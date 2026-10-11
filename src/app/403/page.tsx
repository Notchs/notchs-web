import type { Metadata } from "next";

import { LockedMark } from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";

export const metadata: Metadata = {
  title: "Access denied",
  robots: { index: false },
};

export default function ForbiddenPage() {
  return (
    <StatusPage
      kicker="Error 403"
      title={"No proof, no entry."}
      description="You don’t have access to this page."
      mark={<LockedMark />}
    />
  );
}
