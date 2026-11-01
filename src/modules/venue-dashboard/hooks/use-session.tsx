"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { routes } from "@/config/routes";
import { ApiError } from "@/shared/lib/api-client";

import { venueData } from "../services/venue-data.service";
import type { SessionResponse } from "../types";
import { useVenueQuery } from "./use-venue-query";

type SessionState = {
  data: SessionResponse | undefined;
  refresh: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, error, refresh } = useVenueQuery(venueData.getSession);

  // With the real API, a logged-out visitor goes back to the login page.
  useEffect(() => {
    if (error instanceof ApiError && error.status === 401) {
      router.replace(routes.venueLogin);
    }
  }, [error, router]);

  const value = useMemo(() => ({ data, refresh }), [data, refresh]);
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession needs SessionProvider");
  return context;
}
