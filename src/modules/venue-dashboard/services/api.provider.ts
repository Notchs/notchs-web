import { apiRequest } from "@/shared/lib/api-client";
import type { ApiSuccess } from "@/shared/types/api";

import type { VenueDataProvider } from "./venue-data.provider";

/**
 * Real backend, used when VENUE_DATA_MODE is "api". The paths are the
 * proposed contract: most of these endpoints don't exist on the API yet.
 */
async function get<T>(path: string, query?: Record<string, string>) {
  const response = await apiRequest<ApiSuccess<T>>(path, { query });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

async function send(path: string, method: string, body?: unknown) {
  await apiRequest<ApiSuccess<unknown>>(path, { method, body });
}

export const apiProvider: VenueDataProvider = {
  getSession: () => get("/venue/dashboard/session"),
  logOut: () => send("/auth/venue/logout", "POST"),
  markNotificationsRead: () =>
    send("/venue/dashboard/notifications/read", "POST"),

  getOverview: (range) => get("/venue/dashboard/overview", { range }),
  getCustomers: (range) => get("/venue/dashboard/customers", { range }),
  getVisits: (range) => get("/venue/dashboard/visits", { range }),
  reportVisit: (reference) =>
    send(`/venue/dashboard/visits/${reference}/report`, "POST"),
  getNotchCard: () => get("/venue/dashboard/notch-card"),
  getFoundingVenue: () => get("/venue/dashboard/founding"),
  getAnalytics: (range) => get("/venue/dashboard/analytics", { range }),
  getRevenue: () => get("/venue/dashboard/revenue"),
  requestPosIntegration: () =>
    send("/venue/dashboard/revenue/interest", "POST"),

  getReviews: () => get("/venue/dashboard/reviews"),
  replyToReview: (id, reply) =>
    send(`/venue/dashboard/reviews/${id}/reply`, "POST", { reply }),

  getDiscover: (range) => get("/venue/dashboard/discover", { range }),

  getRewards: () => get("/venue/dashboard/campaigns"),
  saveCampaign: (input) =>
    input.id
      ? send(`/venue/dashboard/campaigns/${input.id}`, "PUT", input)
      : send("/venue/dashboard/campaigns", "POST", input),
  deleteCampaign: (id) => send(`/venue/dashboard/campaigns/${id}`, "DELETE"),
  endCampaign: (id) => send(`/venue/dashboard/campaigns/${id}/end`, "POST"),
  requestRewardsAccess: () =>
    send("/venue/dashboard/campaigns/interest", "POST"),

  getCounter: () => get("/venue/dashboard/counter"),
  renameCounter: (name) => send("/venue/dashboard/counter", "PATCH", { name }),
  pairCounter: () => send("/venue/dashboard/counter/pair", "POST"),
  removeCounter: () => send("/venue/dashboard/counter", "DELETE"),

  getVenueProfile: () => get("/venue/dashboard/profile"),
  saveVenueProfile: (profile) =>
    send("/venue/dashboard/profile", "PUT", profile),

  getTeam: () => get("/venue/dashboard/team"),
  inviteMember: (email, role) =>
    send("/venue/dashboard/team/invites", "POST", { email, role }),
  removeMember: (id) => send(`/venue/dashboard/team/${id}`, "DELETE"),

  getBilling: () => get("/venue/dashboard/billing"),

  getSettings: () => get("/venue/dashboard/settings"),
  saveNotificationPreferences: (preferences) =>
    send("/venue/dashboard/settings/notifications", "PUT", preferences),
  changePassword: (current, next) =>
    send("/venue/dashboard/settings/password", "POST", { current, next }),
  requestEmailChange: (email, password) =>
    send("/venue/dashboard/settings/email", "POST", { email, password }),
  confirmEmailChange: (code) =>
    send("/venue/dashboard/settings/email/confirm", "POST", { code }),
  requestVenueDeletion: () =>
    send("/venue/dashboard/settings/delete-request", "POST"),
};
