import type { ReactNode } from "react";
import Image from "next/image";

import { legalRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { UsersIcon } from "@/shared/components/icons";

import cityMap from "./assets/city-map.webp";

/** What the Ink brand panel says for one role and mode. */
export type AuthBrand = {
  /** Small pill above the headline, e.g. "Welcome back!". */
  kicker: string;
  title: string;
  description: string;
  /** The floating preview card: an illustration, not live data. */
  preview: { label: string; value: string; change: string };
};

type AuthLayoutProps = {
  /** The Ink side panel: usually an `AuthBrandPanel`. */
  brand: ReactNode;
  /** Subject line of the footer's Help email. */
  helpSubject: string;
  children: ReactNode;
};

/**
 * Shared venue and admin auth layout. Desktop: the Ink brand panel on the
 * left, the Paper form on the right. Phones: the form only.
 */
export function AuthLayout({ brand, helpSubject, children }: AuthLayoutProps) {
  return (
    <div className="row-span-3 grid min-h-svh lg:grid-cols-[minmax(460px,5fr)_minmax(0,7fr)]">
      {brand}
      <div className="flex min-w-0 flex-col bg-background tone-paper lg:min-h-svh">
        <main className="flex flex-1 flex-col px-gutter pt-4 pb-6 lg:px-14 lg:py-8">
          {children}
        </main>
        <AuthFooter helpSubject={helpSubject} />
      </div>
    </div>
  );
}

/** Always-Ink side panel with the role's pitch and a preview card. Desktop only. */
export function AuthBrandPanel({
  kicker,
  title,
  description,
  preview,
}: AuthBrand) {
  return (
    <aside className="relative hidden min-h-svh flex-col justify-center gap-14 overflow-hidden bg-background px-14 py-16 tone-ink lg:flex">
      <Backdrop />

      <div
        key={title}
        className="relative flex max-w-120 animate-rise flex-col items-start gap-5"
      >
        <span className="rounded-full glass px-3.5 py-1.5 text-sm font-semibold">
          {kicker}
        </span>
        <h1 className="font-display text-[3.5rem] leading-[1.02] tracking-[-.02em] text-balance">
          {title}
        </h1>
        <p className="max-w-100 text-lg leading-relaxed text-stone-light">
          {description}
        </p>
      </div>

      <PreviewCard {...preview} />
    </aside>
  );
}

/** Faint grid, soft Volt glows and dark arcs behind the brand panel. */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgb(245 243 236 / .04) 1px, transparent 1px), linear-gradient(90deg, rgb(245 243 236 / .04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 40% 40%, #000 40%, transparent 100%)",
        }}
      />
      {/* City map with green spots, tucked into the top-right corner. */}
      <Image
        src={cityMap}
        alt=""
        sizes="(min-width: 1024px) 40vw, 1px"
        className="absolute top-0 right-0 w-[95%] max-w-none translate-x-[44%] -translate-y-[36%] mix-blend-lighten"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 70% at 55% 45%, #000 55%, transparent 100%)",
        }}
      />
      {/* Tally mark (||||/) in the bottom-right corner. */}
      <svg
        viewBox="0 0 24 24"
        className="absolute -right-36 -bottom-28 size-140 text-graphite opacity-70"
      >
        <g fill="currentColor">
          <rect x="6.5" y="2" width="2" height="20" />
          <rect x="9.5" y="2" width="2" height="20" />
          <rect x="12.5" y="2" width="2" height="20" />
          <rect x="15.5" y="2" width="2" height="20" />
        </g>
        <path d="M5 21L16.5 1.1" stroke="currentColor" strokeWidth="2" />
      </svg>
      {/* Soft Volt light: behind the preview card and in the top corner. */}
      <div className="absolute bottom-[8%] left-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(210_255_60/.16),transparent_65%)]" />
      <div className="absolute top-[-12%] right-[-14%] size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(210_255_60/.09),transparent_65%)]" />
      <svg
        viewBox="0 0 500 800"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
      >
        <path
          d="M-40 860 C 120 700, 380 720, 560 840"
          fill="none"
          stroke="var(--graphite)"
          strokeWidth="90"
          opacity=".55"
        />
      </svg>
    </div>
  );
}

const voltGlow = "drop-shadow(0 0 6px rgb(210 255 60 / .75))";

