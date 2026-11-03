"use client";

import { venueRoutes } from "@/config/routes";

import { content } from "../../content";
import { useSession } from "../../hooks/use-session";
import { venueData } from "../../services/venue-data.service";
import type { NotificationKind } from "../../types";
import { GuardedLink } from "../ui/guarded-link";
import { Icon, type IconName } from "../ui/icon";
import { MenuPopover, menuItemStyles } from "./menu-popover";

const destination: Record<NotificationKind, { href: string; icon: IconName }> =
  {
    card: { href: venueRoutes.notchCard, icon: "image" },
    rating: { href: venueRoutes.reviews, icon: "star" },
  };

export function NotificationsMenu() {
  const { data, refresh } = useSession();
  const notifications = data?.notifications ?? [];
  const unread = notifications.filter((item) => !item.read).length;

  const markRead = () => {
    void venueData.markNotificationsRead().then(refresh);
  };

  return (
    <MenuPopover
      className="w-[min(300px,calc(100vw-24px))]"
      trigger={({ open, toggle }) => (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={content.shell.notificationsLabel(unread)}
          onClick={toggle}
          className="relative grid size-10 cursor-pointer place-items-center rounded-[10px] hover:bg-ink/5"
        >
          <Icon name="bell" />
          {unread > 0 && (
            <span className="absolute top-[9px] right-[9px] size-2 rounded-full bg-[#ff5b35] shadow-[0_0_0_2px_var(--paper)]" />
          )}
        </button>
      )}
    >
      {(close) => (
        <>
          <span className="flex items-center justify-between px-2.5 pt-2 pb-1 text-[11px] font-semibold tracking-[.08em] text-muted uppercase">
            {content.shell.notifications}
            {unread > 0 && (
              <button
                type="button"
                onClick={markRead}
                className="cursor-pointer font-medium tracking-normal normal-case underline underline-offset-2"
              >
                {content.shell.markAllRead}
              </button>
            )}
          </span>
          {notifications.map((item) => (
            <GuardedLink
              key={item.id}
              role="menuitem"
              href={destination[item.kind].href}
              onClick={() => {
                markRead();
                close();
              }}
              className={menuItemStyles}
            >
              <Icon name={destination[item.kind].icon} size={18} />
              <span className="min-w-0 flex-1">
                <b className="block text-sm">{item.title}</b>
                <span className="text-xs text-muted">{item.whenLabel}</span>
              </span>
              {!item.read && (
                <span className="size-2 flex-none rounded-full bg-[#ff5b35]" />
              )}
            </GuardedLink>
          ))}
        </>
      )}
    </MenuPopover>
  );
}
