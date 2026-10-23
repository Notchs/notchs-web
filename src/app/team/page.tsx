import { notFound } from "next/navigation";

import { env } from "@/config/env";
import { TeamHubPage, teamHubMetadata } from "@/modules/team-hub";

export const metadata = teamHubMetadata;

export default function TeamHub() {
  // The live site has no team pages.
  if (env.siteAccess === "public") notFound();
  return <TeamHubPage />;
}
