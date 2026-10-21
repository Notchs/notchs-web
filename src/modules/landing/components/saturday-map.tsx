"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";

import { ArrowRightIcon } from "@/shared/components/icons";
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
  const listRef = useRef<HTMLOListElement>(null);
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
      <ol
        ref={listRef}
        className="flex snap-x gap-2 overflow-x-auto pb-1 lg:grid lg:gap-2 lg:overflow-visible lg:pb-0"
      >
        {saturdayStops.map((item, index) => {
          const place = venueByKind(item.kind);
          const current = index === active;
          return (
            <li key={item.time} className="flex-none snap-start">
              <button
                type="button"
                aria-pressed={current}
                onClick={() => choose(index)}
                className={cn(
                  "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color] duration-200",
                  current
                    ? "border-foreground bg-card"
                    : "border-line hover:border-foreground/40",
                )}
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
            </li>
          );
        })}
      </ol>

      <div className="[container-type:size] relative h-[30rem] overflow-hidden rounded-3xl border border-line bg-block [--cx:50cqw] [--cy:68cqh] [--zoom:.85] sm:h-[34rem] lg:h-[40rem] lg:[--cy:60cqh] lg:[--zoom:1.05]">
        <div
          className="absolute top-0 left-0 origin-top-left transition-transform duration-[1400ms] ease-notch motion-reduce:transition-none"
          style={layerStyle}
        >
          <Image
            src={ahmedabadMap}
            alt={saturdayContent.mapAlt}
            width={MAP_W}
            height={MAP_H}
            sizes={`${MAP_W}px`}
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
                  "absolute grid -translate-1/2 cursor-pointer place-items-center rounded-full border-2 font-mono text-xs transition-[width,height,background-color,color] duration-500 ease-notch",
                  current
                    ? "z-10 size-14 border-ink bg-ink text-paper"
                    : "size-11 border-ink bg-paper text-ink hover:bg-card",
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
          <div className="overflow-hidden rounded-2xl border border-line bg-card text-foreground">
            <div className="relative aspect-[2/1] bg-block">
              <Image
                src={venue.image.src}
                alt=""
                fill
                sizes="272px"
                placeholder="blur"
                className="object-cover"
              />
              <span className="absolute top-2.5 left-2.5 rounded-full bg-ink/75 px-2.5 py-1 font-mono text-xs text-paper">
                {stop.time}
              </span>
            </div>
            <div className="p-4">
              <p className="font-display text-lg leading-tight font-extrabold tracking-[-.02em]">
                {venue.example}
              </p>
              <p className="mt-1 text-[.9375rem] text-muted">
                {venue.label} · {stop.area}
              </p>
              <button
                type="button"
                onClick={openAccess}
                className="group mt-3 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-foreground font-semibold transition-colors duration-150 hover:bg-foreground hover:text-background"
              >
                {saturdayContent.cta}
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        <span className="absolute right-2 bottom-2 rounded bg-paper/90 px-2 py-0.5 text-xs text-ink/70">
          {saturdayContent.credit}
        </span>
      </div>
    </div>
  );
}
