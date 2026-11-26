"use client";

import { useEffect, useRef, useState } from "react";

import { BellIcon } from "@/shared/components/icons";

import { shellContent } from "../content";

const { notifications } = shellContent;

/**
 * The bell in the header. There is no notifications API yet, so the panel
 * only shows the empty state: never sample items dressed up as real.
 */
export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
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
        aria-label={notifications.label}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-grid size-11 cursor-pointer place-items-center rounded-full"
      >
        <BellIcon className="size-5" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label={notifications.label}
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-[min(18rem,calc(100vw_-_2_*_var(--gutter)))] animate-pop rounded-2xl border border-line bg-card p-4 shadow-[0_12px_32px_rgb(15_15_20/.18)]"
        >
          <p className="text-[.8125rem] font-semibold tracking-[.08em] text-muted uppercase">
            {notifications.label}
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 py-4 text-center">
            <span className="grid size-11 place-items-center rounded-full bg-glass-tint">
              <BellIcon className="size-5" />
            </span>
            <p className="font-semibold">{notifications.empty}</p>
            <p className="text-[.9375rem] leading-relaxed text-muted">
              {notifications.emptyBody}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
