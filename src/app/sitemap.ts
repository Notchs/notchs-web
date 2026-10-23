import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * Public pages Google should index. Add a page here only once it is live for
 * everyone; error pages and anything behind a login stay out.
 */
const publicPaths = [routes.home];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
  }));
}
