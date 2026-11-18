import type { ApiRequestOptions } from "@/shared/lib/api-client";
import type { Paginated } from "@/shared/types/api";

import type {
  CityNotchs,
  Leaderboard,
  LeaderboardRow,
  Me,
  MyClaim,
  Notch,
  Option,
  PlaceKind,
  Referral,
  Reward,
  Standing,
} from "../lib/api";
import { nicheLabel } from "../lib/format";

/*
 * Example data for mock mode (lib/config.ts). Every name and number here is
 * invented: it is for seeing the screens, never for the live site.
 */

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY);
const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const inDays = (days: number) => isoDate(new Date(Date.now() + days * DAY));

const city = { id: "city-ahmedabad", name: "Ahmedabad" };

let me: Me = {
  name: "Abhishek Sharma",
  handle: "abhishek.s",
  phone: "+91 98765 43210",
  photo_url: null,
  city,
  area: { id: "area-navrangpura", name: "Navrangpura" },
  is_public: true,
  theme: "light",
  founding_member_no: 128,
  instagram_handle: "abhishek.eats",
  show_instagram_to_venues: false,
  member_since: daysAgo(120).toISOString(),
  age: {
    birth_date: null,
    age_range: null,
    adult_confirmed_at: daysAgo(120).toISOString(),
    consent_text:
      "I confirm this is my date of birth. Notchs uses it only to show my age group.",
    consent_version: "example-1",
  },
  totals: { notches: 0, places: 0, points: 0 },
};

const venues = [
  { name: "Blue Tokai", area: "Navrangpura", niche: "cafe", colour: "#2f5bd3" },
  { name: "Cafe Natraj", area: "Bodakdev", niche: "cafe", colour: "#2f5bd3" },
  {
    name: "Agashiye",
    area: "Lal Darwaja",
    niche: "restaurant",
    colour: "#c2381a",
  },
  {
    name: "The Grand Bhagwati",
    area: "SG Highway",
    niche: "restaurant",
    colour: "#c2381a",
  },
  { name: "Turf Park", area: "Thaltej", niche: "turf_gym", colour: "#1f8a5b" },
  {
    name: "Third Wave Coffee",
    area: "Prahlad Nagar",
    niche: "cafe",
    colour: "#2f5bd3",
  },
  { name: "Hotel Hyatt", area: "Vastrapur", niche: "hotel", colour: "#8a4fd3" },
];

/** 18 Notchs over the last four months, newest first. */
const notches: Notch[] = (() => {
  const visits = [0, 2, 3, 5, 0, 8, 1, 12, 2, 16, 4, 21, 0, 30, 5, 44, 2, 70];
  const seen = new Map<string, number>();
  const list = visits
    .map((venueIndex, i) => {
      const venue = venues[venueIndex % venues.length];
      const date = daysAgo(110 - i * 6);
      return { venue, date };
    })
    .map(({ venue, date }, i) => {
      const visitNo = (seen.get(venue.name) ?? 0) + 1;
      seen.set(venue.name, visitNo);
      return {
        notch_no: 1040 + i,
        venue_name: venue.name,
        venue_area: venue.area,
        niche: venue.niche,
        colour: venue.colour,
        visit_date: isoDate(date),
        visited_at: date.toISOString(),
        visit_no_at_venue: visitNo,
        points: visitNo === 1 ? 10 : 5,
      };
    });
  return list.reverse();
})();

me = {
  ...me,
  totals: {
    notches: notches.length,
    places: new Set(notches.map((n) => n.venue_name)).size,
    points: notches.reduce((sum, n) => sum + n.points, 0),
  },
};

const MY_MONTH = { rank: 4, points: 38 };
const MY_ALL = { rank: 9, points: 120 };

