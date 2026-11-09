import type { IsoDateTime } from "./common.types";

export type CounterStatus = "online" | "offline" | "none";

export type CounterDevice = {
  name: string;
  status: CounterStatus;
  lastHeartbeat: IsoDateTime;
  minutesSinceHeartbeat: number;
  lastVerifiedVisit: IsoDateTime;
  batteryPercent: number | null;
  charging: boolean;
  pairedOn: string;
  browser: string;
  verifiedToday: number;
};

export type CounterChecklistKey =
  "paired" | "liveTest" | "plugged" | "standee" | "tents";

export type CounterChecklistItem = { key: CounterChecklistKey; done: boolean };

export type CounterResponse = {
  device: CounterDevice;
  checklist: CounterChecklistItem[];
  /** Rotating example codes; real ones come from the Notchs server. */
  exampleCodes: string[];
  rotationSeconds: number;
};

/** A one-time link that pairs a phone as the counter display. */
export type PairingLink = {
  url: string;
  expiresAt: IsoDateTime;
  /** Example data: the QR doesn't pair anything. */
  example?: boolean;
};
