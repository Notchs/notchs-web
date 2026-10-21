/** Application route paths. Reference these instead of hard-coding strings. */
export const routes = {
  home: "/",
  forbidden: "/403",
} as const;

/**
 * Admin panel paths as seen on the admin host (admin.notchs.com). The proxy
 * maps them onto the pages in src/app/admin, so links never include "/admin".
 */
export const adminRoutes = {
  dashboard: "/",
  venues: "/venues",
  customers: "/customers",
  notchs: "/notchs",
  settings: "/settings",
} as const;