/**
 * Tilted glass card with a glowing rising line, a Volt sweep running behind
 * it, and two floating icon tiles.
 */
function PreviewCard({ label, value, change }: AuthBrand["preview"]) {
  return (
    <div aria-hidden="true" className="relative h-64 w-full max-w-110">
      {/* The sweep: starts off the panel's left edge and rises past the card. */}
      <svg
        viewBox="0 0 560 260"
        preserveAspectRatio="none"
        className="absolute top-0 -left-14 h-full w-[calc(100%+7rem)] animate-fade-in"
        fill="none"
        strokeLinecap="round"
      >
        <path
          d="M0 120 C 90 70, 170 60, 250 80 S 420 120, 560 30"
          stroke="var(--volt)"
          strokeWidth="9"
          opacity=".18"
          style={{ filter: "blur(6px)" }}
        />
        <path
          d="M0 120 C 90 70, 170 60, 250 80 S 420 120, 560 30"
          stroke="var(--volt)"
          strokeWidth="2.5"
          style={{ filter: voltGlow }}
        />
      </svg>

      <div className="absolute top-4 right-10 flex size-14 animate-rise items-center justify-center rounded-2xl glass [animation-delay:.2s]">
        <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
          <rect x="4" y="13" width="4" height="7" rx="1" />
          <rect x="10" y="9" width="4" height="11" rx="1" />
          <rect x="16" y="4" width="4" height="16" rx="1" />
        </svg>
      </div>

      <div className="absolute top-20 left-0 w-[22rem] -rotate-3 animate-rise [animation-delay:.1s]">
        {/* Volt light under the card. */}
        <div className="absolute inset-4 -z-10 rounded-3xl bg-volt/25 blur-3xl" />
        <div className="relative flex h-32 flex-col justify-center gap-1 overflow-hidden rounded-2xl glass px-6">
          <span className="text-[.9375rem] text-stone-light">{label}</span>
          <b className="font-display text-[2rem] leading-none tracking-[-.02em]">
            {value}
          </b>
          <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-volt">
            <svg
              viewBox="0 0 12 12"
              className="size-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10.5V1.5M2 5.5l4-4 4 4" />
            </svg>
            {change}
          </span>
          {/* The line: from under the number, waving up to the top corner. */}
          <svg
            viewBox="0 0 200 110"
            preserveAspectRatio="none"
            className="absolute top-0 right-0 h-full w-[62%] overflow-visible"
            fill="none"
            strokeLinecap="round"
          >
            <path
              d="M0 92 C 22 92, 30 70, 50 76 S 76 98, 96 70 S 122 46, 140 58 S 164 50, 176 30 S 190 14, 192 12"
              stroke="var(--volt)"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
              style={{ filter: voltGlow }}
            />
          </svg>
          <span className="absolute top-[9px] right-[calc(2.5%-5px)] size-2.5 rounded-full bg-volt shadow-[0_0_10px_rgb(210_255_60/.9)]">
            <span className="absolute inset-0 rounded-full bg-volt opacity-40 motion-safe:animate-ping" />
          </span>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 flex size-14 animate-rise items-center justify-center rounded-2xl glass [animation-delay:.3s]">
        <UsersIcon className="size-6" />
      </div>
    </div>
  );
}

const footerContent = {
  signOff: "Built for every city",
  help: "Help",
  privacy: "Privacy",
  terms: "Terms",
} as const;

export function AuthFooter({ helpSubject }: { helpSubject: string }) {
  return (
    <footer className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line px-gutter py-5 text-sm text-muted lg:px-14">
      <span>
        © {siteConfig.copyrightYear} {siteConfig.name} · {footerContent.signOff}
      </span>
      <nav
        aria-label="Help and legal"
        className="flex flex-wrap gap-x-5 gap-y-2"
      >
        <a
          href={`mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(helpSubject)}`}
          className="underline underline-offset-[3px] hover:text-foreground"
        >
          {footerContent.help}
        </a>
        <a
          href={legalRoutes.privacy}
          className="underline underline-offset-[3px] hover:text-foreground"
        >
          {footerContent.privacy}
        </a>
        <a
          href={legalRoutes.terms}
          className="underline underline-offset-[3px] hover:text-foreground"
        >
          {footerContent.terms}
        </a>
      </nav>
    </footer>
  );
}
