"use client";

import { useId, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { visibilityContent as copy } from "../content";
import { setNameShown } from "../lib/api";
import { useMe } from "./me-context";

/** "Show my name on the leaderboard". Private by default; the rank stays either way. */
export function VisibilitySwitch({ className }: { className?: string }) {
  const { me, setMe } = useMe();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const titleId = useId();
  const shown = me.is_public;

  async function toggle() {
    setBusy(true);
    setFailed(false);
    try {
      const standing = await setNameShown(!shown);
      setMe({ ...me, is_public: standing.is_public });
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "flex items-center justify-between gap-4 rounded-3xl border border-line bg-card p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 id={titleId} className="text-[.9375rem] font-bold">
          {copy.title}
        </h2>
        <p className="text-sm text-muted" role="status">
          {failed ? copy.failed : shown ? copy.on : copy.off}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={shown}
        aria-labelledby={titleId}
        onClick={toggle}
        disabled={busy}
        className={cn(
          "flex h-8 w-14 flex-none cursor-pointer rounded-full p-1 transition-colors disabled:cursor-default disabled:opacity-60",
          shown ? "justify-end bg-foreground" : "justify-start bg-muted/40",
        )}
      >
        <span
          className={cn(
            "size-6 rounded-full",
            shown ? "bg-volt" : "bg-background",
          )}
        />
      </button>
    </section>
  );
}
