import type { NextConfig } from "next";

/** Icons and images change rarely, so browsers may keep them for a week. */
const WEEK_CACHE = [{ key: "Cache-Control", value: "public, max-age=604800" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
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
