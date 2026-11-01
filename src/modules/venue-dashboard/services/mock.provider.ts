import { activityByRange, discoveryByRange } from "../mock/shared.dummydata";
import { analyticsDummyData } from "../mock/analytics.dummydata";
import { billingDummyData } from "../mock/billing.dummydata";
import {
  counterDummyData,
  offlineDeviceOverrides,
} from "../mock/counter.dummydata";
import {
  atRiskCount,
  customersDummyData,
  regularsCount,
} from "../mock/customers.dummydata";
import { discoverDummyData } from "../mock/discover.dummydata";
import { overviewDummyData } from "../mock/overview.dummydata";
import { revenueDummyData } from "../mock/revenue.dummydata";
import { reviews, reviewsSummaryDummyData } from "../mock/reviews.dummydata";
import { campaigns, rewardsSummaryDummyData } from "../mock/rewards.dummydata";
import {
  applyRequestScenario,
  getScenario,
  type ScenarioPage,
} from "../mock/scenario";
import { sessionDummyData } from "../mock/session.dummydata";
import { settingsDummyData } from "../mock/settings.dummydata";
import { teamDummyData } from "../mock/team.dummydata";
import { venueProfileDummyData } from "../mock/venue-profile.dummydata";
import {
  foundingVenueDummyData,
  notchCardDummyData,
  visitFunnelByRange,
  visitLog,
} from "../mock/visits.dummydata";
import type {
  Campaign,
  CampaignInput,
  DiscoveryStats,
  OverviewStage,
} from "../types";
import type { VenueDataProvider } from "./venue-data.provider";

/** Deep copy, so screens can never change the stored example data. */
const copy = <T>(value: T): T => structuredClone(value);
const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/**
 * In-memory stand-in for the backend. Writes last until the page reloads,
 * so every action on screen behaves as it will with the API.
 */
const store = {
  session: copy(sessionDummyData),
  reviews: copy(reviews),
  campaigns: copy(campaigns),
  counter: copy(counterDummyData),
  counterRemoved: false,
  venueProfile: copy(venueProfileDummyData),
  team: copy(teamDummyData),
  settings: copy(settingsDummyData),
};

/** Runs the request scenario for a page, then returns a private copy. */
async function respond<T>(page: ScenarioPage, build: () => T): Promise<T> {
  await applyRequestScenario(page);
  return copy(build());
}

const discoveryFor = (range: "7d" | "30d"): DiscoveryStats => ({
  ...discoveryByRange[range],
});

function rewardLabel(input: CampaignInput) {
  return input.rewardType;
}

function saveCampaignRow(input: CampaignInput) {
  const existing = store.campaigns.find((row) => row.id === input.id);
  const row: Campaign = {
    ...input,
    id: input.id ?? `c${store.campaigns.length + 1}-${input.name.length}`,
    rewardLabel: existing?.rewardLabel ?? rewardLabel(input),
    redemptions: existing?.redemptions ?? 0,
  };
  if (existing) Object.assign(existing, row);
  else store.campaigns.unshift(row);
}

