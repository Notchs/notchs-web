"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { GlassGroup } from "@/shared/components/glass/glass-group";
import { ArrowRightIcon, PauseIcon, PlayIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import {
  howItWorksContent,
  placesContent,
  sectionIds,
  venues,
} from "../content";
import { useLanding } from "./landing-provider";

type Venue = (typeof venues)[number];

/** How long the photo's hover zoom runs; the glass follows it. */
const ZOOM_MS = 700;

/**
 * A full-bleed photo with a glass caption floating over its lower part. The
 * glass bends the photo beneath it (and follows the photo's hover zoom),
 * presses in when tapped, and its text follows the theme.
 */
function PlaceCard({
  venue,
  onPick,
}: {
  venue: Venue;
  onPick: (kind: Venue["kind"]) => void;
}) {
  const photoRef = useRef<HTMLImageElement>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
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
        sizes="(min-width: 1024px) 320px, 50vw"
        placeholder="blur"
        className="object-cover transition-transform duration-700 ease-notch group-hover:scale-105 motion-reduce:transition-none"
      />
      <GlassGroup
        image={photoRef}
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
 * Photo cards in a row that moves slowly from right to left, without end:
 * two copies of the cards slide left by one copy, then start again. It
 * pauses on hover, while a card has keyboard focus, and with the Pause
 * button (moving content needs a way to stop it). With reduced motion it
 * stands still as a row you can swipe. Picking a card replays the WhatsApp
 * demo at that place.
 */
export function PlaceCards() {
  const { selectVenue } = useLanding();
  const [paused, setPaused] = useState(false);

  const tryAt = (kind: Venue["kind"]) => {
    selectVenue(kind);
    document.getElementById(sectionIds.howItWorks)?.scrollIntoView();
  };

  return (
    <div className="reveal">
      {/* Edges fade out, so cards slide in and out softly. Inline-size
          containment: the long moving row must not widen the page. */}
      <div className="group/marquee overflow-hidden mask-x-from-94% mask-x-to-100% contain-inline-size motion-reduce:snap-x motion-reduce:overflow-x-auto motion-reduce:mask-none">
        <div
          className={cn(
            "flex w-max animate-marquee group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused]",
            paused && "[animation-play-state:paused]",
          )}
        >
          {/* The second copy only makes the loop seamless: hidden from
              screen readers and keyboards, and gone with reduced motion. */}
          {[false, true].map((copy) => (
            <ul
              key={String(copy)}
              aria-hidden={copy || undefined}
              inert={copy}
              className={cn(
                "flex gap-3 pr-3 sm:gap-4 sm:pr-4",
                copy && "motion-reduce:hidden",
              )}
            >
              {venues.map((venue) => (
                <li
                  key={venue.kind}
                  className="w-[13.5rem] flex-none snap-start sm:w-64 lg:w-72"
                >
                  <PlaceCard venue={venue} onPick={tryAt} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((now) => !now)}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold transition-colors duration-150 hover:border-foreground/40"
        >
          {paused ? (
            <PlayIcon className="size-4" />
          ) : (
            <PauseIcon className="size-4" />
          )}
          {paused ? placesContent.play : placesContent.pause}
          <span className="sr-only">{placesContent.motionLabel}</span>
        </button>
      </div>
    </div>
  );
}
