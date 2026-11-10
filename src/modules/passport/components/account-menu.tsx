"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";

import { shellContent } from "../content";
import { logOut } from "../lib/api";
import { firstName, initials } from "../lib/format";

/** The initials button with Profile and Log out. */
export function AccountMenu({ name }: { name: string | null }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // A click anywhere else closes it.
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  async function leave() {
    setBusy(true);
    // The cookies may already be gone; either way the session is over here.
    await logOut().catch(() => {});
    window.location.assign(routes.login);
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-label={shellContent.accountMenu}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-foreground pr-1.5 pl-1.5 text-sm font-semibold text-background md:pr-4"
      >
        <span className="grid size-8 place-items-center rounded-full bg-volt text-[.8125rem] font-bold text-ink">
          {initials(name)}
        </span>
        <span className="hidden md:inline">{firstName(name)}</span>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 z-50 flex w-56 animate-pop flex-col rounded-2xl border border-line bg-card p-2 shadow-[0_12px_32px_rgb(15_15_20/.18)]">
          {name && (
            <span className="px-3 pt-2.5 pb-2 text-[.8125rem] text-muted">
              {name}
            </span>
          )}
          <Link
            href={routes.passportProfile}
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center rounded-xl px-3 font-semibold hover:bg-glass-tint"
          >
            {shellContent.nav.profile}
          </Link>
          <button
            type="button"
            onClick={leave}
            disabled={busy}
            className="flex min-h-11 cursor-pointer items-center rounded-xl px-3 text-left font-semibold text-unnotched hover:bg-glass-tint disabled:cursor-default"
          >
            {busy ? shellContent.loggingOut : shellContent.logOut}
          </button>
        </div>
      )}
    </div>
  );
}
