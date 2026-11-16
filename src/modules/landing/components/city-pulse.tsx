"use client";

import { CityNotice, CitySelector, useCity } from "@/modules/city";

import { saturdayContent } from "../content";
import { SaturdayMap } from "./saturday-map";
import { SectionHeading } from "./section-heading";

/** Cities with a map tour. Each needs its own map and stops in content. */
const citiesWithMap = new Set(["ahmedabad"]);

/**
 * "What's happening around your city?": the map tour for a city that has one,
 * or a plain notice for a city that isn't live. Nothing made up.
 */
export function CityPulse() {
  const { city } = useCity();
  const hasMap = citiesWithMap.has(city.slug);

  return (
    <>
      <div className="mb-10 flex reveal flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          kicker={saturdayContent.kicker}
          title={saturdayContent.title}
          description={
            hasMap
              ? saturdayContent.description
              : saturdayContent.noMapDescription
          }
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {saturdayContent.cityLabel}
          </span>
          <CitySelector
            align="start"
            className="rounded-full border border-line bg-card lg:[&>div]:right-0 lg:[&>div]:left-auto"
          />
        </div>
      </div>
      {hasMap ? <SaturdayMap /> : <CityNotice />}
    </>
  );
}
