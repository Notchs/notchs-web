import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ArrowRightIcon } from "@/shared/components/icons";

import { venuesContent } from "../content";
import { SectionHeading } from "./section-heading";
import { VerifiedIcon } from "./verified-icon";

/** Ink panel for venue owners, with a photo beside the pitch. */
export function ForVenues() {
  return (
    <div className="grid reveal overflow-hidden rounded-3xl border border-white/10 bg-ink text-paper lg:grid-cols-2">
      <div className="relative aspect-[16/10] lg:order-last lg:aspect-auto">
        <Image
          src={venuesContent.image.src}
          alt={venuesContent.image.alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-6 py-10 sm:p-10 lg:p-14">
        <SectionHeading
          kicker={venuesContent.kicker}
          title={venuesContent.title}
          description={venuesContent.description}
          onInk
        />
        <ul className="mt-8 grid gap-3.5">
          {venuesContent.points.map((point) => (
            <li key={point} className="flex items-start gap-3 text-base">
              <VerifiedIcon className="mt-0.5 size-5 flex-none text-volt" />
              {point}
            </li>
          ))}
        </ul>
        <a
          href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Notchs for my venue")}`}
          className="group mt-10 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-graphite px-6 py-3 text-center font-semibold transition-colors duration-150 hover:bg-white/14 sm:w-auto"
        >
          {venuesContent.cta}
          <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
