"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import {
  ChartEmpty,
  ChartTooltip,
  chartColors,
  chartSurfaces,
  niceTop,
} from "./chart-frame";
import { useChartWidth } from "./use-chart-width";

const PADDING = { left: 30, right: 4, top: 8, bottom: 24 };

/** Two stacked series per label, with hover detail. */
export function StackedBars({
  bottom,
  top: upper,
  labels,
  bottomName,
  topName,
  label,
  height = 170,
}: {
  bottom: number[];
  top: number[];
  labels: string[];
  bottomName: string;
  topName: string;
  label: string;
  height?: number;
}) {
  const { ref, width } = useChartWidth(380);
  const [active, setActive] = useState<number | null>(null);
  const colors = chartSurfaces.paper;
  const count = labels.length;

  if (count === 0) return <ChartEmpty height={height} />;

  const top = niceTop(Math.max(...bottom.map((value, i) => value + upper[i])));
  const band = (width - PADDING.left - PADDING.right) / count;
  const barHeight = (value: number) =>
    ((height - PADDING.top - PADDING.bottom) * value) / top;
  const baseline = height - PADDING.bottom;
  const step = Math.ceil(count / Math.max(2, Math.floor(width / 55)));

  return (
    <div ref={ref} className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        role="img"
        aria-label={label}
        className="block w-full overflow-visible"
        onPointerLeave={() => setActive(null)}
      >
        {[0, top / 2, top].map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={baseline - barHeight(tick)}
              y2={baseline - barHeight(tick)}
              stroke={colors.grid}
            />
            <text
              x={PADDING.left - 6}
              y={baseline - barHeight(tick) + 3}
              textAnchor="end"
              fill={colors.text}
              className="font-mono text-[10px]"
            >
              {Math.round(tick)}
            </text>
          </g>
        ))}
        {labels.map((text, index) => {
          const barX = PADDING.left + index * band + band * 0.18;
          const barWidth = band * 0.64;
          const lower = barHeight(bottom[index]);
          const higher = barHeight(upper[index]);
          return (
            <g
              key={text}
              onPointerEnter={() => setActive(index)}
              className={cn(
                "transition-opacity duration-150",
                active != null && active !== index && "opacity-40",
              )}
            >
              <rect
                x={PADDING.left + index * band}
                y={PADDING.top}
                width={band}
                height={baseline - PADDING.top}
                fill="transparent"
              />
              <rect
                x={barX}
                y={baseline - lower}
                width={barWidth}
                height={lower}
                fill={chartColors.ink}
                rx={2}
              />
              <rect
                x={barX}
                y={baseline - lower - higher - 1.5}
                width={barWidth}
                height={Math.max(0, higher)}
                fill={chartColors.stoneLight}
                rx={2}
              />
              {index % step === 0 && (
                <text
                  x={barX + barWidth / 2}
                  y={height - 6}
                  textAnchor="middle"
                  fill={colors.text}
                  className="font-mono text-[10px]"
                >
                  {text.split(" ")[0]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {active != null && (
        <ChartTooltip
          x={PADDING.left + active * band + band / 2}
          width={width}
          title={labels[active]}
          rows={[
            {
              label: bottomName,
              value: bottom[active],
              color: chartColors.ink,
            },
            {
              label: topName,
              value: upper[active],
              color: chartColors.stoneLight,
            },
          ]}
        />
      )}
    </div>
  );
}
