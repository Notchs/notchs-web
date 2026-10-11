import type { Metadata } from "next";

import { GhostMark } from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <StatusPage
      kicker="Error 404"
      title="Unnotched."
      description="This page doesn’t exist. Nothing to prove here."
      mark={<GhostMark />}
    />
  );
}
