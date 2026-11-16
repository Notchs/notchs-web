"use client";

import { MapPinIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { cityContent, requestCityHref } from "../content";
import { useCity } from "./city-provider";

/**
 * Shown in place of city content when the chosen city isn't live: says so
 * plainly and offers to ask for Notchs there. Renders nothing for live cities.
 */
export function CityNotice({ className }: { className?: string }) {
  const { city } = useCity();
  if (city.status === "active") return null;

  const copy = cityContent.notice[city.status];

  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-start gap-4 rounded-[20px] border border-line bg-card p-6 sm:p-8",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-block">
        <MapPinIcon className="size-5" />
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-xl tracking-[-.01em] text-balance sm:text-2xl">
          {copy.title(city.name)}
        </h3>
        <p className="max-w-120 leading-relaxed text-muted">{copy.body}</p>
      </div>
      <a
        href={requestCityHref(city.name)}
        className="inline-flex min-h-12 items-center rounded-full border border-foreground px-5 font-semibold transition-colors duration-150 hover:bg-foreground hover:text-background"
      >
        {cityContent.askFor(city.name)}
      </a>
    </div>
  );
}
