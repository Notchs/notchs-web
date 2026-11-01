import type { CSSProperties, ReactNode } from "react";

import { routes } from "@/config/routes";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import { ButtonLink } from "@/shared/components/ui/button";
import { ArrowRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import {
  accessLabel,
  compareContent,
  foundingContent,
  heroContent,
  sectionIds,
} from "../content";
import "../venues.css";
import { Founding } from "./founding";
import { HowItWorks } from "./how-it-works";
import { HeartIcon } from "./icons";
import { LiveQr } from "./live-qr";
import { Phone } from "./phone";
import { VenuesHeader } from "./venues-header";
import { YourWeek } from "./your-week";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Page-width section; `scroll-mt` keeps headings clear of the floating header. */
function Section({ id, className, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-[1440px] scroll-mt-24 px-gutter py-12 sm:py-20",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** The heading and lead show at once: no fade stands in front of them. */
function Hero() {
  return (
    <section className="mx-auto grid max-w-[1440px] items-center gap-12 overflow-x-clip px-gutter pt-8 pb-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:pt-14 lg:pb-20">
      <div>
        <p className="mb-6 flex items-center gap-3.5 text-xs font-semibold tracking-[.14em] text-muted uppercase before:h-px before:w-8 before:bg-current">
          {heroContent.kicker}
        </p>
        <h1 className="font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[.96] font-extrabold tracking-[-.035em] text-balance">
          {heroContent.title}
        </h1>
        <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted sm:text-xl">
          <strong className="font-semibold text-foreground">
            {heroContent.question}
          </strong>{" "}
          {heroContent.description}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href={routes.venueLogin} className="w-full sm:w-auto">
            {accessLabel}
            <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </ButtonLink>
          <a
            href={`#${sectionIds.howItWorks}`}
            className="inline-flex min-h-12 items-center justify-center font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-current"
          >
            {heroContent.secondary}
          </a>
        </div>
        <p className="mt-6 text-sm text-muted">{heroContent.launch}</p>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-6">
          {heroContent.stats.map((stat) => (
            <div key={stat.value} className="flex flex-col-reverse gap-1">
              <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
              <dd className="font-display text-[clamp(1.25rem,.9rem+1.6vw,2.25rem)] leading-none font-extrabold tracking-[-.03em]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="venues-enter relative mx-auto w-full max-w-[300px]">
        <Phone label={heroContent.screenLabel} className="max-w-none">
          <LiveQr />
        </Phone>
        {/* A proof card, so it takes the notch. */}
        <div className="venues-float absolute -bottom-4 -left-4 max-w-[220px] bg-graphite p-4 pt-5 text-paper notch sm:-left-16">
          <p className="font-display text-lg leading-none font-extrabold">
            {heroContent.notched}
          </p>
          <p className="mt-1.5 text-sm leading-snug text-stone-light">
            {heroContent.notchedBody}
          </p>
        </div>
        <p className="mt-8 text-center text-xs font-semibold tracking-[.14em] text-muted uppercase">
          {heroContent.example}
        </p>
      </div>
    </section>
  );
}

const TALLY = [
  "M5 4v16",
  "M10 4v16",
  "M15 4v16",
  "M20 4v16",
  "M2 17L23 7",
] as const;

/** Likes are not visits: the tally draws itself as it scrolls in. */
function Compare() {
  const { likes, visits, line } = compareContent;
  return (
    <div
      {...INK_GROUND}
      className="reveal rounded-3xl bg-ink p-6 tone-ink text-paper surface-ink sm:p-10"
    >
      <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto_1fr] sm:gap-10">
        <div className="flex items-center gap-4">
          <HeartIcon className="size-10 flex-none text-stone-light" />
          <p className="leading-snug">
            <span className="block font-display text-xl font-extrabold">
              {likes.title}
            </span>
            <span className="text-stone-light">{likes.body}</span>
          </p>
        </div>
        <span
          aria-label="are not"
          role="img"
          className="font-display text-4xl font-extrabold max-sm:ml-1"
        >
          ≠
        </span>
        <div className="flex items-center gap-4">
          <svg
            viewBox="0 0 25 24"
            aria-hidden="true"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            className="size-10 flex-none stroke-volt"
          >
            {TALLY.map((d, index) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="venues-tally"
                style={{ "--i": index } as CSSProperties}
              />
            ))}
          </svg>
          <p className="leading-snug">
            <span className="block font-display text-xl font-extrabold">
              {visits.title}
            </span>
            <span className="text-stone-light">{visits.body}</span>
          </p>
        </div>
      </div>
      <p className="mt-6 border-t border-paper/15 pt-5 text-[.9375rem] text-stone-light">
        {line}
      </p>
    </div>
  );
}

export function VenuesPage() {
  return (
    <>
      <VenuesHeader />
      <main data-smooth-scroll>
        <Hero />

        <Section id={sectionIds.howItWorks}>
          <HowItWorks />
        </Section>

        <Section className="py-0 sm:py-0">
          <Compare />
        </Section>

        <Section id={sectionIds.yourWeek}>
          <YourWeek />
        </Section>

        <Section id={sectionIds.founding}>
          <Founding />
        </Section>
      </main>
      <div className="mx-auto max-w-[1440px]">
        <p className="px-gutter pb-2 font-display text-lg font-extrabold">
          {foundingContent.footer}
        </p>
        <SiteFooter />
      </div>
    </>
  );
}
