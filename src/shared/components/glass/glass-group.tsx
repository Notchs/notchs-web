import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type GlassGroupProps = ComponentProps<"div"> & {
  /** The group's own box is glass (default). False makes it a plain wrapper. */
  self?: boolean;
  /** Corner radius in px. */
  radius?: number;
};

/**
 * A floating control's surface: CSS glass (the `glass` utility), frosted, and
 * solid with reduced transparency. Use it for controls, not content.
 */
export function GlassGroup({
  self = true,
  radius = 16,
  className,
  style,
  ...props
}: GlassGroupProps) {
  return (
    <div
      className={cn("relative", self && "glass", className)}
      style={{ ...style, ...(self && { borderRadius: radius }) }}
      {...props}
    />
  );
}

type GlassShapeProps = ComponentProps<"div"> & {
  radius?: number;
};

/** One piece of glass, usually in a row or list inside a plain <GlassGroup>. */
export function GlassShape({
  radius = 14,
  className,
  style,
  ...props
}: GlassShapeProps) {
  return (
    <div
      className={cn("glass", className)}
      style={{ ...style, borderRadius: radius }}
      {...props}
    />
  );
}
