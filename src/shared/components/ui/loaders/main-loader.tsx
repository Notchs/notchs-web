import type { CSSProperties } from "react";

import { cn } from "@/shared/lib/cn";

import {
  BOTTOM_NOTCH_CUT,
  LOGO_GRID,
  LOGO_OUTLINE,
  TOP_NOTCH_CUT,
  useLoaderId,
} from "./notch-geometry";

import "./main-loader.css";

const MIN_SIZE = 24;
const SCREEN_SIZE = 160;

const TALLY_MARKS = [
  { x: 4.2, className: "main-loader-tally1" },
  { x: 9, className: "main-loader-tally2" },
  { x: 13.8, className: "main-loader-tally3" },
  { x: 18.6, className: "main-loader-tally4" },
];

export function delayStyle(delayMs: number, size?: number) {
  return {
    width: size,
    height: size,
    "--main-loader-delay": `${Math.max(0, delayMs)}ms`,
  } as CSSProperties;
}

type MainLoaderProps = {
  /** Pixels, at least 24. */
  size?: number;
  /** Text for screen readers. */
  label?: string;
  /** Stays invisible this long, so fast loads don't flash. */
  delayMs?: number;
  className?: string;
};

/**
 * "Carved tally": a knife cuts 4 marks and a strike into a Volt block, the marks
 * heal, then the two notches of the N are cut. For Ink or Graphite backgrounds
 * only: Volt must never sit on white or Paper. Plain SVG and CSS. Every cut is a
 * real hole in a mask, so the background shows through it.
 */
export function MainLoader({
  size = 64,
  label = "Loading",
  delayMs = 300,
  className,
}: MainLoaderProps) {
  const maskId = useLoaderId("main-loader-mask");
  const validSize = Math.max(MIN_SIZE, size);

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "main-loader-appear",
        "inline-block shrink-0 align-middle",
        className,
      )}
      style={delayStyle(delayMs, validSize)}
    >
      <svg
        viewBox={`0 0 ${LOGO_GRID} ${LOGO_GRID}`}
        width={validSize}
        height={validSize}
        aria-hidden="true"
        className="block overflow-visible"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={LOGO_GRID}
            height={LOGO_GRID}
          >
            <rect width={LOGO_GRID} height={LOGO_GRID} fill="white" />
            {TALLY_MARKS.map(({ x, className: markClass }) => (
              <rect
                key={x}
                x={x}
                y="4"
                width="1.6"
                height="16"
                fill="black"
                className={cn("main-loader-tally", markClass)}
              />
            ))}
            <line
              x1="2"
              y1="17"
              x2="22"
              y2="7"
              pathLength="1"
              stroke="black"
              className="main-loader-strike"
            />
            <polygon
              points={TOP_NOTCH_CUT}
              fill="black"
              className="main-loader-top-notch"
            />
            <polygon
              points={BOTTOM_NOTCH_CUT}
              fill="black"
              className="main-loader-bottom-notch"
            />
          </mask>
        </defs>
        <g className="main-loader-shake">
          <path
            d={LOGO_OUTLINE}
            mask={`url(#${maskId})`}
            className="main-loader-block"
          />
        </g>
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Full-screen version on Ink, for loading.tsx files. */
export function MainLoaderScreen({
  label,
  delayMs = 300,
}: Pick<MainLoaderProps, "label" | "delayMs">) {
  return (
    <div
      className={cn(
        "main-loader-appear",
        "fixed inset-0 z-40 grid place-items-center bg-ink",
      )}
      style={delayStyle(delayMs)}
    >
      <MainLoader size={SCREEN_SIZE} label={label} delayMs={delayMs} />
    </div>
  );
}
