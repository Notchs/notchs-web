import { env } from "./env";

/** Same-origin path that `next.config.ts` rewrites to the backend. */
export const API_PROXY_PREFIX = "/api";

export const apiConfig = {
  /**
   * Root of the versioned backend API; request paths are appended to this.
   * The browser goes through the same-origin proxy so the backend's HttpOnly
   * session cookies are first-party; the server calls the backend directly.
   */
  baseUrl:
    typeof window === "undefined"
      ? `${env.apiUrl}/api/v1`
      : `${API_PROXY_PREFIX}/v1`,
} as const;
