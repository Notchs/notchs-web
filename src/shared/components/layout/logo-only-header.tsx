import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

/** Bare top bar for error pages: only the Notchs logo, linking home. */
export function LogoOnlyHeader() {
  return (
    <header className="px-gutter pt-6">
      <Link
        href={routes.home}
        aria-label={`${siteConfig.name} home`}
        className="inline-flex min-h-11 items-center gap-2.5"
      >
        {/* Volt never sits on Paper, so the mark gets an Ink tile. */}
        <span className="grid size-8 place-items-center rounded-lg bg-ink text-volt">
          <NotchGlyph className="size-5" />
        </span>
        <span className="font-display text-base leading-none font-extrabold tracking-[-.01em]">
          {siteConfig.name}
        </span>
      </Link>
    </header>
  );
}
