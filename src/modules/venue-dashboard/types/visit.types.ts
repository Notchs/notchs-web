import type { GuestId, IsoDateTime } from "./common.types";

export type VisitStatus =
  "Verified" | "Duplicate" | "Expired code" | "In review" | "Not counted";

export type VisitRecord = {
  reference: string;
  receivedAt: IsoDateTime;
  /** Null when the attempt didn't count as a Notch. */
  notchNumber: string | null;
  status: VisitStatus;
  guestId: GuestId;
  detail: string;
  code: string;
  codeWindow: string;
  counterName: string;
};

export type VisitFunnel = {
  attempts: number;
  verified: number;
  duplicate: number;
  expired: number;
  inReview: number;
};

export type VisitsResponse = {
  funnel: VisitFunnel;
  visits: VisitRecord[];
};

export type NotchCardResponse = {
  /** False until a full month with at least 10 verified visits. */
  ready: boolean;
  monthLabel: string;
  monthName: string;
  venueName: string;
  location: string;
  visitors: number;
  newPercent: number;
  issuedOn: string;
  firstCardOn: string;
  nextCardNote: string;
};

export type FoundingVenueResponse = {
  number: number;
  total: number;
  venueName: string;
  area: string;
  joinedOn: string;
  pilotLabel: string;
};
