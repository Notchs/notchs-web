import { mapConfig } from "@/config/map";
import { apiRequest } from "@/shared/lib/api-client";

/** A live place on Notchs, as the homepage map shows it. */
export type Place = {
  code: string;
  name: string;
  area: string | null;
  /** The API's kind of place, e.g. "cafe", "turf_gym". */
  category: string;
  isCafe: boolean;
  /** [longitude, latitude] */
  lngLat: [number, number];
  /**
   * Cafés only, from the API; null when it has none or while ranks are
   * hidden. Other kinds are ranked among themselves, so their rank isn't shown.
   */
  rank: number | null;
};

export type PlaceMap = {
  cityName: string;
  /**
   * Cafés first (in rank order when ranks show, otherwise A to Z, never by a
   * hidden rank), then every other place A to Z.
   */
  places: Place[];
  /** At least `mapConfig.minRankedCafes` cafés have a rank. */
  showRanks: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** One GeoJSON feature from the API, or null if anything about it is off. */
function toPlace(feature: unknown): Place | null {
  if (!isRecord(feature)) return null;
  const { geometry, properties } = feature;
  if (!isRecord(geometry) || !isRecord(properties)) return null;
  const [lng, lat] = Array.isArray(geometry.coordinates)
    ? geometry.coordinates
    : [];
  if (
    typeof lng !== "number" ||
    typeof lat !== "number" ||
    !Number.isFinite(lng) ||
    !Number.isFinite(lat) ||
    Math.abs(lng) > 180 ||
    Math.abs(lat) > 90
  ) {
    return null;
  }
  const { venue_code, name, area, category, rank } = properties;
  if (!isText(venue_code) || !isText(name) || !isText(category)) return null;
  const isCafe = category === "cafe";
  return {
    code: venue_code,
    name: name.trim(),
    area: isText(area) ? area.trim() : null,
    category,
    isCafe,
    lngLat: [lng, lat],
    rank:
      isCafe && Number.isInteger(rank) && (rank as number) >= 1
        ? (rank as number)
        : null,
  };
}

/**
 * Checks the API's answer (it is untrusted) and keeps only well-formed places.
 * The ranks are the API's; nothing here works one out.
 */
export function toPlaceMap(payload: unknown): PlaceMap | null {
  const data = isRecord(payload) ? payload.data : null;
  if (!isRecord(data) || !isRecord(data.city) || !isRecord(data.venues)) {
    return null;
  }
  const features = data.venues.features;
  if (!Array.isArray(features)) return null;

  const places = features.map(toPlace).filter((place) => place !== null);
  if (places.length === 0) return null;

  const cafes = places.filter((place) => place.isCafe);
  const others = places.filter((place) => !place.isCafe);
  const showRanks =
    cafes.filter((cafe) => cafe.rank !== null).length >=
    mapConfig.minRankedCafes;
  const byName = (a: Place, b: Place) => a.name.localeCompare(b.name);
  const byRank = (a: Place, b: Place) =>
    (a.rank ?? Infinity) - (b.rank ?? Infinity) || byName(a, b);

  return {
    cityName: isText(data.city.name) ? data.city.name.trim() : "Ahmedabad",
    places: [
      ...(showRanks
        ? cafes.sort(byRank)
        : cafes.map((cafe) => ({ ...cafe, rank: null })).sort(byName)),
      ...others.sort(byName),
    ],
    showRanks,
  };
}

/**
 * Asks the API for the city's live places: GET /venues/map?city=ahmedabad
 * (every kind; the website highlights and ranks the cafés). Works on the
 * server (straight to the API) and in the browser (through the site's /api
 * proxy). Throws on any failure, including a 404 for a city not live yet.
 */
export async function fetchPlaceMap(
  signal: AbortSignal,
): Promise<PlaceMap | null> {
  const payload = await apiRequest<unknown>("/venues/map", {
    query: { city: mapConfig.city.slug },
    signal,
  });
  return toPlaceMap(payload);
}
