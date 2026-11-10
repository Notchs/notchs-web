"use client";

import { inactivityContent as copy } from "../content";
import { getNotches } from "../lib/api";
import { fullDate } from "../lib/format";
import { useLoad } from "../lib/use-load";

/** Team decision: no deletion for being quiet, just a note after 3 months. */
const QUIET_DAYS = 90;
const DAY_MS = 86_400_000;

/** The last Notch's time, if it is more than 3 months old. */
async function quietSince() {
  const last = (await getNotches(1, 1)).items[0]?.visited_at;
  return last && Date.now() - Date.parse(last) >= QUIET_DAYS * DAY_MS
    ? last
    : null;
}

/** Shown on Profile when the last Notch is more than 3 months old. No messages are sent. */
export function InactivityNote() {
  // The clock is read with the data, in the browser, so rendering stays pure.
  const { data: last } = useLoad(quietSince, "quiet-since");
  if (!last) return null;

  return (
    <section
      role="status"
      className="flex flex-col gap-2 rounded-[20px] border border-line bg-card p-4 md:p-6"
    >
      <h2 className="font-display text-lg font-extrabold">{copy.title}</h2>
      <p className="text-[.9375rem] text-muted">{copy.body(fullDate(last))}</p>
    </section>
  );
}
