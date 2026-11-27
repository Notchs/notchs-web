export type VenueCategory = "Cafe" | "Restaurant" | "Bar" | "Turf / Gym";

/** Public information about a venue on the city map. */
export type CityVenue = {
  id: string;
  name: string;
  category: VenueCategory;
  area: string;
  /** Where the venue is (WGS84 degrees), from the API. */
  latitude: number;
  longitude: number;
  rating: number;
  priceLevel: 1 | 2 | 3;
  amenities: string[];
  distanceKm: number;
  isMine: boolean;
  /** Only venues in a published city ranking have these. */
  rank: number | null;
  rankMove: number | null;
};

export type DiscoverSource = { label: string; value: number };

export type DiscoverResponse = {
  /** False when the map provider failed; the list keeps working. */
  mapAvailable: boolean;
  venues: CityVenue[];
  myVenueId: string;
  rankingPeriod: string;
  myUniqueGuests: number;
  minimumRankedVenues: number;
  sources: DiscoverSource[];
};
