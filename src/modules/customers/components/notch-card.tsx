import Image from "next/image";

import { SectionHeading } from "@/modules/landing";

import { notchCardContent } from "../content";
import cardImage from "../images/notch-card.webp";

/**
 * A Paper panel in either theme: the illustration's off-white background
 * blends into it, and no Volt sits on it outside the art's dark phone.
 */
export function NotchCard() {
  return (
    <div className="grid gap-8 rounded-3xl border border-line bg-background p-6 py-10 tone-paper sm:p-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-14">
      <SectionHeading
        kicker={notchCardContent.kicker}
        title={notchCardContent.title}
        description={notchCardContent.description}
      />
      <figure className="mx-auto w-full max-w-lg">
        <Image
          src={cardImage}
          alt={notchCardContent.imageAlt}
          sizes="(min-width: 1024px) 512px, 90vw"
          className="h-auto w-full"
        />
        <figcaption className="mt-2 text-center text-sm text-muted">
          {notchCardContent.imageLabel}
        </figcaption>
      </figure>
    </div>
  );
}
