import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** /robots.txt: every crawler may read every page, and finds the sitemap here. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
