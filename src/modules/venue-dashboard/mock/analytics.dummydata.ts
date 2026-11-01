import type { AnalyticsResponse, HeatmapCell } from "../types";
import { cohorts, returningWeekly } from "./shared.dummydata";

const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_WEIGHT = [
  0.1, 0.15, 0.25, 0.3, 0.2, 0.15, 0.2, 0.35, 0.6, 0.85, 0.9, 0.6,
];
const DAY_WEIGHT = [0.6, 0.55, 0.6, 0.7, 0.85, 1, 0.9];

const heatmap: HeatmapCell[] = days.flatMap((day, dayIndex) =>
  hours.map((hour, hourIndex) => ({
    day,
    hour,
    visits: Number(
      (HOUR_WEIGHT[hourIndex] * DAY_WEIGHT[dayIndex] * 6).toFixed(1),
    ),
  })),
);

export const analyticsDummyData: Omit<
  AnalyticsResponse,
  "activity" | "discovery"
> = {
  busiestDay: { label: "Sat", averageVisits: 22 },
  busiestHours: { label: "7–9", unit: "PM", note: "weekends" },
  hours,
  days,
  heatmap,
  retention: { backWithin7Days: 22, backWithin30Days: 41, medianGapDays: 9 },
  cohorts,
  returningWeekly,
};
