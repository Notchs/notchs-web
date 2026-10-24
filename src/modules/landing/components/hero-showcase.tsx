"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import Image from "next/image";

import { heroContent, heroSlides, sampleProof, venueByKind } from "../content";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";

const SLIDE_MS = 2000;

/** How long a card takes to glide into its spot. */
const SETTLE_MS = 700;

/** How far, as a share of the deck's width, a drag goes to move one card. */
const DRAG_UNIT = 0.45;

/** Pixels a pointer has to travel before a press counts as a drag. */
const DRAG_THRESHOLD = 6;

/** Release speed, in px/ms, that flicks to the next card on a short drag. */
const FLICK_SPEED = 0.4;

/**
 * Cards kept mounted on each side of the front one. The outer ones sit faded
 * out past the edge, so their photos have loaded before they slide in.
 */
const REACH = 3;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Where a card sits for its place in the fan. 0 is the main card in front,
 * -1 and 1 lean out behind it on the left and right, and ±2 is off the edge
 * and faded out. Places in between blend, so a dragged card glides between
 * spots. The sideways step comes from --fan-step, tighter below lg so the
 * tilted side cards stay inside the gutter.
 */
function fan(offset: number) {
  const distance = Math.abs(offset);
  const scale =
    distance <= 1
      ? 1 - 0.14 * distance
      : 0.86 - 0.08 * Math.min(distance - 1, 1);

  return {
    translate: `calc(${offset} * var(--fan-step)) 0`,
    scale: `${scale}`,
    rotate: `${Math.max(-2, Math.min(2, offset)) * 6}deg`,
    opacity: `${Math.max(0, Math.min(1, 2 - distance))}`,
    zIndex: `${Math.max(0, 30 - Math.round(distance * 10))}`,
    pointerEvents: distance > 1.5 ? "none" : "",
    // How much the dimming layer covers the photo, so the front card stands out.
    dim: `${0.35 * Math.min(1, distance)}`,
  };
}

const fanStyle = (offset: number) => {
  const { dim, ...style } = fan(offset);
  return { ...style, "--dim": dim } as CSSProperties;
};

/** Writes a card's spot straight to the DOM, skipping a React render. */
function paintCard(element: HTMLElement, offset: number) {
  const { dim, ...style } = fan(offset);
  Object.assign(element.style, style);
  element.style.setProperty("--dim", dim);
}

/** One venue card: photo, place label and the sample proof. */
function DeckCard({
  slideIndex,
  front,
}: {
  slideIndex: number;
  front: boolean;
}) {
  const slide = heroSlides[slideIndex];
  const venue = venueByKind(slide.kind);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-ink">
      <Image
        src={slide.image.src}
        alt={front ? slide.image.alt : ""}
        aria-hidden={!front}
        fill
        draggable={false}
        sizes="(min-width: 1024px) 440px, 70vw"
        placeholder="blur"
        preload={slideIndex === 0}
        className="object-cover"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-ink opacity-(--dim) transition-opacity duration-(--deck-speed) ease-notch motion-reduce:transition-none"
      />
      <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1.5 text-sm font-semibold text-paper">
        {venue.label}
      </span>
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[19rem]">
        <div className="rounded-2xl border border-white/10 bg-ink p-4 pt-6 text-paper notch notch-lg">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <p className="flex items-center gap-2 font-display text-lg font-extrabold tracking-[-.02em] text-volt sm:text-xl">
              <VerifiedIcon className="size-5" />
              {sampleProof.title}
            </p>
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-stone">
              {heroContent.sampleNote}
            </span>
          </div>
          <p className="mt-2 font-mono text-sm text-paper/90">
            {venue.example} · {sampleProof.notch}
          </p>
        </div>
      </div>
    </div>
  );
}

type Drag = {
  pointerId: number;
  startX: number;
  startView: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  unit: number;
  moved: boolean;
};

