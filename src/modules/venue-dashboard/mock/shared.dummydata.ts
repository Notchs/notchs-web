import type { ActivitySeries, DateRangeKey, DateRangeOption } from "../types";

/** Every example timestamp is relative to this moment. */
export const MOCK_AS_OF = "2026-11-01T18:13:00+05:30";
export const MOCK_VENUE_NAME = "Kahwa House";
export const MOCK_COUNTER_NAME = "Till phone";

export const dateRanges: DateRangeOption[] = [
  { key: "7d", label: "Last 7 days", comparisonLabel: "vs previous 7 days" },
  { key: "30d", label: "Last 30 days", comparisonLabel: "vs previous 30 days" },
];

const WEEK_VISITS = [12, 16, 20, 24, 16, 11, 13];
const WEEK_VIEWS = [170, 150, 180, 230, 210, 140, 160];
const asOf = new Date(MOCK_AS_OF);

function dayLabels(count: number, options: Intl.DateTimeFormatOptions) {
  return Array.from({ length: count }, (_, index) => {
    const day = new Date(asOf);
    day.setDate(asOf.getDate() - (count - 1 - index));
    return day.toLocaleDateString("en-IN", {
      ...options,
      timeZone: "Asia/Kolkata",
    });
  });
}

const series30 = (value: (index: number) => number) =>
  Array.from({ length: 30 }, (_, index) => value(index));

const growingVisits = (index: number) =>
  WEEK_VISITS[(index + 5) % 7] * (0.78 + index * 0.009);

export const activityByRange: Record<DateRangeKey, ActivitySeries> = {
  "7d": {
    labels: dayLabels(7, { weekday: "short", day: "numeric" }),
    visits: WEEK_VISITS,
    previousVisits: [9, 14, 17, 19, 14, 10, 12],
    newVisitors: [3, 5, 6, 6, 4, 3, 4],
    newVisitorsPrevious: 27,
    uniqueGuests: 86,
    returningRate: 64,
    returningRatePrevious: 58,
    profileViews: WEEK_VIEWS,
    profileViewsPrevious: 1010,
    rating: 4.7,
    ratingPrevious: 4.5,
    ratingCount: 9,
  },
  "30d": {
    labels: dayLabels(30, { day: "numeric", month: "short" }),
    visits: series30((i) => Math.round(growingVisits(i))),
    previousVisits: series30((i) =>
      Math.round(WEEK_VISITS[(i + 1) % 7] * (0.7 + i * 0.006)),
    ),
    newVisitors: series30((i) =>
      Math.max(1, Math.round(growingVisits(i) * (0.3 - i * 0.002))),
    ),
    newVisitorsPrevious: 98,
    uniqueGuests: 312,
    returningRate: 61,
    returningRatePrevious: 55,
    profileViews: series30((i) =>
      Math.round(WEEK_VIEWS[(i + 5) % 7] * (0.85 + i * 0.006)),
    ),
    profileViewsPrevious: 4100,
    rating: 4.6,
    ratingPrevious: 4.4,
    ratingCount: 38,
  },
};

export const returningWeekly = [
  { label: "13 Sep", value: 48 },
  { label: "20 Sep", value: 51 },
  { label: "27 Sep", value: 50 },
  { label: "4 Oct", value: 55 },
  { label: "11 Oct", value: 57 },
  { label: "18 Oct", value: 58 },
  { label: "25 Oct", value: 61 },
  { label: "1 Nov", value: 64 },
];

export const discoveryByRange = {
  "7d": { seen: 8420, directions: 186, saves: 74 },
  "30d": { seen: 33900, directions: 742, saves: 281 },
} as const;

export const cohorts = [
  { month: "Aug", guests: 74, retention: [100, 42, 31] },
  { month: "Sep", guests: 96, retention: [100, 38] },
  { month: "Oct", guests: 128, retention: [100] },
];
