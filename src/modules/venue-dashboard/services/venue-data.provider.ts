import type {
  AnalyticsResponse,
  BillingResponse,
  CampaignInput,
  CounterResponse,
  CustomersResponse,
  DateRangeKey,
  DiscoverResponse,
  FoundingVenueResponse,
  NotchCardResponse,
  NotificationPreferences,
  OverviewResponse,
  RevenueResponse,
  ReviewsResponse,
  RewardsResponse,
  SessionResponse,
  SettingsResponse,
  TeamResponse,
  MemberRole,
  VenueProfile,
  VenueProfileResponse,
  VisitsResponse,
} from "../types";

/** One contract, two implementations: mock today, the API later. */
export type VenueDataProvider = {
  getSession(): Promise<SessionResponse>;
  logOut(): Promise<void>;
  markNotificationsRead(): Promise<void>;

  getOverview(range: DateRangeKey): Promise<OverviewResponse>;
  getCustomers(range: DateRangeKey): Promise<CustomersResponse>;
  getVisits(range: DateRangeKey): Promise<VisitsResponse>;
  reportVisit(reference: string): Promise<void>;
  getNotchCard(): Promise<NotchCardResponse>;
  getFoundingVenue(): Promise<FoundingVenueResponse>;
  getAnalytics(range: DateRangeKey): Promise<AnalyticsResponse>;
  getRevenue(): Promise<RevenueResponse>;
  requestPosIntegration(): Promise<void>;

  getReviews(): Promise<ReviewsResponse>;
  replyToReview(id: string, reply: string): Promise<void>;

  getDiscover(range: DateRangeKey): Promise<DiscoverResponse>;

  getRewards(): Promise<RewardsResponse>;
  saveCampaign(input: CampaignInput): Promise<void>;
  deleteCampaign(id: string): Promise<void>;
  endCampaign(id: string): Promise<void>;
  requestRewardsAccess(): Promise<void>;

  getCounter(): Promise<CounterResponse>;
  renameCounter(name: string): Promise<void>;
  pairCounter(): Promise<void>;
  removeCounter(): Promise<void>;

  getVenueProfile(): Promise<VenueProfileResponse>;
  saveVenueProfile(profile: VenueProfile): Promise<void>;

  getTeam(): Promise<TeamResponse>;
  inviteMember(email: string, role: MemberRole): Promise<void>;
  removeMember(id: string): Promise<void>;

  getBilling(): Promise<BillingResponse>;

  getSettings(): Promise<SettingsResponse>;
  saveNotificationPreferences(
    preferences: NotificationPreferences,
  ): Promise<void>;
  changePassword(current: string, next: string): Promise<void>;
  requestEmailChange(email: string, password: string): Promise<void>;
  confirmEmailChange(code: string): Promise<void>;
  requestVenueDeletion(): Promise<void>;
};
