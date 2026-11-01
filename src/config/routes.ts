import { adminConfig } from "./admin";
import { env } from "./env";

/** Application route paths. Reference these instead of hard-coding strings. */
export const routes = {
  home: "/",
  forbidden: "/403",
  login: "/login",
  loginVerify: "/login/verify",
  venues: "/venues",
  venueLogin: "/venue/login",
  venueSetPassword: "/venue/set-password",
  /** Team builds only; a 404 on the live site. */
  teamLogin: "/team-login",
  teamLoginSession: "/team-login/session",
  /** Team builds only: the All pages hub. */
  teamHub: "/team",
  /** Local development only: the loader demo. */
  devLoaders: "/dev/loaders",
} as const;

/** Venue dashboard paths. Private: never link them from public pages. */
export const venueRoutes = {
  overview: "/venue",
  customers: "/venue/customers",
  visits: "/venue/visits",
  notchCard: "/venue/visits/card",
  foundingVenue: "/venue/visits/founding",
  analytics: "/venue/analytics",
  reviews: "/venue/reviews",
  discover: "/venue/discover",
  rewards: "/venue/rewards",
  counter: "/venue/counter",
  counterSigns: "/venue/counter/signs",
  billing: "/venue/billing",
  profile: "/venue/profile",
  content: "/venue/content",
  team: "/venue/team",
  settings: "/venue/settings",
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
