import type { IsoDateTime } from "./common.types";
import type { RatingSummaryItem } from "./review.types";
import type { VisitRecord } from "./visit.types";

/** One range of day-by-day activity, shared by Overview and Analytics. */
export type ActivitySeries = {
  labels: string[];
  visits: number[];
  previousVisits: number[];
  newVisitors: number[];
  newVisitorsPrevious: number;
  uniqueGuests: number;
  returningRate: number;
  returningRatePrevious: number;
  profileViews: number[];
  profileViewsPrevious: number;
  rating: number;
  ratingPrevious: number;
  ratingCount: number;
};

export type WeeklyPoint = { label: string; value: number };

export type DiscoveryStats = {
  seen: number;
  directions: number;
  saves: number;
};

export type CounterSnapshot = {
  online: boolean;
  lastHeartbeat: IsoDateTime;
  lastVerifiedVisit: IsoDateTime;
  batteryPercent: number | null;
};

export type SetupStepKey =
  "approved" | "paired" | "liveTest" | "signs" | "venuePage" | "staff";

export type SetupStep = { key: SetupStepKey; done: boolean };

/** "firstDays" until the venue has 10 verified visits; charts open after. */
export type OverviewStage = "firstDays" | "live";

export type OverviewResponse = {
  asOf: IsoDateTime;
  stage: OverviewStage;
  activity: ActivitySeries;
  returningWeekly: WeeklyPoint[];
  discovery: DiscoveryStats;
  counter: CounterSnapshot;
  recentVisits: VisitRecord[];
  recentRatings: RatingSummaryItem[];
  firstDays: { verifiedVisits: number; target: number; steps: SetupStep[] };
};
