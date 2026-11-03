"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { routes } from "@/config/routes";

import { venueData } from "../services/venue-data.service";
import { useVenueDraft } from "./use-venue-draft";

/** Ends the session and goes to the login page, unless edits hold it back. */
export function useLogOut() {
  const router = useRouter();
  const { holdNavigation } = useVenueDraft();
  return useCallback(() => {
    if (holdNavigation(routes.venueLogin)) return;
    void venueData
      .logOut()
      .catch(() => {})
      .finally(() => router.push(routes.venueLogin));
  }, [holdNavigation, router]);
}
