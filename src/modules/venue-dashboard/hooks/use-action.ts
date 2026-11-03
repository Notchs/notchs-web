"use client";

import { useCallback, useRef, useState } from "react";

import { content } from "../content";
import { useToast } from "./use-toast";

/**
 * Runs a write once at a time, so a double click can't send it twice, and
 * reports the result as a toast. Resolves to true on success.
 */
export function useAction() {
  const toast = useToast();
  const running = useRef(false);
  const [isBusy, setIsBusy] = useState(false);

  const run = useCallback(
    async (action: () => Promise<unknown>, success?: string) => {
      if (running.current) return false;
      running.current = true;
      setIsBusy(true);
      try {
        await action();
        if (success) toast(success);
        return true;
      } catch {
        toast(content.common.actionFailed);
        return false;
      } finally {
        running.current = false;
        setIsBusy(false);
      }
    },
    [toast],
  );

  return { run, isBusy };
}
