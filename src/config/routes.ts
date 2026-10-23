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
