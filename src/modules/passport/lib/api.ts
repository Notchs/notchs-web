import { ApiError, type ApiRequestOptions } from "@/shared/lib/api-client";
import { endSession, sessionRequest } from "@/shared/lib/session";
import type { ApiSuccess, Paginated } from "@/shared/types/api";

import { USES_MOCK } from "./config";

export type PlaceRef = { id: string; name: string };

export type Theme = "light" | "dark";

/** GET /me → age: the birthday and the words they agree to when saving it. */
export type Age = {
  /** "1998-05-14"; null until they add it. */
  birth_date: string | null;
  /** "18-24", "25-34", "35-44" or "45+"; worked out from birth_date. */
  age_range: string | null;
  /** When they confirmed they are 18+ (on WhatsApp). */
  adult_confirmed_at: string | null;
  /** Shown word for word next to the date field; the API stores these words. */
  consent_text: string;
  consent_version: string;
};

/** GET /me: the logged-in customer. */
export type Me = {
  name: string | null;
  handle: string;
  /**
   * Their own number, in full. Shown only on the profile page: never in shared
   * components, links, logs or analytics.
   */
  phone: string | null;
  /** A signed link that works for 15 minutes: never saved or cached. */
  photo_url: string | null;
  city: PlaceRef | null;
  area: PlaceRef | null;
  is_public: boolean;
  theme: Theme;
  founding_member_no: number | null;
  instagram_handle: string | null;
  show_instagram_to_venues: boolean;
  member_since: string;
  age: Age;
  totals: { notches: number; places: number; points: number };
};

/** PATCH /me: only the fields sent change. */
export type MeUpdate = {
  name?: string;
  area_id?: string;
  theme?: Theme;
  /** null removes it. */
  instagram_handle?: string | null;
  show_instagram_to_venues?: boolean;
  /** "1998-05-14"; null removes it. */
  birth_date?: string | null;
};

/** GET /me/places: one kind of place, the kind with most visits first. */
export type PlaceKind = {
  niche: string;
  label: string;
  colour: string;
  places: number;
  visits: number;
  venues: VisitedPlace[];
};

export type VisitedPlace = {
  venue_code: string;
  venue_name: string;
  area: string | null;
  city: string;
  visits: number;
  first_visit: string;
  last_visit: string;
};

/** GET /me/notches/by-location: one city, the busiest first. */
export type CityNotchs = {
  city: PlaceRef;
  notchs: number;
  places: number;
  /** area is null for places with no area set. */
  areas: { area: PlaceRef | null; notchs: number; places: number }[];
};

/** POST /me/phone-change: send `message` from the new number. */
export type PhoneChange = {
  message: string;
  expires_at: string;
  /** Null until the Notchs WhatsApp number is set up. */
  whatsapp_link: string | null;
};

export type MyRank = { rank: number; points: number };

/** GET /leaderboards/me: my rank in my home city. */
export type Standing = {
  city_id: string | null;
  is_public: boolean;
  month: MyRank | null;
  all_time: MyRank | null;
  /** Rank decay: the share of my points that counts for rank today (100 = all). */
  rank_points_percent: number;
  /** When it next drops unless I get a Notch first; null if it can't. */
  rank_drops_on: string | null;
};

export type Period = "month" | "all";

export type LeaderboardRow = {
  rank: number;
  points: number;
  /** Null when the customer keeps their name hidden. */
  name: string | null;
  handle: string | null;
};

export type Leaderboard = {
  city_id: string;
  period: Period;
  total_ranked: number;
  rows: LeaderboardRow[];
};

/** One verified visit. */
export type Notch = {
  notch_no: number;
  venue_name: string;
  venue_area: string | null;
  niche: string;
  colour: string;
  visit_date: string;
  visited_at: string;
  visit_no_at_venue: number;
  points: number;
};

/** GET /me/reward: this month's progress to the free-food reward. */
export type Reward = {
  month: string;
  new_cafes: number;
  needed: number;
  eligible: boolean;
  value_rupees: number;
};

export type Option = { value: string; label: string };

const request = sessionRequest("user");

