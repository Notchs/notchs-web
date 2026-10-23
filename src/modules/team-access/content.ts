import type { Metadata } from "next";

export const teamLoginContent = {
  kicker: "Team only",
  title: "Team preview.",
  description:
    "A private test version of Notchs. Sign in with the team login to see the latest work.",
  username: "Username",
  password: "Password",
  submit: "Sign in",
  submitting: "Signing in…",
  errors: {
    wrong: "Wrong username or password.",
    unset:
      "The team login isn't set up yet. Add TEAM_USERNAME and TEAM_PASSWORD in Netlify, then redeploy.",
    network: "Couldn't reach the server. Check your connection and try again.",
  },
} as const;

export const teamLoginMetadata: Metadata = {
  title: "Team login",
  robots: { index: false, follow: false },
};
