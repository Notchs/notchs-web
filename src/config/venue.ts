import { env } from "./env";

/**
 * Where the venue platform lives. It is served on its own host
 * (venues.notchs.com, or venues.localhost in development) from the pages under
 * src/app/venue.
 */
export const venueConfig = {
  /** Any host starting with this is the venue platform. */
  hostPrefix: "venues.",
  /** Folder of the venue pages inside src/app. Never shown in venue URLs. */
  appPath: "/venue",
  /** Where the bare host goes while the dashboard is not on the live site. */
  homePath: "/login",
} as const;

/** True for venues.notchs.com, venues.localhost and the like. */
export function isVenueHost(hostname: string) {
  return hostname.startsWith(venueConfig.hostPrefix);
}

/** The venue host's origin, worked out from the site address. */
export const venueOrigin = (() => {
  const url = new URL(env.appUrl);
  url.hostname = `${venueConfig.hostPrefix}${url.hostname.replace(/^www\./, "")}`;
  return url.origin;
})();
