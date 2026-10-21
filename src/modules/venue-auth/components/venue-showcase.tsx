import Link from "next/link";

import { routes } from "@/config/routes";
import { Logo } from "@/shared/components/brand/logo";
import { cn } from "@/shared/lib/cn";

import { showcaseContent } from "../content";

/**
 * Always-Ink side panel with the pitch and a sample dashboard. Desktop only:
 * on phones the form gets the whole screen.
 */
export function VenueShowcase() {
  const { sample } = showcaseContent;

  return (
    <aside className="relative hidden min-h-svh flex-col justify-between gap-12 overflow-hidden bg-ink px-14 py-12 text-paper lg:flex">
      {/* Tally mark watermark. */}
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-30 size-140 opacity-[.06]"
      >
        <g fill="currentColor">
          <rect x="6.5" y="2" width="2" height="20" />
          <rect x="9.5" y="2" width="2" height="20" />
          <rect x="12.5" y="2" width="2" height="20" />
          <rect x="15.5" y="2" width="2" height="20" />
        </g>
        <path d="M5 21L16.5 1.1" stroke="currentColor" strokeWidth="2" />
      </svg>

      <Link
        href={routes.home}
        className="relative flex flex-wrap items-center gap-3 self-start"
      >
        <Logo variant="on-dark" height={40} />
        <span className="rounded-md border border-paper/18 px-2 py-1 font-mono text-[.8125rem] tracking-[.08em] whitespace-nowrap text-[#b5b3ac] uppercase">
          {showcaseContent.badge}
        </span>
      </Link>

      <div className="relative flex max-w-120 flex-col gap-5">
        <h1 className="font-display text-[3.25rem] leading-[1.04] tracking-[-.02em] text-balance">
          {showcaseContent.title}
        </h1>
        <p className="text-xl leading-relaxed text-[#b5b3ac]">
          {showcaseContent.description}
        </p>
      </div>

      <div className="relative flex max-w-105 flex-col gap-3">
        <div className="flex flex-col gap-4 rounded-[14px] border border-paper/9 bg-[#17171d] p-5">
          <span className="text-[.8125rem] leading-none font-semibold tracking-[.08em] text-[#b5b3ac] uppercase">
            {sample.label}
          </span>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl leading-none tracking-[-.02em] text-volt">
              {sample.total}
            </span>
            <span className="text-lg">{sample.detail}</span>
          </div>
          <div aria-hidden="true" className="flex h-16 items-end gap-2">
            {sample.bars.map((height, i) => (
              <span
                key={i}
                style={{ height: `${height}%` }}
                className={cn(
                  "flex-1 rounded-t",
                  i === sample.highlight ? "bg-volt" : "bg-graphite",
                )}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[.8125rem] text-[#b5b3ac] uppercase">
          {sample.caption}
        </span>
      </div>
    </aside>
  );
}
