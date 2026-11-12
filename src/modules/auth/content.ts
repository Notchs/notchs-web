import type { Metadata } from "next";

export const loginLabel = "Login with WhatsApp";

export const loginUnavailable =
  "WhatsApp login isn’t available right now. Please try again later.";

export const qrTitle = "Scan to login with WhatsApp";
export const qrHint =
  "Scan this QR code with your phone camera, then press Send in WhatsApp.";

/** The message WhatsApp pre-fills; the bot answers it with a login link. */
export const LOGIN_MESSAGE = "Hey Notchs, I want to login";

/** Shown under the login button: logging in is the customer's agreement. */
export const loginConsent = {
  before:
    "Notchs is for people aged 18 or older. By logging in you agree to our",
  terms: "Terms",
  and: "and",
  privacy: "Privacy notice",
  after: ".",
} as const;

export const loginMetadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
  description: "Log in to Notchs with WhatsApp. No email, no password.",
};

export const verifyMetadata: Metadata = {
  title: "Logging you in",
  robots: { index: false, follow: false },
};
