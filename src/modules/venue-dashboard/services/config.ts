export type VenueDataMode = "mock" | "api";

/**
 * Where the dashboard gets its data. "api" is the real backend: Overview,
 * Visits and Guests show real numbers, other screens say "Opens soon".
 * "mock" shows the example data, for design work only.
 */
export const VENUE_DATA_MODE = "api" as VenueDataMode;

/**
 * Whether the live site serves the dashboard to logged-in venues. Off until
 * the team agrees to open it; team builds show it either way.
 */
export const VENUE_DASHBOARD_LIVE = false as boolean;
