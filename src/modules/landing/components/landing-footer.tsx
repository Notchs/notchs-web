import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { SiteFooter } from "@/shared/components/layout/site-footer";

import { closingContent, navLinks } from "../content";
import { AccessButton } from "./access-button";

/** Closing call to action, page links, then the shared socials footer. */
export function LandingFooter() {
  return (
    <div>
      <section className="mx-auto max-w-[1440px] px-gutter pb-16 sm:pb-24">
        <div className="flex reveal flex-col items-start gap-8 border-t border-line pt-14 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-[16ch] font-display text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] leading-[1] font-extrabold tracking-[-.035em] text-balance">
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
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-gutter py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <NotchGlyph className="size-6" />
            <span className="font-display text-[1.0625rem] font-extrabold">
              {siteConfig.name}
            </span>
            <span className="w-full text-[.9375rem] text-muted sm:ml-2 sm:w-auto">
              {siteConfig.description}
            </span>
          </div>
          <nav aria-label="Footer">
            {/* A glass lens follows the pointer along the links. */}
            <GlassGroup self={false}>
              <GlassLensTrack lensRadius={20} inset={2}>
                <ul className="-ml-3 flex flex-wrap gap-x-1 sm:ml-0">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="relative inline-flex min-h-12 items-center rounded-full px-3 text-[.9375rem] font-medium text-muted transition-colors duration-150 hover:text-foreground"
                        {...LENS_ITEM}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassLensTrack>
            </GlassGroup>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px]">
        <SiteFooter />
      </div>
    </div>
  );
}
