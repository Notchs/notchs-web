"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ReplayIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

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

/** Plays the three stages once the phone scrolls into view. */
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
      <ol className="grid gap-3">
        {steps.map((step, index) => {
          const current = stage === index;
          return (
            <li key={step.title}>
              <button
                type="button"
                aria-pressed={current}
                onClick={() => jumpTo(index)}
                className={cn(
                  "w-full cursor-pointer rounded-2xl border p-5 pt-6 text-left transition-[background-color,border-color] duration-200 notch sm:p-6 sm:pt-7",
                  current
                    ? "border-foreground bg-card"
                    : "border-line hover:border-foreground/40",
                )}
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
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={replay}
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-lg px-1 font-semibold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-current"
          >
            <ReplayIcon className="size-4.5" />
            {howItWorksContent.replay}
          </button>
        </li>
      </ol>

      {/* The phone. Always Ink, like the real WhatsApp screens in the demo. */}
      <div
        ref={phoneRef}
        className="mx-auto w-full max-w-[20rem] rounded-[2.5rem] border-[10px] border-graphite bg-ink text-paper"
      >
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.9rem]">
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
    </div>
  );
}
