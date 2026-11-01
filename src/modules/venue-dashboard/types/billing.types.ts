export type BillingState = "free" | "paying" | "failed";

export type Invoice = {
  id: string;
  period: string;
  verifiedVisits: number;
  amountLabel: string;
};

export type BillingResponse = {
  state: BillingState;
  freeUntil: string;
  visitsThisCycle: number;
  /** Prices stay out of this public repo; the API supplies the real one. */
  priceLabel: string;
  autopayHandle: string;
  nextCharge: string;
  failedOn: string;
  invoices: Invoice[];
};