export const mockProvider: VenueDataProvider = {
  getSession: () => Promise.resolve(copy(store.session)),
  async logOut() {},
  async markNotificationsRead() {
    store.session.notifications.forEach((item) => (item.read = true));
  },

  getOverview: (range) =>
    respond("overview", () => {
      const scenario = getScenario("overview");
      const stage: OverviewStage =
        scenario === "First days" ? "firstDays" : "live";
      return {
        ...overviewDummyData,
        stage,
        activity: activityByRange[range],
        discovery: discoveryFor(range),
        counter: {
          ...overviewDummyData.counter,
          online: scenario !== "Counter off",
        },
      };
    }),

  getCustomers: (range) =>
    respond("customers", () => {
      const activity = activityByRange[range];
      const newGuests = sum(activity.newVisitors);
      const isEmpty = getScenario("customers") === "Empty";
      return {
        ...customersDummyData,
        customers: isEmpty ? [] : customersDummyData.customers,
        summary: {
          guests: isEmpty ? 0 : activity.uniqueGuests,
          newGuests: isEmpty ? 0 : newGuests,
          returning: isEmpty ? 0 : activity.uniqueGuests - newGuests,
          regulars: isEmpty ? 0 : regularsCount,
          atRisk: isEmpty ? 0 : atRiskCount,
        },
      };
    }),

  getVisits: (range) =>
    respond("visits", () => ({
      funnel: visitFunnelByRange[range],
      visits: visitLog,
    })),
  async reportVisit() {},
  getNotchCard: () =>
    respond("visits", () => ({
      ...notchCardDummyData,
      ready: getScenario("visits") !== "Card not ready",
    })),
  getFoundingVenue: () => respond("visits", () => foundingVenueDummyData),

  getAnalytics: (range) =>
    respond("analytics", () => ({
      ...analyticsDummyData,
      activity: activityByRange[range],
      discovery: discoveryFor(range),
    })),
  getRevenue: () => respond("analytics", () => revenueDummyData),
  async requestPosIntegration() {},

  getReviews: () =>
    respond("reviews", () => {
      if (getScenario("reviews") === "No ratings yet") {
        return {
          average: 0,
          total: 0,
          distribution: [],
          topics: [],
          reviews: [],
        };
      }
      return { ...reviewsSummaryDummyData, reviews: store.reviews };
    }),
  async replyToReview(id, reply) {
    const review = store.reviews.find((row) => row.id === id);
    if (review) Object.assign(review, { status: "replied", reply });
  },

  getDiscover: (range) =>
    respond("discover", () => ({
      ...discoverDummyData,
      sources: [
        ...discoverDummyData.sources,
        {
          label: "Profile views",
          value: sum(activityByRange[range].profileViews),
        },
      ],
      mapAvailable: getScenario("discover") !== "Map error",
    })),

  getRewards: () =>
    respond("rewards", () => ({
      ...rewardsSummaryDummyData,
      enabled: getScenario("rewards") !== "Not available yet",
      campaigns: store.campaigns,
    })),
  async saveCampaign(input) {
    saveCampaignRow(input);
  },
  async deleteCampaign(id) {
    store.campaigns = store.campaigns.filter((row) => row.id !== id);
  },
  async endCampaign(id) {
    const campaign = store.campaigns.find((row) => row.id === id);
    if (campaign) campaign.status = "Completed";
  },
  async requestRewardsAccess() {},

  getCounter: () =>
    respond("counter", () => {
      const scenario = getScenario("counter");
      if (scenario === "Offline") {
        return {
          ...store.counter,
          device: { ...store.counter.device, ...offlineDeviceOverrides },
        };
      }
      if (scenario === "Not paired" || store.counterRemoved) {
        return {
          ...store.counter,
          device: { ...store.counter.device, status: "none" as const },
        };
      }
      return store.counter;
    }),
  async renameCounter(name) {
    store.counter.device.name = name;
  },
  async pairCounter() {
    store.counterRemoved = false;
  },
  async removeCounter() {
    store.counterRemoved = true;
  },

  getVenueProfile: () => respond("venue-page", () => store.venueProfile),
  async saveVenueProfile(profile) {
    store.venueProfile.profile = copy(profile);
  },

  getTeam: () =>
    respond("team", () => ({
      ...store.team,
      enabled: getScenario("team") !== "Not available yet",
    })),
  async inviteMember(email, role) {
    store.team.members.push({
      id: `m${store.team.members.length + 1}-${email}`,
      name: email.split("@")[0],
      email,
      role,
      status: "Invited",
      lastActive: "Invite sent today",
      isYou: false,
    });
  },
  async removeMember(id) {
    store.team.members = store.team.members.filter((row) => row.id !== id);
  },

  getBilling: () =>
    respond("billing", () => {
      const scenario = getScenario("billing");
      const state =
        scenario === "Paying"
          ? ("paying" as const)
          : scenario === "Payment failed"
            ? ("failed" as const)
            : billingDummyData.state;
      return { ...billingDummyData, state };
    }),

  getSettings: () => respond("settings", () => store.settings),
  async saveNotificationPreferences(preferences) {
    store.settings.preferences = copy(preferences);
  },
  async changePassword() {},
  async requestEmailChange() {},
  async confirmEmailChange() {},
  async requestVenueDeletion() {},
};
