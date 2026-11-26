import Image from "next/image";
import Link from "next/link";

import { LandingShell } from "@/modules/landing";
import { ArrowRightIcon } from "@/shared/components/icons";

import {
  heroContent,
  privacyLine,
  reasons,
  reasonsHeading,
  socialContent,
} from "../content";
import contactImage from "../images/contact.webp";

const primaryLinkStyles =
  "group inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-current";

/** /contact: one card per reason for getting in touch. */
export function ContactPage() {
  return (
    <LandingShell>
      <main>
        <section className="mx-auto grid max-w-[1440px] gap-10 px-gutter pt-6 pb-12 sm:pt-8 sm:pb-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-14">
          <div className="max-sm:text-center">
            <p className="mb-5 text-xs font-semibold tracking-[.14em] text-muted uppercase">
              {heroContent.kicker}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,1.2rem+5.2vw,5.25rem)] leading-[1.06] font-extrabold tracking-[-.02em]">
              {heroContent.title}
            </h1>
            <p className="mt-6 max-w-[40ch] text-[1.0625rem] leading-relaxed text-muted max-sm:mx-auto sm:text-xl">
              {heroContent.description}
            </p>
          </div>
          <Image
            src={contactImage}
            alt={heroContent.imageAlt}
            priority
            sizes="(min-width: 641px) 384px, 224px"
            className="mx-auto h-auto w-full max-w-56 rounded-3xl sm:max-w-sm"
          />
        </section>

        <section className="mx-auto max-w-[1440px] px-gutter pb-12 sm:pb-24">
          <h2 className="sr-only">{reasonsHeading}</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {reasons.map((reason) => (
              <li
                key={reason.title}
                className="flex flex-col rounded-3xl bg-block p-6 sm:p-8"
              >
                <h3 className="font-display text-xl font-extrabold tracking-[-.01em]">
                  {reason.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{reason.body}</p>
                <div className="mt-auto flex flex-wrap gap-x-6 pt-5">
                  <Link
                    href={reason.primary.href}
                    className={primaryLinkStyles}
                  >
                    {reason.primary.label}
                    <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </Link>
                  {reason.secondary && (
                    <Link
                      href={reason.secondary.href}
                      className="inline-flex min-h-11 items-center text-muted underline decoration-line underline-offset-[6px] transition-colors duration-150 hover:text-foreground"
                    >
                      {reason.secondary.label}
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted">
              {privacyLine.text}{" "}
              <Link
                href={privacyLine.href}
                className="font-semibold text-foreground underline decoration-line underline-offset-[6px] hover:decoration-current"
              >
                {privacyLine.label}
              </Link>
            </p>
            <nav aria-label={socialContent.title}>
              <ul className="flex flex-wrap gap-x-6">
                {socialContent.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center font-semibold hover:text-muted"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
    </LandingShell>
  );
}
