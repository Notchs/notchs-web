"use client";

import { useEffect, useState } from "react";

import { profileContent as copy } from "../content";
import { errorMessage, startPhoneChange, type PhoneChange } from "../lib/api";
import { minutesSeconds, phoneNumber } from "../lib/format";
import { useMe } from "./me-context";
import { PillButton, Section } from "./ui";

/** Ticks once a second until `until`, for the countdown. */
function useTimeLeft(until: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!until) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [until]);
  return until ? new Date(until).getTime() - now : 0;
}

/**
 * The customer's WhatsApp number and "Change number": they send a code from
 * the new number. The number is shown only here, on their own profile.
 */
export function PhoneCard() {
  const { me } = useMe();
  const [change, setChange] = useState<PhoneChange | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const left = useTimeLeft(change?.expires_at ?? null);
  const expired = change !== null && left <= 0;

  async function start() {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      setChange(await startPhoneChange());
    } catch (caught) {
      setError(errorMessage(caught, copy.phoneFailed));
    } finally {
      setBusy(false);
    }
  }

  async function copyMessage() {
    if (!change) return;
    try {
      await navigator.clipboard.writeText(change.message);
      setNote(copy.phoneCopied);
    } catch {
      setNote(copy.phoneCopyFailed);
    }
  }

  return (
    <Section title={copy.phoneLabel}>
      {me.phone && (
        <p className="font-display text-xl font-extrabold tracking-[-.01em]">
          {phoneNumber(me.phone)}
        </p>
      )}
      <p className="text-sm text-muted">{copy.phoneNote}</p>

      {!change || expired ? (
        <>
          {expired && (
            <p role="status" className="text-sm font-semibold">
              {copy.phoneExpired}
            </p>
          )}
          <PillButton onClick={start} disabled={busy} className="self-start">
            {busy
              ? copy.phoneStarting
              : expired
                ? copy.phoneAgain
                : copy.phoneStart}
          </PillButton>
        </>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-block p-4">
          <h3 className="font-bold">{copy.phoneTitle}</h3>
          <p className="text-[.9375rem]">{copy.phoneSend}</p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="rounded-xl bg-card px-3 py-2 font-mono text-lg font-bold">
              {change.message}
            </code>
            <PillButton onClick={copyMessage}>{copy.phoneCopy}</PillButton>
          </div>
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
          <p className="text-sm font-semibold" aria-live="off">
            {copy.phoneTimeLeft(minutesSeconds(left))}
          </p>
          <p className="text-sm text-muted">{copy.phoneAfter}</p>
          <PillButton
            onClick={() => window.location.reload()}
            className="self-start"
          >
            {copy.phoneRefresh}
          </PillButton>
        </div>
      )}

      {note && (
        <p role="status" className="text-sm">
          {note}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}
    </Section>
  );
}
