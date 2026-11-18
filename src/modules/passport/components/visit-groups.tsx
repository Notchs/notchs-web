"use client";

import type { ReactNode } from "react";

import { ChevronDownIcon } from "@/shared/components/icons";

import { notchsContent as copy } from "../content";
import { getNotchsByLocation, getPlaces } from "../lib/api";
import { dayMonth, safeColour } from "../lib/format";
import { useLoad } from "../lib/use-load";
import { NotchTile } from "./notch-tile";
import { LoadError, Loading } from "./states";

/** A block that opens to show its rows: one kind of place, or one city. */
function Group({
  icon,
  title,
  open,
  children,
}: {
  icon: ReactNode;
  title: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={open}
      className="group details-smooth rounded-[20px] border border-line bg-card"
    >
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3.5 px-4 py-3 [&::-webkit-details-marker]:hidden">
        {icon}
        <span className="min-w-0 grow font-bold">{title}</span>
        <ChevronDownIcon className="size-5 flex-none text-muted transition-transform group-open:rotate-180" />
      </summary>
      <ul className="flex flex-col divide-y divide-line border-t border-line">
        {children}
      </ul>
    </details>
  );
}

/** Places visited, grouped by kind (cafés, turfs…), most visited kind first. */
export function PlacesByKind() {
  const places = useLoad(getPlaces, "places");

  if (places.error) return <LoadError onRetry={places.reload} />;
  if (!places.data) return <Loading />;
  if (places.data.length === 0)
    return <p className="text-muted">{copy.noPlaces}</p>;

  return (
    <ul className="flex flex-col gap-3">
      {places.data.map((kind, i) => (
        <li key={kind.niche}>
          <Group
            open={i === 0}
            icon={<NotchTile colour={kind.colour} />}
            title={copy.kind(
              kind.label,
              copy.places(kind.places),
              copy.visits(kind.visits),
            )}
          >
            {kind.venues.map((venue) => (
              <li
                key={venue.venue_code}
                className="flex items-start gap-3 px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2.5 flex-none rounded-full"
                  style={{ backgroundColor: safeColour(kind.colour) }}
                />
                <span className="flex min-w-0 grow flex-col gap-0.5">
                  <span className="font-semibold">{venue.venue_name}</span>
                  <span className="text-sm text-muted">
                    {[venue.area, venue.city].filter(Boolean).join(", ")}
                  </span>
                  <span className="text-sm text-muted">
                    {copy.firstLast(
                      dayMonth(venue.first_visit),
                      dayMonth(venue.last_visit),
                    )}
                  </span>
                </span>
                <span className="flex-none text-sm font-bold">
                  {copy.visits(venue.visits)}
                </span>
              </li>
            ))}
          </Group>
        </li>
      ))}
    </ul>
  );
}

/** Notchs per city, the busiest first, then per area. */
export function NotchsByLocation() {
  const cities = useLoad(getNotchsByLocation, "locations");

  if (cities.error) return <LoadError onRetry={cities.reload} />;
  if (!cities.data) return <Loading />;
  if (cities.data.length === 0)
    return <p className="text-muted">{copy.noPlaces}</p>;

  return (
    <ul className="flex flex-col gap-3">
      {cities.data.map((city, i) => (
        <li key={city.city.id}>
          <Group
            open={i === 0}
            icon={
              <span
                aria-hidden="true"
                className="grid size-11 flex-none place-items-center rounded-[14px] bg-panel font-display text-lg font-extrabold text-volt"
              >
                {city.city.name.charAt(0)}
              </span>
            }
            title={copy.city(
              city.city.name,
              copy.notchs(city.notchs),
              copy.places(city.places),
            )}
          >
            {city.areas.map((area) => (
              <li
                key={area.area?.id ?? "other"}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span className="min-w-0 font-semibold">
                  {area.area?.name ?? copy.otherAreas}
                </span>
                <span className="flex-none text-sm text-muted">
                  {copy.notchs(area.notchs)} · {copy.places(area.places)}
                </span>
              </li>
            ))}
          </Group>
        </li>
      ))}
    </ul>
  );
}
