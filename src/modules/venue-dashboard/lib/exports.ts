import type { Customer, VisitRecord } from "../types";
import { downloadCsv } from "./browser-actions";

/** Exports only ever hold pseudonymous guest IDs. */
export function exportCustomersCsv(customers: Customer[]) {
  downloadCsv("notchs-guests.csv", [
    ["Guest", "Segment", "Visits", "First visit", "Last visit", "Avg gap days"],
    ...customers.map((row) => [
      row.id,
      row.segment,
      row.totalVisits,
      row.firstVisitAt,
      row.lastVisitAt,
      row.averageGapDays ?? "",
    ]),
  ]);
}

export function exportVisitsCsv(visits: VisitRecord[]) {
  downloadCsv("notchs-visits.csv", [
    ["Received", "Notch", "Status", "Guest", "Detail", "Code", "Reference"],
    ...visits.map((row) => [
      row.receivedAt,
      row.notchNumber ?? "",
      row.status,
      row.guestId,
      row.detail,
      row.code,
      row.reference,
    ]),
  ]);
}
