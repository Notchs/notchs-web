import { notFound } from "next/navigation";

import { env } from "@/config/env";
import { TeamLoginPage, teamLoginMetadata } from "@/modules/team-access";

export const metadata = teamLoginMetadata;

export default function TeamLogin() {
  // The live site has no team login.
  if (env.siteAccess === "public") notFound();
  return <TeamLoginPage />;
}
