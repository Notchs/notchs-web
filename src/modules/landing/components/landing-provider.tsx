"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { type VenueKind } from "../content";
import { AccessDialog } from "./access-dialog";

type LandingState = {
  /** The place the hero and the WhatsApp demo are showing. */
  venue: VenueKind;
  selectVenue: (venue: VenueKind) => void;
  openAccess: () => void;
};

const LandingContext = createContext<LandingState | null>(null);

export function useLanding() {
  const state = use(LandingContext);
  if (!state) throw new Error("useLanding must be used inside LandingProvider");
  return state;
}

/** Shares the chosen venue and the access dialog across the landing page. */
export function LandingProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [venue, setVenue] = useState<VenueKind>("cafe");
  // Bumped on every open so the QR animation plays again from the start.
  const [openCount, setOpenCount] = useState(0);
  const [open, setOpen] = useState(false);

  const openAccess = useCallback(() => {
    setOpenCount((count) => count + 1);
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const state = useMemo(
    () => ({ venue, selectVenue: setVenue, openAccess }),
    [venue, openAccess],
  );

  return (
    <LandingContext value={state}>
      {children}
      <AccessDialog
        ref={dialogRef}
        open={open}
        openCount={openCount}
        onClose={() => setOpen(false)}
      />
    </LandingContext>
  );
}
