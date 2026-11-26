import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { openGraphBase } from "@/shared/lib/metadata";

/** Not in SEO_PLAN.md yet; written to CLAUDE.md §4 (title ≤ 60, description 70–155). */
const title = "Our mission";
const description =
  "Notchs is the proof layer of real life: status you earn by really going out, rankings that are never for sale, and your privacy kept.";

export const missionMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.mission },
  openGraph: {
    ...openGraphBase,
    title,
    description,
    url: routes.mission,
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

export const heroContent = {
  kicker: "Our mission",
  title: "The proof layer of real life.",
  description: "If it's on Notchs, it really happened.",
  imageAlt:
    "Illustration: on the left, a faded social media post; on the right, the same girl really at a café with friends under a Notched! tick",
} as const;

export const problemContent = {
  title: "Feeds reward the best photo, not the most real life.",
  body: "Anyone can post a picture. Nobody can prove they were there. And the café down the road still has no idea who its regulars are.",
} as const;

export const beliefsContent = {
  kicker: "What we believe",
  title: "Four rules we build by.",
  items: [
    {
      title: "Real",
      body: "Proof over posts. A Notch only happens when you're there.",
    },
    {
      title: "Earned",
      body: "Status you can't buy. Points come from real visits only.",
    },
    {
      title: "Local",
      body: "Your city first: the places and people around you.",
    },
    {
      title: "Fair",
      body: "Nobody can pay to rank higher, customer or place.",
    },
  ],
} as const;

/** Each line matches the privacy notice, the terms or how the product works. */
export const neverContent = {
  kicker: "What we will never do",
  title: "Our never list.",
  items: [
    "Sell rankings",
    "Sell your data or send you marketing",
    "Show your phone number or name to venues",
    "Make you download an app",
  ],
} as const;

export const keepRealContent = {
  kicker: "How we keep it real",
  title: "Every Notch is checked.",
  items: [
    {
      title: "A code that keeps changing",
      body: "The code on the counter phone changes every 30 seconds, so you have to be there.",
    },
    {
      title: "One Notch per place per day",
      body: "Visiting twice in a day doesn't count twice.",
    },
    {
      title: "Hidden by default",
      body: "On leaderboards you're “A Notchs member” unless you choose to show your name.",
    },
    {
      title: "Delete any time",
      body: "Profile → Delete my account. It happens at once.",
    },
  ],
} as const;

export const citiesContent = {
  kicker: "Where we're going",
  title: "One city at a time.",
  description:
    "We start where we can do it well. Ahmedabad is live now. Vadodara, Surat, Pune and Bengaluru are next on our list, each when the city before it is ready.",
  imageAlt:
    "Illustration: a dashed path across a map from Ahmedabad, lit up, to Vadodara, Surat, Pune and Bengaluru",
} as const;
