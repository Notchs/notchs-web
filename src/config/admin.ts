/**
 * Where the admin panel lives. It is served on its own host (admin.notchs.com,
 * or admin.localhost in development) from the pages under src/app/admin.
 */
export const adminConfig = {
  /** Any host starting with this is the admin panel. */
  hostPrefix: "admin.",
  /** Folder of the admin pages inside src/app. Never shown in admin URLs. */
  appPath: "/admin",
} as const;

/** True for admin.notchs.com, admin.localhost and the like. */
export function isAdminHost(hostname: string) {
  return hostname.startsWith(adminConfig.hostPrefix);
}
