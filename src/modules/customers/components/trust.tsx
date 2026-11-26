import Image from "next/image";
import Link from "next/link";

import { routes } from "@/config/routes";
import { SectionHeading } from "@/modules/landing";
import { ArrowRightIcon } from "@/shared/components/icons";

import { trustContent } from "../content";
import privacyImage from "../images/privacy.webp";

/** Privacy promises beside the phone-with-lock illustration. */
export function Trust() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
      <div>
        <SectionHeading
          kicker={trustContent.kicker}
          title={trustContent.title}
          className="mb-10"
        />
        <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {trustContent.items.map((item) => (
            <li key={item.title}>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
        <Link
          href={routes.privacy}
          className="group mt-8 inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-line decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-current"
        >
          {trustContent.privacyLink}
          <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <Image
        src={privacyImage}
        alt={trustContent.imageAlt}
        sizes="(min-width: 1024px) 400px, 80vw"
        className="mx-auto h-auto w-full max-w-sm rounded-3xl"
      />
    </div>
  );
}
