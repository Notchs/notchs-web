"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { displayContent } from "../content";
import { pairDisplay } from "../lib/api";
import { DisplayMessage } from "./display-message";

const copy = displayContent.pair;

/**
 * Opened from the owner's pairing link (/display/pair?token=…). Uses the token
 * once, which gives this phone its device cookie, then shows the counter
 * screen. The token is dropped from the address bar straight away.
 */
export function PairDisplay({ screenHref }: { screenHref: string }) {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [state, setState] = useState<"pairing" | "failed">("pairing");
  const started = useRef(false);

  const pair = useCallback(async () => {
    if (!token) return;
    setState("pairing");
    try {
      await pairDisplay(token);
      router.replace(screenHref);
    } catch {
      setState("failed");
    }
  }, [router, screenHref, token]);

  useEffect(() => {
    // Strict mode runs effects twice; a token works only once.
    if (started.current) return;
    started.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    void pair();
  }, [pair]);

  if (!token) return <DisplayMessage title={copy.noToken} />;
  if (state === "pairing") return <DisplayMessage title={copy.pairing} />;
  return <DisplayMessage title={copy.failedTitle} body={copy.failedBody} />;
}
