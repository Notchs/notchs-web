import { apiRequest } from "@/shared/lib/api-client";
import type { ApiSuccess } from "@/shared/types/api";

import {
  toCustomers,
  toOverview,
  toSession,
  toVisits,
  type ApiGuests,
  type ApiOverview,
  type ApiScans,
  type ApiVenueMe,
} from "./api-mappers";
import { notLive } from "./not-live";
import type { VenueDataProvider } from "./venue-data.provider";

/**
 * Real backend, used when VENUE_DATA_MODE is "api". Screens the API can't
 * serve yet reject with NotLiveError and show "Opens soon"; none of them
 * falls back to example data.
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
  getSession: async () => toSession(await get<ApiVenueMe>("/venue/me")),
  logOut: () => send("/auth/venue/logout", "POST"),
  // No notifications yet: the list is always empty.
  markNotificationsRead: async () => {},

  getOverview: async (range) =>
    toOverview(await get<ApiOverview>("/venue/insights/overview", { range })),
  getCustomers: async () =>
    toCustomers(await get<ApiGuests>("/venue/insights/guests")),
  getVisits: async (range) =>
    toVisits(await get<ApiScans>("/venue/insights/scans", { range })),
  reportVisit: notLive("Reporting a visit"),
  getNotchCard: notLive("The Notch Card"),
  getFoundingVenue: notLive("Founding venue"),
  getAnalytics: notLive("Analytics"),
  getRevenue: notLive("Revenue"),
  requestPosIntegration: notLive("POS integration"),

  getReviews: notLive("Reviews"),
  replyToReview: notLive("Replying to reviews"),

  getDiscover: notLive("Discover"),

  getRewards: notLive("Rewards"),
  saveCampaign: notLive("Campaigns"),
  deleteCampaign: notLive("Campaigns"),
  endCampaign: notLive("Campaigns"),
  requestRewardsAccess: notLive("Rewards"),

  getCounter: notLive("The counter page"),
  renameCounter: notLive("The counter page"),
  pairCounter: notLive("The counter page"),
  removeCounter: notLive("The counter page"),

  getVenueProfile: notLive("The venue page"),
  saveVenueProfile: notLive("The venue page"),

  getTeam: notLive("Team"),
  inviteMember: notLive("Team"),
  removeMember: notLive("Team"),

  getBilling: notLive("Billing"),

  getSettings: notLive("Settings"),
  saveNotificationPreferences: notLive("Settings"),
  changePassword: (current, next) =>
    send("/venue/auth/change-password", "POST", {
      current_password: current,
      new_password: next,
    }),
  requestEmailChange: notLive("Changing the email"),
  confirmEmailChange: notLive("Changing the email"),
  requestVenueDeletion: notLive("Deleting the venue"),
};
