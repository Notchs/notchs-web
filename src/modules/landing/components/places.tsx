"use client";

import Image from "next/image";

import { ArrowRightIcon } from "@/shared/components/icons";

import { howItWorksContent, sectionIds, venues } from "../content";
import { useLanding } from "./landing-provider";

/** Photo cards; picking one replays the WhatsApp demo at that place. */
export function PlaceCards() {
  const { selectVenue } = useLanding();

  const tryAt = (kind: (typeof venues)[number]["kind"]) => {
    selectVenue(kind);
    document.getElementById(sectionIds.howItWorks)?.scrollIntoView();
  };

  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {venues.map((venue, index) => (
        <li
          key={venue.kind}
          className="reveal"
          style={{ animationRangeStart: `entry ${(index % 4) * 8}%` }}
        >
          <button
            type="button"
            onClick={() => tryAt(venue.kind)}
            className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-card text-left transition-[border-color] duration-200 hover:border-foreground/40"
          >
            {/* Wider photo on phones keeps the narrow two-up cards short. */}
            <span className="relative block aspect-4/3 overflow-hidden bg-block sm:aspect-4/5">
              <Image
                src={venue.image.src}
                alt={venue.image.alt}
                fill
                sizes="(min-width: 1024px) 280px, 50vw"
                className="object-cover transition-transform duration-700 ease-notch group-hover:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span className="flex flex-1 flex-col gap-1 p-3.5 sm:gap-1.5 sm:p-5">
              <span className="font-display text-base font-extrabold tracking-[-.02em] sm:text-xl">
                {venue.label}
              </span>
              <span className="text-sm leading-snug text-muted sm:text-base">
                {venue.line}
              </span>
              <span className="mt-auto inline-flex min-h-9 items-center gap-1.5 pt-1 text-sm font-semibold sm:min-h-10 sm:pt-2">
                {howItWorksContent.tryIt}
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
