import type { ReactNode } from "react";
import Image from "next/image";

import { LandingShell, SectionHeading } from "@/modules/landing";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { CloseIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import {
  beliefsContent,
  citiesContent,
  heroContent,
  keepRealContent,
  neverContent,
  problemContent,
} from "../content";
import citiesImage from "../images/cities.webp";
import postsImage from "../images/posts-vs-real.webp";

function Section({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "mx-auto max-w-[1440px] px-gutter py-12 sm:py-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

/** /mission: why Notchs exists and what it will never do. */
export function MissionPage() {
  return (
    <LandingShell>
      <main>
        <section className="mx-auto grid max-w-[1440px] gap-10 px-gutter pt-6 pb-12 sm:pt-8 sm:pb-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-14">
          <div className="max-sm:text-center">
            <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
              {heroContent.kicker}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,1.2rem+4.6vw,4.75rem)] leading-[1.06] font-extrabold tracking-[-.02em] text-balance">
              {heroContent.title}
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted sm:text-xl">
              {heroContent.description}
            </p>
          </div>
          <Image
            src={postsImage}
            alt={heroContent.imageAlt}
            priority
            sizes="(min-width: 641px) 448px, 272px"
            className="mx-auto h-auto w-full max-w-68 rounded-3xl sm:max-w-md"
          />
        </section>

        <Section className="pt-0 sm:pt-0">
          <div className="grid gap-6 rounded-3xl bg-block p-6 py-10 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
            <h2 className="font-display text-[clamp(1.625rem,1rem+2.4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-.01em] text-balance">
              {problemContent.title}
            </h2>
            <p className="text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
              {problemContent.body}
            </p>
          </div>
        </Section>

        <Section>
          <SectionHeading
            kicker={beliefsContent.kicker}
            title={beliefsContent.title}
            className="mb-10 sm:mb-12"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {beliefsContent.items.map((item) => (
              <li key={item.title} className="rounded-2xl bg-block p-6 sm:p-7">
                <h3 className="font-display text-xl font-extrabold tracking-[-.01em]">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section className="pt-0 sm:pt-0">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-line p-6 sm:p-10">
              <SectionHeading
                kicker={neverContent.kicker}
                title={neverContent.title}
                className="mb-8"
              />
              <ul className="grid gap-4">
                {neverContent.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-lg font-semibold"
                  >
                    <CloseIcon className="size-5 flex-none text-unnotched" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-line p-6 sm:p-10">
              <SectionHeading
                kicker={keepRealContent.kicker}
                title={keepRealContent.title}
                className="mb-8"
              />
              <ul className="grid gap-5">
                {keepRealContent.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <VerifiedIcon className="mt-1 size-5 flex-none" />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid gap-8 rounded-3xl border border-line bg-background p-6 py-10 tone-paper sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14">
            <SectionHeading
              kicker={citiesContent.kicker}
              title={citiesContent.title}
              description={citiesContent.description}
            />
            <Image
              src={citiesImage}
              alt={citiesContent.imageAlt}
              sizes="(min-width: 1024px) 470px, 90vw"
              className="mx-auto h-auto w-full max-w-[470px]"
            />
          </div>
        </Section>
      </main>
    </LandingShell>
  );
}
