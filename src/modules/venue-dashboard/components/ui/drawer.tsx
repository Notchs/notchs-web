"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { content } from "../../content";
import { Icon } from "./icon";

/** Slide-in detail panel. The page behind it stays usable, like the artifact. */
export function Drawer({
  title,
  label,
  onClose,
  children,
}: {
  title: ReactNode;
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <aside
      role="dialog"
      aria-label={label}
      className="fixed inset-y-0 right-0 z-30 flex w-full max-w-100 animate-panel flex-col border-l border-ink/16 bg-card shadow-[-30px_0_60px_-30px_rgb(15_15_20/0.35)]"
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <b className="min-w-0 flex-1">{title}</b>
        <button
          ref={closeButton}
          type="button"
          aria-label={content.common.close}
          onClick={onClose}
          className="grid size-10 flex-none cursor-pointer place-items-center rounded-[10px] hover:bg-ink/5"
        >
          <Icon name="x" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {children}
      </div>
    </aside>
  );
}
