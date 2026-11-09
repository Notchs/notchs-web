import type {
  CohortRow,
  Customer,
  CustomerSegment,
  CustomersResponse,
  DateRangeOption,
  OverviewResponse,
  SessionResponse,
  ShareStat,
  VisitRecord,
  VisitStatus,
  VisitsResponse,
} from "../types";

/**
 * The API's answers (snake_case, see notchs-api `venue_insights`) turned into
 * the shapes the screens already use. Only real numbers: what the API can't
 * know yet (profile views, ratings, discovery) is marked unavailable, never
 * filled in.
 */

export type ApiVenueMe = {
  name: string;
  email: string;
  role: string;
  venue: { name: string; venue_code: string; status: string };
};

type ApiDay = { day: string; visits: number; new_guests: number };

export type ApiScan = {
  received_at: string;
  outcome: string;
  notch_no: number | null;
  guest_no: number | null;
  code: string | null;
  counter_name: string | null;
};

export type ApiOverview = {
  as_of: string;
  stage: "first_days" | "live";
  activity: {
    days: ApiDay[];
    /** The range before, day by day, oldest first. */
    previous_days: ApiDay[];
    visits: number;
    visits_previous: number;
    new_guests: number;
    new_guests_previous: number;
    unique_guests: number;
    returning_rate: number | null;
    returning_rate_previous: number | null;
  };
  counter: {
    paired: boolean;
    online: boolean;
    last_seen_at: string | null;
    last_verified_visit_at: string | null;
  };
  first_days: { verified_visits: number; target: number };
  recent_scans: ApiScan[];
};

export type ApiScans = {
  funnel: {
    attempts: number;
    verified: number;
    refused: Record<string, number>;
  };
  scans: ApiScan[];
};

export type ApiGuest = {
  guest_no: number;
  segment: "new" | "returning" | "regular" | "at_risk";
  total_visits: number;
  first_visit_at: string;
  last_visit_at: string;
  average_gap_days: number | null;
  /** Null until they come back. */
  days_to_second_visit: number | null;
  visits_by_month: number[];
  usual_hour: number;
  instagram_handle: string | null;
};

export type ApiGuests = {
  as_of: string;
  summary: {
    guests: number;
    new: number;
    returning: number;
    regulars: number;
    at_risk: number;
  };
  month_labels: string[];
  guests: ApiGuest[];
};

const DAY_MS = 86_400_000;

export const dateRanges: DateRangeOption[] = [
  { key: "7d", label: "Last 7 days", comparisonLabel: "vs previous 7 days" },
  { key: "30d", label: "Last 30 days", comparisonLabel: "vs previous 30 days" },
];

/** "Guest #10": numbered by their first Notch here, never a person. */
export const guestId = (guestNo: number) => `#${guestNo}`;

export function toSession(me: ApiVenueMe): SessionResponse {
  const firstName = me.name.trim().split(/\s+/)[0] ?? me.name;
  return {
    session: {
      venueName: me.venue.name,
      venueInitial: me.venue.name.trim().charAt(0).toUpperCase(),
      area: "",
      city: "",
      memberName: me.name,
      memberRole: me.role === "owner" ? "Owner" : "Manager",
      memberEmail: me.email,
      firstName,
    },
    notifications: [],
    ranges: dateRanges,
  };
}

const dayLabel = (day: string) =>
  new Date(`${day}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

const OUTCOMES: Record<string, { status: VisitStatus; detail: string }> = {
  verified: { status: "Verified", detail: "a verified visit" },
  already_today: {
    status: "Duplicate",
    detail: "Already notched here today",
  },
  daily_limit: {
    status: "Duplicate",
    detail: "Already notched at another place of this kind today",
  },
  expired_code: { status: "Expired code", detail: "The code had expired" },
  wrong_code: { status: "Not counted", detail: "The code didn't match" },
  code_used: {
    status: "Not counted",
    detail: "Too many people used the same code",
  },
  venue_unavailable: {
    status: "Not counted",
    detail: "The venue wasn't live for scans",
  },
};

export function toVisit(scan: ApiScan): VisitRecord {
  const outcome = OUTCOMES[scan.outcome] ?? {
    status: "Not counted" as const,
    detail: "Not counted",
  };
  const notch =
    scan.notch_no == null ? null : `#${String(scan.notch_no).padStart(4, "0")}`;
  return {
    // Unique per scan: the moment it arrived, plus the Notch when there is one.
    reference: `${scan.received_at}${notch ?? ""}`,
    receivedAt: scan.received_at,
    notchNumber: notch,
    status: outcome.status,
    guestId: scan.guest_no == null ? "—" : guestId(scan.guest_no),
    detail:
      outcome.status === "Verified" && notch
        ? `Notch ${notch}`
        : outcome.detail,
    code: scan.code ?? "—",
    codeWindow: "—",
    counterName: scan.counter_name ?? "—",
  };
}

