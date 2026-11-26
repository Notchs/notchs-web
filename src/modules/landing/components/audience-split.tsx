import Link from "next/link";

import { ArrowRightIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";
import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { audienceContent } from "../content";

/** Two cards: one for people who go out, one for venue owners. */
export function AudienceSplit() {
  return (
    <>
      <h2 className="sr-only">{audienceContent.heading}</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {audienceContent.cards.map((card) => (
          <li
            key={card.href}
            {...(card.ink ? INK_GROUND : {})}
            className={cn(
              "flex flex-col rounded-3xl p-6 py-9 sm:p-10",
              card.ink ? "bg-ink text-paper" : "bg-block",
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold tracking-[.14em] uppercase",
                card.ink ? "text-stone-light" : "text-muted",
              )}
            >
              {card.kicker}
            </p>
            <h3 className="mt-4 font-display text-[clamp(1.625rem,1rem+2.2vw,2.375rem)] leading-[1.15] font-extrabold tracking-[-.01em] text-balance">
              {card.title}
            </h3>
            <p
              className={cn(
                "mt-4 leading-relaxed sm:text-lg",
                card.ink ? "text-stone-light" : "text-muted",
              )}
            >
              {card.body}
            </p>
            <Link
              href={card.href}
              className="group mt-auto inline-flex min-h-11 w-fit items-center gap-2 pt-6 font-semibold underline decoration-current/30 decoration-2 underline-offset-[6px] opacity-100 hover:decoration-current"
            >
              {card.cta}
              <ArrowRightIcon className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
