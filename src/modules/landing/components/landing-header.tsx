"use client";

import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { CloseIcon, MenuIcon } from "@/shared/components/icons";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";

import { navLinks } from "../content";
import { AccessButton } from "./access-button";

const linkStyles =
  "inline-flex min-h-12 items-center rounded-lg px-3 text-[.9375rem] font-medium text-muted transition-colors duration-150 hover:text-foreground";

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-background transition-colors duration-200",
        scrolled || menuOpen ? "border-line" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-3 px-gutter">
        <a
          href="#top"
          aria-label={`${siteConfig.name} home`}
          className="inline-flex min-h-12 items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <NotchGlyph className="size-6" />
          <span className="font-display text-[1.0625rem] leading-none font-extrabold tracking-[-.01em]">
            {siteConfig.name}
          </span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkStyles}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <AccessButton size="sm" />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="landing-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 inline-flex min-h-12 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[.9375rem] font-medium lg:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
            <span className="sr-only sm:not-sr-only">Menu</span>
          </button>
        </div>
      </div>

      {/* Phone and tablet menu: slides open by animating the grid row. */}
      <div
        id="landing-menu"
        inert={!menuOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-notch motion-reduce:transition-none lg:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <nav aria-label="Menu" className="px-gutter pb-4">
            <ul className="grid gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      linkStyles,
                      "w-full text-base text-foreground hover:bg-block/60",
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="flex items-center justify-between px-3 pt-2 sm:hidden">
                <span className="text-base text-muted">Theme</span>
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
