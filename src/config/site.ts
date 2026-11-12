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
  /** General questions and partnerships (footer). */
  contactEmail: "contact@notchs.com",
  /** Help for customers and venues (venue login help, venue Settings). */
  supportEmail: "support@notchs.com",
  /** Complaints and data requests: the Grievance Officer's inbox (Privacy, Terms). */
  grievanceEmail: "grievance@notchs.com",
  social: {
    instagram: "https://www.instagram.com/notchs.app/",
    youtube: "https://www.youtube.com/@notchs",
    linkedin: "https://www.linkedin.com/company/notchs",
  },
  copyrightYear: 2026,
} as const;
