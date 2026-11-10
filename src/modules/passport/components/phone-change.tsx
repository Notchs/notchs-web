"use client";

import { useState } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { profileContent as copy } from "../content";
import { startPhoneChange, type PhoneChange } from "../lib/api";

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

/** Moves the account to a new number: the customer sends a code from it. */
export function PhoneChangeCard() {
  const [change, setChange] = useState<PhoneChange | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      setChange(await startPhoneChange());
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 429
          ? copy.phoneTooMany
          : copy.phoneFailed,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-card p-4 md:p-6">
      <h2 className="font-display text-lg font-extrabold">{copy.phoneTitle}</h2>
      <p className="text-[.9375rem] text-muted">{copy.phoneBody}</p>
      {change ? (
        <div className="flex flex-col gap-3" role="status">
          <p className="font-semibold">{copy.phoneSend(change.message)}</p>
          {change.whatsapp_link ? (
            <a
              href={change.whatsapp_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center self-start rounded-full bg-foreground px-6 font-bold text-background"
            >
              {copy.phoneOpen}
            </a>
          ) : (
            <p className="text-sm text-muted">{copy.phoneNoLink}</p>
          )}
          <p className="text-sm text-muted">
            {copy.phoneExpires(timeOf(change.expires_at))}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={busy}
          className="min-h-12 cursor-pointer self-start rounded-full border-[1.5px] border-foreground px-6 font-bold disabled:cursor-default disabled:opacity-60"
        >
          {busy ? copy.phoneStarting : copy.phoneStart}
        </button>
      )}
      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}
    </section>
  );
}
