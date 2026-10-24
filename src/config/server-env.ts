import "server-only";

/**
 * Environment variables that are secret, read at runtime on the server only.
 * Never import this from client code: these values must not reach the browser.
 */
export const serverEnv = {
  /** The shared team login for test links. Set in Netlify for branch deploys and deploy previews. */
  teamUsername: (process.env.TEAM_USERNAME ?? "").trim(),
  teamPassword: process.env.TEAM_PASSWORD ?? "",
};
