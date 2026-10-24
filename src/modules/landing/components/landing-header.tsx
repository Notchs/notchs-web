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
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { CloseIcon, MenuIcon } from "@/shared/components/icons";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { SNAPSHOT_IGNORE_ATTRIBUTE } from "@/shared/lib/glass/page-snapshot";
import { useInkGround } from "@/shared/lib/glass/use-ink-ground";

import { navLinks } from "../content";
import { useActiveSection } from "../lib/use-active-section";
import { AccessButton } from "./access-button";

const linkStyles =
  "relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[.9375rem] font-medium text-muted transition-colors duration-150 hover:text-foreground focus-visible:text-foreground";

/** Height and corner radius of the bar's glass capsules, px. */
const CAPSULE_RADIUS = 32;

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
      {...LENS_ITEM}
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
 * The top bar as Liquid Glass: three capsules (brand, links, actions) that
 * float over the page and bend it as it scrolls beneath. Pieces that come
 * close melt together; a glass lens follows the pointer or keyboard focus
 * along the links and actions, stretching a neck as it moves. Over Ink
 * panels the glass turns dark so it stays readable. On phones and tablets
 * the links open in a glass panel that grows out of the Menu button.
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
            className="flex h-16 items-center pr-5 pl-5"
          >
            <a
              href="#top"
              aria-label={`${siteConfig.name} home`}
              className="inline-flex min-h-11 items-center gap-2.5"
              onClick={closeMenu}
            >
              <NotchGlyph className="size-6" />
              <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-.01em]">
                {siteConfig.name}
              </span>
            </a>
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
                      <SectionLink
                        href={link.href}
                        label={link.label}
                        active={link.href.slice(1) === activeSection}
                        className={linkStyles}
                      />
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
            <GlassLensTrack
              lensRadius={22}
              inset={1}
              className="flex items-center gap-1"
            >
              <span className="max-sm:hidden" {...LENS_ITEM}>
                <ThemeToggle />
              </span>
              <a href={routes.login} className={linkStyles} {...LENS_ITEM}>
                Login
              </a>
              <button
                ref={menuButtonRef}
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
            <AccessButton size="sm" />
          </GlassShape>
        </GlassGroup>

        {/* Phone and tablet menu: grows out of the Menu button (200ms, both
            ways; none with reduced motion). An overlay, so the page snapshot
            the glass bends leaves it out. */}
        <div
          id="landing-menu"
          inert={!menuOpen}
          {...{ [SNAPSHOT_IGNORE_ATTRIBUTE]: "" }}
          className={cn(
            "absolute inset-x-0 top-full mt-2 origin-top-right transition-[opacity,scale,translate] duration-200 ease-notch motion-reduce:transition-none sm:left-auto sm:w-72 lg:hidden",
            menuOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[.85] opacity-0",
          )}
        >
          {/* Heavier frost than the bar: the items must read over anything. */}
          <GlassGroup
            floating
            radius={20}
            tintAmount={0.9}
            frost={1}
            className="rounded-[20px] p-1.5"
          >
            <nav aria-label="Menu">
              <GlassLensTrack lensRadius={14} inset={1}>
                <ul className="grid gap-0.5">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <SectionLink
                        href={link.href}
                        label={link.label}
                        active={link.href.slice(1) === activeSection}
                        onClick={closeMenu}
                        className="relative flex min-h-12 w-full items-center rounded-[14px] px-3 text-base font-medium transition-colors"
                      />
                    </li>
                  ))}
                  <li className="mt-1 flex items-center justify-between border-t border-line pt-1 pl-3 sm:hidden">
                    <span className="text-base text-muted">Theme</span>
                    <ThemeToggle />
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
