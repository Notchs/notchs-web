"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { GlassGroup } from "@/shared/components/glass/glass-group";
import { ArrowRightIcon } from "@/shared/components/icons";

import { howItWorksContent, sectionIds, venues } from "../content";
import { useLanding } from "./landing-provider";

type Venue = (typeof venues)[number];

/** How long the photo's hover zoom runs; the glass follows it. */
const ZOOM_MS = 700;

/** Start loading every photo once the rail is this close to the screen. */
const RAIL_PRELOAD_MARGIN = "800px";

/**
 * A full-bleed photo with a glass caption floating over its lower part. The
 * glass bends the photo beneath it (and follows the photo's hover zoom),
 * presses in when tapped, and its text follows the theme.
 */
function PlaceCard({
  venue,
  onPick,
  tabIndex,
  preload,
}: {
  venue: Venue;
  onPick: (kind: Venue["kind"]) => void;
  tabIndex?: number;
  preload: boolean;
}) {
  const photoRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={() => onPick(venue.kind)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="group relative block aspect-3/4 w-full cursor-pointer overflow-hidden rounded-2xl bg-block text-left sm:aspect-4/5"
    >
      <Image
        ref={photoRef}
        src={venue.image.src}
        alt={venue.image.alt}
        fill
        sizes="(min-width: 640px) 288px, 224px"
        placeholder="blur"
        // Ready before it slides in, and no blank frame when the rail loops.
        loading={preload ? "eager" : "lazy"}
        decoding="sync"
        className="object-cover transition-transform duration-700 ease-notch group-hover:scale-105 motion-reduce:transition-none"
      />
      <GlassGroup
        image={photoRef}
        drawOffscreen
        radius={14}
        pressable
        tintAmount={0.6}
        frost={0.9}
        margin={12}
        animateKey={hovered}
        animateFor={ZOOM_MS}
        className="absolute inset-x-2 bottom-2 flex flex-col gap-0.5 rounded-[14px] p-3 sm:gap-1 sm:p-4"
      >
        <span className="font-display text-base font-extrabold tracking-[-.02em] sm:text-xl">
          {venue.label}
        </span>
        <span className="text-[.8125rem] leading-snug text-muted sm:text-[.9375rem]">
          {venue.line}
        </span>
        <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold">
          {howItWorksContent.tryIt}
          <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </span>
      </GlassGroup>
    </button>
  );
}

/**
 * One row of photo cards on an endless rail; picking one replays the WhatsApp
 * demo at that place. It moves by CSS alone, so it stays smooth, and pauses on
 * hover, press and focus. The second set only closes the loop, so it is hidden
 * from screen readers and the tab order; with reduced motion it is dropped and
 * the row scrolls by hand instead.
 */
export function PlaceCards() {
  const { selectVenue } = useLanding();
  const railRef = useRef<HTMLDivElement>(null);
  const [preload, setPreload] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPreload(true);
        near.disconnect();
      },
      { rootMargin: RAIL_PRELOAD_MARGIN },
    );
    near.observe(rail);
    return () => near.disconnect();
  }, []);

  const tryAt = (kind: Venue["kind"]) => {
    selectVenue(kind);
    document.getElementById(sectionIds.howItWorks)?.scrollIntoView();
  };

  return (
    <div
      ref={railRef}
      // Focus can scroll a card into view; put the row back when it leaves.
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          event.currentTarget.scrollLeft = 0;
        }
      }}
      className="relative mx-auto w-[90%] overflow-hidden rounded-2xl motion-reduce:overflow-x-auto"
    >
      {/* Padding, not gap, so the two sets are exactly half the track each. */}
      <ul className="flex w-max animate-rail py-1.5 will-change-transform hover:[animation-play-state:paused] active:[animation-play-state:paused] has-focus-visible:[animation-play-state:paused]">
        {venues.map((venue) => (
          <li key={venue.kind} className="w-59 flex-none pr-3 sm:w-76 sm:pr-4">
            <PlaceCard venue={venue} onPick={tryAt} preload={preload} />
          </li>
        ))}
        {venues.map((venue) => (
          <li
            key={`${venue.kind}-copy`}
            aria-hidden
            className="w-59 flex-none pr-3 motion-reduce:hidden sm:w-76 sm:pr-4"
          >
            <PlaceCard
              venue={venue}
              onPick={tryAt}
              tabIndex={-1}
              preload={preload}
            />
          </li>
        ))}
      </ul>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent sm:w-24" />
    </div>
  );
}
