"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminConfig } from "@/config/admin";
import { cn } from "@/shared/lib/cn";

import { adminContent, adminSections, type AdminSectionKey } from "../content";
import { SectionIcon } from "./section-icon";

const subscribeNever = () => () => {};

/** "/admin/venues" -> "/venues"; other paths unchanged. */
function withoutAppPath(path: string) {
  const { appPath } = adminConfig;
  return path === appPath || path.startsWith(`${appPath}/`)
    ? path.slice(appPath.length) || "/"
    : path;
}

/**
 * Accepts both /venues (admin host) and /admin/venues (rewritten path, and
 * the links on team builds, where the panel lives under /admin).
 */
function sectionFor(pathname: string): AdminSectionKey | null {
  const path = withoutAppPath(pathname);
  const match = adminSections.find(({ href }) => {
    const section = withoutAppPath(href);
    return section === "/"
      ? path === "/"
      : path === section || path.startsWith(`${section}/`);
  });
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
