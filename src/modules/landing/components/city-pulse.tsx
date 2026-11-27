import { placeMapContent, saturdayContent } from "../content";
import { placeMapStops, saturdayMapStops } from "../lib/map-stops";
import { getPlaceMap } from "../lib/place-map";
import { PulseMap } from "./pulse-map";
import { SectionHeading } from "./section-heading";

/**
 * "What's happening around your city?": the Ahmedabad map. Shows the real
 * places on Notchs (from the API; cafés highlighted, and ranked once enough
 * cafés have a rank), or the example Saturday tour while none is live or the
 * API can't be reached. Rendered on the server, so the list of places is in
 * the page's HTML.
 */
export async function CityPulse() {
  const map = await getPlaceMap();
  const description = !map
    ? saturdayContent.description
    : map.showRanks
      ? placeMapContent.description(map.cityName)
      : placeMapContent.descriptionUnranked(map.cityName);

  return (
    <>
      <SectionHeading
        className="mb-10 reveal"
        kicker={saturdayContent.kicker}
        title={saturdayContent.title}
        description={description}
      />
      {map ? (
        <PulseMap
          stops={placeMapStops(map)}
          mapAlt={placeMapContent.mapAlt(map.cityName)}
          example={false}
        />
      ) : (
        <PulseMap
          stops={saturdayMapStops}
          mapAlt={saturdayContent.mapAlt}
          example
        />
      )}
    </>
  );
}
