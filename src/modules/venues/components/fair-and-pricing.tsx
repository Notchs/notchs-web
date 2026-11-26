import { VerifiedIcon } from "@/shared/components/brand/verified-icon";

import { fairContent, pricingContent } from "../content";

const cardStyles = "rounded-3xl border border-line p-6 sm:p-10";
const titleStyles =
  "text-xs font-semibold tracking-[.14em] text-muted uppercase";

/** What venues can count on, beside what it costs. */
export function FairAndPricing() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className={cardStyles}>
        <h2 className={titleStyles}>{fairContent.title}</h2>
        <ul className="mt-6 grid gap-4">
          {fairContent.points.map((point) => (
            <li key={point} className="flex items-start gap-3 leading-relaxed">
              <VerifiedIcon className="mt-1 size-5 flex-none" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className={cardStyles}>
        <h2 className={titleStyles}>{pricingContent.title}</h2>
        <p className="mt-6 font-display text-2xl leading-tight font-extrabold tracking-[-.01em] sm:text-3xl">
          {pricingContent.headline}
        </p>
        <p className="mt-3 leading-relaxed text-muted">{pricingContent.body}</p>
      </div>
    </div>
  );
}
