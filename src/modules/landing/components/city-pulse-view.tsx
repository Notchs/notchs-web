"use client";

import { useEffect, useState } from "react";

import { placeMapContent, saturdayContent } from "../content";
import { fetchPlaceMap, type PlaceMap } from "../lib/place-data";
import { placeMapStops, saturdayMapStops } from "../lib/map-stops";
import { PulseMap } from "./pulse-map";
import { SectionHeading } from "./section-heading";

/** The browser gives up on the API after this long and keeps what it has. */
const TIMEOUT_MS = 15000;

/**
 * The City Pulse heading and map. Starts from the places the server rendered
 * (so they are in the HTML), then calls GET /api/v1/venues/map?city=ahmedabad
 * itself as soon as the page loads, so every visitor sees what the API says
 * now: new places, new ranks, or none (the example tour). If that call fails,
 * the server's places stay.
 */
export function CityPulseView({ initial }: { initial: PlaceMap | null }) {
  const [map, setMap] = useState(initial);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetchPlaceMap(controller.signal)
      .then((fresh) => {
        // Only re-render when something changed, so nothing flickers.
        setMap((current) =>
          JSON.stringify(current) === JSON.stringify(fresh) ? current : fresh,
        );
      })
      .catch(() => {
        // Asleep, rate-limited (429), offline or left: keep the server's.
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const stops = map ? placeMapStops(map) : saturdayMapStops;
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
      <PulseMap
        // New places or ranks start the map afresh at the top of the list.
        key={stops.map((stop) => `${stop.key}:${stop.tag}`).join("|")}
        stops={stops}
        mapAlt={
          map ? placeMapContent.mapAlt(map.cityName) : saturdayContent.mapAlt
        }
        example={!map}
      />
    </>
  );
}
