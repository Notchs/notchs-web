import Link from "next/link";

import { ArrowRightIcon } from "@/shared/components/icons";
import { ButtonLink } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import {
  applyHref,
  dashboardSample,
  heroContent,
  howItWorksId,
} from "../content";

/** The pitch beside a sample dashboard (labelled Example). No fade-in: it is the LCP. */
export function VenuesHero() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-gutter pt-6 pb-12 sm:pt-8 sm:pb-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-14">
      <div className="max-sm:text-center">
        <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
          {heroContent.kicker}
        </p>
        <h1 className="font-display text-[clamp(2.5rem,1.2rem+4.6vw,4.75rem)] leading-[1.06] font-extrabold tracking-[-.02em] text-balance">
          {heroContent.title}
        </h1>
        <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-muted max-sm:mx-auto sm:text-xl">
          {heroContent.description}
        </p>
        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
          <ButtonLink href={applyHref}>
            {heroContent.cta}
            <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </ButtonLink>
          <Link
            href={`#${howItWorksId}`}
            className="inline-flex min-h-12 items-center justify-center font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-current"
          >
            {heroContent.secondary}
          </Link>
        </div>
      </div>

      <div {...INK_GROUND} className="rounded-3xl bg-ink p-5 text-paper sm:p-7">
        <div className="flex items-center justify-between gap-4 text-sm text-stone-light">
          <span>{dashboardSample.heading}</span>
          <span className="rounded-full border border-current px-2.5 py-0.5 text-xs font-semibold">
            {dashboardSample.label}
          </span>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-3">
          {dashboardSample.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-graphite p-4 sm:p-5"
            >
              <dt className="text-xs text-stone-light">{stat.label}</dt>
              <dd
                className={cn(
                  "mt-1.5 font-display text-2xl font-extrabold sm:text-4xl",
                  "highlight" in stat && stat.highlight && "text-volt",
                )}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-stone-light">{dashboardSample.note}</p>
      </div>
    </section>
  );
}
