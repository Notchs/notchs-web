import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/shared/lib/metadata";

/** Not in SEO_PLAN.md yet; written to CLAUDE.md §4 (title ≤ 60, description 70–155). */
const title = "Contact";
const description =
  "Questions about a Notch, joining as a venue, bringing Notchs to your city or working with us? Here's how to reach the Notchs team.";

export const contactMetadata: Metadata = {
  title,
  description,
  alternates: { canonical: routes.contact },
  openGraph: {
    ...openGraphBase,
    title,
    description,
    url: routes.contact,
    images: ["/opengraph-image.png"],
  },
  twitter: { card: "summary_large_image", images: ["/twitter-image.png"] },
};

const mailto = (email: string, subject?: string) =>
  `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

export const heroContent = {
  kicker: "Contact",
  title: "Talk to us.",
  description:
    "Pick what you need, and it reaches the right person on the Notchs team.",
  imageAlt:
    "Illustration: a chat bubble with a lime tick rises from a phone, with a paper plane and an envelope",
} as const;

type ContactLink = { label: string; href: string };

export type Reason = {
  title: string;
  body: string;
  primary: ContactLink;
  secondary?: ContactLink;
};

/** One card per reason; every link is an existing page or inbox. */
export const reasons: readonly Reason[] = [
  {
    title: "Questions about a Notch",
    body: "A scan that didn't count, your points, or anything about your passport.",
    primary: {
      label: `Email ${siteConfig.supportEmail}`,
      href: mailto(siteConfig.supportEmail),
    },
    secondary: { label: "Read the FAQ", href: `${routes.home}#faq` },
  },
  {
    title: "Own a café, turf or gym?",
    body: "Apply as a Founding Venue. The team checks every venue, then emails you a link to set your password.",
    primary: {
      label: "Apply for your venue",
      href: `${routes.venueLogin}?view=apply`,
    },
    secondary: { label: "How Notchs works for venues", href: routes.venues },
  },
  {
    title: "Want Notchs in your city?",
    body: "Tell us your city. We're adding cities one at a time, and requests help us choose.",
    primary: {
      label: "Ask for your city",
      href: mailto(siteConfig.contactEmail, "Bring Notchs to my city"),
    },
  },
  {
    title: "Press, brands and partners",
    body: "Working on a story or a collab? Write to the team.",
    primary: {
      label: `Email ${siteConfig.contactEmail}`,
      href: mailto(siteConfig.contactEmail),
    },
  },
];

export const reasonsHeading = "Ways to reach us";

export const privacyLine = {
  text: "Privacy or a data request?",
  label: `Write to ${siteConfig.grievanceEmail}`,
  href: mailto(siteConfig.grievanceEmail),
} as const;

export const socialContent = {
  title: "Follow Notchs",
  links: [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "YouTube", href: siteConfig.social.youtube },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
  ],
} as const;
