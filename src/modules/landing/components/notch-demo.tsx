"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { ArrowRightIcon, ChatIcon, ScanIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { howItWorksContent, steps, venues } from "../content";
import { buildQrPattern } from "../lib/qr-pattern";
import { useLanding } from "./landing-provider";
import { SectionHeading } from "./section-heading";
import { WhatsAppChat } from "./whatsapp-chat";

const STAGE_MS = 2600;
const MINI_QR = 25;

const stepIcons = [ScanIcon, ChatIcon, VerifiedIcon];

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

/**
 * "How it works" as one Ink panel: the pitch, the three steps as icons and
 * the call to action on the left, a tilted phone playing the demo on the
 * right. The demo starts once the phone scrolls into view; tapping a step
 * jumps to it.
 */
export function NotchDemo() {
  const { venue } = useLanding();
  const active = venues.find((item) => item.kind === venue) ?? venues[0];
  const phoneRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [inView, setInView] = useState(false);
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

  // Loops Scan → Send → Notched → Scan… once the phone shows. Tapping a step
  // jumps there and the loop carries on from it. Reduced motion: no autoplay.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setTimeout(
      () => setStage((current) => (current + 1) % steps.length),
      STAGE_MS,
    );
    return () => clearTimeout(timer);
  }, [inView, stage]);

  // A new place starts the demo again from the scan.
  const [shownVenue, setShownVenue] = useState(venue);
  if (venue !== shownVenue) {
    setShownVenue(venue);
    setStage(0);
  }

  const jumpTo = (index: number) => setStage(index);

  const layer = (index: number) =>
    cn(
      "absolute inset-0 transition-[opacity,translate] duration-300 ease-notch motion-reduce:transition-none",
      stage === index
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-2 opacity-0",
    );

  return (
    <div
      {...INK_GROUND}
      className="relative grid reveal gap-12 overflow-hidden rounded-3xl bg-ink p-6 py-10 text-paper sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:p-14 lg:pr-20"
    >
      <div className="relative">
        <SectionHeading
          kicker={howItWorksContent.kicker}
          title={howItWorksContent.titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          description={howItWorksContent.description}
          onInk
        />

        {/* The steps: icons joined by arrows. The current one lights up. */}
        <ol className="mt-10 flex items-start gap-2 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            const current = stage === index;
            const done = index < stage;
            return (
              <Fragment key={step.label.join(" ")}>
                {index > 0 && (
                  <li aria-hidden="true" className="pt-5 sm:pt-6">
                    <ArrowRightIcon
                      className={cn(
                        "size-4 transition-colors duration-300",
                        done || current ? "text-paper" : "text-paper/35",
                      )}
                    />
                  </li>
                )}
                <li className="flex-1 sm:flex-none">
                  <button
                    type="button"
                    aria-pressed={current}
                    onClick={() => jumpTo(index)}
                    className="group flex w-full cursor-pointer flex-col items-center gap-2.5 text-center sm:w-24"
                  >
                    <span
                      className={cn(
                        "grid size-14 place-items-center rounded-full border-2 transition-colors duration-300 sm:size-16",
                        current
                          ? "border-volt bg-volt/10 text-volt"
                          : done
                            ? "border-paper/60 text-paper"
                            : "border-paper/20 text-paper/70 group-hover:border-paper/50",
                      )}
                    >
                      <Icon className="size-6 sm:size-7" />
                    </span>
                    <span className="text-sm leading-tight font-semibold sm:text-[.9375rem]">
                      {step.label[0]}
                      <br />
                      {step.label[1]}
                    </span>
                    <span className="sr-only">{step.body}</span>
                  </button>
                </li>
              </Fragment>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href={routes.login}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-volt px-6 font-semibold text-ink transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none"
          >
            {howItWorksContent.cta}
            <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* The phone, tilted on desktop, with a few Volt sparks by its corner. */}
      <div className="relative mx-auto w-full max-w-60 lg:w-68 lg:max-w-none">
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="absolute -top-8 -right-8 size-12 text-volt"
          fill="none"
          stroke="currentColor"
          strokeWidth={3.5}
          strokeLinecap="round"
        >
          <path d="M8 16 6 5M20 14l6-10M24 24l11-3" />
        </svg>
        <div
          ref={phoneRef}
          className="rounded-[2.25rem] border-[8px] border-graphite bg-ink text-paper shadow-[0_40px_80px_-30px_rgb(0_0_0/.9)] ring-1 surface-ink ring-white/15 lg:rotate-6"
        >
          {/* A 9:16 screen, like a real phone. */}
          <div className="relative aspect-9/16 overflow-hidden rounded-[1.75rem]">
            {/* 1. Scan: camera over the counter phone. */}
            <div className={layer(0)} aria-hidden={stage !== 0}>
              <Image
                src={active.image.src}
                alt=""
                fill
                sizes="280px"
                placeholder="blur"
                className="object-cover opacity-45"
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative rounded-xl bg-paper p-3">
                  <svg
                    viewBox={`0 0 ${MINI_QR} ${MINI_QR}`}
                    className="size-28 text-ink"
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

      <p aria-live="polite" className="sr-only">
        {steps[stage].body}
      </p>
    </div>
  );
}
