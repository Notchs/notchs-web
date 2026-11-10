"use client";

import { useState, type FormEvent } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { profileContent as copy } from "../content";
import { addInviter, getReferral } from "../lib/api";
import { useLoad } from "../lib/use-load";

const fieldStyles =
  "min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-background px-3 text-[.9375rem] text-foreground";

/** My invite code and Star Points, and who invited me (once, early on). */
export function InviteCard() {
  const { data: referral, setData } = useLoad(getReferral, "referral");
  const [note, setNote] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  if (!referral) return null;

  async function copyLink() {
    if (!referral) return;
    try {
      await navigator.clipboard.writeText(referral.link);
      setNote(copy.inviteCopied);
    } catch {
      setNote(copy.inviteCopyFailed);
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy || !code.trim()) return;
    setBusy(true);
    try {
      setData(await addInviter(code.trim()));
      setNote(copy.inviterSaved);
    } catch (error) {
      setNote(
        error instanceof ApiError && error.status < 500
          ? error.message
          : copy.inviterFailed,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-card p-4 md:p-6">
      <h2 className="font-display text-lg font-extrabold">
        {copy.inviteTitle}
      </h2>
      <p className="text-[.9375rem] text-muted">{copy.inviteBody}</p>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[.8125rem] font-semibold text-muted">
          {copy.inviteCode}
        </span>
        <b className="font-mono text-lg">{referral.code}</b>
      </p>
      <p className="text-sm">
        <b>{copy.starPoints(referral.star_points)}</b>
        <span className="text-muted">
          {" · "}
          {copy.invited(referral.invited, referral.rewarded)}
        </span>
      </p>
      <button
        type="button"
        onClick={copyLink}
        className="min-h-12 cursor-pointer self-start rounded-full border-[1.5px] border-foreground px-6 font-bold"
      >
        {copy.inviteCopy}
      </button>
      {referral.invited_by ? (
        <p className="text-sm text-muted">
          {copy.invitedBy(referral.invited_by)}
        </p>
      ) : (
        referral.can_add_inviter && (
          <form onSubmit={save} className="flex flex-col gap-1.5">
            <label
              htmlFor="inviter-code"
              className="text-[.8125rem] font-semibold text-muted"
            >
              {copy.inviterLabel}
            </label>
            <div className="flex gap-2">
              <input
                id="inviter-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoCapitalize="none"
                spellCheck={false}
                maxLength={31}
                className={fieldStyles}
              />
              <button
                type="submit"
                disabled={busy || !code.trim()}
                className="min-h-12 cursor-pointer rounded-full bg-foreground px-5 font-bold text-background disabled:cursor-default disabled:opacity-60"
              >
                {copy.inviterSave}
              </button>
            </div>
          </form>
        )
      )}
      {note && (
        <p role="status" className="text-sm">
          {note}
        </p>
      )}
    </section>
  );
}
