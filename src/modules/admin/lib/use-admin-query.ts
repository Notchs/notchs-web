"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Loads data through a stable fetcher (wrap it in useCallback). `refresh`
 * loads it again after a change.
 */
export function useAdminQuery<T>(fetcher: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    fetcher: () => Promise<T>;
    attempt: number;
    data?: T;
    error?: unknown;
  } | null>(null);

  useEffect(() => {
    let current = true;
    fetcher().then(
      (data) => current && setResult({ fetcher, attempt, data }),
      (error: unknown) => current && setResult({ fetcher, attempt, error }),
    );
    return () => {
      current = false;
    };
  }, [fetcher, attempt]);

  const refresh = useCallback(() => setAttempt((count) => count + 1), []);
  const settled =
    result?.fetcher === fetcher && result.attempt === attempt ? result : null;
  return {
    data:
      settled?.data ?? (result?.fetcher === fetcher ? result.data : undefined),
    error: settled?.error,
    isLoading: !settled,
    refresh,
  };
}
