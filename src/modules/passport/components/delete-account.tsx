"use client";

import { useState, type FormEvent } from "react";

import { routes } from "@/config/routes";

import { deleteContent as copy } from "../content";
import { deleteAccount } from "../lib/api";

const CONFIRM_WORD = "DELETE";

/** Deletes the account for good, after the customer types DELETE. */
export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const confirmed = typed.trim() === CONFIRM_WORD;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!confirmed || busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await deleteAccount();
      window.location.assign(routes.home);
    } catch {
      setFailed(true);
      setBusy(false);
    }
  }

  if (!open)
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer self-center text-sm font-semibold text-muted underline"
      >
        {copy.open}
      </button>
    );

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-[20px] border border-[#ff5b35] bg-card p-4 md:p-6"
    >
      <h2 className="font-display text-lg font-extrabold">{copy.title}</h2>
      <ul className="list-disc space-y-1 pl-5 text-[.9375rem] text-muted">
        {copy.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <label
        htmlFor="delete-confirm"
        className="text-[.8125rem] font-semibold text-muted"
      >
        {copy.typeLabel(CONFIRM_WORD)}
      </label>
      <input
        id="delete-confirm"
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        className="min-h-12 rounded-xl border border-line bg-background px-3 text-[.9375rem] text-foreground"
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!confirmed || busy}
          className="min-h-12 cursor-pointer rounded-full bg-[#c2410c] px-6 font-bold text-white disabled:cursor-default disabled:opacity-50"
        >
          {busy ? copy.deleting : copy.confirm}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTyped("");
          }}
          className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-foreground px-6 font-bold"
        >
          {copy.cancel}
        </button>
      </div>
      {failed && (
        <p role="alert" className="text-sm font-semibold">
          {copy.failed}
        </p>
      )}
    </form>
  );
}
