import Link from "next/link";

import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { SiteFooter } from "@/shared/components/layout/site-footer";

import { closingContent, footerContent } from "../content";
import { withBase } from "../lib/link-base";
import { AccessButton } from "./access-button";

/** Closing call to action, page links, then the shared socials footer. */
export function LandingFooter({
  linkBase = "",
}: {
  /** Path put in front of section links when used off the landing page. */
  linkBase?: string;
}) {
  return (
    <div>
      <section className="mx-auto max-w-[1440px] px-gutter pb-16 sm:pb-24">
        <div className="flex reveal flex-col items-start gap-8 border-t border-line pt-14 max-sm:items-center max-sm:text-center sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] leading-[1.14] font-extrabold tracking-[-.02em] text-balance">
              {closingContent.title}
            </h2>
            <p className="mt-4 text-lg text-muted">
              Don&rsquo;t stay{" "}
              <em className="text-unnotched not-italic">unnotched.</em>
            </p>
          </div>
          <AccessButton />
        </div>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-gutter py-12 sm:py-16 lg:grid-cols-[1.2fr_3fr] lg:gap-16">
          <div className="flex flex-col gap-3 max-sm:items-center max-sm:text-center">
            <span className="flex items-center gap-2.5">
              <span className="grid size-8 flex-none place-items-center rounded-lg bg-btn text-btn-fg">
                <NotchGlyph className="size-4.5" />
              </span>
              <span className="font-display text-[1.0625rem] font-extrabold">
                {siteConfig.name}
              </span>
            </span>
            <p className="max-w-[30ch] text-[.9375rem] leading-relaxed text-muted">
              {siteConfig.description}
            </p>
            <p className="text-sm font-semibold">{footerContent.signOff}</p>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
          >
            {footerContent.columns.map((column) => (
              <div
                key={column.title}
                className="flex flex-col gap-2 max-sm:items-center max-sm:text-center"
              >
                <p className="text-xs font-semibold tracking-[.14em] text-muted uppercase">
                  {column.title}
                </p>
                <ul className="flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={withBase(link.href, linkBase)}
                        className="inline-flex min-h-11 items-center text-[.9375rem] font-medium transition-colors duration-150 hover:text-muted"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <SiteFooter />
      </div>
    </div>
  );
}
