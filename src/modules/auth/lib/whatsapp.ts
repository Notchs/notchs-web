import { env } from "@/config/env";

import { LOGIN_MESSAGE } from "../content";

/** Digits only; wa.me wants the full international number (E.164, 8–15 digits). */
const botNumber = env.whatsappNumber.replace(/\D/g, "");

/**
 * Opens a chat with the bot, the "LOGIN" message ready to send.
 * Null when the bot number is missing or invalid, so no broken link is built.
 */
export const whatsappLoginUrl: string | null = /^[1-9]\d{7,14}$/.test(botNumber)
  ? `https://wa.me/${botNumber}?text=${encodeURIComponent(LOGIN_MESSAGE)}`
  : null;
