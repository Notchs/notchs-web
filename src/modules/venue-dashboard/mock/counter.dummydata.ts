import type { CounterResponse } from "../types";
import { MOCK_COUNTER_NAME } from "./shared.dummydata";

export const counterDummyData: CounterResponse = {
  device: {
    name: MOCK_COUNTER_NAME,
    status: "online",
    lastHeartbeat: "2026-11-01T18:11:00+05:30",
    minutesSinceHeartbeat: 1,
    lastVerifiedVisit: "2026-11-01T18:12:00+05:30",
    batteryPercent: 82,
    charging: true,
    pairedOn: "14 Oct 2026",
    browser: "Chrome 118 · Android",
    verifiedToday: 14,
  },
  checklist: [
    { key: "paired", done: true },
    { key: "liveTest", done: true },
    { key: "plugged", done: true },
    { key: "standee", done: true },
    { key: "tents", done: false },
  ],
  exampleCodes: [
    "K7Q-29F",
    "M3X-81B",
    "R9T-44D",
    "H2V-07K",
    "P6W-58C",
    "T4N-13J",
  ],
  rotationSeconds: 30,
};

/** What the same phone reports when its heartbeat stops. */
export const offlineDeviceOverrides = {
  status: "offline",
  lastHeartbeat: "2026-11-01T17:40:00+05:30",
  minutesSinceHeartbeat: 32,
  lastVerifiedVisit: "2026-11-01T17:31:00+05:30",
  batteryPercent: null,
  charging: false,
} as const;
