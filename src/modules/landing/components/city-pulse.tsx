import { cafeMapContent, saturdayContent } from "../content";
import { getCafeMap } from "../lib/cafe-map";
import { cafeMapStops, saturdayMapStops } from "../lib/map-stops";
import { PulseMap } from "./pulse-map";
import { SectionHeading } from "./section-heading";

/**
 * "What's happening around your city?": the Ahmedabad map. Shows the real
 * cafés on Notchs (from the API, ranked once enough cafés have a rank), or
 * the example Saturday tour while no café is live or the API can't be
 * reached. Rendered on the server, so the café list is in the page's HTML.
 */
export async function CityPulse() {
  const cafes = await getCafeMap();
  const description = !cafes
    ? saturdayContent.description
    : cafes.showRanks
      ? cafeMapContent.description(cafes.cityName)
      : cafeMapContent.descriptionUnranked(cafes.cityName);

  return (
    <>
      <SectionHeading
        className="mb-10 reveal"
        kicker={saturdayContent.kicker}
        title={saturdayContent.title}
        description={description}
      />
      {cafes ? (
        <PulseMap
          stops={cafeMapStops(cafes)}
          mapAlt={cafeMapContent.mapAlt(cafes.cityName)}
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
