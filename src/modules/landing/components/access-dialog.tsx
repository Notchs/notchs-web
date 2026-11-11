"use client";

import Link from "next/link";
import type { MouseEvent, Ref } from "react";

import { routes } from "@/config/routes";
import { GlassGroup } from "@/shared/components/glass/glass-group";
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
 * The access card, on CSS glass over the page. The code is drawn in the
 * theme's colours on a plate that keeps it scannable. Native <dialog> gives
 * focus trapping and Esc to close.
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
      className={`${jetbrainsMono.variable} m-auto w-[calc(100%_-_2rem)] max-w-[26rem] overflow-visible border-0 bg-transparent p-0 text-foreground outline-none backdrop:bg-ink/30`}
    >
      {open && (
        <div className="animate-rise overflow-hidden rounded-[28px] bg-(--glass-fill) shadow-[0_0_0_1px_rgb(255_255_255/.14),0_2px_6px_rgb(0_0_0/.25),0_40px_90px_-30px_rgb(0_0_0/.75)] backdrop-blur-2xl backdrop-saturate-150 [@media(prefers-reduced-transparency:reduce)]:bg-(--glass-solid)">
          <div className="grid max-h-[calc(100dvh_-_2rem)] justify-items-center gap-6 overflow-y-auto px-6 pt-6 pb-7 text-center sm:px-8">
            <div className="flex w-full items-start justify-between gap-4 text-left">
              <div>
                <h2
                  id="access-title"
                  className="font-display text-2xl leading-tight font-extrabold tracking-[-.02em]"
                >
                  {accessDialogContent.title}
                </h2>
                <p className="mt-2 text-base leading-snug text-foreground/75">
                  {accessDialogContent.description}
                </p>
              </div>
              <button
                type="button"
                aria-label={accessDialogContent.close}
                onClick={(event) =>
                  event.currentTarget.closest("dialog")?.close()
                }
                className="-mt-1 -mr-2 grid size-12 flex-none cursor-pointer place-items-center rounded-full text-foreground/70 transition-colors duration-150 hover:bg-glass-tint hover:text-foreground"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            {/* On a plate of the theme's background, so it always scans. */}
            <AccessQr key={openCount} />

            <p className="font-mono text-[.8125rem] tracking-wide text-foreground/60">
              {accessDialogContent.note}
            </p>

            <GlassGroup radius={12} className="w-full rounded-xl">
              <Link
                href={routes.login}
                className="inline-flex min-h-12 w-full items-center justify-center px-5 font-semibold"
              >
                {accessDialogContent.start}
              </Link>
            </GlassGroup>
          </div>
        </div>
      )}
    </dialog>
  );
}
