/**
 * Single access point for environment variables.
 * Read `process.env` here only, so defaults and naming stay in one place.
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://notchs.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  /**
   * "public" on the live site. Anything else, including a missing value, means
   * a team build: every page asks for the team login. Set by next.config.ts.
   */
  siteAccess:
    process.env.SITE_ACCESS === "public"
      ? ("public" as const)
      : ("team" as const),
} as const;
