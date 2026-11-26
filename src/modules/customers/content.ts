import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { openGraphBase } from "@/shared/lib/metadata";

/** Not in SEO_PLAN.md yet; written to CLAUDE.md §4 (title ≤ 60, description 70–155). */
const title = "For people who go out";
const description =
  "Turn every real visit into proof, points and a place on your city's leaderboard. Free, no app: scan the code and send one WhatsApp message.";

export const customersMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.customers },
  openGraph: {
    ...openGraphBase,
    title,
    description,
    url: routes.customers,
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

export const heroContent = {
  kicker: "For people who go out",
  title: "Prove where you go.",
  description:
    "You already go out. Notchs turns every real visit into proof, points and a place on your city's leaderboard. Free, no app, works on WhatsApp.",
} as const;

/** Sample Notch Card in the hero. Example values, labelled as such. */
export const cardSample = {
  label: "Example",
  month: "October",
  count: "23",
  countLabel: "Notchs this month",
  vibe: "Late-night matcha explorer",
  badges: ["First Notch", "Cafe Hopper"],
} as const;

export const problemContent = {
  title: "Your camera roll is full. But where did you actually go this year?",
  body: "Instagram shows posts, not proof. Anyone can post a photo. Nobody can fake a Notch: it only happens when you are really there.",
} as const;

export const howItWorksId = "how-it-works";

export const howItWorksContent = {
  kicker: "How it works",
  title: "Your first Notch in 30 seconds.",
  steps: [
    {
      title: "Scan the code at the counter",
      body: "Every Notchs place has a phone at the counter showing a code. It changes every 30 seconds, so it only works when you're there.",
    },
    {
      title: "Tap send on WhatsApp",
      body: "WhatsApp opens with a message ready. No app, no form, no password. Your phone number is your passport.",
    },
    {
      title: "Get Notched",
      body: "A reply comes back in seconds and the visit is saved to your passport. One Notch per place per day.",
    },
    {
      title: "Get your Notch Card on the 1st",
      body: "Every month, your city life lands on WhatsApp as one card, ready to share.",
    },
  ],
} as const;

/** Sample chat beside the steps; same sample as the homepage demo. */
export const chatSample = {
  label: "WhatsApp · Example",
  sent: "Notch me at Kahwa House · K7Q-29F",
  replyTitle: "Notched.",
  replyLines: ["Kahwa House · Notch #0145", "Saved to your passport"],
} as const;

/** Matches the passport (points, rank from the 3rd Notch, badges, Star Points). */
export const earnContent = {
  kicker: "What you earn",
  title: "Points, rank and badges.",
  items: [
    {
      title: "Points",
      body: "Every real Notch adds points. Your points never go down.",
    },
    {
      title: "City rank",
      body: "See where you stand in your city from your 3rd Notch. Equal points share a rank.",
    },
    {
      title: "Badges",
      body: "First Notch, Café Hopper, Night Owl, Regular and more.",
    },
    {
      title: "Star Points",
      body: "Get 50 Star Points for each friend who joins with your code and gets their first Notch.",
    },
  ],
} as const;

export const notchCardContent = {
  kicker: "Your Notch Card",
  title: "Your month, in one card.",
  description:
    "On the 1st of every month, your card lands on WhatsApp: the places you went, your badges and your rank. Ready for your story.",
  imageAlt:
    "Illustration: a young man on a sofa shows his phone with a monthly Notch Card that says 23 Notchs",
  imageLabel: "Example",
} as const;

/** Every line matches the privacy notice (src/modules/legal/content.ts). */
export const trustContent = {
  kicker: "Trust and privacy",
  title: "Your Notchs are yours.",
  items: [
    {
      title: "Hidden by default",
      body: "On leaderboards you show as “A Notchs member” unless you choose to show your name.",
    },
    {
      title: "Venues see totals",
      body: "A place never sees your phone number or your name.",
    },
    {
      title: "Delete any time",
      body: "Profile → Delete my account. It happens at once.",
    },
    {
      title: "18+ only",
      body: "You confirm your age and give consent in WhatsApp before your first Notch.",
    },
  ],
  privacyLink: "Read the privacy notice",
  imageAlt:
    "Illustration: a smiling phone with a lock on a lime shield gives a thumbs-up",
} as const;

export const momentsContent = {
  kicker: "Real moments",
  title: "Go out. Notch it. Keep the memory.",
  items: [
    {
      title: "Bring the gang",
      body: "Everyone scans, everyone gets the Notch.",
    },
    {
      title: "Make a whole Saturday of it",
      body: "Pickleball in the morning, a café after, box cricket at night.",
    },
    {
      title: "See who's ahead",
      body: "Check the leaderboard and see who notched more this month.",
    },
  ],
} as const;

/** Customer questions; answers match the homepage FAQ and the privacy notice. */
export const faqContent = {
  kicker: "FAQ",
  title: "Your questions.",
  items: [
    {
      q: "Is it free?",
      a: "Yes. Notchs is free for you, forever. Venues pay a monthly fee.",
    },
    {
      q: "Do I need to download an app?",
      a: "No. You scan the QR with your phone camera and send one WhatsApp message. Your passport opens in the browser.",
    },
    {
      q: "Why can't I just Notch from home?",
      a: "The code on the counter phone changes every 30 seconds. You have to be there to scan it.",
    },
    {
      q: "What if I visit the same place twice in a day?",
      a: "You get one Notch per place per day. Come back another day for your next one.",
    },
    {
      q: "Who can see my Notchs?",
      a: "A place sees totals, never your phone number or your name. On leaderboards you show as “A Notchs member” unless you choose to show your name.",
    },
    {
      q: "How do I delete my account?",
      a: "Go to Profile → Delete my account. It happens at once and can't be undone.",
    },
  ],
} as const;
