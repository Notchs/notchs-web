import type { Metadata } from "next";

import { GhostMark } from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";

export const metadata: Metadata = {
  title: "Page not found",
};

/** A15: always Ink, in either theme. */
export default function NotFound() {
  return (
    <div className="row-span-full grid min-h-svh grid-rows-[auto_1fr_auto] bg-background tone-ink text-foreground">
      <StatusPage
        kicker="404 · Unnotched"
        title="This place isn't on the map."
        mark={<GhostMark />}
      />
    </div>
  );
}
