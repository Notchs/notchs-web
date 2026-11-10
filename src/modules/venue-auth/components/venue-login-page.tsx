import { Suspense } from "react";

import { SetPasswordForm } from "./set-password-form";
import { VenueAuthFlow } from "./venue-auth-flow";
import { VenueAuthShell } from "./venue-auth-shell";

type VenueAuthPageProps = {
  /** The dashboard, when this build serves it; logged-in owners go there. */
  dashboardHref?: string;
};

export function VenueLoginPage({ dashboardHref }: VenueAuthPageProps) {
  return (
    <VenueAuthShell>
      {/* The flow reads `?view=`, so it renders in the browser; the shell stays static. */}
      <Suspense fallback={<div className="flex-1" />}>
        <VenueAuthFlow dashboardHref={dashboardHref} />
      </Suspense>
    </VenueAuthShell>
  );
}

export function VenueSetPasswordPage({ dashboardHref }: VenueAuthPageProps) {
  return (
    <VenueAuthShell>
      <SetPasswordForm dashboardHref={dashboardHref} />
    </VenueAuthShell>
  );
}
