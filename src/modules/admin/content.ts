import type { Metadata } from "next";

import { adminRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export type AdminSectionKey = keyof typeof adminRoutes;

type AdminSection = {
  key: AdminSectionKey;
  label: string;
  href: string;
  description: string;
};

/** Sidebar order. Each section has a page under src/app/admin. */
export const adminSections: readonly AdminSection[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: adminRoutes.dashboard,
    description: "Venues, customers and Notchs at a glance.",
  },
  {
    key: "venues",
    label: "Venues",
    href: adminRoutes.venues,
    description: "The places where customers collect Notchs.",
  },
  {
    key: "customers",
    label: "Customers",
    href: adminRoutes.customers,
    description: "People who log in with WhatsApp and collect Notchs.",
  },
  {
    key: "notchs",
    label: "Notchs",
    href: adminRoutes.notchs,
    description: "Every verified visit, newest first.",
  },
  {
    key: "settings",
    label: "Settings",
    href: adminRoutes.settings,
    description: "Admin users and panel settings.",
  },
];

export const adminSectionByKey = (key: AdminSectionKey) =>
  adminSections.find((section) => section.key === key) ?? adminSections[0];

export const adminContent = {
  badge: "Admin",
  home: `${siteConfig.name} admin home`,
  nav: "Admin",
  menu: "Menu",
  pendingTitle: "Connects when the API is ready",
  pendingBody:
    "This section is laid out and waiting for its backend endpoints. Data shows up here once they are live.",
  stats: [
    { label: "Venues", hint: "Live and onboarding" },
    { label: "Customers", hint: "With at least one Notch" },
    { label: "Notchs this month", hint: "Verified visits" },
    { label: "New this week", hint: "First-time customers" },
  ],
  emptyValue: "—",
} as const;

const adminTitle = `${siteConfig.name} Admin`;

/** Shared by every admin page: never indexed. */
export const adminMetadata: Metadata = {
  title: adminTitle,
  robots: { index: false, follow: false },
};

/**
 * Absolute, because a layout's title template skips the page in its own
 * folder (the dashboard), and the root "· Notchs" template must not apply.
 */
export const adminSectionMetadata = (key: AdminSectionKey): Metadata => ({
  title: { absolute: `${adminSectionByKey(key).label} · ${adminTitle}` },
});
