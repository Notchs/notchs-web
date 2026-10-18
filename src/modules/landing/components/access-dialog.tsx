"use client";

import type { MouseEvent, Ref } from "react";

import { siteConfig } from "@/config/site";
import { CloseIcon } from "@/shared/components/icons";

import { accessDialogContent } from "../content";
import { jetbrainsMono } from "../fonts";
import { AccessQr } from "./access-qr";

type AccessDialogProps = {
  ref: Ref<HTMLDialogElement>;
  open: boolean;
  openCount: number;
  onClose: () => void;
};

/** Closes the dialog when the dimmed area around it is clicked. */
function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}

/**
 * Always Ink, like the counter screen: a Paper panel behind the code so it
 * reads dark-on-light. Native <dialog> gives focus trapping and Esc to close.
 */
export function AccessDialog({
  ref,
  open,
  openCount,
  onClose,
}: AccessDialogProps) {
  return (
    <dialog
      ref={ref}
      aria-labelledby="access-title"
      onClose={onClose}
      onClick={closeOnBackdrop}
      className={`${jetbrainsMono.variable} m-auto max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-[26rem] overflow-y-auto rounded-3xl border border-white/10 bg-ink p-0 text-paper shadow-2xl backdrop:bg-ink/72`}
    >
      {open && (
        <div className="grid animate-rise justify-items-center gap-6 px-6 pt-6 pb-7 text-center sm:px-8">
          <div className="flex w-full items-start justify-between gap-4 text-left">
            <div>
              <h2
                id="access-title"
                className="font-display text-2xl leading-tight font-extrabold tracking-[-.02em]"
              >
                {accessDialogContent.title}
              </h2>
              <p className="mt-2 text-base leading-snug text-stone">
                {accessDialogContent.description}
              </p>
            </div>
            <button
              type="button"
              aria-label={accessDialogContent.close}
              onClick={(event) =>
                event.currentTarget.closest("dialog")?.close()
              }
              className="-mt-1 -mr-2 grid size-12 flex-none cursor-pointer place-items-center rounded-full text-stone transition-colors duration-150 hover:bg-white/8 hover:text-paper"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <AccessQr key={openCount} />

          <p className="font-mono text-[.8125rem] tracking-wide text-stone">
            {accessDialogContent.note}
          </p>

          <a
            href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Notchs access")}`}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-graphite px-5 font-semibold transition-colors duration-150 hover:bg-white/14"
          >
            {accessDialogContent.notify}
          </a>
        </div>
      )}
    </dialog>
  );
}
