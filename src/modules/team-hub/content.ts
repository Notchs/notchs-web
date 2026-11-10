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
      { name: "Homepage", href: "/", note: "Mobile and desktop" },
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
      {
        name: "My Notchs (passport)",
        code: "C1–C4, C13",
        href: "/passport",
        note: "Needs a customer login (WhatsApp)",
      },
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
        name: "Venue log in and application",
        code: "E1, E2",
        href: "/venue/login",
      },
      {
        name: "Set your password",
        href: "/venue/set-password",
        note: "Normally opened from the email link",
      },
      {
        name: "Counter setup",
        code: "E3",
        href: "/venue/counter",
        note: "Pairing link and phone status, on real data",
      },
      {
        name: "Counter screen with the QR",
        code: "E4",
        href: "/venue/display",
        note: "Open the pairing link on the counter phone first",
      },
      {
        name: "Venue dashboard",
        href: "/venue",
        note: "Real numbers on Overview, Visits, Guests and Counter. Analytics, Reviews, Discover and Rewards show labelled example data on test links (live: Opens soon)",
      },
      {
        name: "Venue page and profile",
        href: "/venue/profile",
        note: "The owner edits their place on real data; photos come later",
      },
      {
        name: "Venue billing",
        href: "/venue/billing",
        note: "₹0 for 3 months, then charges; founding discount on real data",
      },
    ],
  },
  {
    title: "Notchs team",
    screens: [
      {
        name: "Admin log in",
        href: "/admin/login",
        note: "Admins are created with the API's create-admin command",
      },
      {
        name: "Admin dashboard",
        href: "/admin",
        note: "Real totals; needs an admin login",
      },
      {
        name: "Admin: Applications",
        href: "/admin/applications",
        note: "Approve or reject venues that registered",
      },
      {
        name: "Admin: Claims",
        href: "/admin/claims",
        note: "Bill photos when a counter phone was down: approve or reject",
      },
      {
        name: "Admin: Venues",
        href: "/admin/venues",
        note: "Pause, resume, close",
      },
      {
        name: "Admin: Customers",
        href: "/admin/customers",
        note: "Block, unblock",
      },
      {
        name: "Admin: Notchs",
        href: "/admin/notchs",
        note: "Remove fraudulent Notchs",
      },
      {
        name: "Admin: Settings",
        href: "/admin/settings",
        note: "Add admins and reviewers, change roles, turn them off",
      },
    ],
  },
];
