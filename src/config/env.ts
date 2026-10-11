/**
 * Single access point for environment variables.
 * Read `process.env` here only, so defaults and naming stay in one place.
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
} as const;
