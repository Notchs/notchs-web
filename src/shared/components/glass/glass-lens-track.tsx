"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FocusEvent,
  type PointerEvent,
} from "react";

import { cn } from "@/shared/lib/cn";

import { GlassShape } from "./glass-group";

/** Marks an item the lens can move to (put it on the hoverable element). */
export const LENS_ITEM = { "data-lens-item": "" } as const;

type Box = { left: number; top: number; width: number; height: number };

type GlassLensTrackProps = ComponentProps<"div"> & {
  /** Corner radius of the lens, px. */
  lensRadius?: number;
  /** Space between the item's edge and the lens, px. */
  inset?: number;
  /** An item the lens rests on when nothing is hovered (e.g. the selection). */
  restingIndex?: number;
};

/**
 * A row or column of items with a liquid glass lens that slides to the item
 * under the pointer or keyboard focus, leaving a stretching neck as it goes,
 * and rests on `restingIndex` (or disappears) when left. Must sit inside a
 * <GlassGroup>; items carry `LENS_ITEM`. It may itself be a scroll container
 * (the lens scrolls with the items).
 */
export function GlassLensTrack({
  lensRadius = 18,
  inset = 4,
  restingIndex,
  className,
  children,
  onPointerOver,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...props
}: GlassLensTrackProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState<Box | null>(null);
  const [resting, setResting] = useState<Box | null>(null);

  const boxOf = (item: Element | null | undefined): Box | null => {
    const track = trackRef.current;
    if (!track || !(item instanceof HTMLElement)) return null;
    const a = item.getBoundingClientRect();
    const b = track.getBoundingClientRect();
    return {
      left: a.left - b.left + inset,
      top: a.top - b.top + inset,
      width: a.width - inset * 2,
      height: a.height - inset * 2,
    };
  };

  const itemAt = (target: EventTarget | null) =>
    target instanceof Element ? target.closest("[data-lens-item]") : null;

  // Where the lens rests: measured after layout, and again on resize.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const item =
          restingIndex === undefined
            ? null
            : track.querySelectorAll("[data-lens-item]")[restingIndex];
        const b = track.getBoundingClientRect();
        if (!(item instanceof HTMLElement)) return setResting(null);
        const a = item.getBoundingClientRect();
        setResting({
          left: a.left - b.left + inset,
          top: a.top - b.top + inset,
          width: a.width - inset * 2,
          height: a.height - inset * 2,
        });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [restingIndex, inset]);

  const box = hovered ?? resting;

  return (
    <div
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn("relative", className)}
      onPointerOver={(event: PointerEvent<HTMLDivElement>) => {
        onPointerOver?.(event);
        const next = boxOf(itemAt(event.target));
        if (next) setHovered(next);
      }}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);
        setHovered(null);
      }}
      onFocus={(event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        const next = boxOf(itemAt(event.target));
        if (next) setHovered(next);
      }}
      onBlur={(event: FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);
        setHovered(null);
      }}
      {...props}
    >
      {children}
      {/* After the items, so item positions among the children hold. */}
      {box && (
        <GlassShape
          aria-hidden="true"
          lens
          liquid
          radius={lensRadius}
          motionKey={`${box.left},${box.top},${box.width}`}
          className="pointer-events-none absolute transition-[left,top,width,height] duration-300 ease-notch motion-reduce:transition-none"
          style={box}
        />
      )}
    </div>
  );
}
