import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import { LandingShell, SectionHeading } from "@/modules/landing";
import { ArrowRightIcon } from "@/shared/components/icons";

import {
  closingContent,
  heroContent,
  nameContent,
  storyContent,
  teamContent,
} from "../content";
import teamImage from "../images/team.webp";

const sectionStyles = "mx-auto max-w-[1440px] px-gutter py-12 sm:py-24";

/** /about: who is behind Notchs and where the name comes from. */
export function AboutPage() {
  return (
    <LandingShell>
      <main>
        <section className="mx-auto grid max-w-[1440px] gap-10 px-gutter pt-6 pb-12 sm:pt-8 sm:pb-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-14">
          <div className="max-sm:text-center">
            <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
              {heroContent.kicker}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[1.06] font-extrabold tracking-[-.02em] text-balance">
              {heroContent.title}
            </h1>
            <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted sm:text-xl">
              {heroContent.description}
            </p>
          </div>
          <Image
            src={teamImage}
            alt={heroContent.imageAlt}
            priority
            sizes="(min-width: 641px) 530px, 296px"
            className="mx-auto h-auto w-full max-w-74 rounded-3xl sm:max-w-[530px]"
          />
        </section>

        <section className={`${sectionStyles} pt-0 sm:pt-0`}>
          <div className="grid gap-4 lg:grid-cols-2">
            {[storyContent, nameContent].map((block) => (
              <div
                key={block.kicker}
                className="rounded-3xl bg-block p-6 sm:p-10"
              >
                <SectionHeading
                  kicker={block.kicker}
                  title={block.title}
                  description={block.body}
                />
              </div>
            ))}
          </div>
        </section>

        <section className={sectionStyles}>
          <SectionHeading
            kicker={teamContent.kicker}
            title={teamContent.title}
            description={teamContent.body}
          />
        </section>

        <section className={`${sectionStyles} pt-0 sm:pt-0`}>
          <div className="flex flex-col gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-extrabold tracking-[-.01em] sm:text-3xl">
              {closingContent.title}
            </h2>
            <div className="flex flex-wrap gap-x-8">
              <Link
                href={routes.contact}
                className="group inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-current"
              >
                {closingContent.contact}
                <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={routes.mission}
                className="inline-flex min-h-11 items-center text-muted underline decoration-line underline-offset-[6px] hover:text-foreground"
              >
                {closingContent.mission}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </LandingShell>
  );
}
