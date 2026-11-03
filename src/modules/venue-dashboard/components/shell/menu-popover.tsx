"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { useDismiss } from "../../hooks/use-dismiss";

/** A button with a dropdown that closes on Escape or an outside press. */
export function MenuPopover({
  trigger,
  children,
  className,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLSpanElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(container, open, close);

  return (
    <span ref={container} className="relative flex-none">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <span
          role="menu"
          className={cn(
            "absolute top-[calc(100%+6px)] right-0 z-40 flex w-56 animate-pop flex-col gap-0.5 rounded-xl border border-ink/16 bg-card p-1.5 shadow-[0_16px_40px_-16px_rgb(15_15_20/0.35)]",
            className,
          )}
        >
          {children(close)}
        </span>
      )}
    </span>
  );
}

export const menuItemStyles =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg p-2.5 text-left text-sm hover:bg-ink/5";
