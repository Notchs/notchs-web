import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * /robots.txt: every crawler may read every page (not the /api/ backend proxy)
 * and finds the sitemap here. Private pages use noindex instead, so crawlers can see it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
