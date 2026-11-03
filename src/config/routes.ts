import { adminConfig } from "./admin";
import { env } from "./env";
import { venueConfig, venueOrigin } from "./venue";

/**
 * The venue pages are on their own host (venues.notchs.com) on the live site,
 * so links to them from anywhere include it. Team builds (Netlify test links)
 * have no venue host, so there the pages live under /venue.
 */
const venueBase = env.siteAccess === "team" ? venueConfig.appPath : venueOrigin;

/** Application route paths. Reference these instead of hard-coding strings. */
export const routes = {
  home: "/",
  /** The main site's homepage, for links from the venue host. */
  mainSite: env.siteAccess === "team" ? "/" : env.appUrl,
  forbidden: "/403",
  login: "/login",
  loginVerify: "/login/verify",
  venueLogin: `${venueBase}/login`,
  venueSetPassword: `${venueBase}/set-password`,
  /** The venue homepage: where the venue host's bare address leads. */
  venueHome: `${venueBase}${venueConfig.homePath}`,
  /** Team builds only; a 404 on the live site. */
  teamLogin: "/team-login",
  teamLoginSession: "/team-login/session",
  /** Team builds only: the All pages hub. */
  teamHub: "/team",
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
