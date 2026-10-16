"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/shared/lib/cn";

import { heroContent, heroSlides, sampleProof, venueByKind } from "../content";
import { VerifiedIcon } from "./verified-icon";

const SLIDE_MS = 2000;

/**
 * Where each card sits, by its place in the fan. 0 is the main card in front,
 * -1 and 1 lean out behind it on the left and right, and -2 is the card that
 * just left (it slides further left and fades). New cards come in on the right.
 */
const fanStyles: Record<number, string> = {
  [-2]: "z-0 -translate-x-[55%] scale-[.78] -rotate-12 opacity-0 pointer-events-none",
  [-1]: "z-10 -translate-x-[30%] scale-[.86] -rotate-6",
  0: "z-30",
  1: "z-10 translate-x-[30%] scale-[.86] rotate-6",
};

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
        sizes="(min-width: 1024px) 640px, 100vw"
        preload={slideIndex === 0}
        className="object-cover"
      />
      {/* Dims the cards behind so the main one stands out. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 z-10 bg-ink transition-opacity duration-700 ease-notch",
          front ? "opacity-0" : "opacity-35",
        )}
      />
      <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-3 py-1.5 text-sm font-semibold text-paper">
        {venue.label}
      </span>
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[19rem]">
        <div className="rounded-2xl border border-white/10 bg-ink p-4 pt-6 text-paper notch notch-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold tracking-[-.02em] text-volt">
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

/**
 * A fan of three venue cards: the main card in front, one leaning out on each
 * side. Every 2 seconds the right card swings to the middle and the middle one
 * moves left. Pauses on hover; reduced motion keeps the first card.
 */
export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const count = heroSlides.length;

  useEffect(() => {
    if (hovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % count),
      SLIDE_MS,
    );
    return () => clearInterval(timer);
  }, [hovered, count]);

  // Keyed by slide, so each card keeps its element and glides between spots.
  const deck = [-2, -1, 0, 1].map((offset) => ({
    offset,
    slideIndex: (index + offset + count) % count,
  }));

  return (
    <div
      className="relative aspect-[4/3.6] animate-fade-in [animation-delay:250ms] lg:aspect-[5/5.2]"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="relative size-full">
        {deck.map(({ offset, slideIndex }) => (
          <div
            key={slideIndex}
            className={cn(
              "absolute inset-x-[15%] inset-y-0 origin-[50%_85%] transition-[translate,scale,rotate,opacity] duration-700 ease-notch motion-reduce:transition-none",
              "starting:translate-x-[55%] starting:scale-[.78] starting:rotate-12 starting:opacity-0",
              fanStyles[offset],
            )}
          >
            <DeckCard slideIndex={slideIndex} front={offset === 0} />
          </div>
        ))}
      </div>
    </div>
  );
}
