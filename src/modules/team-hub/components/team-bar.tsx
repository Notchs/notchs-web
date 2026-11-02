import Link from "next/link";

import { routes } from "@/config/routes";

import { hubContent } from "../content";

/**
 * Small link to the All pages hub, in the corner of every page on team builds.
 * Rendered by app/layout.tsx only when env.siteAccess is "team".
 */
export function TeamBar() {
  return (
    <Link
      href={routes.teamHub}
      aria-label={hubContent.barLabel}
      className="fixed bottom-4 left-4 z-50 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-lg hover:bg-block"
    >
      {hubContent.bar}
    </Link>
  );
}
