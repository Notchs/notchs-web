import { adminConfig } from "./admin";
import { env } from "./env";

/** Application route paths. Reference these instead of hard-coding strings. */
export const routes = {
  home: "/",
  forbidden: "/403",
  login: "/login",
  loginVerify: "/login/verify",
  venueLogin: "/venue/login",
  venueSetPassword: "/venue/set-password",
  /** Team builds only; a 404 on the live site. */
  teamLogin: "/team-login",
  teamLoginSession: "/team-login/session",
} as const;

/**
 * Admin panel paths. On the live site they are as seen on the admin host
 * (admin.notchs.com): the proxy maps them onto the pages in src/app/admin, so
 * links never include "/admin". Team builds (Netlify test links) have no admin
 * host, so there the panel lives under /admin.
 */
const adminBase = env.siteAccess === "team" ? adminConfig.appPath : "";

export const adminRoutes = {
  dashboard: adminBase || "/",
  venues: `${adminBase}/venues`,
  customers: `${adminBase}/customers`,
  notchs: `${adminBase}/notchs`,
  settings: `${adminBase}/settings`,
} as const;
