import { apiProvider } from "./api.provider";
import { VENUE_DATA_MODE } from "./config";
import { mockProvider } from "./mock.provider";
import type { VenueDataProvider } from "./venue-data.provider";

/**
 * The only door to venue data. Hooks and components call this and never
 * learn which provider answered.
 */
export const venueData: VenueDataProvider =
  VENUE_DATA_MODE === "api" ? apiProvider : mockProvider;
