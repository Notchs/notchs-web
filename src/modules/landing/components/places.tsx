"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { GlassGroup } from "@/shared/components/glass/glass-group";
import { ArrowRightIcon } from "@/shared/components/icons";

import { howItWorksContent, sectionIds, venues } from "../content";
import { useAutoScroll } from "../lib/use-auto-scroll";
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
        sizes="(min-width: 1024px) 288px, (min-width: 640px) 256px, 216px"
        // A drag moves the row; it must not start dragging the photo.
        draggable={false}
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

/** Copies of the cards side by side; the middle one is the real one. */
const COPIES = [0, 1, 2] as const;
const REAL_COPY = 1;

/**
 * Photo cards in a row that moves slowly from right to left, forever. Swipe
 * or drag it either way at any time; it carries on from there a moment
 * later (see useAutoScroll). The copies around the real one make the loop
 * seamless, so they are hidden from screen readers and keyboards. With
 * reduced motion it stands still as a row you can swipe. Picking a card
 * replays the WhatsApp demo at that place.
 */
export function PlaceCards() {
  const { selectVenue } = useLanding();
  const scrollerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollerRef);

  const tryAt = (kind: Venue["kind"]) => {
    selectVenue(kind);
    document.getElementById(sectionIds.howItWorks)?.scrollIntoView();
  };

  return (
    <div
      ref={scrollerRef}
      // Inline-size containment: the long row must not widen the page.
      // Edges fade out, so cards slide in and out softly.
      className="flex reveal cursor-grab [scrollbar-width:none] overflow-x-auto overscroll-x-contain mask-x-from-94% mask-x-to-100% contain-inline-size select-none active:cursor-grabbing motion-reduce:mask-none [&::-webkit-scrollbar]:hidden"
    >
      {COPIES.map((copy) => {
        const decoy = copy !== REAL_COPY;
        return (
          <ul
            key={copy}
            aria-hidden={decoy || undefined}
            inert={decoy}
            className="flex flex-none gap-3 pr-3 sm:gap-4 sm:pr-4"
          >
            {venues.map((venue) => (
              <li
                key={venue.kind}
                className="w-[13.5rem] flex-none sm:w-64 lg:w-72"
              >
                <PlaceCard venue={venue} onPick={tryAt} />
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
