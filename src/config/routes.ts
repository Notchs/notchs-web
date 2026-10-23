/** Application route paths. Reference these instead of hard-coding strings. */
export const routes = {
  home: "/",
  forbidden: "/403",
  /** Team builds only; a 404 on the live site. */
  teamLogin: "/team-login",
  teamLoginSession: "/team-login/session",
  /** Team builds only: the All pages hub. */
  teamHub: "/team",
} as const;
