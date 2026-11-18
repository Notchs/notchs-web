import { cn } from "@/shared/lib/cn";

import { homeContent } from "../content";
import type { Me } from "../lib/api";

const copy = homeContent.totals;

/** Notchs, places and points, big, on an always-dark panel. */
export function TotalsGrid({
  totals,
  compact = false,
}: {
  totals: Me["totals"];
  compact?: boolean;
}) {
  const items = [
    { label: copy.notchs, value: totals.notches },
    { label: copy.places, value: totals.places },
    { label: copy.points, value: totals.points, accent: true },
  ];
  return (
    <dl className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col-reverse gap-1.5">
          <dt className="text-sm text-paper/75 md:text-[.9375rem]">
            {item.label}
          </dt>
          <dd
            className={cn(
              "font-display leading-none font-extrabold",
              compact
                ? "text-[1.75rem] md:text-[2.25rem]"
                : "text-[2.125rem] md:text-[3.5rem]",
              item.accent && "text-volt",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
