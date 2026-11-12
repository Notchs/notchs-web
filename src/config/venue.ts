import { env } from "./env";

/**
 * Where the venue platform lives. It is served on its own host
 * (venue.notchs.com, or venue.localhost in development) from the pages under
 * src/app/venue.
 */
export const venueConfig = {
  /** Any host starting with this is the venue platform. */
  hostPrefix: "venue.",
  /** The earlier address (venues.notchs.com), still served if its DNS remains. */
  oldHostPrefix: "venues.",
  /** Folder of the venue pages inside src/app. Never shown in venue URLs. */
  appPath: "/venue",
} as const;

/** True for venue.notchs.com, venue.localhost and the like (and the old venues.*). */
export function isVenueHost(hostname: string) {
  return (
    hostname.startsWith(venueConfig.hostPrefix) ||
    hostname.startsWith(venueConfig.oldHostPrefix)
  );
}

/** The venue host's origin, worked out from the site address. */
export const venueOrigin = (() => {
  const url = new URL(env.appUrl);
  url.hostname = `${venueConfig.hostPrefix}${url.hostname.replace(/^www\./, "")}`;
  return url.origin;
})();
