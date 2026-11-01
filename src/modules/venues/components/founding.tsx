import type { CSSProperties } from "react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { ArrowRightIcon } from "@/shared/components/icons";
import { ButtonLink } from "@/shared/components/ui/button";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { accessLabel, foundingContent } from "../content";
import { venueIcons } from "./icons";

const overline =
  "text-xs font-semibold tracking-[.14em] text-stone-light uppercase";

/** One empty slot per spot. All stay empty: this shows the offer, not sign-ups. */
function Slots() {
  return (
    <div
      aria-hidden="true"
      className="venues-slots mt-8 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 sm:gap-1.5 lg:max-w-3xl"
    >
      {Array.from({ length: foundingContent.spots }, (_, index) => (
        <span
          key={index}
          style={{ "--i": index } as CSSProperties}
          className="venues-slot aspect-square rounded-[4px] border border-paper/30"
        />
      ))}
    </div>
  );
}

/** Pitch page three: the offer, what it takes, our promises, then the CTA. */
export function Founding() {
  const { cta } = foundingContent;

  return (
    <div
      {...INK_GROUND}
      className="rounded-3xl bg-ink p-5 py-8 tone-ink text-paper surface-ink sm:p-10 lg:p-14"
    >
      <p className={overline}>{foundingContent.kicker}</p>
      <h2 className="mt-6 flex flex-col gap-4 font-display font-extrabold lg:flex-row lg:items-end lg:gap-10">
        <span className="text-[clamp(6rem,3rem+14vw,13rem)] leading-[.8] tracking-[-.05em] text-volt">
          {foundingContent.spots}
        </span>
        <span className="max-w-[16ch] text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-[1.05] tracking-[-.03em]">
          {foundingContent.title}
        </span>
      </h2>
      <Slots />

      <ul className="mt-10 grid gap-3 md:grid-cols-2">
        {foundingContent.perks.map((perk) => (
          <li
            key={perk.title}
            className="flex reveal items-center gap-5 rounded-2xl bg-graphite p-5 sm:p-6"
          >
            <span
              aria-hidden="true"
              className="w-20 flex-none font-display text-2xl font-extrabold tracking-[-.02em] sm:w-24 sm:text-3xl"
            >
              {perk.metric}
            </span>
            <div>
              <h3 className="font-display text-base leading-tight font-extrabold tracking-[-.02em] sm:text-lg">
                {perk.title}
              </h3>
              <p className="mt-1.5 text-[.9375rem] leading-relaxed text-stone-light">
                {perk.body}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className={`mt-10 ${overline}`}>{foundingContent.needsTitle}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {foundingContent.needs.map((need) => {
          const Icon = venueIcons[need.icon];
          return (
            <li
              key={need.title}
              className="flex items-center gap-4 rounded-2xl border border-paper/15 p-4"
            >
              <Icon className="size-7 flex-none text-paper" />
              <p className="leading-snug">
                <span className="block font-semibold">{need.title}</span>
                <span className="text-[.9375rem] text-stone-light">
                  {need.body}
                </span>
              </p>
            </li>
          );
        })}
      </ul>

      <h3 className={`mt-10 ${overline}`}>{foundingContent.promisesTitle}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {foundingContent.promises.map((promise) => (
          <li
            key={promise}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-paper/15 px-3.5 py-1.5 text-[.9375rem]"
          >
            <VerifiedIcon className="size-4 flex-none text-paper" />
            {promise}
          </li>
        ))}
      </ul>

      {/* Paper tone on Volt: Ink text and an Ink button. */}
      <div className="mt-10 flex reveal flex-col gap-6 rounded-2xl bg-volt p-6 tone-paper sm:p-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-ink">
          <h2 className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-[1.02] font-extrabold tracking-[-.03em] text-balance">
            {cta.title}
          </h2>
          <p className="mt-3 text-[1.0625rem]">{cta.body}</p>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <ButtonLink href={routes.venueLogin} className="w-full sm:w-auto">
            {accessLabel}
            <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </ButtonLink>
          <p className="flex flex-wrap gap-x-5 text-[.9375rem] font-semibold text-ink">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-flex min-h-12 items-center underline underline-offset-4"
            >
              {siteConfig.contactEmail}
            </a>
            <a
              href={siteConfig.social.instagram}
              className="inline-flex min-h-12 items-center underline underline-offset-4"
            >
              {cta.instagram}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
