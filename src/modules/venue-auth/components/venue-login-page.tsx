import { Suspense } from "react";

import { SetPasswordForm } from "./set-password-form";
import { VenueAuthFlow } from "./venue-auth-flow";
import { VenueAuthShell } from "./venue-auth-shell";

export function VenueLoginPage() {
  return (
    <VenueAuthShell>
      {/* The flow reads `?view=`, so it renders in the browser; the shell stays static. */}
      <Suspense fallback={<div className="flex-1" />}>
        <VenueAuthFlow />
      </Suspense>
    </VenueAuthShell>
  );
}

export function VenueSetPasswordPage() {
  return (
    <VenueAuthShell>
      <SetPasswordForm />
    </VenueAuthShell>
  );
}
