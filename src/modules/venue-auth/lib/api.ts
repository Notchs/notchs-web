import { apiRequest } from "@/shared/lib/api-client";
import { sessionRequest } from "@/shared/lib/session";
import type { ApiSuccess } from "@/shared/types/api";

/**
 * The logged-in venue member. The OpenAPI schema leaves this untyped, so only
 * the fields the website reads are listed, all optional.
 */
export type VenueMember = {
  id?: string;
  email?: string;
  name?: string | null;
  contact_name?: string | null;
  venue?: { name?: string | null } | null;
  venue_name?: string | null;
};

export type DropdownOption = { value: string; label: string };

export type VenueApplication = {
  verification_token: string;
  venue_name: string;
  category: string;
  city_id: string;
  google_maps_url: string;
  contact_name: string;
  phone: string;
  landmark?: string | null;
  notes?: string | null;
};

/** Sets the venue session cookies. */
export function loginVenue(email: string, password: string) {
  return apiRequest<ApiSuccess<VenueMember>>("/venue/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getVenueMe() {
  // Renews an expired 15-minute login first, so a returning owner stays logged in.
  return sessionRequest("venue")<ApiSuccess<VenueMember>>("/venue/me");
}

export function logoutVenue() {
  return apiRequest<null>("/auth/venue/logout", { method: "POST" });
}

/** Same answer whether or not the email is registered. */
export function requestPasswordReset(email: string, turnstileToken: string) {
  return apiRequest<ApiSuccess<null>>("/venue/auth/forgot-password", {
    method: "POST",
    body: { email, turnstile_token: turnstileToken },
  });
}

/** Token comes from the emailed link (first password or reset); logs in. */
export function setVenuePassword(token: string, password: string) {
  return apiRequest<ApiSuccess<VenueMember>>("/venue/auth/set-password", {
    method: "POST",
    body: { token, password },
  });
}

/** Both send-code calls need a fresh Turnstile token; each works once. */
export function sendApplicationCode(email: string, turnstileToken: string) {
  return apiRequest<ApiSuccess<null>>("/venue-applications/email/send-code", {
    method: "POST",
    body: { email, turnstile_token: turnstileToken },
  });
}

/** Returns the token the application form is submitted with. */
export function verifyApplicationCode(email: string, code: string) {
  return apiRequest<ApiSuccess<{ verification_token: string }>>(
    "/venue-applications/email/verify",
    { method: "POST", body: { email, code } },
  );
}

/** Returns the application code, e.g. APP-7K3M9QX2. */
export function submitApplication(application: VenueApplication) {
  return apiRequest<ApiSuccess<{ application_code: string }>>(
    "/venue-applications",
    { method: "POST", body: application },
  );
}

export function getApplicationDropdowns() {
  return apiRequest<
    ApiSuccess<{ cities: DropdownOption[]; venue_categories: DropdownOption[] }>
  >("/dropdowns", { query: { names: "cities,venue_categories" } });
}

/** Venue name to greet the member with, wherever the backend puts it. */
export function venueNameOf(member: VenueMember | undefined) {
  return member?.venue?.name ?? member?.venue_name ?? null;
}
