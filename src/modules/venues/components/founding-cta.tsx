import Link from "next/link";

import { ArrowRightIcon } from "@/shared/components/icons";

import { applyHref, closingContent } from "../content";

/**
 * Closing call to action in the button colours: Volt with Ink text in dark,
 * Ink with Volt text in light, so Volt never sits on Paper. The button swaps
 * them.
 */
export function FoundingCta() {
  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-btn p-6 py-10 text-btn-fg max-sm:items-center max-sm:text-center sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
      <div>
        <h2 className="font-display text-[clamp(1.875rem,1.1rem+3vw,3.25rem)] leading-[1.1] font-extrabold tracking-[-.01em] text-balance">
          {closingContent.title}
        </h2>
        <p className="mt-4 max-w-[46ch] text-[1.0625rem] leading-relaxed sm:text-lg">
          {closingContent.body}
        </p>
      </div>
      <Link
        href={applyHref}
        className="group inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-full bg-btn-fg px-6 font-semibold text-btn transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none"
      >
        {closingContent.cta}
        <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