/**
 * A fan of three venue cards: the main card in front, one leaning out on each
 * side. Every 2 seconds the right card swings to the middle and the middle one
 * moves left. People can also drag or swipe the deck, tap a side card, or use
 * the arrow keys; the cards follow the pointer and settle on the nearest spot.
 * Pauses on hover and while dragging; reduced motion turns off the autoplay.
 *
 * While dragging, card positions are written to the DOM once per frame rather
 * than through React state, so the photos track the pointer without lag.
 */
export function HeroShowcase() {
  // The front card's place, unbounded so a card keeps its element as the deck
  // wraps around. Only changes when the front card does.
  const [center, setCenter] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<number, HTMLDivElement>());
  // Where the deck is right now, as a fractional place.
  const view = useRef(0);
  const frame = useRef(0);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const count = heroSlides.length;

  const paint = () => {
    frame.current = 0;
    for (const [place, element] of cards.current) {
      paintCard(element, place - view.current);
    }
  };

  const setSpeed = (ms: number) =>
    deckRef.current?.style.setProperty("--deck-speed", `${ms}ms`);

  const goTo = (place: number) => {
    setSpeed(SETTLE_MS);
    view.current = place;
    paint();
    setCenter(place);
  };

  // Cards that just mounted take their spot before the browser draws them.
  useLayoutEffect(paint);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useEffect(() => {
    if (hovered || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(() => goTo(center + 1), SLIDE_MS);
    return () => clearTimeout(timer);
  });

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    suppressClick.current = false;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startView: view.current,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      unit: event.currentTarget.offsetWidth * DRAG_UNIT,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;

    if (!current.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      // Captured only once it is a drag, so a plain tap still reaches a card.
      current.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setSpeed(0);
      setDragging(true);
    }

    const elapsed = event.timeStamp - current.lastTime;
    if (elapsed > 0) {
      const instant = (event.clientX - current.lastX) / elapsed;
      current.velocity = current.velocity * 0.6 + instant * 0.4;
    }
    current.lastX = event.clientX;
    current.lastTime = event.timeStamp;

    view.current = current.startView - dx / current.unit;
    if (!frame.current) frame.current = requestAnimationFrame(paint);
    // Re-renders only when the front card changes, to mount the next one.
    const nearest = Math.round(view.current);
    if (nearest !== center) setCenter(nearest);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    suppressClick.current = true;
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    // A pointer that sat still before letting go should not flick.
    const idle = event.timeStamp - current.lastTime > 80;
    const velocity = idle ? 0 : current.velocity;
    const flick =
      Math.abs(velocity) > FLICK_SPEED ? -Math.sign(velocity) * 0.5 : 0;
    goTo(Math.round(view.current + flick));
    setDragging(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") goTo(center - 1);
    else if (event.key === "ArrowRight") goTo(center + 1);
    else return;
    event.preventDefault();
  };

  // Keyed by slide, so each card keeps its element and glides between spots.
  const deck = Array.from({ length: REACH * 2 + 1 }, (_, i) => {
    const place = center + i - REACH;
    return { place, slideIndex: mod(place, count) };
  });

  return (
    <div
      ref={deckRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Places you can get Notched"
      tabIndex={0}
      className="relative aspect-[4/3.6] animate-fade-in cursor-grab touch-pan-y rounded-3xl select-none [--deck-speed:700ms] [animation-delay:250ms] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt active:cursor-grabbing lg:aspect-[5/5.2]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="relative size-full [--fan-step:22.5%] lg:[--fan-step:29%]">
        {deck.map(({ place, slideIndex }) => (
          <div
            key={slideIndex}
            ref={(element) => {
              if (!element) return;
              cards.current.set(place, element);
              return () => {
                cards.current.delete(place);
              };
            }}
            style={fanStyle(place - center)}
            className="absolute inset-x-[17%] inset-y-0 origin-[50%_85%] transition-[translate,scale,rotate,opacity] duration-(--deck-speed) ease-notch will-change-[translate,scale,rotate,opacity] motion-reduce:transition-none lg:inset-x-[15%]"
            onClick={() => {
              if (suppressClick.current) return;
              if (place !== center) goTo(place);
            }}
          >
            <DeckCard slideIndex={slideIndex} front={place === center} />
          </div>
        ))}
      </div>
    </div>
  );
}
