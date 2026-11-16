"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { AuthBrandPanel, AuthLayout } from "@/shared/components/auth";

import { brandContent, type VenueAuthMode } from "../content";

const ModeContext = createContext<{
  mode: VenueAuthMode;
  setMode: Dispatch<SetStateAction<VenueAuthMode>>;
}>({ mode: "login", setMode: () => {} });

/** Lets the flow tell the brand panel whether the owner is logging in or applying. */
export const useVenueAuthMode = () => useContext(ModeContext);

function VenueBrandPanel() {
  const { mode } = useVenueAuthMode();
  return <AuthBrandPanel {...brandContent[mode]} />;
}

/** Venue auth layout: the shared auth layout with the venue's brand panel. */
export function VenueAuthShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<VenueAuthMode>("login");

  return (
    <ModeContext value={{ mode, setMode }}>
      <AuthLayout
        brand={<VenueBrandPanel />}
        helpSubject={brandContent.helpSubject}
      >
        {children}
      </AuthLayout>
    </ModeContext>
  );
}
