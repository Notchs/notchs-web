"use client";

import { useCallback, useState } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { adminContent } from "../content";

/** Runs one change at a time (no double submits) and keeps its error message. */
export function useAdminAction() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const run = useCallback(
    async (action: () => Promise<unknown>, onDone?: () => void) => {
      if (busy) return false;
      setBusy(true);
      setMessage(null);
      try {
        await action();
        onDone?.();
        return true;
      } catch (error) {
        setMessage(
          error instanceof ApiError && error.status < 500
            ? error.message
            : adminContent.actionFailed,
        );
        return false;
      } finally {
        setBusy(false);
      }
    },
    [busy],
  );
  return { run, busy, message };
}
