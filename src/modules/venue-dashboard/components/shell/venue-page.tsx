"use client";

import { useContext, useEffect, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

import { content } from "../../content";
import type { ScenarioPage } from "../../mock/scenario";
import { VENUE_DATA_MODE } from "../../services/config";
import { Icon } from "../ui/icon";
import { NavigationDrawerContext } from "./navigation-drawer";
import { NotificationsMenu } from "./notifications-menu";
import { PreviewStateMenu } from "./preview-state-menu";

/**
 * Top bar plus scrolling body. The page's single h1 is the top bar title.
 */
export function VenuePage({
  title,
  scenarioPage,
  actions,
  children,
  bodyClassName,
}: {
  title: string;
  scenarioPage: ScenarioPage;
  actions?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}) {
  const openNavigation = useContext(NavigationDrawerContext);

  // Closes the phone navigation when a page opens underneath it.
  useEffect(() => {
    openNavigation?.(false);
  }, [openNavigation]);

  return (
    <main className="flex min-w-0 flex-col overflow-hidden">
      <header className="flex h-14 flex-none items-center gap-1.5 border-b border-line bg-background pr-2.5 pl-1.5 sm:h-16 sm:gap-3 sm:px-6">
        <button
          type="button"
          aria-label={content.shell.openNavigation}
          onClick={() => openNavigation?.(true)}
          className="grid size-10 flex-none cursor-pointer place-items-center rounded-[10px] hover:bg-ink/5 sm:hidden"
        >
          <Icon name="menu" />
        </button>
        <h1 className="m-0 min-w-0 truncate font-display text-[17px] leading-[1.1] tracking-[-.02em] sm:text-xl">
          {title}
        </h1>
        <div className="ml-auto flex flex-none items-center gap-2">
          {VENUE_DATA_MODE === "mock" && (
            <PreviewStateMenu page={scenarioPage} />
          )}
          {actions}
          <NotificationsMenu />
        </div>
      </header>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 *:shrink-0 sm:gap-5 sm:p-6",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </main>
  );
}
