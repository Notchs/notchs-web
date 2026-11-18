"use client";

import { useRef } from "react";

import { CloseIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { flowContent } from "../content";

const copy = flowContent.path;

/** The four joining steps. Steps before `current` show as done. */
function PathSteps({ current }: { current: number }) {
  const last = copy.steps.length - 1;
  return (
    <ol className="flex flex-col">
      {copy.steps.map((step, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li
            key={step.title}
            aria-current={now ? "step" : undefined}
            className="relative flex gap-3.5 pb-4 last:pb-0"
          >
            {i < last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-8 bottom-1 left-[13px] w-0.5 rounded-full",
                  done ? "bg-foreground" : "bg-line",
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "grid size-7 flex-none place-items-center rounded-full border-2 font-mono text-xs font-semibold",
                done && "border-foreground bg-foreground text-background",
                now && "border-foreground",
                !done && !now && "border-line text-muted",
              )}
            >
              {i + 1}
            </span>
            <span className="flex flex-col gap-0.5 pt-0.5">
              <span
                className={cn(
                  "leading-snug font-semibold",
                  !done && !now && "text-muted",
                )}
              >
                {step.title}
                {done && <span className="sr-only"> ({copy.done})</span>}
                {now && <span className="sr-only"> ({copy.current})</span>}
              </span>
              <span className="text-[.9375rem] leading-snug text-muted">
                {step.body}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * How a venue joins Notchs: apply, the team reviews, a set-password link is
 * emailed on approval, then log in.
 */
export function ApplicationPath({ current }: { current: number }) {
  return (
    <section className="w-full rounded-[14px] border border-line bg-card p-5">
      <h3 className="font-semibold">{copy.title}</h3>
      <div className="mt-4">
        <PathSteps current={current} />
      </div>
    </section>
  );
}

/**
 * A "How joining works" link that opens the steps in a native modal dialog:
 * the browser handles the focus trap and Escape.
 */
export function ApplicationPathLink({ current }: { current: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="cursor-pointer py-3 font-semibold text-foreground underline underline-offset-[3px] hover:text-muted"
      >
        {copy.title}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="joining-title"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog itself.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[min(440px,calc(100%-32px))] animate-panel flex-col gap-5 rounded-2xl border-0 bg-card p-6 text-left text-foreground shadow-[0_30px_80px_-20px_rgb(0_0_0/0.5)] backdrop:bg-ink/60 open:flex"
      >
        <div className="flex items-center gap-3">
          <h2
            id="joining-title"
            className="m-0 flex-1 font-display text-xl leading-[1.2] font-extrabold tracking-[-.02em]"
          >
            {copy.title}
          </h2>
          <button
            type="button"
            aria-label={copy.close}
            onClick={close}
            className="grid size-10 flex-none cursor-pointer place-items-center rounded-[10px] hover:bg-foreground/5"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
        <PathSteps current={current} />
      </dialog>
    </>
  );
}
