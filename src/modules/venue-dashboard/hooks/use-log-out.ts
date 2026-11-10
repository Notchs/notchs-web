"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { routes } from "@/config/routes";

import { apiProvider } from "../services/api.provider";
import { useVenueDraft } from "./use-venue-draft";

/** Ends the session and goes to the login page, unless edits hold it back. */
export function useLogOut() {
  const router = useRouter();
  const { holdNavigation } = useVenueDraft();
  return useCallback(() => {
    if (holdNavigation(routes.venueLogin)) return;
    // The login is real even on example data, so this always ends it;
    // otherwise the login page would send the owner straight back here.
    void apiProvider
      .logOut()
      .catch(() => {})
      .finally(() => router.push(routes.venueLogin));
  }, [holdNavigation, router]);
}
