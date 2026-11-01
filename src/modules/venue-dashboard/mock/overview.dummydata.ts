import type { OverviewResponse } from "../types";
import { MOCK_AS_OF, returningWeekly } from "./shared.dummydata";
import { reviews } from "./reviews.dummydata";
import { visitLog } from "./visits.dummydata";

export const overviewDummyData: Omit<
  OverviewResponse,
  "activity" | "discovery" | "stage"
> = {
  asOf: MOCK_AS_OF,
  returningWeekly,
  counter: {
    online: true,
    lastHeartbeat: "2026-11-01T18:11:00+05:30",
    lastVerifiedVisit: "2026-11-01T18:12:00+05:30",
    batteryPercent: 82,
  },
  recentVisits: visitLog.slice(0, 5),
  recentRatings: reviews.slice(0, 4),
  firstDays: {
    verifiedVisits: 4,
    target: 10,
    steps: [
      { key: "approved", done: true },
      { key: "paired", done: true },
      { key: "liveTest", done: true },
      { key: "signs", done: false },
      { key: "venuePage", done: false },
      { key: "staff", done: false },
    ],
  },
};
