"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";

import {
  ChartEmpty,
  ChartTooltip,
  chartSurfaces,
  niceTop,
  type ChartSurface,
} from "./chart-frame";
import { useChartWidth } from "./use-chart-width";

export type LineSeries = {
  name: string;
  data: number[];
  color: string;
  area?: boolean;
  dashed?: boolean;
  strokeWidth?: number;
};

const PADDING = { left: 30, right: 10, top: 12, bottom: 24 };

/** Line or area chart with a hover and arrow-key readout. */
export function LineChart({
  series,
  labels,
  label,
  height = 200,
  surface = "paper",
  unit = "",
}: {
  series: LineSeries[];
  labels: string[];
  label: string;
  height?: number;
  surface?: ChartSurface;
  unit?: string;
}) {
  const { ref, width } = useChartWidth();
  const [active, setActive] = useState<number | null>(null);
  const colors = chartSurfaces[surface];
  const count = labels.length;

  if (count < 2 || series.every((line) => line.data.length === 0)) {
    return <ChartEmpty height={height} />;
  }

  const top = niceTop(Math.max(...series.flatMap((line) => line.data)));
  const plotWidth = width - PADDING.left - PADDING.right;
  const x = (index: number) => PADDING.left + (index * plotWidth) / (count - 1);
  const y = (value: number) =>
    PADDING.top + (height - PADDING.top - PADDING.bottom) * (1 - value / top);
  const maxTicks = Math.max(2, Math.floor(width / 70));
  const step = Math.ceil(count / maxTicks);
  const path = (data: number[]) =>
    data
      .map(
        (value, index) =>
          `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`,
      )
      .join("");

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const position = event.clientX - box.left - PADDING.left;
    const index = Math.round((position / plotWidth) * (count - 1));
    setActive(Math.min(count - 1, Math.max(0, index)));
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const move = event.key === "ArrowRight" ? 1 : -1;
    setActive((current) =>
      Math.min(count - 1, Math.max(0, (current ?? count - 1) + move)),
    );
  };

  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={label}
        tabIndex={0}
        className="block w-full touch-pan-y overflow-visible rounded"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setActive(null)}
        onKeyDown={onKeyDown}
        onBlur={() => setActive(null)}
      >
        {[0, top / 2, top].map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={colors.grid}
            />
            <text
              x={PADDING.left - 6}
              y={y(tick) + 3}
              textAnchor="end"
              fill={colors.text}
              className="font-mono text-[10px]"
            >
              {Math.round(tick)}
            </text>
          </g>
        ))}
        {labels.map((text, index) =>
          (index % step === 0 && count - 1 - index >= step / 2) ||
          index === count - 1 ? (
            <text
              key={text}
              x={x(index)}
              y={height - 6}
              textAnchor={index === count - 1 ? "end" : "middle"}
              fill={colors.text}
              className="font-mono text-[10px]"
            >
              {text}
            </text>
          ) : null,
        )}
        {series.map((line) => (
          <g key={line.name}>
            {line.area && (
              <path
                d={`${path(line.data)}L${x(count - 1)} ${y(0)}L${x(0)} ${y(0)}Z`}
                fill={line.color}
                fillOpacity={0.14}
              />
            )}
            <path
              d={path(line.data)}
              fill="none"
              stroke={line.color}
              strokeWidth={line.strokeWidth ?? 2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={line.dashed ? undefined : 1}
              strokeDasharray={line.dashed ? "4 4" : 1}
              className={line.dashed ? undefined : "animate-draw"}
            />
          </g>
        ))}
        {active != null && (
          <line
            x1={x(active)}
            x2={x(active)}
            y1={PADDING.top}
            y2={height - PADDING.bottom}
            stroke={colors.text}
            strokeDasharray="2 3"
          />
        )}
        {series.map((line, seriesIndex) => {
          const index = active ?? (seriesIndex === 0 ? count - 1 : null);
          return index == null ? null : (
            <circle
              key={line.name}
              cx={x(index)}
              cy={y(line.data[index])}
              r={4}
              fill={line.color}
            />
          );
        })}
      </svg>
      {active != null && (
        <ChartTooltip
          x={x(active)}
          width={width}
          title={labels[active]}
          rows={series.map((line) => ({
            label: line.name,
            value: `${line.data[active]}${unit}`,
            color: line.color,
          }))}
        />
      )}
    </div>
  );
}
