import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ArrowRightIcon } from "@/shared/components/icons";

import { venuesContent } from "../content";
import { SectionHeading } from "./section-heading";
import { VerifiedIcon } from "./verified-icon";

/**
 * Ink panel for venue owners, with a photo beside the pitch. On phones the
 * photo sits darkened behind the text instead of taking its own space, and
 * the spacing is tighter, so the panel stays short.
 */
export function ForVenues() {
  return (
    <div className="relative grid reveal overflow-hidden rounded-3xl border border-white/10 bg-ink text-paper lg:grid-cols-2">
      <div className="absolute inset-0 sm:relative sm:inset-auto sm:aspect-16/10 lg:order-last lg:aspect-auto">
        <Image
          src={venuesContent.image.src}
          alt={venuesContent.image.alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
        {/* Keeps the text readable where the photo is the background. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-ink/85 sm:hidden"
        />
      </div>
      <div className="relative p-5 py-8 sm:p-10 lg:p-14">
        <SectionHeading
          kicker={venuesContent.kicker}
          title={venuesContent.title}
          description={venuesContent.description}
          onInk
        />
        <ul className="mt-6 grid gap-2.5 sm:mt-8 sm:gap-3.5">
          {venuesContent.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-[.9375rem] sm:text-base"
            >
              <VerifiedIcon className="mt-0.5 size-5 flex-none text-volt" />
              {point}
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Notchs for my venue")}`}
          className="group mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-graphite px-6 py-3 text-center font-semibold transition-colors duration-150 hover:bg-white/14 sm:mt-10 sm:w-auto"
        >
          {venuesContent.cta}
          <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
