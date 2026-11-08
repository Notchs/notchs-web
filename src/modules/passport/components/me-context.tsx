"use client";

import { createContext, useContext } from "react";

import type { Me } from "../lib/api";

type MeContextValue = {
  me: Me;
  /** Replaces the profile, e.g. with a PATCH response. */
  setMe: (me: Me) => void;
};

export const MeContext = createContext<MeContextValue | null>(null);

/** The logged-in customer; only inside the passport shell. */
export function useMe() {
  const context = useContext(MeContext);
  if (!context) throw new Error("useMe needs the passport shell");
  return context;
}
