"use client";

import { useRef } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { ButtonLink } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/cn";
import { useInkGround } from "@/shared/lib/glass/use-ink-ground";

import { accessLabel, navLinks } from "../content";

/** Corner radius of the bar's glass capsules, px. */
const CAPSULE_RADIUS = 32;

/**
 * The landing page's Liquid Glass bar, for venue owners: brand, the sections
 * of this page, and Get access to the venue login. Phones scroll the short
 * page instead of opening a menu.
 */
export function VenuesHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const onInk = useInkGround(headerRef);

  return (
    <header
      ref={headerRef}
      className={cn("sticky top-0 z-40 px-gutter pt-3", onInk && "tone-ink")}
    >
      <div className="relative mx-auto max-w-[calc(1440px_-_2_*_var(--gutter))]">
        <GlassGroup
          self={false}
          floating
          merge={22}
          tintAmount={0.62}
          frost={0.85}
          className="flex h-16 items-center justify-between gap-2"
        >
          <GlassShape
            radius={CAPSULE_RADIUS}
            className="flex h-16 items-center px-4 sm:px-5"
          >
            <Link
              href={routes.home}
              aria-label={`${siteConfig.name} home`}
              className="inline-flex min-h-11 items-center gap-2.5"
            >
              <NotchGlyph className="size-6" />
              <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-.01em]">
                {siteConfig.name}
              </span>
            </Link>
          </GlassShape>

          <GlassShape
            radius={CAPSULE_RADIUS}
            className="hidden h-16 items-center px-2 lg:flex"
          >
            <nav aria-label="On this page">
              <GlassLensTrack lensRadius={20} inset={2}>
                <ul className="flex items-center gap-0.5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[.9375rem] font-medium text-muted transition-colors duration-150 hover:text-foreground focus-visible:text-foreground"
                        {...LENS_ITEM}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassLensTrack>
            </nav>
          </GlassShape>

          <GlassShape
            radius={CAPSULE_RADIUS}
            className="flex h-16 items-center gap-1 pr-3 pl-2 sm:gap-2"
          >
            <GlassLensTrack lensRadius={22} inset={1}>
              <span {...LENS_ITEM}>
                <ThemeToggle />
              </span>
            </GlassLensTrack>
            <ButtonLink href={routes.venueLogin} size="sm">
              {accessLabel}
            </ButtonLink>
          </GlassShape>
        </GlassGroup>
      </div>
    </header>
  );
}
