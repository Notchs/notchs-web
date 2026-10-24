import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/** Open Graph fields shared by every page; spread and add title/description. */
export const openGraphBase = {
  type: "website",
  locale: "en_IN",
  siteName: siteConfig.name,
  url: siteConfig.url,
} satisfies Metadata["openGraph"];
