"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { DateRangeKey } from "../types";

type DateRangeState = {
  range: DateRangeKey;
  setRange: (range: DateRangeKey) => void;
  compare: boolean;
  setCompare: (compare: boolean) => void;
};

const DateRangeContext = createContext<DateRangeState | null>(null);

/** The range stays selected while moving between dashboard pages. */
export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<DateRangeKey>("7d");
  const [compare, setCompare] = useState(true);
  const value = useMemo(
    () => ({ range, setRange, compare, setCompare }),
    [range, compare],
  );
  return (
    <DateRangeContext.Provider value={value}>
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) throw new Error("useDateRange needs DateRangeProvider");
  return context;
}
