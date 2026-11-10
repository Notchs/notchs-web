import { apiRequest } from "@/shared/lib/api-client";
import type { ApiSuccess } from "@/shared/types/api";

/** What the counter phone needs (notchs-api `DisplayConfigOut`). */
export type DisplayConfig = {
  counter_id: string;
  label: string;
  venue: { name: string; venue_code: string; slug: string; scan_code: string };
  totp: { secret: string; digits: number; interval_s: number };
  /** Null until the Notchs WhatsApp number is set up on the API. */
  scan: { link_template: string; text_example: string } | null;
};

/** Uses the pairing link's token once; sets the phone's device cookie. */
export async function pairDisplay(token: string) {
  const response = await apiRequest<ApiSuccess<DisplayConfig>>(
    "/display/pair",
    { method: "POST", body: { token } },
  );
  return response.data;
}

export async function getDisplayConfig() {
  const response = await apiRequest<ApiSuccess<DisplayConfig>>(
    "/display/config",
    { cache: "no-store" },
  );
  if (!response.data) throw new Error("No display config");
  return response.data;
}

export function sendHeartbeat() {
  return apiRequest<null>("/display/heartbeat", { method: "POST" });
}
