import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { openGraphBase } from "@/shared/lib/metadata";

/** Title, description and h1 from SEO_PLAN.md (/about). */
const title = "About Notchs";
const description =
  "Notchs is the proof layer of real life. Built by a small team from Ahmedabad and Bengaluru.";

export const aboutMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.about },
  openGraph: {
    ...openGraphBase,
    title,
    description,
    url: routes.about,
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

export const heroContent = {
  kicker: "About",
  title: "Real life, ranked.",
  description: "Four friends who wanted a scoreboard for real life.",
  imageAlt:
    "Illustration: four friends around a table with laptops and coffee, sketching the Notchs logo",
} as const;

/** Draft: Harsh to rewrite in his own words. */
export const storyContent = {
  kicker: "Our story",
  title: "Less posting, more going out.",
  body: "We noticed our friends spent more time posting about going out than actually going out. We wanted a scoreboard you can't fake and can't buy, so the people who really show up get the credit.",
} as const;

export const nameContent = {
  kicker: "The name",
  title: "Why “Notchs”?",
  body: "A notch is one of the oldest ways people kept count: a mark cut into wood or bone, one for each time. A notch on your belt. “Notched up a century.” We spell it Notchs because nobody collects just one.",
} as const;

/** First names only, no titles: roles aren't final. */
export const teamContent = {
  kicker: "The team",
  title: "Harsh, Abhishek, Vejanand and Jaydip.",
  body: "A small team from Ahmedabad and Bengaluru.",
} as const;

export const closingContent = {
  title: "Want Notchs in your city?",
  contact: "Tell us",
  mission: "What we stand for",
} as const;
