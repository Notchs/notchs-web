"use client";

import { useState } from "react";

import { routes } from "@/config/routes";
import { ButtonLink } from "@/shared/components/ui/button";

import { flowContent } from "../content";
import { logoutVenue, venueNameOf, type VenueMember } from "../lib/api";
import { DonePanel } from "./done-panel";

const copy = flowContent.done;

type LoggedInPanelProps = {
  stamp: string;
  member: VenueMember | undefined;
  /** Shown when the backend's member record has no email. */
  fallbackEmail?: string;
  onLoggedOut: () => void;
};

/**
 * End of a successful log in or password set. The venue dashboard is not on
 * the website yet, so this confirms the session and offers log out.
 */
export function LoggedInPanel({
  stamp,
  member,
  fallbackEmail,
  onLoggedOut,
}: LoggedInPanelProps) {
  const [busy, setBusy] = useState(false);
  const venueName = venueNameOf(member);
  const who = member?.email ?? fallbackEmail?.trim().toLowerCase();

  async function logout() {
    setBusy(true);
    // The cookies may already be gone; either way the session is over here.
    await logoutVenue().catch(() => {});
    onLoggedOut();
  }

  return (
    <DonePanel
      stamp={stamp}
      title={venueName ? `${copy.loginTitle}, ${venueName}` : copy.loginTitle}
      body={who ? copy.loginBody(who) : undefined}
    >
      <ButtonLink href={routes.home} className="w-full">
        {copy.home}
      </ButtonLink>
      <button
        type="button"
        onClick={logout}
        disabled={busy}
        className="h-12 cursor-pointer font-semibold underline underline-offset-[3px] disabled:cursor-default disabled:text-muted"
      >
        {busy ? copy.loggingOut : copy.logout}
      </button>
    </DonePanel>
  );
}
