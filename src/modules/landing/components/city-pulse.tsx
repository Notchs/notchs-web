import { getPlaceMap } from "../lib/place-map";
import { CityPulseView } from "./city-pulse-view";

/**
 * "What's happening around your city?": the Ahmedabad map. The server puts
 * the live places it last fetched into the page's HTML; the browser then asks
 * the API again when the page loads (CityPulseView). With no places, or no
 * API, it shows the example Saturday tour.
 */
export async function CityPulse() {
  return <CityPulseView initial={await getPlaceMap()} />;
}
