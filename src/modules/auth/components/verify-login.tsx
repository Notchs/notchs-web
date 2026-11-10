"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import {
  GhostMark,
  LockedMark,
  NotchedMark,
} from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";
import { Button, ButtonLink } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api-client";

import { consumeLoginLink } from "../lib/api";
import { WhatsAppLoginButton } from "./whatsapp-login-button";

type VerifyState =
  | { status: "verifying" }
  | { status: "success"; name: string | null }
  | { status: "invalid" }
  | { status: "error" };

/** Reads the token and removes it from the address bar, so it isn't kept in history. */
function takeTokenFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (token !== null) {
    url.searchParams.delete("token");
    window.history.replaceState(window.history.state, "", url);
  }
  return token;
}

/** Trades the token for a session and resolves to the screen to show next. */
function verify(token: string | null): Promise<VerifyState> {
  if (!token) return Promise.resolve({ status: "invalid" });
  return consumeLoginLink(token).then(
    (response) => ({ status: "success", name: response.data?.name ?? null }),
    (error: unknown) => {
      // 400: expired or already used; 422: malformed token. Retrying won't help either.
      const invalid =
        error instanceof ApiError &&
        (error.status === 400 || error.status === 422);
      return { status: invalid ? "invalid" : "error" };
    },
  );
}

/**
 * Logs the customer in with the single-use token from their WhatsApp link.
 * The link works once, so the token is consumed at most once per attempt.
 */
export function VerifyLogin() {
  const [state, setState] = useState<VerifyState>({ status: "verifying" });
  /** Kept across renders: StrictMode runs effects twice, the URL is already clean on the second run. */
  const tokenRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (tokenRef.current !== undefined) return;
    tokenRef.current = takeTokenFromUrl();
    void verify(tokenRef.current).then(setState);
  }, []);

  // A moment to see the "Logged in" stamp, then on to the passport.
  const router = useRouter();
  const success = state.status === "success";
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => router.replace(routes.passport), 1500);
    return () => clearTimeout(timer);
  }, [success, router]);

  function retry() {
    setState({ status: "verifying" });
    void verify(tokenRef.current ?? null).then(setState);
  }

  switch (state.status) {
    case "verifying":
      return (
        <StatusPage
          kicker="Log in"
          title="Checking your link…"
          description="Hold on, this takes a second."
          mark={<GhostMark />}
          action={null}
        />
      );
    case "success":
      return (
        <StatusPage
          kicker="Logged in"
          title={
            state.name
              ? `You’re logged in, ${state.name}!`
              : "You’re logged in!"
          }
          description="Taking you to your passport…"
          mark={<NotchedMark />}
          action={
            <ButtonLink href={routes.passport}>Go to my passport</ButtonLink>
          }
        />
      );
    case "invalid":
      return (
        <StatusPage
          kicker="Log in"
          title="Link expired or already used."
          description="Each link works once. Log in with WhatsApp again for a fresh one."
          mark={<LockedMark />}
          action={<WhatsAppLoginButton />}
        />
      );
    case "error":
      return (
        <StatusPage
          kicker="Error"
          title="Something went wrong."
          description="We couldn’t log you in. Please try again."
          mark={<GhostMark />}
          action={<Button onClick={retry}>Retry</Button>}
        />
      );
  }
}
