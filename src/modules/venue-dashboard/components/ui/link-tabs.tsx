import { cn } from "@/shared/lib/cn";

import { GuardedLink } from "./guarded-link";

/** Tabs that are real pages, so each has its own URL. */
export function LinkTabs({
  tabs,
  current,
  label,
}: {
  tabs: readonly { href: string; label: string }[];
  current: string;
  label: string;
}) {
  return (
    <nav
      aria-label={label}
      className="inline-flex max-w-full gap-1 self-start overflow-x-auto rounded-xl bg-block p-1"
    >
      {tabs.map((tab) => (
        <GuardedLink
          key={tab.href}
          href={tab.href}
          aria-current={tab.href === current ? "page" : undefined}
          className={cn(
            "flex h-9 items-center rounded-[9px] px-3.5 text-sm font-semibold whitespace-nowrap text-muted transition-colors duration-150",
            tab.href === current &&
              "bg-card text-ink shadow-[0_1px_0_rgb(15_15_20/0.16)]",
          )}
        >
          {tab.label}
        </GuardedLink>
      ))}
    </nav>
  );
}
