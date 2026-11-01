"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { venueRoutes } from "@/config/routes";

import { Button } from "../components/ui/button";
import { Modal } from "../components/ui/modal";
import { content } from "../content";
import { profileErrors, type ProfileField } from "../lib/venue-profile";
import { venueData } from "../services/venue-data.service";
import type { PublicStats, VenueProfile, VenueProfileResponse } from "../types";
import { useToast } from "./use-toast";
import { useVenueQuery } from "./use-venue-query";

const EDITOR_PATHS: readonly string[] = [
  venueRoutes.profile,
  venueRoutes.content,
];

type DraftState = {
  isLoading: boolean;
  error: unknown;
  retry: () => void;
  options: VenueProfileResponse | undefined;
  stats: PublicStats | undefined;
  /** The edited profile, or the saved one when nothing has changed. */
  profile: VenueProfile | undefined;
  errors: Partial<Record<ProfileField, string>>;
  isDirty: boolean;
  needsReview: boolean;
  isPublishing: boolean;
  update: (changes: Partial<VenueProfile>) => void;
  discard: () => void;
  publish: () => Promise<void>;
  /** True when leaving must wait for the unsaved-changes question. */
  holdNavigation: (href: string) => boolean;
};

const DraftContext = createContext<DraftState | null>(null);

/**
 * Venue page edits, shared by Edit venue page and Venue profile so one draft
 * spans both, with a guard against leaving before publishing.
 */
export function VenueDraftProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const toast = useToast();
  const query = useVenueQuery(venueData.getVenueProfile);
  const [savedOverride, setSavedOverride] = useState<VenueProfile | null>(null);
  const [draft, setDraft] = useState<VenueProfile | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [leavingTo, setLeavingTo] = useState<string | null>(null);

  const saved = savedOverride ?? query.data?.profile;
  const profile = draft ?? saved;
  const isDirty =
    draft !== null && JSON.stringify(draft) !== JSON.stringify(saved);
  const needsReview =
    isDirty &&
    (draft.name !== saved?.name || draft.category !== saved?.category);

  const update = useCallback(
    (changes: Partial<VenueProfile>) => {
      if (!saved) return;
      setDraft((current) => ({ ...(current ?? saved), ...changes }));
    },
    [saved],
  );

  const discard = useCallback(() => setDraft(null), []);

  const publish = useCallback(async () => {
    if (!draft || isPublishing) return;
    setIsPublishing(true);
    try {
      await venueData.saveVenueProfile(draft);
      setSavedOverride(draft);
      setDraft(null);
      toast(
        needsReview
          ? content.venuePage.toastReview
          : content.venuePage.toastPublished,
      );
    } catch {
      toast(content.common.actionFailed);
    } finally {
      setIsPublishing(false);
    }
  }, [draft, isPublishing, needsReview, toast]);

  const holdNavigation = useCallback(
    (href: string) => {
      if (!isDirty || EDITOR_PATHS.includes(href)) return false;
      setLeavingTo(href);
      return true;
    },
    [isDirty],
  );

  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const value = useMemo<DraftState>(
    () => ({
      isLoading: query.isLoading,
      error: query.error,
      retry: query.refresh,
      options: query.data,
      stats: query.data?.stats,
      profile,
      errors: profile ? profileErrors(profile) : {},
      isDirty,
      needsReview,
      isPublishing,
      update,
      discard,
      publish,
      holdNavigation,
    }),
    [
      query.isLoading,
      query.error,
      query.refresh,
      query.data,
      profile,
      isDirty,
      needsReview,
      isPublishing,
      update,
      discard,
      publish,
      holdNavigation,
    ],
  );

  return (
    <DraftContext.Provider value={value}>
      {children}
      {leavingTo && (
        <Modal
          title={content.venuePage.leaveTitle}
          icon="alert"
          danger
          onClose={() => setLeavingTo(null)}
          actions={
            <>
              <Button onClick={() => setLeavingTo(null)}>
                {content.venuePage.keepEditing}
              </Button>
              <Button
                variant="dangerSolid"
                onClick={() => {
                  setDraft(null);
                  setLeavingTo(null);
                  router.push(leavingTo);
                }}
              >
                {content.venuePage.discardLeave}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">{content.venuePage.leaveBody}</p>
        </Modal>
      )}
    </DraftContext.Provider>
  );
}

export function useVenueDraft() {
  const context = useContext(DraftContext);
  if (!context) throw new Error("useVenueDraft needs VenueDraftProvider");
  return context;
}
