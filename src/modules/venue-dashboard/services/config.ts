export type VenueDataMode = "mock" | "api";

/**
 * Where the dashboard gets its data. Switch to "api" once the backend
 * endpoints in api.provider.ts exist; no component needs to change.
 */
export const VENUE_DATA_MODE = "mock" as VenueDataMode;
