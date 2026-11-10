import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";

export const chartColors = {
  ink: "#0f0f14",
  volt: "#d2ff3c",
  stone: "#8a8a94",
  stoneLight: "#b5b3ac",
} as const;

/** Colours of axes and labels, by the surface the chart sits on. */
export const chartSurfaces = {
  paper: { text: "#5c5c66", grid: "rgb(15 15 20 / 0.12)" },
  ink: { text: "#b5b3ac", grid: "rgb(245 243 236 / 0.14)" },
} as const;

export type ChartSurface = keyof typeof chartSurfaces;

export function ChartEmpty({ height }: { height: number }) {
  return (
    <div
      style={{ height }}
      className="grid place-items-center rounded-lg border border-dashed border-current/20 text-sm opacity-70"
    >
      {content.common.chartEmpty}
    </div>
  );
}

export function ChartLegend({
  items,
  className,
}: {
  items: { label: string; color: string }[];
  className?: string;
}) {
  return (
    <span className={cn("flex flex-wrap gap-3.5 text-xs", className)}>
      {items.map((item) => (
        <span key={item.label}>
          <i
            className="mr-1.5 inline-block size-2.5 rounded-[3px] align-[-1px]"
            style={{ background: item.color }}
          />
          {item.label}
        </span>
      ))}
    </span>
  );
}

export function ChartTooltip({
  x,
  width,
  title,
  rows,
}: {
  x: number;
  width: number;
  title: string;
  rows: { label: string; value: ReactNode; color: string }[];
}) {
  const flip = x > width / 2;
  return (
    <div
      className="pointer-events-none absolute top-1 z-10 min-w-30 animate-pop rounded-lg bg-graphite px-2.5 py-2 text-xs text-paper shadow-lg"
      style={flip ? { right: width - x + 10 } : { left: x + 10 }}
    >
      <b className="mb-1 block font-semibold">{title}</b>
      {rows.map((row) => (
        <span key={row.label} className="flex items-center gap-1.5">
          <i className="size-2 rounded-sm" style={{ background: row.color }} />
          <span className="flex-1">{row.label}</span>
          <b className="ml-2 font-mono font-medium">{row.value}</b>
        </span>
      ))}
    </div>
  );
}

/** Rounded top of the axis: the next multiple of 5 at or above the maximum. */
export const niceTop = (max: number) => Math.max(5, Math.ceil(max / 5) * 5);
