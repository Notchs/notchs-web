import type { RevenueResponse } from "../types";

/** Stays empty on purpose: a visit doesn't tell us what anyone spent. */
export const revenueDummyData: RevenueResponse = {
  connection: "not_connected",
  revenue: null,
  averageOrderValue: null,
  transactions: null,
};
