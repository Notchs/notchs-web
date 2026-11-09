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
  /** The customer's passport, after logging in. Private: never link it from public pages. */
  passport: "/passport",
  passportNotchs: "/passport/notchs",
  passportLeaderboard: "/passport/leaderboard",
  passportProfile: "/passport/profile",
  venueLogin: `${venueBase}/login`,
  venueSetPassword: `${venueBase}/set-password`,
  /** The venue homepage: the dashboard overview. */
  venueHome: env.siteAccess === "team" ? venueBase : `${venueBase}/`,
  /** Team builds only; a 404 on the live site. */
  teamLogin: "/team-login",
  teamLoginSession: "/team-login/session",
  /** Team builds only: the All pages hub. */
  teamHub: "/team",
} as const;

/**
 * Venue dashboard paths, used only inside the dashboard. On the live site they
 * are as seen on the venue host (venues.notchs.com/customers). Private: never
 * link them from public pages.
 */
const dashboardBase = env.siteAccess === "team" ? venueConfig.appPath : "";

export const venueRoutes = {
  overview: dashboardBase || "/",
  customers: `${dashboardBase}/customers`,
  visits: `${dashboardBase}/visits`,
  notchCard: `${dashboardBase}/visits/card`,
  foundingVenue: `${dashboardBase}/visits/founding`,
  analytics: `${dashboardBase}/analytics`,
  reviews: `${dashboardBase}/reviews`,
  discover: `${dashboardBase}/discover`,
  rewards: `${dashboardBase}/rewards`,
  counter: `${dashboardBase}/counter`,
  counterSigns: `${dashboardBase}/counter/signs`,
  billing: `${dashboardBase}/billing`,
  profile: `${dashboardBase}/profile`,
  content: `${dashboardBase}/content`,
  team: `${dashboardBase}/team`,
  settings: `${dashboardBase}/settings`,
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
  applications: `${adminBase}/applications`,
  claims: `${adminBase}/claims`,
  venues: `${adminBase}/venues`,
  customers: `${adminBase}/customers`,
  notchs: `${adminBase}/notchs`,
  settings: `${adminBase}/settings`,
  login: `${adminBase}/login`,
  setPassword: `${adminBase}/set-password`,
} as const;
