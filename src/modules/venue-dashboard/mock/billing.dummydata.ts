import type { BillingResponse } from "../types";

export const billingDummyData: BillingResponse = {
  state: "free",
  freeUntil: "14 Dec 2026",
  visitsThisCycle: 312,
  priceLabel: "Example price",
  autopayHandle: "example@upi",
  nextCharge: "14 Jan 2027",
  failedOn: "14 Jan",
  invoices: [
    {
      id: "NX-2026-0007",
      period: "14 Dec – 13 Jan",
      verifiedVisits: 1204,
      amountLabel: "Example amount",
    },
  ],
};
