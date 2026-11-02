import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import { VerifiedIcon } from "@/shared/components/brand/verified-icon";
import { ArrowRightIcon } from "@/shared/components/icons";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { venuesContent } from "../content";
import { SectionHeading } from "./section-heading";

/**
 * An Ink panel for venue owners, with a photo beside the pitch.
 * On phones the photo sits behind the text under Ink instead of taking its
 * own space, so the panel stays short.
 */
export function ForVenues() {
  return (
    <div
      {...INK_GROUND}
      className="grid reveal overflow-hidden rounded-3xl bg-ink text-paper lg:grid-cols-2"
    >
      <div className="absolute inset-0 sm:relative sm:inset-auto sm:aspect-16/10 lg:order-last lg:aspect-auto">
        <Image
          src={venuesContent.image.src}
          alt={venuesContent.image.alt}
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          placeholder="blur"
          className="object-cover"
        />
        {/* Ink over the photo keeps the text readable. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-ink/82 sm:hidden"
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
        <div className="mt-8 inline-flex w-full rounded-xl bg-graphite sm:mt-10 sm:w-auto">
          <Link
            href={routes.venueLogin}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 px-6 py-3 text-center font-semibold"
          >
            {venuesContent.cta}
            <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
