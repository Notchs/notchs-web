import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/shared/lib/metadata";

export const comingSoonContent = {
  kicker: "Coming soon",
  titleLines: ["Touch grass.", "Collect Notchs."],
  tagline: "Ahmedabad is about to get ranked.",
  location: "Ahmedabad · 23.0225° N, 72.5714° E",
} as const;

const title = `${siteConfig.name} · ${comingSoonContent.kicker}`;
const description = `${siteConfig.description} ${comingSoonContent.tagline}`;

export const comingSoonMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: routes.home },
  openGraph: { ...openGraphBase, title, description },
};
