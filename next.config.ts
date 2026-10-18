import type { NextConfig } from "next";

import { API_PROXY_PREFIX } from "./src/config/api";
import { env } from "./src/config/env";

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
  /**
   * Proxies API calls through this origin, so the backend's HttpOnly login
   * cookies are first-party and the browser doesn't block them.
   */
  async rewrites() {
    return [
      {
        source: `${API_PROXY_PREFIX}/:path*`,
        destination: `${env.apiUrl}/api/:path*`,
      },
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
