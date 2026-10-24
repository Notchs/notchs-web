import type { Metadata } from "next";

export const teamHubMetadata: Metadata = {
  title: "All pages",
  robots: { index: false, follow: false },
};

export const hubContent = {
  kicker: "Team preview",
  title: "All pages.",
  description:
    "Every screen from the Notchs mockups in one place. Built pages open here behind the team login. The public site doesn't change until launch.",
  built: "Built",
  notBuilt: "Not built yet",
  bar: "All pages",
  barLabel: "Team preview: all pages",
} as const;

export type HubScreen = {
  name: string;
  /** Screen code from the mockups, e.g. "C3". */
  code?: string;
  /** Set once the page is built. Paths as on team builds (admin under /admin). */
  href?: string;
  note?: string;
};

export type HubSection = { title: string; screens: readonly HubScreen[] };

/**
 * The mockups ("UI mockups for Notchs"), grouped by who uses them. Add an
 * href when a page is built. Paths match src/config/routes.ts and adminRoutes.
 */
export const hubSections: readonly HubSection[] = [
  {
    title: "Public website",
    screens: [
      {
        name: "Homepage",
        href: "/",
        note: "Mobile and desktop; glass header marks the section you're on",
      },
      { name: "Waitlist form", note: "Name, WhatsApp, city, area, consent" },
      { name: "Shared Notch Card page", code: "A12" },
      {
        name: "City and area pages",
        note: "e.g. /ahmedabad/cafes, once real verified-visit data exists",
      },
    ],
  },
  {
    title: "Customer",
    screens: [
      { name: "Log in with WhatsApp", href: "/login" },
      {
        name: "Logging you in",
        href: "/login/verify",
        note: "Normally opened from the link the WhatsApp bot sends",
      },
      { name: "My Notchs (passport)", code: "C1–C4, C13" },
      { name: "Notch Card reveal and past cards", code: "C9, C10" },
      {
        name: "WhatsApp bot replies",
        code: "B1–B10",
        note: "Messages in WhatsApp, built in the API",
      },
    ],
  },
  {
    title: "Venue",
    screens: [
      {
        name: "Venue log in and sign-up",
        code: "E1, E2",
        href: "/venue/login",
      },
      {
        name: "Set your password",
        href: "/venue/set-password",
        note: "Normally opened from the email link",
      },
      { name: "Counter setup", code: "E3" },
      { name: "Counter screen with the QR", code: "E4" },
      { name: "Venue dashboard", note: "Venue App mockup" },
    ],
  },
  {
    title: "Notchs team",
    screens: [
      {
        name: "Admin dashboard",
        href: "/admin",
        note: "Screens only, not connected to real data yet",
      },
      { name: "Admin: Venues", href: "/admin/venues" },
      { name: "Admin: Customers", href: "/admin/customers" },
      { name: "Admin: Notchs", href: "/admin/notchs" },
      { name: "Admin: Settings", href: "/admin/settings" },
    ],
  },
];
