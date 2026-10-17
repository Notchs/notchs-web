"use client";

import { useState } from "react";
import Image from "next/image";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { PlusIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import {
  builderBadges,
  builderContent,
  venues,
  type VenueKind,
} from "../content";
import { VerifiedIcon } from "./verified-icon";

type Counts = Record<VenueKind, number>;

const MAX_PER_PLACE = 9;
const emptyCounts = Object.fromEntries(
  venues.map((venue) => [venue.kind, 0]),
) as Counts;

/** Which badges the chosen visits would unlock, by badge name. */
function unlockedBadges(counts: Counts, total: number) {
  const values = Object.values(counts);
  return new Set(
    [
      total >= 1 && "First Notch",
      counts.cafe >= 3 && "Café Hopper",
      counts.snooker + counts.bowling >= 2 && "Night Owl",
      values.some((count) => count >= 5) && "Regular",
      values.filter((count) => count > 0).length >= 4 && "Explorer",
    ].filter(Boolean),
  );
}

function Stepper({
  label,
  count,
  onChange,
}: {
  label: string;
  count: number;
  onChange: (next: number) => void;
}) {
  const buttonStyles =
    "grid size-12 flex-none cursor-pointer place-items-center rounded-xl border border-line text-lg font-semibold transition-colors duration-150 hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`${builderContent.remove}: ${label}`}
        disabled={count === 0}
        onClick={() => onChange(count - 1)}
        className={buttonStyles}
      >
        −
      </button>
      <span
        aria-live="polite"
        className="w-7 text-center font-display text-lg font-extrabold tabular-nums"
      >
        {count}
      </span>
      <button
        type="button"
        aria-label={`${builderContent.add}: ${label}`}
        disabled={count === MAX_PER_PLACE}
        onClick={() => onChange(count + 1)}
        className={buttonStyles}
      >
        <PlusIcon className="size-5" />
      </button>
    </div>
  );
}

/**
 * Pick visits per kind of place and watch a live Notch Card fill up. Below lg
 * the places are a swipeable strip right above a compact card, so each tap
 * and its result fit on one screen.
 */
export function NotchCardBuilder() {
  const [counts, setCounts] = useState<Counts>(emptyCounts);
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const unlocked = unlockedBadges(counts, total);
  const top = venues.reduce((best, venue) =>
    counts[venue.kind] > counts[best.kind] ? venue : best,
  );

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
      {/* min-w-0 lets the place strip scroll instead of widening the page. */}
      <div className="min-w-0">
        <h3 className="font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-tight font-extrabold tracking-[-.03em]">
          {builderContent.title}
        </h3>
        <p className="mt-3 max-w-[40ch] text-[1.0625rem] leading-relaxed text-muted">
          {builderContent.description}
        </p>
        <ul className="mt-6 flex snap-x gap-2 overflow-x-auto pb-1 lg:mt-8 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0">
          {venues.map((venue) => (
            <li
              key={venue.kind}
              className="flex flex-none snap-start items-center justify-between gap-3 rounded-2xl border border-line bg-card p-2 pl-2"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="relative size-11 flex-none overflow-hidden rounded-xl bg-block">
                  <Image
                    src={venue.image.src}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </span>
                <span className="truncate font-semibold">{venue.label}</span>
              </span>
              <Stepper
                label={venue.label}
                count={counts[venue.kind]}
                onChange={(next) =>
                  setCounts((current) => ({ ...current, [venue.kind]: next }))
                }
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setCounts(emptyCounts)}
          disabled={total === 0}
          className="mt-1 inline-flex min-h-12 cursor-pointer items-center font-semibold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-current disabled:cursor-not-allowed disabled:opacity-40 lg:mt-4"
        >
          {builderContent.reset}
        </button>
      </div>

      {/* The live card. Always Ink, so Volt may sit inside it. */}
      <div className="mx-auto w-full max-w-[24rem] lg:sticky lg:top-28">
        <div className="rounded-3xl border border-white/10 bg-ink p-5 pt-7 text-paper notch notch-lg sm:p-7 sm:pt-9">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[.14em] text-stone uppercase">
              {builderContent.month}
            </span>
            <NotchGlyph className="size-6 text-volt" />
          </div>

          <p
            key={total}
            className="mt-5 animate-rise font-display text-6xl leading-none font-extrabold tracking-[-.04em] tabular-nums lg:mt-8 lg:text-7xl"
          >
            {total}
          </p>
          <p className="mt-2 text-lg font-semibold">
            {builderContent.countLabel}
          </p>

          <p className="mt-4 inline-flex rounded-full bg-graphite px-3 py-1.5 font-mono text-sm lg:mt-5">
            {total >= 3 ? builderContent.rankOpen : builderContent.rankLocked}
          </p>
          <p className="mt-2 min-h-6 text-[.9375rem] text-stone lg:mt-3">
            {total === 0
              ? builderContent.empty
              : `${builderContent.mostly} ${top.label.toLowerCase()}`}
          </p>

          {/* Below lg the badges are small chips; the rules stay for screen readers. */}
          <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-4 lg:mt-6 lg:grid lg:gap-2 lg:pt-5">
            {builderBadges.map((badge) => {
              const on = unlocked.has(badge.name);
              return (
                <li
                  key={`${badge.name}-${on}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 transition-colors duration-200 lg:gap-3 lg:rounded-xl lg:border-0 lg:px-3 lg:py-2",
                    on ? "animate-rise bg-graphite" : "opacity-50",
                  )}
                >
                  <VerifiedIcon
                    className={cn(
                      "size-3.5 flex-none lg:size-4",
                      on ? "text-volt" : "text-stone",
                    )}
                  />
                  <span className="leading-tight">
                    <span className="block text-xs font-semibold lg:text-[.9375rem]">
                      {badge.name}
                    </span>
                    <span className="sr-only text-sm text-stone lg:not-sr-only lg:block">
                      {badge.rule}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-3 text-center text-sm text-muted">
          {builderContent.preview}
        </p>
      </div>
    </div>
  );
}
