"use client";

import { CityNotice, useCity } from "@/modules/city";
import { MapPinIcon } from "@/shared/components/icons";

import { neighbourhoodsContent } from "../content";
import { SectionHeading } from "./section-heading";

/** The chosen city's neighbourhoods. Each city lists only its own areas. */
export function Neighbourhoods() {
  const { city } = useCity();
  const areas = city.neighbourhoods;

  return (
    <>
      <SectionHeading
        kicker={neighbourhoodsContent.kicker}
        title={neighbourhoodsContent.title(city.name)}
        description={neighbourhoodsContent.description}
        className="mb-10 reveal"
      />
      {areas.length === 0 ? (
        <CityNotice />
      ) : (
        <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {areas.map((area, index) => (
            <li
              key={`${city.slug}-${area.slug}`}
              className="group flex min-h-36 reveal flex-col justify-between gap-6 rounded-2xl border border-line bg-card p-5 transition-[transform,border-color] duration-200 ease-notch hover:-translate-y-0.5 hover:border-foreground/30 motion-reduce:transition-none sm:p-6"
              style={{ animationRangeStart: `entry ${(index % 4) * 8}%` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <MapPinIcon className="size-5 text-muted transition-colors duration-200 group-hover:text-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl leading-tight font-extrabold tracking-[-.02em] sm:text-2xl">
                  {area.name}
                </h3>
                <span className="text-sm text-muted">
                  {neighbourhoodsContent.areaOf(city.name)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
