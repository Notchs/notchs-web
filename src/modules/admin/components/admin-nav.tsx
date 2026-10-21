"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminConfig } from "@/config/admin";
import { cn } from "@/shared/lib/cn";

import { adminContent, adminSections, type AdminSectionKey } from "../content";
import { SectionIcon } from "./section-icon";

const subscribeNever = () => () => {};

/** Accepts both /venues (browser URL) and /admin/venues (rewritten path). */
function sectionFor(pathname: string): AdminSectionKey | null {
  const { appPath } = adminConfig;
  const path = pathname.startsWith(appPath)
    ? pathname.slice(appPath.length) || "/"
    : pathname;
  const match = adminSections.find(({ href }) =>
    href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`),
  );
  return match?.key ?? null;
}

/**
 * The section links. The active one is marked only after hydration: behind
 * the host rewrite, the server and browser see different paths.
 */
export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
  const active = hydrated ? sectionFor(pathname) : null;

  return (
    <nav aria-label={adminContent.nav}>
      <ul className="grid gap-1">
        {adminSections.map((section) => {
          const current = section.key === active;
          return (
            <li key={section.key}>
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl px-3 text-[.9375rem] font-medium transition-colors duration-150",
                  current
                    ? "bg-card text-foreground shadow-[inset_0_0_0_1px_var(--line)]"
                    : "text-muted hover:bg-block/60 hover:text-foreground",
                )}
              >
                <SectionIcon section={section.key} className="size-5" />
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