/** Calls the API and returns `data`, renewing the short-lived login when needed. */
async function call<T>(path: string, options?: ApiRequestOptions) {
  if (USES_MOCK) {
    // Loaded only in mock mode, so example data never ships otherwise.
    const { mockCall } = await import("../mock/passport.dummydata");
    return (await mockCall(path, options)) as T;
  }
  return (await request<ApiSuccess<T>>(path, options)).data as T;
}

export const getMe = () => call<Me>("/me");

export const updateMe = (body: MeUpdate) =>
  call<Me>("/me", { method: "PATCH", body });

/** Uploads or replaces the profile picture; answers with the whole profile. */
export function uploadPhoto(photo: File) {
  const form = new FormData();
  form.append("photo", photo);
  return call<Me>("/me/photo", { method: "PUT", body: form });
}

export const removePhoto = () => call<Me>("/me/photo", { method: "DELETE" });

export const getPlaces = () => call<PlaceKind[]>("/me/places");

export const getNotchsByLocation = () =>
  call<CityNotchs[]>("/me/notches/by-location");

export const getStanding = () => call<Standing>("/leaderboards/me");

/** Shows or hides my name on the leaderboard; I keep my rank either way. */
export const setNameShown = (isPublic: boolean) =>
  call<Standing>("/leaderboards/me", {
    method: "PATCH",
    body: { is_public: isPublic },
  });

export const getLeaderboard = (cityId: string, period: Period) =>
  call<Leaderboard>("/leaderboards", {
    query: { city_id: cityId, period, limit: 50 },
  });

export const getNotches = (page: number, size: number) =>
  call<Paginated<Notch>>("/me/notches", { query: { page, size } });

export const getReward = () => call<Reward>("/me/reward");

/** GET /me/referral: my invite link and Star Points. */
export type Referral = {
  code: string;
  link: string;
  star_points: number;
  invited: number;
  rewarded: number;
  invited_by: string | null;
  can_add_inviter: boolean;
};

export const getReferral = () => call<Referral>("/me/referral");

/** Once, in the first 14 days. */
export const addInviter = (code: string) =>
  call<Referral>("/me/referral/inviter", { method: "POST", body: { code } });

/** A code to send from the new number; a new one cancels the old. */
export const startPhoneChange = () =>
  call<PhoneChange>("/me/phone-change", { method: "POST" });

/** A live place to claim a missed Notch at (GET /me/claims/venues). */
export type ClaimVenue = {
  venue_code: string;
  name: string;
  area: string | null;
  /** Already a label, e.g. "café". */
  niche: string;
};

/** POST /me/claims: what to send on WhatsApp, then the bill photo, today. */
export type ClaimStart = {
  claim_code: string;
  venue_name: string;
  message: string;
  whatsapp_link: string | null;
  expires_at: string;
};

export type ClaimStatus =
  "awaiting_photo" | "expired" | "in_review" | "approved" | "rejected";

export type MyClaim = {
  claim_code: string;
  venue_name: string;
  visit_date: string;
  status: ClaimStatus;
  notch_no: number | null;
  reject_reason: string | null;
  created_at: string;
};

export const findClaimVenues = (q: string) =>
  call<ClaimVenue[]>("/me/claims/venues", { query: { q } });

export const startClaim = (venueCode: string) =>
  call<ClaimStart>("/me/claims", {
    method: "POST",
    body: { venue_code: venueCode },
  });

export const getClaims = () => call<MyClaim[]>("/me/claims");

export const getAreas = (cityId: string) =>
  call<Option[]>("/dropdowns/areas", { query: { city_id: cityId } });

/** Deletes the account for good; the backend clears the login cookies. */
export const deleteAccount = () =>
  call<null>("/me/delete", { method: "POST", body: { confirm: "DELETE" } });

/** Ends the session; the backend clears its cookies. */
export function logOut() {
  if (USES_MOCK) return Promise.resolve();
  return endSession("user");
}

/** True when the error means the customer isn't logged in. */
export const isLoggedOut = (error: unknown) =>
  error instanceof ApiError && error.status === 401;

/** The API's code for an error, e.g. "passport.photo_invalid". */
export const errorCode = (error: unknown) =>
  error instanceof ApiError ? error.code : null;

/** The API's own message for an error, else `fallback`. */
export const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError && error.code !== "http_error" && error.message
    ? error.message
    : fallback;
