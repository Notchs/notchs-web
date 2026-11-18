import type { ComponentType, SVGProps } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  BadgeIcon,
  CardIcon,
  ChartIcon,
  StarIcon,
  TrophyIcon,
} from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { collectContent } from "../content";
import { SectionHeading } from "./section-heading";
import { staggerDelay, staggerItem } from "../lib/stagger";
import { StaggerReveal } from "./stagger-reveal";

type Item = (typeof collectContent.items)[number];

const icons: Record<Item["kind"], ComponentType<SVGProps<SVGSVGElement>>> = {
  count: ChartIcon,
  rank: TrophyIcon,
  badges: BadgeIcon,
  card: CardIcon,
};

/** Bar heights for the sample month-by-month chart. */
const bars = [32, 48, 40, 62, 56, 84];

function ExampleTag() {
  return (
    <span className="absolute top-2.5 right-2.5 rounded-full bg-foreground/8 px-2 py-0.5 text-[.6875rem] font-medium text-muted">
      {collectContent.example}
    </span>
  );
}

/** A small picture of each reward. Decorative: the text says it all. */
function Visual({ item }: { item: Item }) {
  switch (item.kind) {
    case "count":
      return (
        <>
          <ExampleTag />
          <div className="flex h-full items-end gap-1.5 px-4 pt-8 pb-3">
            {bars.map((height, i) => (
              <span
                key={height}
                style={{ height: `${height}%` }}
                className={cn(
                  "flex-1 rounded-t-md",
                  i === bars.length - 1 ? "bg-foreground" : "bg-foreground/15",
                )}
              />
            ))}
          </div>
        </>
      );
    case "rank":
      return (
        <>
          <ExampleTag />
          {/* A podium: 2nd, 1st, 3rd, with "You" climbing to the top. */}
          <div className="flex h-full items-end justify-center gap-1.5 px-6 pt-6">
            {item.podium.map((place) => (
              <div
                key={place}
                className="flex w-12 flex-col items-center gap-1.5"
              >
                {place === 1 && (
                  <StarIcon className="size-7 fill-volt stroke-ink" />
                )}
                <span
                  className={cn(
                    "grid w-full place-items-start justify-center rounded-t-lg pt-1.5 font-display text-sm font-extrabold",
                    place === 1
                      ? "h-14 bg-foreground text-background"
                      : "bg-foreground/15 text-muted",
                    place === 2 && "h-10",
                    place === 3 && "h-7",
                  )}
                >
                  {place}
                </span>
              </div>
            ))}
          </div>
        </>
      );
    case "badges":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5">
          {item.badges.map((badge, i) => (
            <span
              key={badge}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-ink px-3 py-1 text-xs font-semibold text-paper",
                i === 1 && "translate-x-4 -rotate-2",
                i === 2 && "-translate-x-3 rotate-1",
              )}
            >
              <VerifiedIcon className="size-3 text-volt" />
              {badge}
            </span>
          ))}
        </div>
      );
    case "card":
      return (
        <>
          <ExampleTag />
          <div className="relative flex h-full items-center justify-center">
            <span className="absolute h-[5.5rem] w-[3.1rem] translate-x-5 rotate-8 rounded-lg bg-foreground/15" />
            <span className="relative flex h-[5.5rem] w-[3.1rem] -rotate-4 flex-col justify-between rounded-lg border border-white/10 bg-ink p-1.5 text-paper">
              <NotchGlyph className="size-3.5 text-volt" />
              <span className="flex flex-col gap-1">
                <span className="h-1 w-full rounded-full bg-paper/40" />
                <span className="h-1 w-2/3 rounded-full bg-paper/25" />
              </span>
            </span>
          </div>
        </>
      );
  }
}

export function Collect() {
  return (
    <div>
      <SectionHeading
        kicker={collectContent.kicker}
        title={collectContent.title}
        description={collectContent.description}
        className="reveal"
      />
      {/* Four pieces of one glass: close neighbours melt together. The
          whole group fades in, so the glass and the text arrive together. */}
      <GlassGroup self={false} className="mt-10">
        <StaggerReveal>
          <div role="list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {collectContent.items.map((item, index) => {
              const Icon = icons[item.kind];
              return (
                <GlassShape
                  key={item.title}
                  role="listitem"
                  radius={16}
                  className={cn("flex flex-col p-4", staggerItem)}
                  style={staggerDelay(index)}
                >
                  <div
                    aria-hidden="true"
                    className="relative h-28 overflow-hidden rounded-xl border border-line bg-foreground/[.03]"
                  >
                    <Visual item={item} />
                  </div>
                  <div className="mt-4 flex items-center gap-2.5 px-1">
                    <span className="grid size-8 flex-none place-items-center rounded-lg bg-foreground text-background">
                      <Icon className="size-4.5" />
                    </span>
                    <h3 className="font-display text-lg font-extrabold tracking-[-.02em]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mt-2 px-1 text-base leading-relaxed text-muted">
                    {item.body}
                  </p>
                  <p className="mt-auto flex items-center gap-2 px-1 pt-3 text-[.9375rem] font-semibold">
                    <VerifiedIcon className="size-3.5 flex-none" />
                    {item.why}
                  </p>
                </GlassShape>
              );
            })}
          </div>
        </StaggerReveal>
      </GlassGroup>
    </div>
  );
}
