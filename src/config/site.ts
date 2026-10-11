import { env } from "./env";

export const siteConfig = {
  name: "Notchs",
  description: "Touch grass. Collect Notchs.",
  url: env.appUrl,
  /** Browser chrome colour per theme: Ink for dark, Paper for light. */
  themeColors: {
    dark: "#0F0F14",
    light: "#F5F3EC",
  },
  contactEmail: "contact@notchs.com",
  social: {
    instagram: "https://www.instagram.com/notchs.app/",
    youtube: "https://www.youtube.com/@notchs",
    linkedin: "https://www.linkedin.com/company/notchs",
  },
  copyrightYear: 2026,
} as const;
