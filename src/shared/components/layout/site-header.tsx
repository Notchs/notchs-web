import type { ReactNode } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";

import { ThemeToggle } from "./theme-toggle";

type SiteHeaderProps = {
  /** Optional content shown beside the theme toggle. */
  children?: ReactNode;
};

/** Floating glass top bar; the page scrolls underneath it. */
export function SiteHeader({ children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 px-gutter pt-3">
      <GlassGroup
        floating
        radius={32}
        className="flex h-16 items-center justify-between gap-4 rounded-[32px] pr-2.5 pl-5"
      >
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
          <GlassLensTrack lensRadius={22} inset={1}>
            <span {...LENS_ITEM}>
              <ThemeToggle />
            </span>
          </GlassLensTrack>
        </div>
      </GlassGroup>
    </header>
  );
}
