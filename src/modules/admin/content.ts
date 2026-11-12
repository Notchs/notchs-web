import type { Metadata } from "next";

import { adminRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export type AdminSectionKey = Exclude<
  keyof typeof adminRoutes,
  "login" | "setPassword"
>;

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
    key: "applications",
    label: "Applications",
    href: adminRoutes.applications,
    description: "Venues that registered themselves, waiting for review.",
  },
  {
    key: "claims",
    label: "Claims",
    href: adminRoutes.claims,
    description:
      "Bill photos from customers whose counter phone wasn’t working. Check them within 30 days: WhatsApp deletes photos after that.",
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
    description:
      "People who collect Notchs. Only the last 4 digits of a number show.",
  },
  {
    key: "notchs",
    label: "Notchs",
    href: adminRoutes.notchs,
    description: "Every Notch, newest first. Remove fraudulent ones here.",
  },
  {
    key: "settings",
    label: "Settings",
    href: adminRoutes.settings,
    description:
      "The team’s admin accounts. Admins can do everything; reviewers can view and check bill-photo claims.",
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
  emptyValue: "—",
  empty: "Nothing here yet.",
  loading: "Loading…",
  loadFailed: "Couldn't load this. Check the connection and try again.",
  retry: "Try again",
  actionFailed: "That didn't go through. Please try again.",
  previous: "Previous",
  next: "Next",
  totalLabel: (total: number) => `${total.toLocaleString("en-IN")} in total`,
  dashboard: {
    live: "Live venues",
    liveHint: (signed: number, paused: number) =>
      `${signed} approved, not live yet · ${paused} paused`,
    applications: "Applications to review",
    applicationsHint: "Venues waiting for approval",
    customers: "Customers",
    customersHint: (fresh: number) => `${fresh} new in the last 7 days`,
    notchs: "Notchs today",
    notchsHint: (week: number, refused: number) =>
      `${week} in the last 7 days · ${refused} scans refused today`,
  },
  venues: {
    search: "Search name or code",
    status: "Status",
    statusOptions: [
      { value: "", label: "All" },
      { value: "counter_live", label: "Live" },
      { value: "signed", label: "Approved, not live" },
      { value: "paused", label: "Paused" },
      { value: "closed", label: "Closed" },
    ],
    statusLabel: {
      pending: "Pending",
      signed: "Approved",
      counter_live: "Live",
      paused: "Paused",
      closed: "Closed",
    } as Record<string, string>,
    category: {
      cafe: "Café",
      restaurant: "Restaurant",
      bar: "Bar",
      hotel: "Hotel",
      turf_gym: "Turf or gym",
      other: "Other",
    } as Record<string, string>,
    columns: [
      "Venue",
      "Kind · area",
      "Status",
      "Counter phone",
      "Notchs 7d / all",
      "Joined",
      "",
    ],
    notPaired: "Not paired",
    online: "Online",
    offline: "Offline",
    pause: "Pause",
    resume: "Resume",
    close: "Close",
    confirmClose: (name: string) =>
      `Close ${name}? Scans stop for good and it can't be reopened here.`,
  },
  notchs: {
    venueFilter: "Venue code",
    status: "Status",
    statusOptions: [
      { value: "", label: "All" },
      { value: "valid", label: "Counted" },
      { value: "revoked", label: "Removed" },
    ],
    statusLabel: { valid: "Counted", revoked: "Removed" },
    columns: ["Notch", "Venue", "Customer", "When", "Points", "Status", ""],
    deletedCustomer: "Deleted account",
    visitNo: (n: number) => `Visit ${n} here`,
    remove: "Remove",
    reasonPrompt: (notchNo: number, venue: string) =>
      `Why remove Notch #${notchNo} at ${venue}? It stops counting for ranks and rewards.`,
  },
  customers: {
    search: "Search handle or name",
    status: "Status",
    statusOptions: [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "blocked", label: "Blocked" },
    ],
    statusLabel: { active: "Active", blocked: "Blocked" },
    columns: [
      "Customer",
      "Phone",
      "City",
      "Notchs",
      "Founding",
      "Joined · last seen",
      "Status",
      "",
    ],
    block: "Block",
    unblock: "Unblock",
    confirmBlock: (handle: string) =>
      `Block ${handle}? Their scans stop counting and the bot stops replying.`,
  },
  applications: {
    status: "Status",
    statusOptions: [
      { value: "pending", label: "Waiting for review" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
    ],
    statusLabel: {
      pending: "Waiting",
      approved: "Approved",
      rejected: "Rejected",
    },
    category: {
      cafe: "Café",
      restaurant: "Restaurant",
      bar: "Bar",
      hotel: "Hotel",
      turf_gym: "Turf or gym",
      other: "Other",
    } as Record<string, string>,
    empty: "No applications here.",
    contact: "Contact",
    email: "Email",
    landmark: "Landmark",
    maps: "Location",
    openMaps: "Open in Google Maps",
    notes: "Notes",
    area: "Area",
    noArea: "Choose later",
    approve: "Approve",
    reject: "Reject",
    confirmApprove: (venue: string, email: string) =>
      `Approve ${venue}? This creates the venue and emails ${email} a link to set their password.`,
    rejectPrompt: (venue: string) =>
      `Reject ${venue}? Optionally write the reason; it is emailed to the applicant.`,
  },
  claims: {
    status: "Status",
    statusOptions: [
      { value: "in_review", label: "Waiting for review" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "awaiting_photo", label: "No photo yet" },
    ],
    statusLabel: {
      awaiting_photo: "No photo yet",
      in_review: "Waiting",
      approved: "Approved",
      rejected: "Rejected",
    } as Record<string, string>,
    empty: "No claims here.",
    customer: "Customer",
    visitDay: "Day of the visit",
    photoAt: "Photo sent",
    counter: "Counter phone last online",
    counterNever: "Never",
    reviewed: "Reviewed",
    reason: "Reason",
    notch: (no: number) => `Notch #${String(no).padStart(4, "0")}`,
    showPhoto: "Show bill photo",
    photoAlt: (venue: string) => `Bill photo for ${venue}`,
    photoGone:
      "The photo is no longer on WhatsApp (it keeps photos about 30 days).",
    photoFailed:
      "The photo didn’t load. WhatsApp may have deleted it, or try again.",
    approve: "Approve",
    reject: "Reject",
    confirmApprove: (venue: string, handle: string) =>
      `Approve ${handle}’s claim at ${venue}? This adds the Notch and its points.`,
    rejectPrompt: (venue: string) =>
      `Reject the claim at ${venue}? Write the reason (3 to 200 characters); the customer sees it.`,
    notified: "The customer was told on WhatsApp.",
    notNotified:
      "Saved. The customer sees it in their passport (WhatsApp only replies within 24 hours of their last message).",
  },
  system: {
    title: "System",
    intro:
      "Whether the API can really send messages. A “dry run” only writes them to the server log, so nobody receives anything.",
    email: "Email",
    whatsapp: "WhatsApp",
    botCheck: "Bot check on forms",
    links: "Links in messages open",
    emailState: {
      sending: "Sending",
      dry_run: "Dry run: emails are not sent",
      local_smtp: "Local test inbox: emails are not sent",
      not_configured: "Not set up: emails fail",
    } as Record<string, string>,
    emailFix:
      "On the API (Render → Environment) set EMAIL_DRY_RUN=false and RESEND_API_KEY, and verify the sending domain in Resend.",
    whatsappState: {
      sending: "Sending",
      dry_run: "Dry run: replies are not sent",
      not_configured: "Not set up: replies fail",
    } as Record<string, string>,
    whatsappFix:
      "On the API set WHATSAPP_DRY_RUN=false, WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.",
    webhookMissing:
      "Meta can't reach the bot yet: set WHATSAPP_APP_SECRET and WHATSAPP_VERIFY_TOKEN, then add the webhook in Meta.",
    numberMissing:
      "WHATSAPP_PUBLIC_NUMBER isn't set, so counter phones can't show a scan QR.",
    botState: {
      on: "On",
      off: "Off",
      not_configured: "Not set up: forms are refused",
    } as Record<string, string>,
    botFix: "On the API set TURNSTILE_SECRET (from Cloudflare Turnstile).",
    testEmail: "Send me a test email",
    testing: "Sending…",
    from: (address: string) => `From ${address}`,
    environment: (name: string, version: string) =>
      `API: ${name} · v${version}`,
  },
  password: {
    title: "Change my password",
    current: "Current password",
    next: "New password (10 or more characters)",
    save: "Change password",
    done: "Password changed. Other devices were logged out.",
  },
  settings: {
    adminsOnly:
      "Only admins can manage the team. Ask an admin to make changes.",
    addTitle: "Add someone",
    name: "Name",
    email: "Email",
    role: "Role",
    roles: [
      { value: "reviewer", label: "Reviewer" },
      { value: "admin", label: "Admin" },
    ],
    roleLabel: { admin: "Admin", reviewer: "Reviewer" } as Record<
      string,
      string
    >,
    add: "Add and email a link",
    added: (email: string) =>
      `Added. ${email} will get a link to set a password.`,
    head: ["Name", "Email", "Role", "Status", "Last login", ""],
    you: "You",
    active: "Active",
    off: "Turned off",
    noPassword: "Hasn’t set a password yet",
    turnOff: "Turn off",
    turnOn: "Turn on",
    sendLink: "Send new link",
    linkSent: "Sent a new link.",
    confirmOff: (name: string) =>
      `Turn off ${name}? They’re logged out straight away and can’t log in until turned back on.`,
  },
  auth: {
    loginTitle: "Log in",
    email: "Email",
    password: "Password",
    login: "Log in",
    loginHelp: "New admins get a link by email from the Notchs team.",
    forgot: "Forgot password?",
    forgotTitle: "Reset your password",
    forgotHelp:
      "Enter your admin email. We'll email you a link to set a new password.",
    forgotSend: "Email me a link",
    forgotSent:
      "If that email belongs to an admin, a link is on its way. Not there in a minute? Check spam.",
    backToLogin: "Back to log in",
    setTitle: "Set your password",
    newPassword: "New password (10 or more characters)",
    confirm: "Type it again",
    save: "Save and log in",
    mismatch: "The two passwords don't match.",
    noToken:
      "This page needs the link from your email. Ask the team for a new one.",
  },
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
