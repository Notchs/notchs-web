/**
 * Single access point for environment variables.
 * Read `process.env` here only, so defaults and naming stay in one place.
 */
export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://notchs.com",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  /** Bot number in international format, digits only (used in wa.me links). */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  /** Cloudflare Turnstile site key; pairs with the secret key on the backend. */
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "",
} as const;
