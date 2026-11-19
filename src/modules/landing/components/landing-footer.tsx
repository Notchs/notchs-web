import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { SiteFooter } from "@/shared/components/layout/site-footer";

import { closingContent, footerContent } from "../content";
import { AccessButton } from "./access-button";

/** Closing call to action, page links, then the shared socials footer. */
export function LandingFooter() {
  return (
    <div>
      <section className="mx-auto max-w-[1440px] px-gutter pb-16 sm:pb-24">
        <div className="flex reveal flex-col items-start gap-8 border-t border-line pt-14 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] leading-[1.14] font-extrabold tracking-[-.02em] text-balance">
              {closingContent.title}
            </h2>
            <p className="mt-4 text-lg text-muted">
              Don&rsquo;t stay{" "}
              <em className="text-unnotched not-italic">unnotched.</em>
            </p>
          </div>
          <AccessButton className="w-full sm:w-auto" />
        </div>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-gutter py-12 sm:py-16 lg:grid-cols-[1.2fr_3fr] lg:gap-16">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2.5">
              <span className="grid size-8 flex-none place-items-center rounded-lg bg-ink text-volt">
                <NotchGlyph className="size-6" />
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
              <div key={column.title} className="flex flex-col gap-2">
                <p className="text-xs font-semibold tracking-[.14em] text-muted uppercase">
                  {column.title}
                </p>
                <ul className="flex flex-col">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-[.9375rem] font-medium transition-colors duration-150 hover:text-muted"
                      >
                        {link.label}
                      </a>
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
