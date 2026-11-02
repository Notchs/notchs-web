"use client";

import { useState, type FormEvent } from "react";

import { routes } from "@/config/routes";
import { Button } from "@/shared/components/ui/button";
import type { TeamLoginResult } from "@/shared/lib/team-access";

import { teamLoginContent as content } from "../content";

type Status = "idle" | "sending" | keyof typeof content.errors;

const fieldStyles =
  "min-h-14 w-full rounded-[10px] border border-line bg-card px-4 text-base text-foreground placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/** The page to return to: `?next=`, kept to paths on this site. */
function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  if (
    !next?.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return routes.teamHub;
  }
  return next.startsWith(routes.teamLogin) ? routes.teamHub : next;
}

export function TeamLoginForm() {
  const [status, setStatus] = useState<Status>("idle");
  const sending = status === "sending";
  const error = status === "idle" || sending ? null : content.errors[status];

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch(routes.teamLoginSession, {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as TeamLoginResult;
      if ("ok" in result) {
        window.location.replace(nextPath());
        return;
      }
      setStatus(result.error);
    } catch {
      setStatus("network");
    }
  }

  return (
    <form onSubmit={signIn} className="grid max-w-sm gap-4" noValidate>
      <label className="grid gap-2 text-sm font-semibold">
        {content.username}
        <input
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          className={fieldStyles}
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        {content.password}
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={fieldStyles}
        />
      </label>
      <p role="alert" className="min-h-5 text-sm text-unnotched">
        {error}
      </p>
      <Button type="submit" disabled={sending}>
        {sending ? content.submitting : content.submit}
      </Button>
    </form>
  );
}
