"use client";

import { useCallback, useEffect, useState } from "react";

type LoadState<T> = {
  /** The latest data; kept on screen while a newer copy loads. */
  data: T | undefined;
  error: unknown;
  loading: boolean;
  /** Fetches again, e.g. after a failure. */
  reload: () => void;
  /** Replaces the data with a newer copy, e.g. a PATCH response. */
  setData: (data: T) => void;
};

/** Runs `load` when the component mounts and whenever `key` changes. */
export function useLoad<T>(load: () => Promise<T>, key = ""): LoadState<T> {
  const [round, setRound] = useState(0);
  const request = `${key}|${round}`;
  const [state, setState] = useState<{
    /** The request this result answers. */
    for?: string;
    data?: T;
    error?: unknown;
  }>({});

  useEffect(() => {
    let live = true;
    load().then(
      (data) => live && setState({ for: request, data }),
      (error: unknown) => live && setState({ for: request, error }),
    );
    return () => {
      live = false;
    };
    // `load` is a new function each render; `request` says when to refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const loading = state.for !== request;
  const reload = useCallback(() => setRound((n) => n + 1), []);
  const setData = useCallback(
    (data: T) => setState({ for: request, data }),
    [request],
  );

  return {
    data: state.data,
    error: loading ? undefined : state.error,
    loading,
    reload,
    setData,
  };
}
