import { env } from "./env";

export const siteConfig = {
  name: "Notchs",
  description: "The Notchs web application.",
  url: env.appUrl,
} as const;
