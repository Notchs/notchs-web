"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/cn";

import { heroContent, heroSlides, sampleProof, venueByKind } from "../content";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";

const SLIDE_MS = 2000;

/** How far, as a share of the deck's width, a drag goes to move one card. */
const DRAG_UNIT = 0.45;

/** Pixels a pointer has to travel before a press counts as a drag. */
const DRAG_THRESHOLD = 6;

/** Release speed, in px/ms, that flicks to the next card on a short drag. */
const FLICK_SPEED = 0.4;

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Where a card sits for its place in the fan. 0 is the main card in front,
 * -1 and 1 lean out behind it on the left and right, and ±2 is off the edge
 * and faded out. Places in between blend, so a dragged card glides between
 * spots. The sideways step comes from --fan-step, tighter below lg so the
 * tilted side cards stay inside the gutter.
 */
function fanStyle(offset: number) {
  const distance = Math.abs(offset);
  const scale =
    distance <= 1
      ? 1 - 0.14 * distance
      : 0.86 - 0.08 * Math.min(distance - 1, 1);

  return {
    translate: `calc(${offset} * var(--fan-step)) 0`,
    scale: `${scale}`,
    rotate: `${Math.max(-2, Math.min(2, offset)) * 6}deg`,
    opacity: Math.max(0, Math.min(1, 2 - distance)),
    zIndex: Math.max(0, 30 - Math.round(distance * 10)),
  };
}

/** One venue card: photo, place label and the sample proof. */
function DeckCard({
  slideIndex,
  offset,
  dragging,
}: {
  slideIndex: number;
  offset: number;
  dragging: boolean;
}) {
  const slide = heroSlides[slideIndex];
  const venue = venueByKind(slide.kind);
  const front = Math.round(offset) === 0;

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
      {/* Dims the cards behind so the main one stands out. */}
      <span
        aria-hidden="true"
        style={{ opacity: 0.35 * Math.min(1, Math.abs(offset)) }}
        className={cn(
          "absolute inset-0 z-10 bg-ink",
          !dragging &&
            "transition-opacity duration-700 ease-notch motion-reduce:transition-none",
        )}
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
 */
export function HeroShowcase() {
  // Unbounded, so a card keeps its element as the deck wraps around.
  const [position, setPosition] = useState(0);
  // How many cards the current drag has moved the deck, as a fraction.
  const [shift, setShift] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const count = heroSlides.length;

  useEffect(() => {
    if (hovered || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () => setPosition((current) => current + 1),
      SLIDE_MS,
    );
    return () => clearTimeout(timer);
  }, [position, hovered, dragging]);

  const settle = (velocity: number) => {
    const flick =
      Math.abs(velocity) > FLICK_SPEED ? -Math.sign(velocity) * 0.5 : 0;
    const steps = Math.round(shift + flick);
    setPosition((current) => current + steps);
    setShift(0);
    setDragging(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    suppressClick.current = false;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
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
      setDragging(true);
    }

    const elapsed = event.timeStamp - current.lastTime;
    if (elapsed > 0) {
      const instant = (event.clientX - current.lastX) / elapsed;
      current.velocity = current.velocity * 0.6 + instant * 0.4;
    }
    current.lastX = event.clientX;
    current.lastTime = event.timeStamp;
    setShift(-dx / current.unit);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!current.moved) return;
    suppressClick.current = true;
    // A pointer that sat still before letting go should not flick.
    const idle = event.timeStamp - current.lastTime > 80;
    settle(idle ? 0 : current.velocity);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") setPosition((current) => current - 1);
    else if (event.key === "ArrowRight") setPosition((current) => current + 1);
    else return;
    event.preventDefault();
  };

  // Keyed by slide, so each card keeps its element and glides between spots.
  const view = position + shift;
  const center = Math.round(view);
  const deck = [-2, -1, 0, 1, 2].map((step) => {
    const place = center + step;
    return { place, offset: place - view, slideIndex: mod(place, count) };
  });

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Places you can get Notched"
      tabIndex={0}
      className="relative aspect-[4/3.6] animate-fade-in cursor-grab touch-pan-y rounded-3xl select-none [animation-delay:250ms] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-volt active:cursor-grabbing lg:aspect-[5/5.2]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
    >
      <div className="relative size-full [--fan-step:22.5%] lg:[--fan-step:29%]">
        {deck.map(({ place, offset, slideIndex }) => (
          <div
            key={slideIndex}
            style={fanStyle(offset)}
            className={cn(
              "absolute inset-x-[17%] inset-y-0 origin-[50%_85%] lg:inset-x-[15%]",
              !dragging &&
                "transition-[translate,scale,rotate,opacity] duration-700 ease-notch motion-reduce:transition-none",
              Math.abs(offset) > 1.5 && "pointer-events-none",
            )}
            onClick={() => {
              if (suppressClick.current) return;
              if (place !== center) setPosition(place);
            }}
          >
            <DeckCard
              slideIndex={slideIndex}
              offset={offset}
              dragging={dragging}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
