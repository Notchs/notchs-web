import type { ReactNode } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { flowContent } from "../content";
import { VenueShowcase } from "./venue-showcase";

/**
 * Venue auth layout: Ink showcase on the left (desktop only) and the form
 * column on the right. On phones a small logo row replaces the showcase.
 */
export function VenueAuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="row-span-3 grid min-h-svh lg:grid-cols-[minmax(420px,5fr)_minmax(0,7fr)]">
      <VenueShowcase />
      <main className="flex min-w-0 flex-col px-gutter py-5 lg:min-h-svh lg:px-14 lg:py-8">
        <Link
          href={routes.home}
          aria-label={`${siteConfig.name} home`}
          className="flex min-h-12 items-center gap-2.5 self-start lg:hidden"
        >
          <NotchGlyph className="size-6" />
          <span className="font-display text-[1.0625rem] leading-none tracking-[-.01em]">
            {siteConfig.name}
          </span>
          <span className="rounded-md border border-line px-2 py-1 font-mono text-xs tracking-[.08em] text-muted uppercase">
            {flowContent.forVenues}
          </span>
        </Link>
        {children}
        <footer className="mt-10 flex flex-wrap justify-between gap-x-4 gap-y-2 text-sm text-muted">
          <span>{flowContent.footer.copyright}</span>
          <a
            href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Venue login help")}`}
            className="underline underline-offset-[3px] hover:text-foreground"
          >
            {flowContent.footer.help}
          </a>
        </footer>
      </main>
    </div>
  );
}

/** Centres one screen of the flow and replays the rise-in when `screenKey` changes. */
export function ScreenFrame({
  screenKey,
  children,
}: {
  screenKey: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-8 lg:py-8">
      <div
        key={screenKey}
        className="flex w-full max-w-115 animate-rise flex-col gap-7"
      >
        {children}
      </div>
    </div>
  );
}

type ScreenHeadingProps = {
  kicker?: string;
  title: string;
  description?: ReactNode;
  /** A back button shown above the title. */
  back?: ReactNode;
};

export function ScreenHeading({
  kicker,
  title,
  description,
  back,
}: ScreenHeadingProps) {
  return (
    <div className="flex flex-col gap-2.5">
      {back}
      {kicker && (
        <span className="text-[.8125rem] leading-none font-semibold tracking-[.08em] text-muted uppercase">
          {kicker}
        </span>
      )}
      <h2 className="font-display text-[1.75rem] leading-[1.1] tracking-[-.02em] text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

/** Form-level error, read out when it appears. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[10px] border border-unnotched/40 px-4 py-3 text-[.9375rem] leading-normal text-unnotched"
    >
      {message}
    </p>
  );
}