const others = {
  month: [
    { rank: 1, name: "Riya Patel", handle: "riya.eats", points: 92 },
    { rank: 2, name: null, handle: null, points: 81 },
    { rank: 3, name: "Karan Mehta", handle: "karan.m", points: 46 },
    { rank: 4, name: "Neha Shah", handle: "nehashah", points: 38 },
    { rank: 6, name: null, handle: null, points: 31 },
    { rank: 7, name: "Dev Joshi", handle: "devjoshi", points: 27 },
    { rank: 8, name: "Aarav Desai", handle: null, points: 24 },
    { rank: 9, name: null, handle: null, points: 22 },
    { rank: 10, name: "Isha Trivedi", handle: "isha.t", points: 19 },
    { rank: 11, name: "Meera Iyer", handle: null, points: 15 },
    { rank: 12, name: null, handle: null, points: 12 },
  ],
  all: [
    { rank: 1, name: "Riya Patel", handle: "riya.eats", points: 410 },
    { rank: 2, name: "Karan Mehta", handle: "karan.m", points: 352 },
    { rank: 3, name: null, handle: null, points: 298 },
    { rank: 4, name: "Neha Shah", handle: "nehashah", points: 240 },
    { rank: 5, name: "Dev Joshi", handle: "devjoshi", points: 211 },
    { rank: 6, name: null, handle: null, points: 187 },
    { rank: 7, name: "Isha Trivedi", handle: "isha.t", points: 160 },
    { rank: 8, name: "Aarav Desai", handle: null, points: 133 },
    { rank: 10, name: null, handle: null, points: 118 },
    { rank: 11, name: "Meera Iyer", handle: null, points: 96 },
    { rank: 12, name: "Kabir Rao", handle: "kabir", points: 90 },
  ],
} satisfies Record<string, LeaderboardRow[]>;

function leaderboard(period: "month" | "all"): Leaderboard {
  const mine = period === "month" ? MY_MONTH : MY_ALL;
  const myRow: LeaderboardRow = me.is_public
    ? { ...mine, name: me.name, handle: me.handle }
    : { ...mine, name: null, handle: null };
  const rows = [...others[period], myRow].sort(
    (a, b) => b.points - a.points || a.rank - b.rank,
  );
  return {
    city_id: city.id,
    period,
    total_ranked: period === "month" ? 214 : 1032,
    rows,
  };
}

const standing = (): Standing => ({
  city_id: city.id,
  is_public: me.is_public,
  month: MY_MONTH,
  all_time: MY_ALL,
  rank_points_percent: 100,
  rank_drops_on: inDays(13),
});

function places(): PlaceKind[] {
  const kinds = new Map<string, PlaceKind>();
  for (const notch of notches) {
    const kind = kinds.get(notch.niche) ?? {
      niche: notch.niche,
      label: nicheLabel(notch.niche),
      colour: notch.colour,
      places: 0,
      visits: 0,
      venues: [],
    };
    kind.visits += 1;
    let venue = kind.venues.find((v) => v.venue_name === notch.venue_name);
    if (!venue) {
      venue = {
        venue_code: `example-${kind.venues.length}-${notch.niche}`,
        venue_name: notch.venue_name,
        area: notch.venue_area,
        city: city.name,
        visits: 0,
        first_visit: notch.visit_date,
        last_visit: notch.visit_date,
      };
      kind.venues.push(venue);
      kind.places += 1;
    }
    venue.visits += 1;
    if (notch.visit_date < venue.first_visit)
      venue.first_visit = notch.visit_date;
    if (notch.visit_date > venue.last_visit)
      venue.last_visit = notch.visit_date;
    kinds.set(notch.niche, kind);
  }
  return [...kinds.values()].sort((a, b) => b.visits - a.visits);
}

function byLocation(): CityNotchs[] {
  const areas = new Map<string, { notchs: number; places: Set<string> }>();
  for (const notch of notches) {
    const key = notch.venue_area ?? "";
    const area = areas.get(key) ?? { notchs: 0, places: new Set() };
    area.notchs += 1;
    area.places.add(notch.venue_name);
    areas.set(key, area);
  }
  return [
    {
      city,
      notchs: me.totals.notches,
      places: me.totals.places,
      areas: [...areas.entries()]
        .map(([name, area]) => ({
          area: name ? { id: `area-${name}`, name } : null,
          notchs: area.notchs,
          places: area.places.size,
        }))
        .sort((a, b) => b.notchs - a.notchs),
    },
  ];
}

