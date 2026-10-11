import { env } from "./env";

export const siteConfig = {
  name: "Notchs",
  description: "Touch grass. Collect Notchs.",
  url: env.appUrl,
  /** Ink: the phone's top bar matches the brand. */
  themeColor: "#0F0F14",
} as const;
