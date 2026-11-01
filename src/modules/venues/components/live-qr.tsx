"use client";

import { useEffect, useMemo, useState } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { qrContent } from "../content";

const SIZE = 25;
const SECONDS_PER_CODE = 6;
const FINDERS = [
  [0, 0],
  [SIZE - 7, 0],
  [0, SIZE - 7],
];

/** One module of a drawn code; it only looks like a QR and scans to nothing. */
function isDark(x: number, y: number, seed: number) {
  for (const [left, top] of FINDERS) {
    const dx = x - left;
    const dy = y - top;
    if (dx < -1 || dx > 7 || dy < -1 || dy > 7) continue;
    if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false;
    const ring = dx === 0 || dx === 6 || dy === 0 || dy === 6;
    const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return ring || core;
  }
  if (Math.abs(x - 12) <= 3 && Math.abs(y - 12) <= 3) return false;
  const hash = Math.imul(
    (x * 73856093) ^ (y * 19349663) ^ (seed * 83492791),
    2654435761,
  );
  return ((hash >>> 16) & 1) === 1;
}

function qrPath(seed: number) {
  let path = "";
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (isDark(x, y, seed)) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return path;
}

/**
 * The counter phone's screen: a drawn QR that changes on a short timer, with a
 * scan line and a countdown. With reduced motion it stays on one code.
 */
export function LiveQr() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setTick((count) => count + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const code = Math.floor(tick / SECONDS_PER_CODE);
  const seconds = SECONDS_PER_CODE - (tick % SECONDS_PER_CODE);
  const path = useMemo(() => qrPath(code), [code]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-paper px-5 text-ink">
      <p className="font-display text-sm font-extrabold tracking-[-.01em]">
        {qrContent.title}
      </p>
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          shapeRendering="crispEdges"
          className="block w-full"
          aria-hidden="true"
        >
          <path d={path} fill="currentColor" />
        </svg>
        <span className="absolute top-1/2 left-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-ink text-volt">
          <NotchGlyph className="size-1/2" />
        </span>
        <span className="absolute inset-x-0 h-1 animate-scan border-y border-ink bg-volt" />
      </div>
      <div className="w-full">
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/15">
          <div
            key={code}
            style={{ transform: `scaleX(${seconds / SECONDS_PER_CODE})` }}
            className="h-full origin-left rounded-full bg-ink transition-transform duration-1000 ease-linear"
          />
        </div>
        <p className="mt-2 text-center text-xs text-ink/75">
          {qrContent.newCode(seconds)}
        </p>
      </div>
    </div>
  );
}
