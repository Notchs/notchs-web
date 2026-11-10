import type { GuestId, IsoDateTime } from "./common.types";

export type CustomerSegment = "New" | "Returning" | "Regular" | "At risk";

/** A guest as a venue may see them: visits only, never a person. */
export type Customer = {
  id: GuestId;
  segment: CustomerSegment;
  totalVisits: number;
  firstVisitAt: IsoDateTime;
  lastVisitAt: IsoDateTime;
  /** Average days between visits; null after a single visit. */
  averageGapDays: number | null;
  /** Oldest first, matching `monthLabels` in the response. */
  visitsByMonth: number[];
  usualTime: string;
  /** Only when the guest chose to show it to venues. */
  instagram?: string | null;
};

export type CustomersSummary = {
  guests: number;
  newGuests: number;
  returning: number;
  regulars: number;
  atRisk: number;
};

export type ShareStat = { label: string; percent: number };

export type CohortRow = {
  month: string;
  guests: number;
  /** Month 0, 1, 2...; a shorter array means the month hasn't happened yet. */
  retention: number[];
};

export type CustomersResponse = {
  asOf: IsoDateTime;
  summary: CustomersSummary;
  customers: Customer[];
  monthLabels: string[];
  cameBackWithin: ShareStat[];
  visitFrequency: ShareStat[];
  cohorts: CohortRow[];
};
