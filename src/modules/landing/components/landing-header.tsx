"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { CloseIcon, MenuIcon } from "@/shared/components/icons";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { useInkGround } from "@/shared/lib/glass/use-ink-ground";

import { navLinks } from "../content";
import { withBase } from "../lib/link-base";
import { useActiveSection } from "../lib/use-active-section";
import { AccessButton } from "./access-button";

/** Section ids the menu links point to, in page order. */
const navSectionIds = navLinks.map((link) => link.href.slice(1));

const linkStyles =
  "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[.9375rem] font-medium text-muted transition-colors duration-150 hover:text-foreground focus-visible:text-foreground";

/** Height and corner radius of the bar's glass capsules, px. */
const CAPSULE_RADIUS = 32;

/** Closes the menu on Escape or on a tap outside the header. */
function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [ref, open, close]);
}

/**
 * The top bar: three glass capsules (brand, links, actions) floating over the
 * page. A soft highlight follows the pointer or keyboard focus along the links
 * and actions. Over Ink panels the glass turns dark so it stays readable. On
 * phones and tablets the links open in a glass panel below the Menu button.
 */
export function LandingHeader({
  linkBase = "",
}: {
  /** Path put in front of section links when used off the landing page. */
  linkBase?: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDismiss(headerRef, menuOpen, closeMenu);
  const onInk = useInkGround(headerRef);
  const activeSection = useActiveSection(navSectionIds);
  const isActive = (href: string) => href.slice(1) === activeSection;

  return (
    <header
      ref={headerRef}
      className={cn("sticky top-0 z-40 px-gutter pt-3", onInk && "tone-ink")}
    >
      <div className="relative mx-auto max-w-[calc(1440px_-_2_*_var(--gutter))]">
        <GlassGroup
          self={false}
          className="flex h-16 items-center justify-between gap-2"
        >
          <GlassShape
            radius={CAPSULE_RADIUS}
            className="flex h-16 items-center pr-5 pl-5"
          >
            <Link
              href={linkBase || "#top"}
              aria-label={`${siteConfig.name} home`}
              className="inline-flex min-h-11 items-center gap-2.5"
              onClick={closeMenu}
            >
              <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-btn text-btn-fg">
                <NotchGlyph className="size-5" />
              </span>
              <span className="font-display text-lg leading-none font-extrabold tracking-[-.01em]">
                {siteConfig.name}
              </span>
            </Link>
          </GlassShape>

          <GlassShape
            radius={CAPSULE_RADIUS}
            className="hidden h-16 items-center px-2 lg:flex"
          >
            <nav aria-label="Main">
              <GlassLensTrack lensRadius={20} inset={2}>
                <ul className="flex items-center gap-0.5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={withBase(link.href, linkBase)}
                        aria-current={
                          isActive(link.href) ? "location" : undefined
                        }
                        className={cn(
                          linkStyles,
                          "after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-btn after:opacity-0 after:transition-opacity after:duration-200 aria-[current=location]:text-foreground aria-[current=location]:after:opacity-100",
                        )}
                        {...LENS_ITEM}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GlassLensTrack>
            </nav>
          </GlassShape>

          <GlassShape
            radius={CAPSULE_RADIUS}
            className="flex h-16 items-center gap-1 px-2 sm:gap-2 sm:pr-3"
          >
            <GlassLensTrack
              lensRadius={22}
              inset={1}
              className="flex items-center gap-1"
            >
              <span className="max-sm:hidden" {...LENS_ITEM}>
                <ThemeToggle />
              </span>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="landing-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="relative order-last inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[.9375rem] font-medium lg:hidden"
                {...LENS_ITEM}
              >
                {menuOpen ? (
                  <CloseIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
                <span className="sr-only sm:not-sr-only">Menu</span>
              </button>
            </GlassLensTrack>
            {/* Phones: inside the menu instead, so the bar is logo + Menu. */}
            <AccessButton size="md" className="max-sm:hidden" />
          </GlassShape>
        </GlassGroup>

        {/* Phone and tablet menu: grows out of the Menu button with a spring,
            and closes quickly. */}
        <div
          id="landing-menu"
          inert={!menuOpen}
          className={cn(
            "absolute inset-x-0 top-full mt-2 origin-top-right motion-reduce:transition-none sm:left-auto sm:w-72 lg:hidden",
            menuOpen
              ? "scale-100 opacity-100 transition-[opacity,scale,translate] duration-500 ease-spring"
              : "pointer-events-none -translate-y-2 scale-[.85] opacity-0 transition-[opacity,scale,translate] duration-200 ease-notch",
          )}
        >
          {/* Heavier frost than the bar: the items must read over anything. */}
          <GlassGroup
            radius={20}
            className="rounded-[20px] p-1.5 [--glass-fill:color-mix(in_srgb,var(--glass-solid)_94%,transparent)]"
          >
            <nav aria-label="Menu">
              <GlassLensTrack lensRadius={14} inset={1}>
                <ul className="grid gap-0.5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={withBase(link.href, linkBase)}
                        onClick={closeMenu}
                        aria-current={
                          isActive(link.href) ? "location" : undefined
                        }
                        className="relative flex min-h-12 w-full items-center justify-between rounded-[14px] px-3 text-base font-medium after:size-1.5 after:rounded-full after:bg-current after:opacity-0 aria-[current=location]:after:opacity-100"
                        {...LENS_ITEM}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 flex items-center justify-between border-t border-line pt-1 pl-3 sm:hidden">
                    <span className="text-base text-muted">Theme</span>
                    <ThemeToggle />
                  </li>
                  <li className="p-1.5 pt-2 sm:hidden">
                    <AccessButton className="w-full" />
                  </li>
                </ul>
              </GlassLensTrack>
            </nav>
          </GlassGroup>
        </div>
      </div>
    </header>
  );
}
