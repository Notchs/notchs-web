import type { ReactNode } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  /** Optional content shown beside the theme toggle. */
  children?: ReactNode;
};

export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between gap-4 px-gutter">
      <Link
        href={routes.home}
        aria-label={`${siteConfig.name} home`}
        className="inline-flex min-h-11 items-center gap-2.5"
      >
        <NotchGlyph className="size-5.5" />
        <span className="font-display text-base leading-none font-extrabold tracking-[-.01em]">
          {siteConfig.name}
        </span>
      </Link>
      <div className="flex items-center gap-5">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
