import { apiConfig } from "@/config/api";
import { sessionRequest } from "@/shared/lib/session";
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

/** An admin account, in Settings (notchs-api `admin_users`). */
export type AdminAccount = {
  id: string;
  admin_user_code: string;
  name: string;
  email: string;
  role: "admin" | "reviewer";
  is_active: boolean;
  has_password: boolean;
  last_login_at: string | null;
  created_at: string;
};

/** GET /admin/system: on/off states of the API's outside services, never keys. */
export type SystemStatus = {
  environment: string;
  version: string;
  email: "sending" | "dry_run" | "local_smtp" | "not_configured";
  email_from: string;
  whatsapp: "sending" | "dry_run" | "not_configured";
  whatsapp_webhook_ready: boolean;
  whatsapp_number_set: boolean;
  bot_check: "on" | "off" | "not_configured";
  customer_app_url: string;
  venue_app_url: string;
  admin_app_url: string;
};

export type Option = { value: string; label: string };

type Query = Record<string, string | number | undefined>;

// The admin's login lasts 15 minutes and renews quietly for 30 days.
const request = sessionRequest("admin");

async function get<T>(path: string, query?: Query) {
  const response = await request<ApiSuccess<T>>(path, { query });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

async function send(path: string, method: string, body?: unknown) {
  await request<ApiSuccess<unknown>>(path, { method, body });
}

async function decide(path: string, body?: unknown) {
  const response = await request<ApiSuccess<ClaimDecision>>(path, {
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
  /** Same answer whether or not the email is an admin's. */
  forgotPassword: (email: string, turnstileToken: string) =>
    send("/admin/auth/forgot-password", "POST", {
      email,
      turnstile_token: turnstileToken,
    }),

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
  system: () => get<SystemStatus>("/admin/system"),
  /** Resolves to the API's message; a refusal throws with the provider's reason. */
  sendTestEmail: async () =>
    (
      await request<ApiSuccess<unknown>>("/admin/system/test-email", {
        method: "POST",
      })
    ).message,
  changePassword: (current: string, next: string) =>
    send("/admin/auth/change-password", "POST", {
      current_password: current,
      new_password: next,
    }),
  admins: () => get<AdminAccount[]>("/admin/users"),
  addAdmin: (name: string, email: string, role: string) =>
    send("/admin/users", "POST", { name, email, role }),
  updateAdmin: (code: string, change: { role?: string; is_active?: boolean }) =>
    send(`/admin/users/${encodeURIComponent(code)}`, "PATCH", change),
  sendAdminLink: (code: string) =>
    send(`/admin/users/${encodeURIComponent(code)}/link`, "POST"),
  areas: (cityId: string) =>
    get<Option[]>("/dropdowns/areas", { city_id: cityId }),
};
