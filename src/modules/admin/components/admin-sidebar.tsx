"use client";

import { useState } from "react";
import Link from "next/link";

import { adminRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { CloseIcon, MenuIcon } from "@/shared/components/icons";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";

import { adminContent } from "../content";
import { AdminNav } from "./admin-nav";

function AdminBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href={adminRoutes.dashboard}
      aria-label={adminContent.home}
      onClick={onNavigate}
      className="inline-flex min-h-11 items-center gap-2.5"
    >
      <NotchGlyph className="size-5.5" />
      <span className="font-display text-base leading-none font-extrabold tracking-[-.01em]">
        {siteConfig.name}
      </span>
      <span className="rounded-full bg-ink px-2 py-0.5 text-[.6875rem] font-semibold tracking-[.08em] text-volt uppercase">
        {adminContent.badge}
      </span>
    </Link>
  );
}

/**
 * Desktop: a fixed column with the brand, section links and theme toggle.
 * Phones and tablets: a top bar whose menu slides the links open.
 */
export function AdminSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <aside className="sticky top-0 z-40 border-b border-line bg-background lg:flex lg:h-svh lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex h-16 items-center justify-between gap-3 px-gutter lg:h-20 lg:px-5">
        <AdminBrand onNavigate={closeMenu} />
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="admin-menu"
            aria-label={adminContent.menu}
            onClick={() => setMenuOpen((open) => !open)}
            className="-mr-2 inline-grid size-11 cursor-pointer place-items-center rounded-lg"
          >
            {menuOpen ? (
              <CloseIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Phones and tablets: slides open by animating the grid row. */}
      <div
        id="admin-menu"
        inert={!menuOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-notch motion-reduce:transition-none lg:hidden",
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="px-gutter pb-4">
            <AdminNav onNavigate={closeMenu} />
          </div>
        </div>
      </div>

      {/* Desktop column. */}
      <div className="hidden flex-1 flex-col px-3 pb-4 lg:flex">
        <AdminNav />
        <div className="mt-auto flex items-center justify-between border-t border-line px-3 pt-4 text-sm text-muted">
          {siteConfig.name} {adminContent.badge}
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
