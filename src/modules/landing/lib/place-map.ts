import "server-only";

import { cacheLife } from "next/cache";

import { fetchPlaceMap, type PlaceMap } from "./place-data";

/** The server waits this long at most, so a sleeping API never holds up a build. */
const TIMEOUT_MS = 8000;

/**
 * The places as the server last saw them, for the page's HTML (search
 * engines, and the first thing visitors see). Refreshed in the background
 * after 5 minutes and never served older than 15; when there are places, the
 * browser also asks the API itself as the page loads (CityPulseView), so
 * visitors end up with what the API says now. Null when there are no places
 * or the API can't be reached.
 */
export async function getPlaceMap(): Promise<PlaceMap | null> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 900 });
  try {
    return await fetchPlaceMap(AbortSignal.timeout(TIMEOUT_MS));
  } catch {
    // Not deployed yet, down, slow or a 404 for a city not live yet.
    return null;
  }
}
