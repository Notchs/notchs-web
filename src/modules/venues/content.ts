import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { openGraphBase } from "@/shared/lib/metadata";

/** In-page sections the header links to. */
export const sectionIds = {
  howItWorks: "how-it-works",
  yourWeek: "your-week",
  founding: "founding",
} as const;

export const navLinks = [
  { label: "How it works", href: `#${sectionIds.howItWorks}` },
  { label: "Your week", href: `#${sectionIds.yourWeek}` },
  { label: "Founding Venues", href: `#${sectionIds.founding}` },
] as const;

export const accessLabel = "Get access";

export const heroContent = {
  kicker: "For cafés & restaurants · Ahmedabad",
  title: "Pay for customers, not clicks.",
  question: "Who came back this week?",
  description:
    "Your café can finally answer. Every real visit becomes a Notch.",
  launch: "Launching November 2026",
  secondary: "See how it works",
  stats: [
    { value: "0", label: "extra work for your staff" },
    { value: "10s", label: "from scan to “Notched.”" },
    { value: "No app", label: "just WhatsApp" },
  ],
  screenLabel: "Example: a counter phone showing a live QR code.",
  notched: "Notched.",
  notchedBody: "2 more visits to become the Regular 👑",
  example: "Example screens",
} as const;

export const qrContent = {
  title: "Scan to Notch",
  newCode: (seconds: number) => `New code in ${seconds} sec`,
} as const;

export const howItWorksContent = {
  kicker: "How it works",
  title: "Scan. Send. Share.",
  description:
    "Three steps for your customer, and nothing for your staff. Example screens below.",
  steps: [
    {
      title: "Scan",
      body: "An old phone at your counter shows a live QR.",
      screenLabel: "Example: the counter phone showing a live QR code.",
    },
    {
      title: "Send",
      body: "WhatsApp opens. They press send. No app, no form.",
      screenLabel:
        "Example: a WhatsApp chat where the customer sends one message and Notchs replies Notched.",
    },
    {
      title: "Share",
      body: "A monthly Notch Card they post. Your name on it.",
      screenLabel:
        "Example: a Notch Card with 23 Notchs this month and the Regular badge for your café.",
    },
  ],
  chat: {
    name: "Notchs",
    message: "Notch me at your café ☕",
    reply: "Notched.",
    replyBody: "2 more visits to become the Regular 👑",
  },
  card: {
    owner: "Riya's October",
    count: "23",
    countLabel: "Notchs this month",
    line: "Saturday explorer. Tuesday loyalist.",
    regular: "Regular of your café",
    badge: "Night Owl",
  },
} as const;

export const compareContent = {
  likes: { title: "Likes", body: "what Instagram counts" },
  visits: { title: "Visits", body: "what Notchs counts" },
  line: "If it's on Notchs, it really happened.",
} as const;

export const yourWeekContent = {
  kicker: "What you get",
  title: "Your week, in your pocket.",
  example: "Examples · sample numbers",
  voice: {
    sender: "Notchs for Venues",
    time: "Mon 9:00",
    length: "0:30 · Hindi",
    transcript:
      "“Is hafte 86 customers, 31 naye. Tuesday slow tha. Saturday 6–8 PM sabse busy.”",
    note: "Every Monday. Gujarati or Hindi. No need to open a dashboard.",
    label:
      "Example: a 30-second WhatsApp voice note in Hindi summing up the week.",
  },
  chart: {
    title: "This week at your café",
    range: "Mon – Sun",
    visitors: 86,
    firstTimers: 31,
    cameBack: 55,
    regulars: 4,
    visitorsLabel: "visitors",
    firstTimersLabel: "first-timers",
    cameBackLabel: "came back",
    regularsLabel: "new Regulars 👑",
    /** Sample visitors per day; they add up to `visitors`. */
    days: [
      { day: "M", name: "Monday", visitors: 9 },
      { day: "T", name: "Tuesday", visitors: 5 },
      { day: "W", name: "Wednesday", visitors: 8 },
      { day: "T", name: "Thursday", visitors: 10 },
      { day: "F", name: "Friday", visitors: 17 },
      { day: "S", name: "Saturday", visitors: 20 },
      { day: "S", name: "Sunday", visitors: 17 },
    ],
    busiestDay: "Saturday",
    busiest: "Saturday 6–8 PM",
    busiestLabel: "Busiest:",
    slowest: "Slowest: Tuesday",
  },
  benefits: [
    {
      icon: "crown",
      title: "A crown for your Regular",
      body: "Loyal customers compete for it, and visit more.",
    },
    {
      icon: "clock",
      title: "Know your slow hours",
      body: "Plan staff and offers on real footfall.",
    },
    {
      icon: "search",
      title: "Found on Google",
      body: "“Best cafés in Ahmedabad, ranked by real visits.”",
    },
    {
      icon: "close",
      title: "No discounts. Ever.",
      body: "People come for status. Your margins stay yours.",
    },
  ],
} as const;

export const promotionContent = {
  kicker: "Free promotion",
  title: "Your regulars post you on their stories.",
  body: "Every month, customers share their Notch Card on Instagram and WhatsApp, with your café's name on it. You also get your own monthly card to repost in one tap.",
  story: {
    author: "riya.s · 2h",
    example: "Example",
    title: "Your café's October",
    count: "312",
    line: "visitors · 41% new · 18 Regulars",
  },
} as const;

export const foundingContent = {
  kicker: "Why join now · Founding Venues · Ahmedabad",
  spots: 100,
  title: "Founding Venue spots. Then it's closed.",
  perks: [
    {
      metric: "3 mo",
      title: "Free for 3 months",
      body: "Then a simple monthly plan, only if you want it.",
    },
    {
      metric: "1st",
      title: "Your regulars count first",
      body: "Crowns and ranks build from visit one. Early cafés lead.",
    },
    {
      metric: "∞",
      title: "Founding badge, forever",
      body: "On your Notchs page and the Founding wall at notchs.com.",
    },
    {
      metric: "Nov",
      title: "Live at launch",
      body: "Launch reels, city pages and first Notch Cards feature live cafés.",
    },
  ],
  needsTitle: "All you need",
  needs: [
    { icon: "phone", title: "An old phone", body: "Android + charger" },
    { icon: "counter", title: "A counter spot", body: "for the phone" },
    { icon: "timer", title: "10 minutes", body: "setup on WhatsApp" },
  ],
  promisesTitle: "Our promises",
  promises: [
    "Rankings never for sale",
    "You see totals, never phone numbers",
    "Only real visits count",
    "No fake reviews",
    "Stop anytime",
  ],
  cta: {
    title: "Don't stay unnotched.",
    body: "Claim your Founding Venue spot.",
    instagram: "@notchs.app",
  },
  footer: "Real life, ranked.",
} as const;

const title = "For cafés, restaurants and turfs";
const description =
  "Pay for customers, not clicks. See how many new and returning customers you really get. Zero extra work for your staff.";

export const venuesMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.venues },
  openGraph: { ...openGraphBase, url: routes.venues, title, description },
};
