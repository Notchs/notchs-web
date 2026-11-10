export type BillingState = "free" | "paying" | "failed";

export type Invoice = {
  id: string;
  period: string;
  verifiedVisits: number;
  amountLabel: string;
};

/** The founding discount: the first places of each kind (team decision). */
export type FoundingPlace = {
  /** This place's number within its kind, or null if the spots were gone. */
  number: number | null;
  spots: number;
  spotsLeft: number;
  discountPercent: number;
  /** "café", "turf or gym"... */
  niche: string;
};

export type BillingResponse = {
  state: BillingState;
  /** Empty when the free months have no end date yet. */
  freeUntil: string;
  freeMonths: number;
  founding: FoundingPlace | null;
  visitsThisCycle: number;
  /** Prices stay out of this public repo; the API supplies the real one. */
  priceLabel: string;
  autopayHandle: string;
  nextCharge: string;
  failedOn: string;
  invoices: Invoice[];
};
