"use client";

import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { env } from "@/config/env";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { cn } from "@/shared/lib/cn";

import { content, venueMenuItems, venueNavItems } from "../../content";
import { useDismiss } from "../../hooks/use-dismiss";
import { useLogOut } from "../../hooks/use-log-out";
import { useSession } from "../../hooks/use-session";
import { GuardedLink } from "../ui/guarded-link";
import { Icon } from "../ui/icon";

const isActive = (pathname: string, href: string, exact?: boolean) =>
  exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

/**
 * Full width on desktop, an icon rail on tablets, and a slide-in drawer on
 * phones. Labels hide on the rail only.
 */
export function VenueSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const label = "sm:hidden wide:inline";

  return (
    <aside
      aria-label={content.shell.navigationLabel}
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-[272px] -translate-x-[102%] flex-col gap-px border-r border-line bg-card px-2.5 py-3.5 transition-transform duration-260 ease-notch sm:static sm:w-auto sm:translate-x-0",
        open && "translate-x-0 shadow-[0_0_60px_-10px_rgb(15_15_20/0.4)]",
      )}
    >
      <div className="mb-2 flex items-center gap-2.5 border-b border-line px-2 pb-3.5 sm:justify-center sm:px-0 wide:justify-start wide:px-2">
        <span className="grid size-8 flex-none place-items-center rounded-lg bg-ink text-volt">
          <NotchGlyph className="size-4.5" />
        </span>
        <span className={cn("flex flex-col", label)}>
          <b className="block font-display text-lg leading-none tracking-[-.02em]">
            {content.shell.brand}
          </b>
          <span className="block font-mono text-[10px] tracking-[.08em] text-muted">
            {content.shell.forVenues}
          </span>
        </span>
      </div>

      <nav
        aria-label={content.shell.mainNavigation}
        className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-x-hidden overflow-y-auto"
      >
        {venueNavItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <GuardedLink
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-[10px] px-3 text-sm whitespace-nowrap transition-colors duration-150 hover:bg-ink/5 sm:justify-center sm:px-0 wide:justify-start wide:px-3",
                active &&
                  "bg-ink font-semibold text-volt shadow-[inset_3px_0_0_var(--volt)] hover:bg-ink",
              )}
            >
              <Icon name={item.icon} size={18} />
              <span className={cn("truncate", label)}>{item.label}</span>
            </GuardedLink>
          );
        })}
      </nav>

      <VenueMenu pathname={pathname} labelClass={label} onNavigate={onClose} />
    </aside>
  );
}

function VenueMenu({
  pathname,
  labelClass,
  onNavigate,
}: {
  pathname: string;
  labelClass: string;
  onNavigate: () => void;
}) {
  const { data } = useSession();
  const session = data?.session;
  const logOut = useLogOut();
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useDismiss(container, open, () => setOpen(false));
  const inMenu = venueMenuItems.some((item) => isActive(pathname, item.href));
  const menuItem =
    "flex cursor-pointer items-center gap-2.5 rounded-lg p-2.5 text-sm hover:bg-ink/5";
  const close = () => {
    setOpen(false);
    onNavigate();
  };

  return (
    <div
      ref={container}
      className={cn(
        "relative mt-2 border-t border-line pt-2.5",
        // The team preview's "All pages" link sits in this corner.
        env.siteAccess === "team" && "pb-11",
      )}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        title={content.shell.venueMenu(session?.venueName ?? "")}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2.5 rounded-xl p-2 text-left hover:bg-ink/5 aria-expanded:bg-ink/5 sm:justify-center sm:px-0 wide:justify-start wide:px-2",
          inMenu && "shadow-[inset_0_0_0_1.5px_var(--ink)]",
        )}
      >
        <span className="grid size-9 flex-none place-items-center rounded-[10px] bg-ink font-display text-sm text-paper">
          {session?.venueInitial}
        </span>
        <span className={cn("min-w-0 flex-1", labelClass)}>
          <b className="block truncate text-sm">{session?.venueName}</b>
          <span className="block truncate text-xs text-muted">
            {session &&
              [session.area, session.city].filter(Boolean).join(" · ")}
          </span>
        </span>
        <span className={cn("text-muted", labelClass)}>
          <Icon name="chevUD" size={16} />
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-[calc(100%+8px)] left-1.5 z-50 flex w-[calc(100%-12px)] min-w-55 animate-pop flex-col gap-0.5 rounded-xl border border-ink/16 bg-card p-1.5 shadow-[0_16px_40px_-16px_rgb(15_15_20/0.35)] sm:bottom-0 sm:left-[calc(100%+12px)] sm:w-62 wide:bottom-[calc(100%+8px)] wide:left-1.5 wide:w-[calc(100%-12px)]"
        >
          <div className="p-2.5">
            <b className="block text-sm">
              {session && `${session.memberName} · ${session.memberRole}`}
            </b>
            <span className="block truncate text-xs text-muted">
              {session?.memberEmail}
            </span>
          </div>
          <span className="my-1 h-px bg-line" />
          {venueMenuItems.map((item) => (
            <GuardedLink
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={close}
              className={cn(
                menuItem,
                isActive(pathname, item.href) && "bg-ink/5 font-semibold",
              )}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </GuardedLink>
          ))}
          <span className="my-1 h-px bg-line" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              logOut();
            }}
            className={cn(
              menuItem,
              "w-full text-left text-unnotched hover:bg-unnotched/8",
            )}
          >
            <Icon name="logout" size={18} />
            {content.shell.logOut}
          </button>
        </div>
      )}
    </div>
  );
}
