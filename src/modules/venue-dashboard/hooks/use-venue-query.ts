"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

import { getDataVersion, subscribeDataVersion } from "../services/data-version";

type QueryResult<T> = {
  fetcher: () => Promise<T>;
  version: number;
  attempt: number;
  data?: T;
  error?: unknown;
};

/**
 * Loads data through a stable fetcher (wrap it in useCallback). A new fetcher
 * shows loading again; `refresh` updates quietly behind what's on screen.
 */
export function useVenueQuery<T>(fetcher: () => Promise<T>) {
  const version = useSyncExternalStore(
    subscribeDataVersion,
    getDataVersion,
    getDataVersion,
  );
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<QueryResult<T> | null>(null);

  useEffect(() => {
    let current = true;
    fetcher().then(
      (data) => {
        if (current) setResult({ fetcher, version, attempt, data });
      },
      (error: unknown) => {
        if (current) setResult({ fetcher, version, attempt, error });
      },
    );
    return () => {
      current = false;
    };
  }, [fetcher, version, attempt]);

  const refresh = useCallback(() => setAttempt((count) => count + 1), []);

  const isCurrent = result?.fetcher === fetcher && result.version === version;
  const retrying =
    isCurrent && result.error != null && result.attempt !== attempt;
  const settled = isCurrent && !retrying ? result : null;

  return {
    data: settled?.data,
    error: settled?.error,
    isLoading: !settled,
    refresh,
  };
}
