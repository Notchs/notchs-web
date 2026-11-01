import type { GuestId } from "./common.types";

export type ReviewStatus = "needs" | "replied" | "none";

export type Review = {
  id: string;
  guestId: GuestId;
  stars: number;
  whenLabel: string;
  message: string;
  topics: string[];
  source: "Notchs";
  status: ReviewStatus;
  reply: string | null;
};

export type RatingSummaryItem = Pick<
  Review,
  "id" | "guestId" | "stars" | "whenLabel" | "message"
>;

export type TopicCount = { topic: string; count: number };

export type ReviewsResponse = {
  average: number;
  total: number;
  /** Counts for 5, 4, 3, 2 and 1 stars. */
  distribution: { stars: number; count: number }[];
  topics: TopicCount[];
  reviews: Review[];
};
