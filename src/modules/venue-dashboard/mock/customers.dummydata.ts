import type { Customer, CustomersResponse } from "../types";
import { cohorts, MOCK_AS_OF } from "./shared.dummydata";

const EVENINGS = "Evenings, 6–8 PM";
const AFTERNOONS = "Afternoons, 2–4 PM";
const LUNCH = "Lunch, 12–2 PM";
const NIGHTS = "Nights, 8–10 PM";

const at = (date: string, time: string) => `2026-${date}T${time}:00+05:30`;

/** The same guest IDs appear in the visit log and in reviews. */
export const customers: Customer[] = [
  {
    id: "G-7F3A",
    segment: "Regular",
    totalVisits: 12,
    firstVisitAt: at("08-12", "15:02"),
    lastVisitAt: at("11-01", "15:20"),
    averageGapDays: 6.4,
    visitsByMonth: [3, 4, 5],
    usualTime: AFTERNOONS,
  },
  {
    id: "G-2C91",
    segment: "Regular",
    totalVisits: 6,
    firstVisitAt: at("09-07", "18:10"),
    lastVisitAt: at("11-01", "17:58"),
    averageGapDays: 9,
    visitsByMonth: [0, 1, 5],
    usualTime: EVENINGS,
  },
  {
    id: "G-5D7C",
    segment: "New",
    totalVisits: 1,
    firstVisitAt: at("11-01", "18:12"),
    lastVisitAt: at("11-01", "18:12"),
    averageGapDays: null,
    visitsByMonth: [0, 0, 1],
    usualTime: EVENINGS,
  },
  {
    id: "G-B04E",
    segment: "Returning",
    totalVisits: 2,
    firstVisitAt: at("10-19", "17:15"),
    lastVisitAt: at("11-01", "17:31"),
    averageGapDays: 13,
    visitsByMonth: [0, 0, 2],
    usualTime: EVENINGS,
  },
  {
    id: "G-E81A",
    segment: "New",
    totalVisits: 1,
    firstVisitAt: at("11-01", "16:44"),
    lastVisitAt: at("11-01", "16:44"),
    averageGapDays: null,
    visitsByMonth: [0, 0, 1],
    usualTime: AFTERNOONS,
  },
  {
    id: "G-11AF",
    segment: "New",
    totalVisits: 1,
    firstVisitAt: at("11-01", "16:44"),
    lastVisitAt: at("11-01", "16:44"),
    averageGapDays: null,
    visitsByMonth: [0, 0, 1],
    usualTime: AFTERNOONS,
  },
  {
    id: "G-91F0",
    segment: "Returning",
    totalVisits: 3,
    firstVisitAt: at("10-10", "14:20"),
    lastVisitAt: at("11-01", "14:02"),
    averageGapDays: 11,
    visitsByMonth: [0, 1, 2],
    usualTime: AFTERNOONS,
  },
  {
    id: "G-D72B",
    segment: "Returning",
    totalVisits: 2,
    firstVisitAt: at("10-26", "12:30"),
    lastVisitAt: at("11-01", "12:48"),
    averageGapDays: 6,
    visitsByMonth: [0, 0, 2],
    usualTime: LUNCH,
  },
  {
    id: "G-4A6B",
    segment: "Regular",
    totalVisits: 8,
    firstVisitAt: at("08-15", "19:05"),
    lastVisitAt: at("10-30", "19:40"),
    averageGapDays: 9.4,
    visitsByMonth: [2, 1, 5],
    usualTime: EVENINGS,
  },
  {
    id: "G-C3D2",
    segment: "New",
    totalVisits: 1,
    firstVisitAt: at("10-29", "20:11"),
    lastVisitAt: at("10-29", "20:11"),
    averageGapDays: null,
    visitsByMonth: [0, 0, 1],
    usualTime: NIGHTS,
  },
  {
    id: "G-0B7E",
    segment: "Returning",
    totalVisits: 4,
    firstVisitAt: at("09-24", "18:30"),
    lastVisitAt: at("10-28", "18:52"),
    averageGapDays: 11.3,
    visitsByMonth: [0, 2, 2],
    usualTime: EVENINGS,
  },
  {
    id: "G-6F2D",
    segment: "Returning",
    totalVisits: 2,
    firstVisitAt: at("10-21", "16:05"),
    lastVisitAt: at("10-27", "16:33"),
    averageGapDays: 6,
    visitsByMonth: [0, 0, 2],
    usualTime: AFTERNOONS,
  },
  {
    id: "G-8B1C",
    segment: "Returning",
    totalVisits: 3,
    firstVisitAt: at("09-30", "13:12"),
    lastVisitAt: at("10-20", "13:40"),
    averageGapDays: 10,
    visitsByMonth: [0, 2, 1],
    usualTime: LUNCH,
  },
  {
    id: "G-A9C4",
    segment: "At risk",
    totalVisits: 7,
    firstVisitAt: at("08-28", "19:22"),
    lastVisitAt: at("10-08", "21:02"),
    averageGapDays: 6.8,
    visitsByMonth: [4, 3, 0],
    usualTime: NIGHTS,
  },
  {
    id: "G-3E5F",
    segment: "At risk",
    totalVisits: 5,
    firstVisitAt: at("08-31", "18:40"),
    lastVisitAt: at("10-03", "19:15"),
    averageGapDays: 8,
    visitsByMonth: [3, 2, 0],
    usualTime: EVENINGS,
  },
];

export const customersDummyData: Omit<CustomersResponse, "summary"> = {
  asOf: MOCK_AS_OF,
  customers,
  monthLabels: ["Sep", "Oct", "Nov"],
  cameBackWithin: [
    { label: "7 days", percent: 22 },
    { label: "30 days", percent: 41 },
    { label: "60 days", percent: 52 },
  ],
  visitFrequency: [
    { label: "1 visit", percent: 58 },
    { label: "2–4 visits", percent: 32 },
    { label: "5+ visits", percent: 10 },
  ],
  cohorts,
};

export const regularsCount = 6;
export const atRiskCount = 9;
