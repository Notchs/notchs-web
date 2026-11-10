import { ApiError } from "@/shared/lib/api-client";
import { sessionRequest } from "@/shared/lib/session";
import type { ApiSuccess } from "@/shared/types/api";

import {
  toBilling,
  toCounter,
  toCustomers,
  toPairingLink,
  toOverview,
  toSession,
  toSettings,
  toTeam,
  toVenueProfile,
  toVenueProfileBody,
  toVisits,
  type ApiCounter,
  type ApiGuests,
  type ApiOverview,
  type ApiScans,
  type ApiVenueBilling,
  type ApiVenueMe,
  type ApiVenueProfile,
} from "./api-mappers";
import { SHOWS_EXAMPLES } from "./config";
import { mockProvider } from "./mock.provider";
import { notLive } from "./not-live";
import type { VenueDataProvider } from "./venue-data.provider";

/**
 * A screen the API can't serve yet: on team test links and local dev it shows
 * the example data (each screen labels it "Example"); on the live site a real
 * venue sees "Opens soon". Example data never reaches a real venue.
 */
const exampleOr = <K extends keyof VenueDataProvider>(
  key: K,
  what: string,
): VenueDataProvider[K] =>
  (SHOWS_EXAMPLES ? mockProvider[key] : notLive(what)) as VenueDataProvider[K];

/** The areas offered by the last profile load, to turn a picked name into its id. */
let areaOptions: { id: string; name: string }[] = [];

/**
 * Real backend, used when VENUE_DATA_MODE is "api". Screens the API can't
 * serve yet reject with NotLiveError and show "Opens soon"; none of them
 * falls back to example data.
 */
// The owner's login lasts 15 minutes and renews quietly for 30 days.
const request = sessionRequest("venue");

async function get<T>(path: string, query?: Record<string, string>) {
  const response = await request<ApiSuccess<T>>(path, { query });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

async function post<T>(path: string) {
  const response = await request<ApiSuccess<T>>(path, { method: "POST" });
  if (response.data === undefined) throw new Error(`No data from ${path}`);
  return response.data;
}

async function send(path: string, method: string, body?: unknown) {
  await request<ApiSuccess<unknown>>(path, { method, body });
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
  getNotchCard: exampleOr("getNotchCard", "The Notch Card"),
  getFoundingVenue: exampleOr("getFoundingVenue", "Founding venue"),
  getAnalytics: exampleOr("getAnalytics", "Analytics"),
  getRevenue: exampleOr("getRevenue", "Revenue"),
  requestPosIntegration: notLive("POS integration"),

  getReviews: exampleOr("getReviews", "Reviews"),
  replyToReview: exampleOr("replyToReview", "Replying to reviews"),

  getDiscover: exampleOr("getDiscover", "Discover"),

  getRewards: exampleOr("getRewards", "Rewards"),
  saveCampaign: exampleOr("saveCampaign", "Campaigns"),
  deleteCampaign: exampleOr("deleteCampaign", "Campaigns"),
  endCampaign: exampleOr("endCampaign", "Campaigns"),
  requestRewardsAccess: exampleOr("requestRewardsAccess", "Rewards"),

  getCounter: async () => {
    const [counter, overview] = await Promise.all([
      get<ApiCounter>("/venue/counter").catch((error: unknown) => {
        // No counter until the first pairing link is made.
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }),
      get<ApiOverview>("/venue/insights/overview", { range: "7d" }),
    ]);
    return toCounter(counter, overview);
  },
  renameCounter: (name) => send("/venue/counter", "PATCH", { label: name }),
  pairCounter: async () =>
    toPairingLink(
      await post<{ url: string; expires_at: string }>(
        "/venue/counter/pairing-link",
      ),
    ),
  removeCounter: () => send("/venue/counter", "DELETE"),

  getVenueProfile: async () => {
    const [profile, billing] = await Promise.all([
      get<ApiVenueProfile>("/venue/profile"),
      get<ApiVenueBilling>("/venue/billing").catch(() => null),
    ]);
    areaOptions = profile.area_options;
    return toVenueProfile(profile, billing);
  },
  saveVenueProfile: (profile) =>
    send("/venue/profile", "PATCH", toVenueProfileBody(profile, areaOptions)),

  // One login per place (team decision): no invites.
  getTeam: async () => toTeam(await get<ApiVenueMe>("/venue/me")),
  inviteMember: notLive("Team"),
  removeMember: notLive("Team"),

  getBilling: async () =>
    toBilling(await get<ApiVenueBilling>("/venue/billing")),

  getSettings: async () => toSettings(await get<ApiVenueMe>("/venue/me")),
  saveNotificationPreferences: notLive("Settings"),
  changePassword: (current, next) =>
    send("/venue/auth/change-password", "POST", {
      current_password: current,
      new_password: next,
    }),
  requestEmailChange: (email, password) =>
    send("/venue/me/email/send-code", "POST", {
      new_email: email,
      current_password: password,
    }),
  confirmEmailChange: (code) =>
    send("/venue/me/email/verify", "POST", { code }),
  requestVenueDeletion: notLive("Deleting the venue"),
};
