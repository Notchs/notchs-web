"use client";

import Image from "next/image";

import { GlassGroup } from "@/shared/components/glass/glass-group";
import { ArrowRightIcon } from "@/shared/components/icons";

import { howItWorksContent, sectionIds, venues } from "../content";
import { useLanding } from "./landing-provider";

type Venue = (typeof venues)[number];

/**
 * A full-bleed photo with a glass caption floating over its lower part. Its
 * text follows the theme.
 */
function PlaceCard({
  venue,
  onPick,
}: {
  venue: Venue;
  onPick: (kind: Venue["kind"]) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(venue.kind)}
      className="group relative block aspect-[10/16] w-full cursor-pointer overflow-hidden rounded-2xl bg-block text-left"
    >
      <Image
        src={venue.image.src}
        alt={venue.image.alt}
        fill
        sizes="(min-width: 1024px) 257px, 225px"
        placeholder="blur"
        className="object-cover transition-transform duration-700 ease-notch group-hover:scale-105 motion-reduce:transition-none"
      />
      <GlassGroup
        radius={12}
        className="absolute inset-x-2 bottom-2 flex flex-col gap-0.5 rounded-xl p-3 sm:gap-1 sm:p-4"
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

/** Photo cards; picking one replays the WhatsApp demo at that place. */
export function PlaceCards() {
  const { selectVenue } = useLanding();

  const tryAt = (kind: Venue["kind"]) => {
    selectVenue(kind);
    document.getElementById(sectionIds.howItWorks)?.scrollIntoView();
  };

  // Two copies side by side; the track slides left by one copy and loops.
  // The second copy is inert, so keyboards and screen readers meet each
  // place once. Hover or focus pauses it; reduced motion turns it into a
  // plain row you can swipe.
  const set = (copy: boolean) => (
    <ul
      inert={copy}
      aria-hidden={copy || undefined}
      className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4"
    >
      {venues.map((venue) => (
        <li
          key={venue.kind}
          className="w-[193px] flex-none sm:w-[225px] lg:w-[257px]"
        >
          <PlaceCard venue={venue} onPick={tryAt} />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="reveal overflow-hidden mask-x-from-92% mask-x-to-100% motion-reduce:overflow-x-auto motion-reduce:mask-none">
      <div className="flex w-max animate-rail focus-within:[animation-play-state:paused] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {set(false)}
        <div className="motion-reduce:hidden">{set(true)}</div>
      </div>
    </div>
  );
}
