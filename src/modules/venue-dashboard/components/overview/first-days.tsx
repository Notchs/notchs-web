"use client";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import { useSession } from "../../hooks/use-session";
import { formatTime } from "../../lib/format";
import type { OverviewResponse } from "../../types";
import { ButtonLink } from "../ui/button";
import { Card, InkCard, Overline, PanelTitle, SideGrid } from "../ui/card";
import { Icon } from "../ui/icon";

const copy = content.overview.firstDays;

/** Replaces the charts until the venue has enough visits to mean something. */
export function FirstDays({ data }: { data: OverviewResponse }) {
  const venueName = useSession().data?.session.venueName ?? "";
  const { verifiedVisits, target, steps } = data.firstDays;
  return (
    <SideGrid>
      <Card className="gap-5 p-7">
        <Overline>{copy.overline(venueName)}</Overline>
        <PanelTitle className="text-[28px] leading-[1.1]">
          {copy.title}
        </PanelTitle>
        <p className="m-0 text-muted">{copy.body}</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: target }, (_, index) => (
              <i
                key={index}
                className={cn(
                  "block h-9 w-2.5 rounded-[3px] bg-ink/16",
                  index < verifiedVisits && "bg-ink",
                )}
              />
            ))}
          </div>
          <span className="font-display text-[28px]">
            {verifiedVisits}{" "}
            <span className="font-sans text-base font-medium tracking-normal text-muted">
              {copy.of(target)}
            </span>
          </span>
        </div>
        <div className="flex flex-col divide-y divide-line border-t border-line">
          {steps.map((step) => {
            const info = copy.steps[step.key];
            return (
              <div
                key={step.key}
                className="flex min-h-14 items-center gap-3.5 py-2"
              >
                <span
                  className={cn(
                    "grid size-7 flex-none place-items-center rounded-lg",
                    step.done
                      ? "bg-ink text-paper"
                      : "text-transparent shadow-[inset_0_0_0_1.5px_rgb(15_15_20/0.16)]",
                  )}
                >
                  <Icon name="check" size={16} />
                </span>
                <span
                  className={cn(
                    "min-w-0 flex-1 text-[15px]",
                    step.done ? "text-muted" : "font-semibold",
                  )}
                >
                  {info.label}
                </span>
                {!step.done && info.cta && info.href && (
                  <ButtonLink size="sm" href={info.href}>
                    {info.cta}
                  </ButtonLink>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        <InkCard>
          <Overline className="text-stone-light">
            {copy.counterQuestion}
          </Overline>
          <span className="flex items-center gap-2 font-semibold">
            <span className="size-2 rounded-full bg-volt" />
            {copy.counterOn}
          </span>
          <span className="text-sm text-stone-light">
            {copy.lastHeartbeat(formatTime(data.counter.lastHeartbeat))}
          </span>
        </InkCard>
        <Card className="gap-2">
          <b>{copy.staffTitle}</b>
          <span className="font-display text-lg leading-[1.3]">
            {copy.staffLine}
          </span>
        </Card>
      </div>
    </SideGrid>
  );
}
