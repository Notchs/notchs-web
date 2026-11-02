"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type PointerEvent,
} from "react";

import { cn } from "@/shared/lib/cn";
import {
  createLensMaps,
  refractionEnabled,
  type LensMaps,
} from "@/shared/lib/glass/refraction";

type LiquidGlassProps = ComponentProps<"div"> & {
  /** Corner radius in px; must match the element's rounded corners. */
  radius: number;
  /** How far the steepest part of the rim bends the content behind it, in px. */
  depth?: number;
  /** Width of the curved rim, in px. */
  bezel?: number;
  /** Frost on the rim, and on the flat middle when it should differ (Level 3). */
  rimBlur?: number;
  coreBlur?: number;
  /** Skips the `glass` fill and border, for surfaces that bring their own. */
  bare?: boolean;
  /** False turns the lens off, e.g. while WebGL draws this glass instead. */
  refract?: boolean;
};

/** Default frost and colour lift inside the lens filter (Level 3). */
const LENS_BLUR = 8;
const LENS_SATURATE = 1.5;
const DEFAULT_BEZEL = 28;

type LensMap = LensMaps & { width: number; height: number };

/** Wait for a resize to settle before rebuilding the maps. */
const REBUILD_DELAY_MS = 120;

/** Builds the lens maps sized to the element, rebuilt when its size changes. */
function useLensMap(
  element: HTMLDivElement | null,
  radius: number,
  bezel: number,
) {
  const [map, setMap] = useState<LensMap | null>(null);

  useEffect(() => {
    if (!element || !refractionEnabled()) return;
    let timer = 0;

    const build = () => {
      const width = Math.round(element.offsetWidth);
      const height = Math.round(element.offsetHeight);
      if (!width || !height) return;
      // A wide rim and a flat top, like a thick slab of glass.
      const rim = Math.min(radius, bezel, height / 2);
      const maps = createLensMaps(width, height, radius, rim);
      if (maps) setMap({ ...maps, width, height });
    };

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(build, REBUILD_DELAY_MS);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [element, radius, bezel]);

  return map;
}

/** Channel masks that split the bent backdrop into red, green and blue. */
const CHANNELS = [
  { result: "r", scale: 1, values: "1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" },
  {
    result: "g",
    scale: 0.96,
    values: "0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0",
  },
  {
    result: "b",
    scale: 0.92,
    values: "0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0",
  },
];

/** An feImage that stretches one of the lens maps over the whole filter. */
function MapImage({
  href,
  map,
  result,
}: {
  href: string;
  map: LensMap;
  result: string;
}) {
  return (
    <feImage
      href={href}
      x="0"
      y="0"
      width={map.width}
      height={map.height}
      preserveAspectRatio="none"
      result={result}
    />
  );
}

/**
 * The lens filter: frost first, then the rim bends the backdrop like thick
 * glass, each colour channel by a slightly different amount for the rainbow
 * fringe at the edge. When the middle should be frosted more heavily than
 * the rim, a second blur is masked to the flat top. Last, the specular map
 * adds the light catching the curved rim. Blur and saturation live here,
 * not in CSS, because Chromium does not reliably chain CSS filters after an
 * SVG one.
 */
function LensFilter({
  id,
  map,
  depth,
  rimBlur,
  coreBlur,
}: {
  id: string;
  map: LensMap;
  depth: number;
  rimBlur: number;
  coreBlur: number;
}) {
  const frostedCore = coreBlur !== rimBlur;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute size-0"
      colorInterpolationFilters="sRGB"
    >
      <filter
        id={id}
        x="0"
        y="0"
        width={map.width}
        height={map.height}
        filterUnits="userSpaceOnUse"
      >
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation={rimBlur}
          edgeMode="duplicate"
          result="frost"
        />
        <MapImage href={map.displacement} map={map} result="map" />
        {CHANNELS.map((channel) => (
          <Fragment key={channel.result}>
            <feDisplacementMap
              in="frost"
              in2="map"
              scale={depth * channel.scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result={`${channel.result}-bent`}
            />
            <feColorMatrix
              in={`${channel.result}-bent`}
              type="matrix"
              values={channel.values}
              result={channel.result}
            />
          </Fragment>
        ))}
        <feComposite
          in="r"
          in2="g"
          operator="arithmetic"
          k2="1"
          k3="1"
          result="rg"
        />
        <feComposite
          in="rg"
          in2="b"
          operator="arithmetic"
          k2="1"
          k3="1"
          result="split"
        />
        {frostedCore && (
          <>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={coreBlur}
              edgeMode="duplicate"
              result="haze"
            />
            <MapImage href={map.core} map={map} result="core-mask" />
            <feComposite
              in="haze"
              in2="core-mask"
              operator="in"
              result="core"
            />
            <feComposite in="core" in2="split" operator="over" result="body" />
          </>
        )}
        <feColorMatrix
          in={frostedCore ? "body" : "split"}
          type="saturate"
          values={String(LENS_SATURATE)}
          result="bent"
        />
        <MapImage href={map.specular} map={map} result="light" />
        <feBlend in="light" in2="bent" mode="screen" />
      </filter>
    </svg>
  );
}

/**
 * A floating glass control (Notchs Glass, Liquid Glass levels 2 and 3).
 * Everywhere: a shine that follows the pointer across the surface. In
 * Chromium: the content behind bends at the rim like a lens. Other browsers
 * and reduced transparency keep the frosted or solid glass from `glass`
 * (or, with `bare`, whatever backdrop-filter the caller sets).
 */
export function LiquidGlass({
  radius,
  depth = 40,
  bezel = DEFAULT_BEZEL,
  rimBlur = LENS_BLUR,
  coreBlur = rimBlur,
  bare = false,
  refract = true,
  className,
  style,
  ref,
  onPointerMove,
  onPointerLeave,
  children,
  ...props
}: LiquidGlassProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const filterId = `lens${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const lens = useLensMap(element, radius, bezel);
  const map = refract ? lens : null;
  const shineFrame = useRef(0);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      setElement(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const moveShine = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== "mouse") return;
    const target = event.currentTarget;
    const { clientX, clientY } = event;
    cancelAnimationFrame(shineFrame.current);
    shineFrame.current = requestAnimationFrame(() => {
      const box = target.getBoundingClientRect();
      target.style.setProperty("--shine-x", `${clientX - box.left}px`);
      target.style.setProperty("--shine-y", `${clientY - box.top}px`);
    });
  };

  const resetShine = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    cancelAnimationFrame(shineFrame.current);
    event.currentTarget.style.removeProperty("--shine-x");
    event.currentTarget.style.removeProperty("--shine-y");
  };

  // Inline, so it replaces the frosted backdrop-filter from CSS.
  const lensStyle: CSSProperties | undefined = map
    ? {
        backdropFilter: `url(#${filterId})`,
        WebkitBackdropFilter: `url(#${filterId})`,
      }
    : undefined;

  return (
    <div
      ref={setRef}
      className={cn(!bare && "glass", className)}
      style={{ ...style, ...lensStyle }}
      onPointerMove={moveShine}
      onPointerLeave={resetShine}
      {...props}
    >
      {map && (
        <LensFilter
          id={filterId}
          map={map}
          depth={depth}
          rimBlur={rimBlur}
          coreBlur={coreBlur}
        />
      )}
      {children}
    </div>
  );
}