const reward: Reward = {
  month: isoDate(new Date()).slice(0, 7),
  new_cafes: 3,
  needed: 5,
  eligible: false,
  value_rupees: 300,
};

const referral: Referral = {
  code: "ABHI128",
  link: "https://www.notchs.com/invite/ABHI128",
  star_points: 100,
  invited: 3,
  rewarded: 2,
  invited_by: null,
  can_add_inviter: false,
};

const claims: MyClaim[] = [
  {
    claim_code: "EXAMPLE1",
    venue_name: "Cafe Natraj",
    visit_date: isoDate(daysAgo(9)),
    status: "approved",
    notch_no: 1052,
    reject_reason: null,
    created_at: daysAgo(9).toISOString(),
  },
];

const areas: Option[] = [
  "Bodakdev",
  "Navrangpura",
  "Prahlad Nagar",
  "Thaltej",
  "Vastrapur",
].map((name) => ({ value: `area-${name.toLowerCase()}`, label: name }));

const pause = () => new Promise((resolve) => setTimeout(resolve, 250));

/**
 * Answers a passport API call with example data, as the backend would. Saves
 * (name switch, profile edits) change it until the page reloads.
 */
export async function mockCall(
  path: string,
  options: ApiRequestOptions = {},
): Promise<unknown> {
  await pause();
  const method = options.method ?? "GET";
  const query = (options.query ?? {}) as Record<string, unknown>;
  const body = (options.body ?? {}) as Record<string, unknown>;

  switch (`${method} ${path}`) {
    case "GET /me":
      return me;
    case "PATCH /me": {
      const area = areas.find((a) => a.value === body.area_id);
      me = {
        ...me,
        ...(body as Partial<Me>),
        area: area ? { id: area.value, name: area.label } : me.area,
        age:
          "birth_date" in body
            ? { ...me.age, birth_date: body.birth_date as string | null }
            : me.age,
      };
      return me;
    }
    case "PUT /me/photo":
    case "DELETE /me/photo":
      return me;
    case "GET /me/places":
      return places();
    case "GET /me/notches/by-location":
      return byLocation();
    case "GET /leaderboards/me":
      return standing();
    case "PATCH /leaderboards/me":
      me = { ...me, is_public: Boolean(body.is_public) };
      return standing();
    case "GET /leaderboards":
      return leaderboard(query.period === "all" ? "all" : "month");
    case "GET /me/notches": {
      const page = Number(query.page ?? 1);
      const size = Number(query.size ?? 20);
      const items = notches.slice((page - 1) * size, page * size);
      return {
        items,
        total: notches.length,
        page,
        size,
        pages: Math.ceil(notches.length / size),
      } satisfies Paginated<Notch>;
    }
    case "GET /me/reward":
      return reward;
    case "GET /me/referral":
      return referral;
    case "POST /me/phone-change":
      return {
        message: "CHANGE EXAMPLE",
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        whatsapp_link: null,
      };
    case "GET /me/claims/venues":
      return venues
        .filter((v) =>
          v.name.toLowerCase().includes(String(query.q ?? "").toLowerCase()),
        )
        .map((v, i) => ({
          venue_code: `example-${i}`,
          name: v.name,
          area: v.area,
          niche: v.niche,
        }));
    case "POST /me/claims":
      return {
        claim_code: "EXAMPLE2",
        venue_name: "Example place",
        message: "CLAIM EXAMPLE2",
        whatsapp_link: null,
        expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      };
    case "GET /me/claims":
      return claims;
    case "GET /dropdowns/areas":
      return areas;
    default:
      return null;
  }
}
