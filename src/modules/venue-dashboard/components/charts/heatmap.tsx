"use client";

import { useState } from "react";

import { content } from "../../content";
import type { HeatmapCell } from "../../types";

const hourLabel = (hour: number) => (hour > 12 ? `${hour - 12}p` : `${hour}a`);

/** Average visits by weekday and hour, darker meaning busier. */
export function Heatmap({
  days,
  hours,
  cells,
  label,
}: {
  days: string[];
  hours: number[];
  cells: HeatmapCell[];
  label: string;
}) {
  const [active, setActive] = useState<HeatmapCell | null>(null);
  const peak = Math.max(1, ...cells.map((cell) => cell.visits));
  const cellFor = (day: string, hour: number) =>
    cells.find((cell) => cell.day === day && cell.hour === hour);

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={label}
        className="grid grid-cols-[28px_repeat(12,minmax(0,1fr))] gap-[3px] font-mono text-[10px] text-muted"
        onPointerLeave={() => setActive(null)}
      >
        <span />
        {hours.map((hour) => (
          <span key={hour} className="text-center">
            {hour % 3 === 1 ? hourLabel(hour) : ""}
          </span>
        ))}
        {days.map((day) => (
          <div key={day} className="contents">
            <span>{day}</span>
            {hours.map((hour) => {
              const cell = cellFor(day, hour);
              const visits = cell?.visits ?? 0;
              return (
                <i
                  key={hour}
                  onPointerEnter={() => setActive(cell ?? null)}
                  className="block aspect-[1.4] rounded-[3px] transition-transform duration-150 hover:scale-110"
                  style={{
                    background: `rgb(15 15 20 / ${(0.05 + (visits / peak) * 0.85).toFixed(2)})`,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <span className="min-h-5 font-mono text-[13px] text-muted">
        {active
          ? content.analytics.heatmapReadout(
              active.day,
              active.hour,
              active.visits,
            )
          : content.analytics.heatmapHint}
      </span>
    </div>
  );
}
