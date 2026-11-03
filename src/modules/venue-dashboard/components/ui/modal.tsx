"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { content } from "../../content";
import { Icon, type IconName } from "./icon";

/**
 * A native modal dialog: the browser handles the focus trap, Escape and
 * stacking. Render it to open it; stop rendering it to close.
 */
export function Modal({
  title,
  icon,
  danger,
  closable,
  onClose,
  actions,
  children,
}: {
  title: string;
  icon?: IconName;
  danger?: boolean;
  closable?: boolean;
  onClose: () => void;
  actions: ReactNode;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[min(460px,calc(100%-32px))] animate-pop flex-col gap-4 overflow-y-auto rounded-2xl border-0 bg-card p-6 text-foreground shadow-[0_30px_80px_-20px_rgb(0_0_0/0.5)] backdrop:bg-ink/60 open:flex"
    >
      {icon && (
        <span className={danger ? "text-unnotched" : "text-ink"}>
          <Icon name={icon} size={28} />
        </span>
      )}
      <div className="flex items-center gap-3">
        <h2 className="m-0 min-w-0 flex-1 font-display text-xl leading-[1.2] tracking-[-.02em]">
          {title}
        </h2>
        {closable && (
          <button
            type="button"
            aria-label={content.common.close}
            onClick={onClose}
            className="grid size-10 flex-none cursor-pointer place-items-center rounded-[10px] hover:bg-ink/5"
          >
            <Icon name="x" />
          </button>
        )}
      </div>
      {children}
      <div className="flex flex-wrap justify-end gap-3">{actions}</div>
    </dialog>
  );
}
