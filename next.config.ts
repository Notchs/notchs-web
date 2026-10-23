import type { NextConfig } from "next";

/** Icons and images change rarely, so browsers may keep them for a week. */
const WEEK_CACHE = [{ key: "Cache-Control", value: "public, max-age=604800" }];

/**
 * Who may open this build: "public" on the live site, "team" on every Netlify
 * test link (deploy previews and branch deploys), which then asks for the team
 * login (see src/proxy.ts). Netlify sets NETLIFY and CONTEXT during its builds.
 * Set SITE_ACCESS to override, e.g. SITE_ACCESS=team to try the login locally.
 */
function siteAccess() {
  if (process.env.SITE_ACCESS) return process.env.SITE_ACCESS;
  if (process.env.NETLIFY === "true") {
    return process.env.CONTEXT === "production" ? "public" : "team";
  }
  return "public";
}

const SITE_ACCESS = siteAccess();

/** Team builds tell search engines to skip every response, files included. */
const NO_INDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Fixed at build time, so the live site can never switch to "team" at runtime.
  env: { SITE_ACCESS },
  images: {
    // AVIF where the browser supports it (smallest), WebP otherwise.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    // Landing photos rarely change, so keep resized copies for 31 days.
    minimumCacheTTL: 2678400,
  },
  async headers() {
    return [
      { source: "/favicon.ico", headers: WEEK_CACHE },
      { source: "/:path(.*\\.png)", headers: WEEK_CACHE },
      ...(SITE_ACCESS === "public"
        ? []
        : [{ source: "/:path*", headers: NO_INDEX }]),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