export function toOverview(api: ApiOverview): OverviewResponse {
  const { activity, counter } = api;
  const days = activity.days;
  return {
    asOf: api.as_of,
    stage: api.stage === "live" ? "live" : "firstDays",
    activity: {
      labels: days.map((d) => dayLabel(d.day)),
      visits: days.map((d) => d.visits),
      previousVisits: activity.previous_days.map((d) => d.visits),
      newVisitors: days.map((d) => d.new_guests),
      newVisitorsPrevious: activity.new_guests_previous,
      uniqueGuests: activity.unique_guests,
      returningRate: activity.returning_rate ?? 0,
      returningRatePrevious: activity.returning_rate_previous ?? 0,
      profileViews: days.map(() => 0),
      profileViewsPrevious: 0,
      rating: 0,
      ratingPrevious: 0,
      ratingCount: 0,
    },
    returningWeekly: returningWeekly(days),
    discovery: { seen: 0, directions: 0, saves: 0 },
    counter: {
      online: counter.online,
      lastHeartbeat: counter.last_seen_at ?? "",
      lastVerifiedVisit: counter.last_verified_visit_at ?? "",
      batteryPercent: null,
    },
    recentVisits: api.recent_scans.map(toVisit),
    recentRatings: [],
    firstDays: {
      verifiedVisits: api.first_days.verified_visits,
      target: api.first_days.target,
      // Only the steps Notchs can see; the rest aren't tracked yet.
      steps: [
        { key: "approved", done: true },
        { key: "paired", done: counter.paired },
        { key: "liveTest", done: api.first_days.verified_visits > 0 },
      ],
    },
    available: { views: false, ratings: false, discovery: false },
  };
}

/** Share of visits by returning guests, per week of the range. */
function returningWeekly(days: ApiDay[]) {
  const weeks: { label: string; value: number }[] = [];
  for (let start = 0; start < days.length; start += 7) {
    const week = days.slice(start, start + 7);
    const visits = week.reduce((total, d) => total + d.visits, 0);
    const fresh = week.reduce((total, d) => total + d.new_guests, 0);
    weeks.push({
      label: dayLabel(week[0].day),
      value: visits ? Math.round((100 * (visits - fresh)) / visits) : 0,
    });
  }
  return weeks;
}

export function toVisits(api: ApiScans): VisitsResponse {
  const refused = api.funnel.refused;
  return {
    funnel: {
      attempts: api.funnel.attempts,
      verified: api.funnel.verified,
      duplicate: (refused.already_today ?? 0) + (refused.daily_limit ?? 0),
      expired: refused.expired_code ?? 0,
      inReview: 0,
    },
    visits: api.scans.map(toVisit),
  };
}

const SEGMENTS: Record<ApiGuest["segment"], CustomerSegment> = {
  new: "New",
  returning: "Returning",
  regular: "Regular",
  at_risk: "At risk",
};

/** "Around 7 PM" from 19 (India time). */
export function usualTime(hour: number) {
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `Around ${twelve} ${hour < 12 ? "AM" : "PM"}`;
}

const percent = (part: number, whole: number) =>
  whole ? Math.round((100 * part) / whole) : 0;

/** "Mar" from "2026-03". */
const monthName = (label: string) =>
  new Date(`${label}-01T00:00:00+05:30`).toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "Asia/Kolkata",
  });

export function toCustomers(api: ApiGuests): CustomersResponse {
  const guests = api.guests;
  const customers: Customer[] = guests.map((g) => ({
    id: guestId(g.guest_no),
    segment: SEGMENTS[g.segment],
    totalVisits: g.total_visits,
    firstVisitAt: g.first_visit_at,
    lastVisitAt: g.last_visit_at,
    averageGapDays: g.average_gap_days,
    visitsByMonth: g.visits_by_month,
    usualTime: usualTime(g.usual_hour),
    instagram: g.instagram_handle,
  }));

  const total = guests.length;
  const once = guests.filter((g) => g.total_visits === 1).length;
  const regular = guests.filter((g) => g.total_visits >= 5).length;
  const visitFrequency: ShareStat[] = [
    { label: "1 visit", percent: percent(once, total) },
    { label: "2–4 visits", percent: percent(total - once - regular, total) },
    { label: "5+ visits", percent: percent(regular, total) },
  ];

  // Only guests whose first visit was at least N days ago can be measured; a
  // window nobody is old enough for is left out rather than shown as 0%.
  const cameBackWithin = [7, 30, 60].flatMap((days) => {
    const since = Date.parse(api.as_of) - days * DAY_MS;
    const measurable = guests.filter(
      (g) => Date.parse(g.first_visit_at) <= since,
    );
    const cameBack = measurable.filter(
      (g) => g.days_to_second_visit != null && g.days_to_second_visit <= days,
    );
    if (measurable.length === 0) return [];
    return [
      {
        label: `${days} days`,
        percent: percent(cameBack.length, measurable.length),
      },
    ];
  });

  return {
    asOf: api.as_of,
    summary: {
      guests: api.summary.guests,
      newGuests: api.summary.new,
      returning: api.summary.returning,
      regulars: api.summary.regulars,
      atRisk: api.summary.at_risk,
    },
    customers,
    monthLabels: api.month_labels.map(monthName),
    cameBackWithin,
    visitFrequency,
    cohorts: cohorts(api),
  };
}

/** "2026-03": the month in India of an ISO moment. */
const istMonth = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" })
    .slice(0, 7);

/** Guests grouped by the month of their first visit (within the months
 * shown), and the share of each group that visited in each later month. */
export function cohorts(api: ApiGuests): CohortRow[] {
  const months = api.month_labels;
  return months.flatMap((label, index) => {
    const group = api.guests.filter(
      (g) => istMonth(g.first_visit_at) === label,
    );
    if (group.length === 0) return [];
    const retention = months
      .slice(index)
      .map((_, offset) =>
        percent(
          group.filter((g) => g.visits_by_month[index + offset] > 0).length,
          group.length,
        ),
      );
    return [{ month: monthName(label), guests: group.length, retention }];
  });
}
