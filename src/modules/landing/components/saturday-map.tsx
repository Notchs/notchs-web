"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";

import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ArrowRightIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { prewarmPageSnapshot } from "@/shared/lib/glass/page-snapshot";

import {
  mapDots,
  saturdayContent,
  saturdayStops,
  venueByKind,
} from "../content";
import { useStripScroll } from "../lib/use-strip-scroll";
import ahmedabadMap from "../assets/ahmedabad-map.webp";
import { useLanding } from "./landing-provider";
import { MapLens, type DropTarget, type Lens } from "./map-lens";

/** Size of the stitched map image, in pixels. */
const MAP_W = 1280;
const MAP_H = 1024;
/** The map file's URL, which the WebGL lenses load as their texture. */
const MAP_SRC = ahmedabadMap.src;
const TOUR_MS = 3500;
/** How long the map takes to fly to a stop (the layer's transition). */
const FLY_MS = 1500;
/** Lens radius under a resting pin (44px wide) and a hovered one. */
const LENS_R = 22;
const LENS_R_HOVER = 26;

/**
 * A still map of Ahmedabad that "flies" to the chosen stop: the whole layer
 * moves so the pin lands in the middle, with a venue card above it. Tours the
 * stops on its own while on screen, until someone picks one.
 */
export function SaturdayMap() {
  const { openAccess } = useLanding();
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLImageElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // True once the WebGL lenses draw; until then pins use CSS glass.
  const [lensReady, setLensReady] = useState(false);
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

  // A glass lens under every pin but the active one, which is solid Ink.
  const lenses = useMemo<Lens[]>(
    () =>
      saturdayStops.flatMap((item, index) =>
        index === active
          ? []
          : [
              {
                id: item.time,
                x: (item.x / 100) * MAP_W,
                y: (item.y / 100) * MAP_H,
                r: index === hovered ? LENS_R_HOVER : LENS_R,
              },
            ],
      ),
    [active, hovered],
  );

  // The glass drop rests under the active pin and travels when it changes.
  const drop = useMemo<DropTarget>(
    () => ({ x: (stop.x / 100) * MAP_W, y: (stop.y / 100) * MAP_H }),
    [stop],
  );

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
      {/* The stops are pieces of one glass; a raised lens sits on the one
          shown on the map and flows to the next. */}
      <GlassGroup self={false} merge={14} className="min-w-0">
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
            ref={mapRef}
            src={ahmedabadMap}
            alt={saturdayContent.mapAlt}
            width={MAP_W}
            height={MAP_H}
            sizes={`${MAP_W}px`}
            placeholder="blur"
            className="block size-full select-none"
            draggable={false}
          />
          <MapLens
            src={MAP_SRC}
            width={MAP_W}
            height={MAP_H}
            lenses={lenses}
            drop={drop}
            onReady={setLensReady}
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
                onPointerEnter={() => setHovered(index)}
                onPointerLeave={() => setHovered(null)}
                className={cn(
                  "absolute grid -translate-1/2 cursor-pointer place-items-center rounded-full font-mono text-xs transition-[width,height,background-color,color] duration-500 ease-notch",
                  current
                    ? "z-10 size-14 border-2 border-ink bg-ink text-paper"
                    : lensReady
                      ? "size-11 font-semibold text-ink [text-shadow:0_0_6px_rgb(255_255_255/.9),0_0_2px_rgb(255_255_255)]"
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
          {/* Glass that bends the map beneath it, following it as it flies. */}
          <GlassGroup
            image={mapRef}
            radius={16}
            tintAmount={0.72}
            frost={0.9}
            animateKey={active}
            animateFor={FLY_MS}
            className="rounded-2xl p-1.5 text-foreground"
          >
            <div className="relative aspect-[2/1] overflow-hidden rounded-[12px] bg-block">
              <Image
                ref={photoRef}
                src={venue.image.src}
                alt=""
                fill
                sizes="272px"
                placeholder="blur"
                className="object-cover"
              />
              <GlassGroup
                image={photoRef}
                radius={999}
                tintVar="--ink"
                tintAmount={0.55}
                frost={0.8}
                margin={10}
                className="absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 font-mono text-xs text-paper"
              >
                {stop.time}
              </GlassGroup>
            </div>
            <div className="p-2.5 pt-3">
              <p className="font-display text-lg leading-tight font-extrabold tracking-[-.02em]">
                {venue.example}
              </p>
              <p className="mt-1 text-[.9375rem] text-muted">
                {venue.label} · {stop.area}
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                onClick={(event) => openAccess(event.currentTarget)}
                onPointerEnter={prewarmPageSnapshot}
                onFocus={prewarmPageSnapshot}
              >
                {saturdayContent.cta}
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </GlassGroup>
        </div>

        <GlassGroup
          image={mapRef}
          radius={999}
          tintAmount={0.35}
          margin={8}
          animateKey={active}
          animateFor={FLY_MS}
          className="absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-xs text-ink/70 glass-light"
        >
          {saturdayContent.credit}
        </GlassGroup>
      </div>
    </div>
  );
}
