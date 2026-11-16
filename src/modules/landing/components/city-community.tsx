"use client";

import { CitySelector, useCity } from "@/modules/city";
import { cn } from "@/shared/lib/cn";

import { communityContent } from "../content";
import { SectionHeading } from "./section-heading";

/**
 * "One platform. Countless local stories.": where Notchs is live, the cities
 * people can ask for, and the picker to ask. Shows only real launch status.
 */
export function CityCommunity() {
  const { cities, city: chosen, setCity } = useCity();
  const live = cities.filter((c) => c.status === "active");
  const later = cities.filter((c) => c.status !== "active");

  const chip = (slug: string, name: string, isLive: boolean) => (
    <li key={slug}>
      <button
        type="button"
        onClick={() => setCity(slug)}
        aria-pressed={chosen.slug === slug}
        className={cn(
          "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 font-medium transition-colors duration-150",
          chosen.slug === slug
            ? "border-foreground bg-foreground text-background"
            : "border-line hover:border-foreground/40",
        )}
      >
        {isLive && (
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full",
              chosen.slug === slug ? "bg-background" : "bg-foreground",
            )}
          />
        )}
        {name}
      </button>
    </li>
  );

  return (
    <div className="grid reveal gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <SectionHeading
        kicker={communityContent.kicker}
        title={communityContent.title}
        description={communityContent.description}
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-[.14em] text-muted uppercase">
            {communityContent.live}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {live.map((c) => chip(c.slug, c.name, true))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold tracking-[.14em] text-muted uppercase">
            {communityContent.next}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {later.map((c) => chip(c.slug, c.name, false))}
          </ul>
        </div>
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-line bg-card p-5 sm:p-6">
          <b className="font-display text-lg font-extrabold tracking-[-.01em]">
            {communityContent.ask}
          </b>
          <p className="leading-relaxed text-muted">
            {communityContent.askBody}
          </p>
          <CitySelector
            align="start"
            className="rounded-full border border-line"
          />
        </div>
      </div>
    </div>
  );
}
