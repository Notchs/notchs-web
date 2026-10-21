"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ReplayIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { howItWorksContent, steps, venues } from "../content";
import { buildQrPattern } from "../lib/qr-pattern";
import { useLanding } from "./landing-provider";
import { WhatsAppChat } from "./whatsapp-chat";

const STAGE_MS = 2600;
const MINI_QR = 25;

/** Viewfinder brackets around the code in the camera view. */
const cameraCorners = [
  "top-0 left-0 rounded-tl-xl border-t-2 border-l-2",
  "top-0 right-0 rounded-tr-xl border-t-2 border-r-2",
  "bottom-0 left-0 rounded-bl-xl border-b-2 border-l-2",
  "right-0 bottom-0 rounded-br-xl border-r-2 border-b-2",
];

/** Dark modules as one SVG path, drawn on a 25 x 25 grid. */
function useMiniQrPath() {
  return useMemo(() => {
    const pattern = buildQrPattern(MINI_QR, 7);
    let d = "";
    pattern.forEach((dark, i) => {
      if (dark) d += `M${i % MINI_QR} ${Math.floor(i / MINI_QR)}h1v1h-1z`;
    });
    return d;
  }, []);
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg px-1 font-semibold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-current"
    >
      <ReplayIcon className="size-4.5" />
      {howItWorksContent.replay}
    </button>
  );
}

/**
 * Plays the three stages once the phone scrolls into view. Desktop lists the
 * steps beside the phone; smaller screens show them as tabs right above it, so
 * picking a step and seeing the phone change happen in one view.
 */
export function NotchDemo() {
  const { venue } = useLanding();
  const active = venues.find((item) => item.kind === venue) ?? venues[0];
  const phoneRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const [replays, setReplays] = useState(0);
  const qrPath = useMiniQrPath();

  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(phone);
    return () => observer.disconnect();
  }, []);

  // Restarts when the phone first shows, the place changes or "Play again".
  useEffect(() => {
    if (!inView || manual) return;
    const timers = steps.map((_, index) =>
      setTimeout(() => setStage(index), index * STAGE_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, manual, venue, replays]);

  const jumpTo = (index: number) => {
    setManual(true);
    setStage(index);
  };

  const replay = () => {
    setManual(false);
    setReplays((count) => count + 1);
  };

  const layer = (index: number) =>
    cn(
      "absolute inset-0 transition-[opacity,translate] duration-300 ease-notch motion-reduce:transition-none",
      stage === index
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-2 opacity-0",
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-16">
      {/* Desktop: the steps are pieces of one glass, so neighbours melt
          together; a raised lens marks the current step and flows to the
          next as the demo plays, or to the one under the pointer. */}
      <GlassGroup self={false} merge={16} className="hidden lg:block">
        <GlassLensTrack restingIndex={stage} lensRadius={14} inset={6}>
          <ol className="grid gap-3">
            {steps.map((step, index) => {
              const current = stage === index;
              return (
                <li key={step.title}>
                  <GlassShape radius={16}>
                    <button
                      type="button"
                      aria-pressed={current}
                      onClick={() => jumpTo(index)}
                      className="relative w-full cursor-pointer rounded-2xl p-5 pt-6 text-left sm:p-6 sm:pt-7"
                      {...LENS_ITEM}
                    >
                      <span className="flex items-baseline gap-4">
                        <span
                          className={cn(
                            "font-display text-2xl font-extrabold tabular-nums transition-colors duration-200",
                            current ? "text-foreground" : "text-muted",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block font-display text-xl font-extrabold tracking-[-.02em]">
                            {step.title}
                          </span>
                          <span className="mt-1.5 block text-base leading-relaxed text-muted">
                            {step.body}
                          </span>
                        </span>
                      </span>
                    </button>
                  </GlassShape>
                </li>
              );
            })}
          </ol>
        </GlassLensTrack>
        <div className="mt-3">
          <ReplayButton onClick={replay} />
        </div>
      </GlassGroup>

      <div className="mx-auto w-full max-w-[18rem] sm:max-w-[20rem]">
        {/* Phones and tablets: the steps as a glass segmented control, with the
            current one explained. A raised glass lens flows between them. */}
        <div className="mb-5 lg:hidden">
          <GlassGroup radius={20} className="rounded-[20px] p-1.5">
            <GlassLensTrack restingIndex={stage} lensRadius={14} inset={0}>
              <ol className="grid grid-cols-3 gap-1">
                {steps.map((step, index) => {
                  const current = stage === index;
                  return (
                    <li key={step.title} className="relative">
                      <button
                        type="button"
                        aria-pressed={current}
                        onClick={() => jumpTo(index)}
                        className="relative flex min-h-12 w-full cursor-pointer flex-col items-center justify-center rounded-[14px] px-1.5 py-2 text-center"
                        {...LENS_ITEM}
                      >
                        <span
                          className={cn(
                            "font-display text-xs font-extrabold tabular-nums",
                            !current && "text-muted",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-sm font-extrabold tracking-[-.02em]">
                          {step.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </GlassLensTrack>
          </GlassGroup>
          <p
            aria-live="polite"
            className="mt-3 min-h-[3lh] text-[.9375rem] leading-snug text-muted"
          >
            {steps[stage].body}
          </p>
        </div>

        {/* The phone. Always Ink, like the real WhatsApp screens in the demo. */}
        <div
          ref={phoneRef}
          {...INK_GROUND}
          className="rounded-[2.5rem] border-[10px] border-graphite bg-ink text-paper surface-ink"
        >
          {/* Below lg the screen height follows the viewport (minus header,
              tabs and caption), so tabs and the whole phone fit in one view. */}
          <div className="relative h-[clamp(20rem,calc(100svh-17rem),32rem)] overflow-hidden rounded-[1.9rem] lg:aspect-9/17 lg:h-auto">
            {/* 1. Scan: camera over the counter phone. */}
            <div className={layer(0)} aria-hidden={stage !== 0}>
              <Image
                src={active.image.src}
                alt=""
                fill
                sizes="300px"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative rounded-xl bg-paper p-3">
                  <svg
                    viewBox={`0 0 ${MINI_QR} ${MINI_QR}`}
                    className="size-32 text-ink"
                    shapeRendering="crispEdges"
                    aria-hidden="true"
                  >
                    <path d={qrPath} fill="currentColor" />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 grid size-7 -translate-1/2 place-items-center rounded-md bg-ink text-paper">
                    <NotchGlyph className="size-4" />
                  </span>
                  <span className="absolute -inset-x-2 h-1 animate-scan rounded-full border-y border-ink bg-volt motion-reduce:hidden" />
                  <span className="pointer-events-none absolute -inset-4">
                    {cameraCorners.map((corner) => (
                      <span
                        key={corner}
                        className={cn("absolute size-6 border-paper", corner)}
                      />
                    ))}
                  </span>
                </div>
              </div>
              <p className="absolute inset-x-0 bottom-6 text-center text-sm font-semibold">
                {howItWorksContent.pickPlace} {active.example}
              </p>
            </div>

            {/* 2 and 3: the WhatsApp chat with the Notchs bot. */}
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none",
                stage === 0 ? "opacity-0" : "opacity-100",
              )}
              aria-hidden={stage === 0}
            >
              <WhatsAppChat
                stage={stage}
                venue={active.example}
                repliesClassName={layer(2)}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-center lg:hidden">
          <ReplayButton onClick={replay} />
        </div>
      </div>
    </div>
  );
}
