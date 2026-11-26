"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { HomeIcon, TrophyIcon, UserIcon } from "@/shared/components/icons";
import { GlassGroup, GlassShape } from "@/shared/components/glass/glass-group";
import {
  GlassLensTrack,
  LENS_ITEM,
} from "@/shared/components/glass/glass-lens-track";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";
import { cn } from "@/shared/lib/cn";
import { useInkGround } from "@/shared/lib/glass/use-ink-ground";

import { shellContent } from "../content";
import { getMe, isLoggedOut } from "../lib/api";
import { USES_MOCK } from "../lib/config";
import { useLoad } from "../lib/use-load";
import { AccountMenu } from "./account-menu";
import { MeContext } from "./me-context";
import { NotificationsMenu } from "./notifications-menu";
import { LoadError, Loading } from "./states";

const { nav } = shellContent;

/** Height and corner radius of the bar's glass capsules, px. */
const CAPSULE_RADIUS = 32;

const tabs = [
  { href: routes.passport, label: nav.home, Icon: HomeIcon },
  { href: routes.passportNotchs, label: nav.notchs, Icon: NotchGlyph },
  {
    href: routes.passportLeaderboard,
    label: nav.leaderboard,
    Icon: TrophyIcon,
  },
  { href: routes.passportProfile, label: nav.profile, Icon: UserIcon },
];

/** Home matches itself only; other tabs also cover their sub-pages. */
const isCurrent = (pathname: string, href: string) =>
  pathname === href ||
  (href !== routes.passport && pathname.startsWith(`${href}/`));

/**
 * Frame for every passport page: the landing page's glass header (logo, nav,
 * account menu) and, on phones, an app-style tab bar along the bottom in
 * place of the header's nav. Loads the customer once; someone who
 * isn't logged in goes to the login page.
 */
export function PassportShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const me = useLoad(getMe);
  const { data, setData } = me;
  const loggedOut = isLoggedOut(me.error);
  const headerRef = useRef<HTMLElement>(null);
  const onInk = useInkGround(headerRef);

  useEffect(() => {
    if (loggedOut) router.replace(routes.login);
  }, [loggedOut, router]);

  const context = useMemo(
    () => (data ? { me: data, setMe: setData } : null),
    [data, setData],
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn("sticky top-0 z-40 px-gutter pt-3", onInk && "tone-ink")}
      >
        {/* Same bar as the landing page: three glass capsules. */}
        <GlassGroup
          self={false}
          className="mx-auto flex h-16 max-w-[calc(1440px_-_2_*_var(--gutter))] items-center justify-between gap-2"
        >
          <GlassShape
            radius={CAPSULE_RADIUS}
            className="flex h-16 items-center px-5"
          >
            <Link
              href={routes.passport}
              aria-label={`${siteConfig.name} passport home`}
              className="inline-flex min-h-11 items-center gap-2.5"
            >
              <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-btn text-btn-fg">
                <NotchGlyph className="size-5" />
              </span>
              <span className="font-display text-lg leading-none font-extrabold tracking-[-.01em]">
                {siteConfig.name}
              </span>
            </Link>
          </GlassShape>

          {/* Phones use the tab bar along the bottom instead. */}
          <GlassShape
            radius={CAPSULE_RADIUS}
            className="hidden h-16 items-center px-2 sm:flex"
          >
            <nav aria-label={nav.label}>
              <GlassLensTrack lensRadius={20} inset={2}>
                <ul className="flex items-center gap-0.5">
                  {tabs.slice(0, 3).map((tab) => (
                    <li key={tab.href}>
                      <Link
                        href={tab.href}
                        aria-current={
                          isCurrent(pathname, tab.href) ? "page" : undefined
                        }
                        className="relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[.9375rem] font-medium whitespace-nowrap text-muted transition-colors duration-150 after:absolute after:bottom-1.5 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-btn after:opacity-0 after:transition-opacity after:duration-200 hover:text-foreground focus-visible:text-foreground aria-[current=page]:text-foreground aria-[current=page]:after:opacity-100"
                        {...LENS_ITEM}
                      >
                        {tab.label}
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
              <span {...LENS_ITEM}>
                <ThemeToggle />
              </span>
              <span {...LENS_ITEM}>
                <NotificationsMenu />
              </span>
            </GlassLensTrack>
            {/* Phones reach the profile from the bottom tab bar. */}
            {data && (
              <span className="max-sm:hidden">
                <AccountMenu name={data.name} photoUrl={data.photo_url} />
              </span>
            )}
          </GlassShape>
        </GlassGroup>
      </header>

      <main className="px-gutter pt-6 pb-10 sm:pt-8 sm:pb-14">
        <div className="mx-auto w-full max-w-[1180px]">
          {USES_MOCK && (
            <p className="mb-4 inline-flex rounded-full border border-dashed border-line px-2.5 py-1 text-[.6875rem] font-bold tracking-[.12em] text-muted uppercase">
              {shellContent.mockData}
            </p>
          )}
          {context ? (
            <MeContext.Provider value={context}>{children}</MeContext.Provider>
          ) : me.error && !loggedOut ? (
            <LoadError onRetry={me.reload} />
          ) : (
            <Loading />
          )}
        </div>
      </main>

      <nav
        aria-label={nav.label}
        className="sticky bottom-0 z-40 border-t border-line bg-background px-4 pt-2.5 pb-[max(14px,env(safe-area-inset-bottom))] sm:hidden"
      >
        <ul className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const current = isCurrent(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[.6875rem] font-medium text-muted",
                    current && "font-bold text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-8 w-14 place-items-center rounded-full transition-colors",
                      current && "bg-volt text-ink",
                    )}
                  >
                    <tab.Icon
                      className={cn(
                        "size-5.5",
                        tab.Icon === NotchGlyph && "size-4.5",
                      )}
                    />
                  </span>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
