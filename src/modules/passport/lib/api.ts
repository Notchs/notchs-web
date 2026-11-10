import {
  ApiError,
  apiRequest,
  type ApiRequestOptions,
} from "@/shared/lib/api-client";
import type { ApiSuccess, Paginated } from "@/shared/types/api";

export type PlaceRef = { id: string; name: string };

export type Theme = "light" | "dark";

/** GET /me: the logged-in customer. */
export type Me = {
  name: string | null;
  handle: string;
  city: PlaceRef | null;
  area: PlaceRef | null;
  is_public: boolean;
  theme: Theme;
  founding_member_no: number | null;
  instagram_handle: string | null;
  show_instagram_to_venues: boolean;
  member_since: string;
  totals: { notches: number; places: number; points: number };
};

export type MeUpdate = {
  name?: string | null;
  area_id?: string | null;
  instagram_handle?: string | null;
  show_instagram_to_venues?: boolean;
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

let refreshing: Promise<boolean> | undefined;

/** Swaps the refresh cookie for a new session; one request at a time. */
function refreshSession() {
  refreshing ??= apiRequest("/auth/customer/refresh", { method: "POST" })
    .then(
      () => true,
      () => false,
    )
    .finally(() => {
      refreshing = undefined;
    });
  return refreshing;
}

/**
 * Calls the API and returns `data`. The session is short-lived, so a 401 is
 * retried once after renewing it; a second 401 means the customer is logged out.
 */
async function call<T>(path: string, options?: ApiRequestOptions) {
  try {
    return (await apiRequest<ApiSuccess<T>>(path, options)).data as T;
  } catch (error) {
    if (
      !(error instanceof ApiError && error.status === 401) ||
      !(await refreshSession())
    ) {
      throw error;
    }
    return (await apiRequest<ApiSuccess<T>>(path, options)).data as T;
  }
}

export const getMe = () => call<Me>("/me");

export const updateMe = (body: MeUpdate) =>
  call<Me>("/me", { method: "PATCH", body });

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
  return apiRequest("/auth/customer/logout", { method: "POST" });
}

/** True when the error means the customer isn't logged in. */
export const isLoggedOut = (error: unknown) =>
  error instanceof ApiError && error.status === 401;
