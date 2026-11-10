import { apiConfig } from "@/config/api";
import { apiRequest } from "@/shared/lib/api-client";
import type { ApiSuccess } from "@/shared/types/api";

/** The admin panel's calls (notchs-api `admin_panel`, `venue_applications`, `claims`, admin auth). */

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export type AdminMe = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "reviewer";
};

export type Overview = {
  as_of: string;
  venues_live: number;
  venues_signed: number;
  venues_paused: number;
  applications_pending: number;
  customers: number;
  customers_new_7d: number;
  notchs_today: number;
  notchs_7d: number;
  scans_refused_today: number;
};

export type AdminVenue = {
  venue_code: string;
  name: string;
  category: string;
  area: string | null;
  status: string;
  joined_at: string;
  counter_paired: boolean;
  counter_online: boolean;
  counter_last_seen_at: string | null;
  notchs_total: number;
  notchs_7d: number;
};

export type AdminNotch = {
  venue_code: string;
  venue_name: string;
  notch_no: number;
  customer_handle: string | null;
  visit_date: string;
  visited_at: string;
  visit_no_at_venue: number;
  status: "valid" | "revoked";
  points: number;
};

export type AdminCustomer = {
  handle: string;
  name: string | null;
  phone_last4: string;
  city: string | null;
  status: "active" | "blocked";
  founding_member_no: number | null;
  notchs: number;
  joined_at: string;
  last_seen_at: string | null;
};

export type Application = {
  id: string;
  application_code: string;
  status: "pending" | "approved" | "rejected";
  venue_name: string;
  category: string;
  city_id: string;
  google_maps_url: string;
  landmark: string | null;
  contact_name: string;
  email: string;
  phone_e164: string;
  notes: string | null;
  created_at: string;
};

/** A bill-photo claim (notchs-api `claims`). The customer's handle, never their number. */
export type AdminClaim = {
  claim_code: string;
  status: "awaiting_photo" | "in_review" | "approved" | "rejected";
  venue_name: string;
  venue_code: string;
  niche: string;
  customer_handle: string;
  visit_date: string;
  created_at: string;
  photo_received_at: string | null;
  photo_available: boolean;
  counter_last_seen_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  reject_reason: string | null;
  notch_no: number | null;
};

export type ClaimDecision = { claim: AdminClaim; customer_notified: boolean };

export type Option = { value: string; label: string };

type Query = Record<string, string | number | undefined>;

async function get<T>(path: string, query?: Query) {
  const response = await apiRequest<ApiSuccess<T>>(path, { query });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

async function send(path: string, method: string, body?: unknown) {
  await apiRequest<ApiSuccess<unknown>>(path, { method, body });
}

async function decide(path: string, body?: unknown) {
  const response = await apiRequest<ApiSuccess<ClaimDecision>>(path, {
    method: "POST",
    body,
  });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

const claimPath = (code: string) => `/admin/claims/${encodeURIComponent(code)}`;

export const adminApi = {
  me: () => get<AdminMe>("/admin/me"),
  login: (email: string, password: string) =>
    send("/admin/auth/login", "POST", { email, password }),
  setPassword: (token: string, password: string) =>
    send("/admin/auth/set-password", "POST", { token, password }),
  logout: () => send("/auth/admin/logout", "POST"),

  overview: () => get<Overview>("/admin/overview"),
  venues: (query: Query) => get<Paginated<AdminVenue>>("/admin/venues", query),
  setVenueStatus: (code: string, status: string) =>
    send(`/admin/venues/${encodeURIComponent(code)}/status`, "PATCH", {
      status,
    }),
  notchs: (query: Query) => get<Paginated<AdminNotch>>("/admin/notchs", query),
  revoke: (code: string, notchNo: number, reason: string) =>
    send(
      `/admin/venues/${encodeURIComponent(code)}/notchs/${notchNo}/revoke`,
      "POST",
      { reason },
    ),
  customers: (query: Query) =>
    get<Paginated<AdminCustomer>>("/admin/customers", query),
  setCustomerStatus: (handle: string, status: string) =>
    send(`/admin/customers/${encodeURIComponent(handle)}/status`, "PATCH", {
      status,
    }),

  applications: (query: Query) =>
    get<Paginated<Application>>("/admin/venue-applications", query),
  approve: (id: string, areaId: string | null) =>
    send(`/admin/venue-applications/${id}/approve`, "POST", {
      area_id: areaId,
    }),
  reject: (id: string, reason: string, notify: boolean) =>
    send(`/admin/venue-applications/${id}/reject`, "POST", {
      reason: reason || null,
      notify,
    }),
  claims: (query: Query) => get<Paginated<AdminClaim>>("/admin/claims", query),
  /** For an <img>: the API fetches it from WhatsApp, with the admin's cookie. */
  claimPhotoUrl: (code: string) =>
    `${apiConfig.baseUrl}${claimPath(code)}/photo`,
  approveClaim: (code: string) => decide(`${claimPath(code)}/approve`),
  rejectClaim: (code: string, reason: string) =>
    decide(`${claimPath(code)}/reject`, { reason }),
  areas: (cityId: string) =>
    get<Option[]>("/dropdowns/areas", { city_id: cityId }),
};
