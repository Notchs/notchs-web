import "server-only";

import { cacheLife } from "next/cache";

import { mapConfig } from "@/config/map";
import { apiRequest } from "@/shared/lib/api-client";

/** A live café on Notchs, as the homepage map shows it. */
export type Cafe = {
  code: string;
  name: string;
  area: string | null;
  /** [longitude, latitude] */
  lngLat: [number, number];
  /** From the API; null when it has none, or while ranks are hidden. */
  rank: number | null;
};

export type CafeMap = {
  cityName: string;
  /** In rank order when ranks show, otherwise A to Z (never by hidden rank). */
  cafes: Cafe[];
  /** At least `mapConfig.minRankedCafes` cafés have a rank. */
  showRanks: boolean;
};

/** The API waits this long at most, so a sleeping API never holds up a build. */
const TIMEOUT_MS = 8000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

/** One GeoJSON feature from the API, or null if anything about it is off. */
function toCafe(feature: unknown): Cafe | null {
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
  if (!isText(venue_code) || !isText(name) || category !== "cafe") {
    return null;
  }
  return {
    code: venue_code,
    name: name.trim(),
    area: isText(area) ? area.trim() : null,
    lngLat: [lng, lat],
    rank:
      Number.isInteger(rank) && (rank as number) >= 1 ? (rank as number) : null,
  };
}

/**
 * Checks the API's answer (it is untrusted) and keeps only well-formed cafés.
 * The ranks are the API's; nothing here works one out.
 */
export function toCafeMap(payload: unknown): CafeMap | null {
  const data = isRecord(payload) ? payload.data : null;
  if (!isRecord(data) || !isRecord(data.city) || !isRecord(data.venues)) {
    return null;
  }
  const features = data.venues.features;
  if (!Array.isArray(features)) return null;

  const cafes = features.map(toCafe).filter((cafe) => cafe !== null);
  if (cafes.length === 0) return null;

  const ranked = cafes.filter((cafe) => cafe.rank !== null).length;
  const showRanks = ranked >= mapConfig.minRankedCafes;
  const byName = (a: Cafe, b: Cafe) => a.name.localeCompare(b.name);
  return {
    cityName: isText(data.city.name) ? data.city.name.trim() : "Ahmedabad",
    cafes: showRanks
      ? cafes.sort(
          (a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity) || byName(a, b),
        )
      : cafes.map((cafe) => ({ ...cafe, rank: null })).sort(byName),
    showRanks,
  };
}

/**
 * The city's live cafés for the homepage map, or null when there are none or
 * the API can't be reached (the page then shows its example map). Cached for
 * 5 minutes, like the API itself.
 */
export async function getCafeMap(): Promise<CafeMap | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  try {
    const payload = await apiRequest<unknown>("/venues/map", {
      query: { city: mapConfig.city.slug, category: "cafe" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return toCafeMap(payload);
  } catch {
    // Not deployed yet, down, slow or a 404 for a city not live yet.
    return null;
  }
}
