import type { NextConfig } from "next";

/** Icons and images change rarely, so browsers may keep them for a week. */
const WEEK_CACHE = [{ key: "Cache-Control", value: "public, max-age=604800" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
