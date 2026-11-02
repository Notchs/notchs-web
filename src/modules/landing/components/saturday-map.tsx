"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ArrowRightIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

import {
  mapDots,
  saturdayContent,
  saturdayStops,
  venueByKind,
} from "../content";
import { useStripScroll } from "../lib/use-strip-scroll";
import ahmedabadMap from "../assets/ahmedabad-map.webp";
import { useLanding } from "./landing-provider";

/** Size of the stitched map image, in pixels. */
const MAP_W = 1280;
const MAP_H = 1024;
const TOUR_MS = 3500;

/**
 * A still map of Ahmedabad that "flies" to the chosen stop: the whole layer
 * moves so the pin lands in the middle, with a venue card above it. Tours the
 * stops on its own while on screen, until someone picks one.
 */
export function SaturdayMap() {
  const { openAccess } = useLanding();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const stop = saturdayStops[active];
  const venue = venueByKind(stop.kind);
  useStripScroll(listRef, active);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || manual) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % saturdayStops.length),
      TOUR_MS,
    );
    return () => clearInterval(timer);
  }, [inView, manual]);

  const choose = (index: number) => {
    setManual(true);
    setActive(index);
  };

  // Moves the pin to the focus point (--cx, --cy), then scales the map.
  const layerStyle: CSSProperties = {
    width: MAP_W,
    height: MAP_H,
    transform: `translate(var(--cx), var(--cy)) scale(var(--zoom)) translate(-${stop.x}%, -${stop.y}%)`,
  };

  return (
    <div
      ref={rootRef}
      className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-6"
    >
      {/* The stops; a soft highlight sits on the one shown on the map and
          slides to the next. */}
      <GlassGroup self={false} className="min-w-0">
        <GlassLensTrack
          ref={listRef}
          role="list"
          restingIndex={active}
          lensRadius={12}
          inset={4}
          className="-my-3 flex snap-x gap-2 overflow-x-auto py-3 lg:my-0 lg:grid lg:gap-2 lg:overflow-visible lg:py-0"
        >
          {saturdayStops.map((item, index) => {
            const place = venueByKind(item.kind);
            const current = index === active;
            return (
              <GlassShape
                key={item.time}
                role="listitem"
                radius={16}
                className="flex-none snap-start"
              >
                <button
                  type="button"
                  aria-pressed={current}
                  onClick={() => choose(index)}
                  className="relative flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left"
                  {...LENS_ITEM}
                >
                  <span className="font-mono text-sm text-muted">
                    {item.time}
                  </span>
                  <span className="leading-tight">
                    <span className="block font-semibold whitespace-nowrap">
                      {place.label}
                    </span>
                    <span className="block text-sm whitespace-nowrap text-muted">
                      {item.area}
                    </span>
                  </span>
                </button>
              </GlassShape>
            );
          })}
        </GlassLensTrack>
      </GlassGroup>

      {/* The map is light in either theme, so the glass over it is too. */}
      <div className="[container-type:size] relative h-[30rem] overflow-hidden rounded-3xl bg-block surface-ink glass-light [--cx:50cqw] [--cy:68cqh] [--zoom:.85] sm:h-[34rem] lg:h-[40rem] lg:[--cy:60cqh] lg:[--zoom:1.05]">
        <div
          className="absolute top-0 left-0 origin-top-left transition-transform duration-[1400ms] ease-notch motion-reduce:transition-none"
          style={layerStyle}
        >
          <Image
            src={ahmedabadMap}
            alt={saturdayContent.mapAlt}
            width={MAP_W}
            height={MAP_H}
            // Phones show the map at about 768 CSS px; the full layer only on wider screens.
            sizes={`(max-width: 767px) 768px, ${MAP_W}px`}
            placeholder="blur"
            className="block size-full select-none"
            draggable={false}
          />
          {mapDots.map(([x, y]) => (
            <span
              key={`${x}-${y}`}
              aria-hidden="true"
              className="absolute size-3 -translate-1/2 rounded-full border-2 border-paper bg-ink/45"
              style={{ left: `${x}%`, top: `${y}%` }}
            />
          ))}
          {saturdayStops.map((item, index) => {
            const current = index === active;
            return (
              <button
                key={item.time}
                type="button"
                aria-label={`${venueByKind(item.kind).label}, ${item.area}, ${item.time}`}
                onClick={() => choose(index)}
                className={cn(
                  "absolute grid -translate-1/2 cursor-pointer place-items-center rounded-full font-mono text-xs transition-[width,height,background-color,color] duration-500 ease-notch",
                  current
                    ? "z-10 size-14 border-2 border-ink bg-ink text-paper"
                    : "size-11 glass text-ink glass-clear hover:[--glass-fill-clear:rgb(255_255_255/.72)]",
                )}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {item.time}
              </button>
            );
          })}
        </div>

        {/* Venue card above the focused pin, like a map popup. */}
        <div
          key={active}
          className="absolute left-1/2 w-[min(17rem,calc(100%_-_2rem))] animate-rise"
          style={{ top: "var(--cy)", translate: "-50% calc(-100% - 2.25rem)" }}
        >
          {/* Solid: it is content, and the map must not show through its text. */}
          <div className="rounded-2xl border border-line bg-background p-1.5 text-foreground shadow-xl">
            <div className="relative aspect-[2/1] overflow-hidden rounded-[12px] bg-block">
              <Image
                src={venue.image.src}
                alt=""
                fill
                sizes="272px"
                placeholder="blur"
                className="object-cover"
              />
              <div className="absolute top-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-xs text-paper">
                {stop.time}
              </div>
            </div>
            <div className="p-2.5 pt-3">
              <p className="font-display text-lg leading-tight font-extrabold tracking-[-.02em]">
                {venue.example}
              </p>
              <p className="mt-1 text-[.9375rem] text-muted">
                {venue.label} · {stop.area}
              </p>
              <Button size="sm" className="mt-3 w-full" onClick={openAccess}>
                {saturdayContent.cta}
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>

        <GlassGroup
          radius={999}
          className="absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-xs text-ink/70 glass-light"
        >
          {saturdayContent.credit}
        </GlassGroup>
      </div>
    </div>
  );
}
