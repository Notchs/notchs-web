"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ArrowRightIcon, CupIcon } from "@/shared/components/icons";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";

import { mapDots, saturdayContent } from "../content";
import { MAP_IMAGE, onImage } from "../lib/map-image";
import type { MapStop } from "../lib/map-stops";
import { useStripScroll } from "../lib/use-strip-scroll";
import ahmedabadMap from "../assets/ahmedabad-map.webp";
import { useLanding } from "./landing-provider";
import { stopPinClass } from "./stop-pin";

const TOUR_MS = 3500;

/**
 * The live map (MapLibre) is big, so it loads only as this section comes
 * near; the still map shows first and stays if the live one can't load.
 */
const PulseLiveMap = dynamic(
  () => import("./pulse-live-map").then((m) => m.PulseLiveMap),
  { ssr: false },
);

/** Data Saver on: keep the still map and skip the download. */
function savesData() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return connection?.saveData === true;
}

/** A stop's card: photo (example stops) or rank pill (cafés), then the CTA. */
function StopCard({ stop }: { stop: MapStop }) {
  const { openAccess } = useLanding();
  const { card } = stop;
  return (
    // Solid: it is content, and the map must not show through its text.
    <div className="rounded-2xl border border-line bg-background p-1.5 text-foreground shadow-xl">
      {card.image && (
        <div className="relative aspect-[2/1] overflow-hidden rounded-[12px] bg-block">
          <Image
            src={card.image}
            alt=""
            fill
            sizes="272px"
            placeholder="blur"
            className="object-cover"
          />
          {card.badge && (
            <div className="absolute top-2.5 left-2.5 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-xs text-paper">
              {card.badge}
            </div>
          )}
        </div>
      )}
      <div className="p-2.5 pt-3">
        {!card.image && card.badge && (
          <span className="mb-2 inline-block rounded-full bg-volt px-2.5 py-1 font-mono text-xs font-semibold text-ink">
            {card.badge}
          </span>
        )}
        <p className="font-display text-lg leading-tight font-extrabold tracking-[-.02em]">
          {card.title}
        </p>
        <p className="mt-1 text-[.9375rem] text-muted">{card.subtitle}</p>
        {card.note && <p className="mt-1 text-sm text-muted">{card.note}</p>}
        <Button size="sm" className="mt-3 w-full" onClick={openAccess}>
          {saturdayContent.cta}
          <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
}

/** A pin's text: its tag, or a cup for a café with no rank to show. */
function PinFace({ stop }: { stop: MapStop }) {
  return stop.tag ? stop.tag : <CupIcon className="size-4.5" />;
}

/**
 * A map of Ahmedabad that "flies" to the chosen stop: the pin lands in the
 * middle, with its card above it. Tours the stops on its own while on screen,
 * until someone picks one. A still map image shows first; the live map takes
 * over once it has loaded. The stops are the example Saturday tour or, once
 * they are live, the real places with cafés highlighted (`example` false).
 */
export function PulseMap({
  stops,
  mapAlt,
  example,
}: {
  stops: MapStop[];
  mapAlt: string;
  /** Example stops: the decorative dots for other places show too. */
  example: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  /** The active stop's card is showing (the live map can close it). */
  const [open, setOpen] = useState(true);
  /** The section is near, so the live map may load. */
  const [nearby, setNearby] = useState(false);
  /** The live map has loaded and covers the still one. */
  const [live, setLive] = useState(false);
  const stop = stops[active];
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
    const root = rootRef.current;
    if (!root || savesData()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNearby(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || manual || stops.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setActive((current) => (current + 1) % stops.length),
      TOUR_MS,
    );
    return () => clearInterval(timer);
  }, [inView, manual, stops.length]);

  const choose = (index: number) => {
    setManual(true);
    setActive(index);
    setOpen(true);
  };
  // Closing the card also stops the tour, so it doesn't pop open again.
  const close = () => {
    setManual(true);
    setOpen(false);
  };

  // Moves the pin to the focus point (--cx, --cy), then scales the map.
  const layerStyle: CSSProperties = {
    width: MAP_IMAGE.width,
    height: MAP_IMAGE.height,
    transform: `translate(var(--cx), var(--cy)) scale(var(--zoom)) translate(-${stop.x}%, -${stop.y}%)`,
  };

  return (
    <div
      ref={rootRef}
      className="grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-6"
    >
      {/* The stops, in the map's order (cafés by rank); a soft highlight sits
          on the one shown on the map and slides to the next. On wide screens
          a long list scrolls inside the map's height. */}
      <GlassGroup self={false} className="min-w-0">
        <GlassLensTrack
          ref={listRef}
          role="list"
          restingIndex={active}
          lensRadius={12}
          inset={4}
          className="-my-3 flex snap-x gap-2 overflow-x-auto py-3 lg:my-0 lg:grid lg:max-h-160 lg:content-start lg:gap-2 lg:overflow-x-visible lg:overflow-y-auto lg:py-0"
        >
          {stops.map((item, index) => {
            const current = index === active;
            return (
              <GlassShape
                key={item.key}
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
                  <span className="grid min-w-5 place-items-center font-mono text-sm text-muted">
                    <PinFace stop={item} />
                  </span>
                  <span className="leading-tight">
                    <span className="block font-semibold whitespace-nowrap">
                      {item.title}
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
        {/* Once the live map covers it, the still map leaves the page's
            tab order and reading order, so each stop is met once. */}
        <div
          inert={live}
          aria-hidden={live || undefined}
          className="absolute top-0 left-0 origin-top-left transition-transform duration-[1400ms] ease-notch motion-reduce:transition-none"
          style={layerStyle}
        >
          <Image
            src={ahmedabadMap}
            alt={mapAlt}
            width={MAP_IMAGE.width}
            height={MAP_IMAGE.height}
            // Phones show the map at about 768 CSS px; the full layer only on wider screens.
            sizes={`(max-width: 767px) 768px, ${MAP_IMAGE.width}px`}
            placeholder="blur"
            className="block size-full select-none"
            draggable={false}
          />
          {example &&
            mapDots.map(([x, y]) => (
              <span
                key={`${x}-${y}`}
                aria-hidden="true"
                className="absolute size-3 -translate-1/2 rounded-full border-2 border-paper bg-ink/45"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
          {/* On the still map the pins are only a picture: real places can
              sit too close to tap apart, so the list above is how to pick
              one here. The live map's pins can be tapped (and cluster). */}
          {stops.map((item, index) => {
            // Places off the still image show on the live map only.
            if (!onImage(item)) return null;
            const current = index === active;
            return (
              <span
                key={item.key}
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -translate-1/2",
                  current && "z-10",
                  stopPinClass(item.isCafe, current),
                )}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                <PinFace stop={item} />
              </span>
            );
          })}
        </div>

        {nearby && (
          <PulseLiveMap
            stops={stops}
            dots={example}
            mapAlt={mapAlt}
            active={active}
            open={open}
            card={<StopCard stop={stop} />}
            pinFace={(item) => <PinFace stop={item} />}
            onChoose={choose}
            onClose={close}
            onExplore={() => setManual(true)}
            onReady={() => setLive(true)}
          />
        )}

        {/* On the still map the card floats above the focused pin, like a
            map popup; the live map carries it on the pin instead. */}
        {!live && (
          <div
            key={active}
            className="absolute left-1/2 w-[min(17rem,calc(100%_-_2rem))] animate-rise"
            style={{
              top: "var(--cy)",
              translate: "-50% calc(-100% - 2.25rem)",
            }}
          >
            <StopCard stop={stop} />
          </div>
        )}

        <GlassGroup
          radius={999}
          className="absolute right-2 bottom-2 rounded-full px-2.5 py-0.5 text-xs text-ink/70 glass-light"
        >
          {live ? saturdayContent.liveCredit : saturdayContent.credit}
        </GlassGroup>
      </div>
    </div>
  );
}
