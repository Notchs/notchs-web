import type { CohortRow } from "./customer.types";
import type {
  ActivitySeries,
  DiscoveryStats,
  WeeklyPoint,
} from "./overview.types";

export type HeatmapCell = { day: string; hour: number; visits: number };

export type AnalyticsResponse = {
  activity: ActivitySeries;
  busiestDay: { label: string; averageVisits: number };
  busiestHours: { label: string; unit: string; note: string };
  hours: number[];
  days: string[];
  heatmap: HeatmapCell[];
  retention: {
    backWithin7Days: number;
    backWithin30Days: number;
    medianGapDays: number;
  };
  cohorts: CohortRow[];
  returningWeekly: WeeklyPoint[];
  discovery: DiscoveryStats;
};

/**
 * Notchs verifies visits, not bills, so every figure stays null until a
 * billing system is connected. We never estimate spend from visits.
 */
export type RevenueResponse = {
  connection: "not_connected" | "connected";
  revenue: number | null;
  averageOrderValue: number | null;
  transactions: number | null;
};
