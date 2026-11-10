export type CampaignStatus = "Active" | "Scheduled" | "Draft" | "Completed";
export type RewardType = "Free item" | "% off" | "Free upgrade";

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  rewardType: RewardType;
  rewardLabel: string;
  audience: string;
  /** ISO dates; null while a draft has no window. */
  startsOn: string | null;
  endsOn: string | null;
  redemptions: number;
  perGuest: string;
  totalLimit: number | null;
  terms: string;
};

/** What the campaign form sends; the server fills in the rest. */
export type CampaignInput = Pick<
  Campaign,
  | "name"
  | "status"
  | "rewardType"
  | "audience"
  | "startsOn"
  | "endsOn"
  | "perGuest"
  | "totalLimit"
  | "terms"
> & { id?: string };

export type RewardsResponse = {
  /** False until rewards are switched on for this venue. */
  enabled: boolean;
  redemptionsLast30Days: number;
  visitsByRedeemingGuests: number;
  campaigns: Campaign[];
};
