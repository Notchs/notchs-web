"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { LiquidGlass } from "@/shared/components/glass/liquid-glass";
import { CloseIcon, MenuIcon } from "@/shared/components/icons";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { SNAPSHOT_IGNORE_ATTRIBUTE } from "@/shared/lib/glass/page-snapshot";
import { useInkGround } from "@/shared/lib/glass/use-ink-ground";

import { navLinks } from "../content";
import { useActiveSection } from "../lib/use-active-section";
import { AccessButton } from "./access-button";

/**
 * Primary text colour on the glass, like iPhone controls: clear glass can
 * sit over anything, and the muted colour would not stay readable.
 */
const linkStyles =
  "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[.9375rem] font-medium text-foreground transition-colors duration-150 hover:bg-glass-tint";

/** Height and corner radius of the bar's glass capsules, px. */
const CAPSULE_RADIUS = 32;
const MENU_RADIUS = 20;

/**
 * The capsules' lens: a clear rim that bends what's behind it, and a light
 * frost behind the text.
 */
const capsuleGlass = {
  radius: CAPSULE_RADIUS,
  bezel: 22,
  depth: 26,
  rimBlur: 1,
  coreBlur: 7,
  bare: true,
} as const;

const capsuleStyles = "glass-liquid flex h-16 items-center rounded-[32px]";

const sectionIds = navLinks.map((link) => link.href.slice(1));

/**
 * A link to a section of the page. The section being read gets the active
 * state: an Ink pill (Paper in dark) with the Notchs corner cut, plus
 * `aria-current`, so it never relies on the glass. The pill is an inner
 * layer so its cut doesn't clip the link's focus ring.
 */
function SectionLink({
  href,
  label,
  active,
  className,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  className: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className={cn(
        className,
        "duration-350 ease-notch motion-reduce:transition-none",
        active &&
          "text-background hover:text-background focus-visible:text-background",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 rounded-xl bg-foreground transition-opacity duration-350 ease-notch clip-notch motion-reduce:transition-none",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <span className="relative">{label}</span>
    </a>
  );
}

/**
 * Closes the menu on Escape (focus goes back to the Menu button) or on a
 * tap outside the header.
 */
function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void,
  returnFocusTo: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      close();
      returnFocusTo.current?.focus();
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
  }, [ref, open, close, returnFocusTo]);
}

/**
 * The top bar as iPhone-style Liquid Glass: three clear capsules (brand,
 * links, actions) that float over the page. In Chromium the content behind
 * bends live at each capsule's rounded rim, with a light frost behind the
 * text and light catching the edge; Safari and Firefox get the same clear
 * glass without the bend. No page snapshot, so it's always up to date and
 * costs almost nothing. Over Ink panels the glass turns dark so it stays
 * readable. On phones and tablets the links open in a glass panel that grows
 * out of the Menu button.
 */
export function LandingHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useDismiss(headerRef, menuOpen, closeMenu, menuButtonRef);
  const onInk = useInkGround(headerRef);
  const activeSection = useActiveSection(sectionIds);

  return (
    <header
      ref={headerRef}
      // Live glass, so other glass must not bend a picture of it.
      {...{ [SNAPSHOT_IGNORE_ATTRIBUTE]: "" }}
      className={cn("sticky top-0 z-40 px-gutter pt-3", onInk && "tone-ink")}
    >
      <div className="relative mx-auto max-w-[calc(1440px_-_2_*_var(--gutter))]">
        <div className="flex h-16 items-center justify-between gap-2">
          <LiquidGlass {...capsuleGlass} className={capsuleStyles}>
            <a
              href="#top"
              aria-label={`${siteConfig.name} home`}
              className="inline-flex min-h-11 items-center gap-2.5 px-5"
              onClick={closeMenu}
            >
              <NotchGlyph className="size-6" />
              <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-.01em]">
                {siteConfig.name}
              </span>
            </a>
          </LiquidGlass>

          <LiquidGlass
            {...capsuleGlass}
            className={cn(capsuleStyles, "hidden px-2 lg:flex")}
          >
            <nav aria-label="Main">
              <ul className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <SectionLink
                      href={link.href}
                      label={link.label}
                      active={link.href.slice(1) === activeSection}
                      className={linkStyles}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </LiquidGlass>

          <LiquidGlass
            {...capsuleGlass}
            className={cn(capsuleStyles, "gap-1 pr-3 pl-2 sm:gap-2")}
          >
            <span className="max-sm:hidden">
              <ThemeToggle />
            </span>
            {/* Phones: in the menu instead, so the bar fits the screen. */}
            <a href={routes.login} className={cn(linkStyles, "max-sm:hidden")}>
              Login
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="landing-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="relative inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[.9375rem] font-medium transition-colors duration-150 hover:bg-glass-tint lg:hidden"
            >
              {menuOpen ? (
                <CloseIcon className="size-5" />
              ) : (
                <MenuIcon className="size-5" />
              )}
              <span className="sr-only sm:not-sr-only">Menu</span>
            </button>
            <AccessButton size="sm" />
          </LiquidGlass>
        </div>

        {/* Phone and tablet menu: grows out of the Menu button (200ms, both
            ways; none with reduced motion). */}
        <div
          id="landing-menu"
          inert={!menuOpen}
          className={cn(
            "absolute inset-x-0 top-full mt-2 origin-top-right transition-[opacity,scale,translate] duration-200 ease-notch motion-reduce:transition-none sm:left-auto sm:w-72 lg:hidden",
            menuOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[.85] opacity-0",
          )}
        >
          {/* More frost behind the items than the bar: they must read over
              anything. The rim stays clear and bends. */}
          <LiquidGlass
            radius={MENU_RADIUS}
            bezel={18}
            depth={30}
            rimBlur={2}
            coreBlur={18}
            bare
            className="glass-liquid rounded-[20px] p-1.5 glass-liquid-strong"
          >
            <nav aria-label="Menu">
              <ul className="grid gap-0.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <SectionLink
                      href={link.href}
                      label={link.label}
                      active={link.href.slice(1) === activeSection}
                      onClick={closeMenu}
                      className="relative flex min-h-12 w-full items-center rounded-[14px] px-3 text-base font-medium transition-colors hover:bg-glass-tint"
                    />
                  </li>
                ))}
                <li className="sm:hidden">
                  <a
                    href={routes.login}
                    onClick={closeMenu}
                    className="relative flex min-h-12 w-full items-center rounded-[14px] px-3 text-base font-medium transition-colors hover:bg-glass-tint"
                  >
                    Login
                  </a>
                </li>
                <li className="mt-1 flex items-center justify-between border-t border-line pt-1 pl-3 sm:hidden">
                  <span className="text-base">Theme</span>
                  <ThemeToggle />
                </li>
              </ul>
            </nav>
          </LiquidGlass>
        </div>
      </div>
    </header>
  );
}
