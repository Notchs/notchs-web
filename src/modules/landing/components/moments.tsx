"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { cn } from "@/shared/lib/cn";

import { momentsContent } from "../content";
import { useStripScroll } from "../lib/use-strip-scroll";
import { SectionHeading } from "./section-heading";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";

const { stories } = momentsContent;

/**
 * Story-style viewer with photos of people out in the city. Bars fill over
 * 4 seconds, then the next story shows. Tap right for next, left for back;
 * press and hold to pause. Below lg the story list is a swipeable strip right
 * above the viewer, and the viewer is sized to the screen, so both fit at once.
 */
export function Moments() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const story = stories[active];
  useStripScroll(listRef, active);

  const go = (step: number) =>
    setActive((current) => (current + step + stories.length) % stories.length);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-center lg:gap-20">
      {/* min-w-0 lets the story strip scroll instead of widening the page. */}
      <div className="min-w-0">
        <SectionHeading
          kicker={momentsContent.kicker}
          title={momentsContent.title}
          description={momentsContent.description}
          className="reveal"
        />
        <ol
          ref={listRef}
          className="mt-8 flex snap-x gap-2 overflow-x-auto pb-1 lg:mt-10 lg:grid lg:grid-cols-2 lg:overflow-visible lg:pb-0"
        >
          {stories.map((item, index) => (
            <li key={item.caption} className="flex-none snap-start">
              <button
                type="button"
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                className={cn(
                  "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border p-1.5 pr-4 text-left transition-[background-color,border-color] duration-200 lg:min-h-16 lg:p-2 lg:pr-4",
                  index === active
                    ? "border-foreground bg-card"
                    : "border-line hover:border-foreground/40",
                )}
              >
                <span className="relative size-10 flex-none overflow-hidden rounded-xl bg-block lg:size-12">
                  <Image
                    src={item.image.src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="leading-snug font-semibold whitespace-nowrap lg:whitespace-normal">
                  {item.caption}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto w-full max-w-[22rem] reveal">
        <div
          className="relative h-[clamp(24rem,calc(100svh-13rem),36rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-ink text-paper select-none lg:aspect-9/16 lg:h-auto"
          onPointerDown={() => setHeld(true)}
          onPointerUp={() => setHeld(false)}
          onPointerLeave={() => setHeld(false)}
        >
          {stories.map((item, index) => (
            <Image
              key={item.caption}
              src={item.image.src}
              alt={index === active ? item.image.alt : ""}
              aria-hidden={index !== active}
              fill
              sizes="352px"
              placeholder="blur"
              className={cn(
                "object-cover transition-opacity duration-500 ease-notch motion-reduce:transition-none",
                index === active ? "opacity-100" : "opacity-0",
              )}
            />
          ))}

          <div className="absolute inset-x-3 top-3 flex gap-1">
            {stories.map((item, index) => (
              <span
                key={item.caption}
                className="h-1 flex-1 overflow-hidden rounded-full bg-paper/35"
              >
                <span
                  key={index === active ? `on-${active}` : "off"}
                  onAnimationEnd={index === active ? () => go(1) : undefined}
                  className={cn(
                    "block h-full origin-left rounded-full bg-paper",
                    index < active && "scale-x-100",
                    index > active && "scale-x-0",
                    index === active && "animate-story",
                    held && "[animation-play-state:paused]",
                  )}
                />
              </span>
            ))}
          </div>

          <div className="absolute top-7 left-3 flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-volt">
              <NotchGlyph className="size-4" />
            </span>
            notchs
          </div>

          <div
            key={active}
            className="absolute inset-x-4 bottom-5 grid animate-rise justify-items-start gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2 font-mono text-sm">
              <VerifiedIcon className="size-4 text-volt" />
              {story.sticker}
            </span>
            <p className="rounded-xl bg-ink/60 px-3 py-2 font-display text-xl leading-tight font-extrabold tracking-[-.02em]">
              {story.caption}
            </p>
          </div>

          <button
            type="button"
            aria-label={momentsContent.previous}
            onClick={() => go(-1)}
            className="absolute inset-y-0 left-0 w-1/3 cursor-pointer"
          />
          <button
            type="button"
            aria-label={momentsContent.next}
            onClick={() => go(1)}
            className="absolute inset-y-0 right-0 w-2/3 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
