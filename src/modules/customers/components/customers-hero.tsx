import { AccessButton } from "@/modules/landing";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { cardSample, heroContent } from "../content";

/** The pitch beside a sample Notch Card (labelled Example). No fade-in: it is the LCP. */
export function CustomersHero() {
  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-gutter pt-6 pb-12 sm:pt-8 sm:pb-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-14">
      <div className="max-sm:text-center">
        <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
          {heroContent.kicker}
        </p>
        <h1 className="font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[1.06] font-extrabold tracking-[-.02em] text-balance">
          {heroContent.title}
        </h1>
        <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-muted max-sm:mx-auto sm:text-xl">
          {heroContent.description}
        </p>
        <div className="mt-9">
          <AccessButton />
        </div>
      </div>

      <div
        {...INK_GROUND}
        className="mx-auto w-full max-w-sm rounded-3xl bg-ink p-6 text-paper notch-lg sm:p-8"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm text-stone-light">
            <NotchGlyph className="size-4 text-volt" />
            {cardSample.month}
          </span>
          <span className="rounded-full border border-stone-light px-2.5 py-0.5 text-xs font-semibold text-stone-light">
            {cardSample.label}
          </span>
        </div>
        <p className="mt-8 font-display text-7xl leading-none font-extrabold text-volt">
          {cardSample.count}
        </p>
        <p className="mt-2 text-stone-light">{cardSample.countLabel}</p>
        <p className="mt-8 text-lg font-semibold">{cardSample.vibe}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {cardSample.badges.map((badge) => (
            <li
              key={badge}
              className="rounded-full bg-graphite px-3 py-1 text-sm"
            >
              {badge}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
