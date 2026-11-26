import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { openGraphBase } from "@/shared/lib/metadata";

/** Title, description and h1 from SEO_PLAN.md (/venues). */
const title = "For cafés, restaurants and turfs";
const description =
  "Pay for customers, not clicks. See how many new and returning customers you really get. Zero extra work for your staff.";

export const venuesMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.venues },
  openGraph: {
    ...openGraphBase,
    title,
    description,
    url: routes.venues,
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

/** Where every "Apply" button on this page goes: the venue sign-up form. */
export const applyHref = `${routes.venueLogin}?view=apply`;

export const heroContent = {
  kicker: "For cafés, turfs and gyms",
  title: "Pay for customers, not clicks.",
  description:
    "Notchs counts every real visit, shows you who's new and who comes back, and brings your city's most social crowd to your door. Zero work for your staff.",
  cta: "Apply as a Founding Venue",
  secondary: "See how it works",
} as const;

/** Sample dashboard in the hero. Example numbers, labelled as such. */
export const dashboardSample = {
  heading: "Your venue · this week",
  label: "Example",
  stats: [
    { label: "Visitors", value: "86", highlight: true },
    { label: "First-timers", value: "31" },
    { label: "Came back", value: "55" },
    { label: "Top regular", value: "9 visits" },
  ],
  note: "Totals only. Never phone numbers.",
} as const;

export const problemContent = {
  title: "Likes don't pay rent.",
  body: "You spend on Instagram ads and influencer posts, and you get likes. But can you answer this: how many new people came this month? Who are your regulars? Did that offer actually work?",
} as const;

export const reasonsContent = {
  kicker: "How Notchs brings you customers",
  title: "Four reasons people walk in.",
  items: [
    {
      title: "Discovery",
      body: "People find you by real visits, not by who pays for ads.",
    },
    {
      title: "Status",
      body: "Customers chase badges and the Regular crown at your venue, so they come back.",
    },
    {
      title: "Sharing",
      body: "Every Notch Card names your venue on Instagram stories. Free word of mouth.",
    },
    {
      title: "Trends",
      body: "“First 50 to try our new menu get a badge.” Launches that fill seats.",
    },
  ],
} as const;

export const howItWorksId = "how-it-works";

export const howItWorksContent = {
  kicker: "How it works",
  title: "Set up in 15 minutes. Then nothing.",
  steps: [
    {
      title: "We set you up",
      body: "We bring a standee and set up the code on a spare phone at your counter.",
    },
    {
      title: "Customers scan",
      body: "They scan and send one WhatsApp message. Your staff do nothing per customer.",
    },
    {
      title: "You see everything",
      body: "Your dashboard shows visitors, first-timers and regulars. Every month, a Venue Notch Card to repost.",
    },
  ],
} as const;

/**
 * The fee calculator. The real fee isn't decided, so the fee is an input with
 * an example value, labelled as such.
 */
export const calculatorContent = {
  kicker: "Does it pay for itself?",
  title: "Do the maths for your venue.",
  description:
    "Type your average bill. We show how many new customers a month cover the fee.",
  billLabel: "Average bill (₹)",
  feeLabel: "Monthly fee (₹)",
  feeNote: "Example fee. We confirm yours when you apply.",
  defaultBill: 400,
  defaultFee: 1999,
  resultLabel: "New customers a month to cover the fee",
  /** Example: 30 first-timers, 10 of whom come back twice. */
  example: { firstTimers: 30, returners: 10, returnVisits: 2 },
  /** Before and after the bolded sales total. */
  exampleLead:
    "Example: if Notchs brings 30 first-timers and 10 of them come back 2 more times, that's",
  exampleTail: "in sales a month.",
} as const;

export const fairContent = {
  title: "Fair by design",
  points: [
    "Rankings are never for sale",
    "You see totals and trends, never phone numbers",
    "Every visit is checked: a code that keeps changing, one Notch per person per day",
  ],
} as const;

/** No number for the free period or the fee until the team decides them. */
export const pricingContent = {
  title: "Pricing",
  headline: "Free for your first months.",
  body: "Then one flat monthly fee. No contract. Cancel any time.",
} as const;

export const faqContent = {
  kicker: "FAQ",
  title: "Owner questions.",
  items: [
    {
      q: "Do my staff have to do anything?",
      a: "No. The code shows on a spare phone at your counter, and customers scan it themselves.",
    },
    {
      q: "Can people cheat?",
      a: "The code on the counter phone changes every 30 seconds, so people have to be there to scan it. Each person gets one Notch per place per day.",
    },
    {
      q: "Who sees my data?",
      a: "Only you and the team members you add see your dashboard. Customers' phone numbers are never shown to you or anyone else.",
    },
    {
      q: "How do I join?",
      a: "Apply on this page. The Notchs team checks every venue, then emails you a link to set your password.",
    },
    {
      q: "What if I want to stop?",
      a: "Tell us. There's no contract and no penalty.",
    },
  ],
} as const;

export const closingContent = {
  title: "Only 30 Founding Venues.",
  body: "Founding Venues get top spot on the launch wall, forever. We'll visit you with everything ready.",
  cta: "Apply as a Founding Venue",
} as const;
