import { env } from "@/config/env";
import { NOTCH_PATH } from "@/shared/components/brand/notch-geometry";
import { cn } from "@/shared/lib/cn";

import { delayStyle } from "./main-loader";
import {
  LOGO_GRID,
  LOGO_OUTLINE,
  N_POLYGON,
  useLoaderId,
} from "./notch-geometry";

import "./secondary-loader.css";

const PIXELS_PER_SQUARE = 2;
const MIN_SIZE = 32;
const SCREEN_SIZE = 160;
const LINE_THICKNESS = 0.7;
const PATTERN_SEED = 0x4e4f5443;
const FILL_INSIDE_N = 0.72;
const FILL_OUTSIDE_N = 0.5;

const N_POINTS = N_POLYGON.split(" ").map((pair) =>
  pair.split(",").map(Number),
);

/** Same seed, same numbers: server and client draw the identical pattern. */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function isInsideN(x: number, y: number) {
  let inside = false;
  N_POINTS.forEach(([x1, y1], index) => {
    const [x2, y2] = N_POINTS[(index + 1) % N_POINTS.length];
    if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) {
      inside = !inside;
    }
  });
  return inside;
}

/** An even number of pixels, so every square lands on whole pixels. */
function normalizeSize(size: number) {
  const valid = Math.max(
    MIN_SIZE,
    Math.round(size / PIXELS_PER_SQUARE) * PIXELS_PER_SQUARE,
  );
  if (valid !== size && !env.isProductionBuild) {
    console.warn(`SecondaryLoader: size ${size} changed to ${valid}.`);
  }
  return valid;
}

type QrPattern = {
  squares: number;
  eyes: { x: number; y: number }[];
  eyeWidth: number;
  ring: number;
  centre: number;
  /** All the data squares; squares side by side in a row share one rectangle. */
  dataPath: string;
};

function buildQrPattern(squares: number): QrPattern {
  const eyeWidth = Math.floor(squares / 4);
  const ring = Math.max(1, Math.round(eyeWidth / 7));
  const far = squares - eyeWidth;

  // The eye plus its one-square gap stays free of data squares.
  const clear = eyeWidth + 1;
  const isNearEye = (column: number, row: number) =>
    (column < clear && row < clear) ||
    (column >= squares - clear && row < clear) ||
    (column < clear && row >= squares - clear);

  const random = mulberry32(PATTERN_SEED);
  const toUnits = LOGO_GRID / squares;
  let dataPath = "";

  for (let row = 0; row < squares; row += 1) {
    let runStart = -1;
    for (let column = 0; column <= squares; column += 1) {
      const fill = isInsideN((column + 0.5) * toUnits, (row + 0.5) * toUnits)
        ? FILL_INSIDE_N
        : FILL_OUTSIDE_N;
      const isFilled =
        column < squares && random() < fill && !isNearEye(column, row);
      if (isFilled && runStart < 0) runStart = column;
      if (!isFilled && runStart >= 0) {
        const length = column - runStart;
        dataPath += `M${runStart} ${row}h${length}v1h-${length}z`;
        runStart = -1;
      }
    }
  }

  return {
    squares,
    eyes: [
      { x: 0, y: 0 },
      { x: far, y: 0 },
      { x: 0, y: far },
    ],
    eyeWidth,
    ring,
    centre: eyeWidth - ring * 4,
    dataPath,
  };
}

/** Patterns never change, so each size is only built once. */
const patterns = new Map<number, QrPattern>();

function patternFor(squares: number) {
  let pattern = patterns.get(squares);
  if (!pattern) {
    pattern = buildQrPattern(squares);
    patterns.set(squares, pattern);
  }
  return pattern;
}

type SecondaryLoaderProps = {
  /** Even pixels, at least 32. One QR square is always 2 x 2 pixels. */
  size?: number;
  /** Text for screen readers. */
  label?: string;
  /** Stays invisible this long, so fast loads don't flash. */
  delayMs?: number;
  className?: string;
};

/**
 * "Ping-pong scan": a scan line moves down and turns a Paper QR into the Volt N,
 * then moves up and turns it back. For scan and verification moments, on Ink or
 * Graphite only. The QR never animates; only the line and two clips move.
 */
export function SecondaryLoader({
  size = 64,
  label = "Loading",
  delayMs = 300,
  className,
}: SecondaryLoaderProps) {
  const logoClipId = useLoaderId("secondary-loader-logo");
  const nClipId = useLoaderId("secondary-loader-n");
  const aboveClipId = useLoaderId("secondary-loader-above");
  const belowClipId = useLoaderId("secondary-loader-below");
  const validSize = normalizeSize(size);
  const { squares, eyes, eyeWidth, ring, centre, dataPath } = patternFor(
    validSize / PIXELS_PER_SQUARE,
  );

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
        className="block"
      >
        <defs>
          <clipPath id={logoClipId}>
            <path d={LOGO_OUTLINE} />
          </clipPath>
          <clipPath id={nClipId}>
            <path d={NOTCH_PATH} />
          </clipPath>
          <clipPath id={aboveClipId}>
            <rect
              y={-LOGO_GRID}
              width={LOGO_GRID}
              height={LOGO_GRID}
              className="secondary-loader-scan"
            />
          </clipPath>
          <clipPath id={belowClipId}>
            <rect
              width={LOGO_GRID}
              height={LOGO_GRID}
              className="secondary-loader-scan"
            />
          </clipPath>
        </defs>
        <g clipPath={`url(#${logoClipId})`}>
          <g clipPath={`url(#${aboveClipId})`}>
            <path d={NOTCH_PATH} className="fill-volt" />
          </g>
          <g clipPath={`url(#${belowClipId})`}>
            <g
              transform={`scale(${LOGO_GRID / squares})`}
              shapeRendering="crispEdges"
            >
              <path d={dataPath} className="fill-paper" />
              {eyes.map(({ x, y }) => (
                <g key={`${x}-${y}`}>
                  <rect
                    x={x}
                    y={y}
                    width={eyeWidth}
                    height={eyeWidth}
                    className="fill-paper"
                  />
                  <rect
                    x={x + ring}
                    y={y + ring}
                    width={eyeWidth - ring * 2}
                    height={eyeWidth - ring * 2}
                    className="fill-ink"
                  />
                  {centre >= 1 && (
                    <rect
                      x={x + ring * 2}
                      y={y + ring * 2}
                      width={centre}
                      height={centre}
                      className="fill-paper"
                    />
                  )}
                </g>
              ))}
            </g>
          </g>
          {/* Only on the N: the line must not cross the empty notches. */}
          <g clipPath={`url(#${nClipId})`}>
            <rect
              y={-LINE_THICKNESS / 2}
              width={LOGO_GRID}
              height={LINE_THICKNESS}
              className={cn(
                "secondary-loader-scan",
                "secondary-loader-line",
                "fill-volt",
              )}
            />
          </g>
        </g>
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Full-screen version on Ink, while a scan is being checked. */
export function SecondaryLoaderScreen({
  label,
  delayMs = 300,
}: Pick<SecondaryLoaderProps, "label" | "delayMs">) {
  return (
    <div
      className={cn(
        "main-loader-appear",
        "fixed inset-0 z-40 grid place-items-center bg-ink",
      )}
      style={delayStyle(delayMs)}
    >
      <SecondaryLoader size={SCREEN_SIZE} label={label} delayMs={delayMs} />
    </div>
  );
}
