import { cn } from "@/shared/lib/cn";

import { flowContent } from "../content";

const copy = flowContent.path;

/**
 * How a venue joins Notchs: apply, the team reviews, a set-password link is
 * emailed on approval, then log in. Steps before `current` show as done.
 */
export function ApplicationPath({ current }: { current: number }) {
  const last = copy.steps.length - 1;
  return (
    <section className="w-full rounded-[14px] border border-line bg-card p-5">
      <h3 className="font-semibold">{copy.title}</h3>
      <ol className="mt-4 flex flex-col">
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
    </section>
  );
}
