import { env } from "@/config/env";

import { VENUE_DASHBOARD_LIVE, VENUE_DATA_MODE } from "./services/config";

/**
 * The live build serves the dashboard only on real data and once the team
 * has switched it on (VENUE_DASHBOARD_LIVE); until then the venue login page
 * is the venue homepage there. Example data never reaches the public. Team
 * builds and local dev can always see it.
 */
export const isVenueDashboardAvailable = () =>
  (VENUE_DATA_MODE === "api" && VENUE_DASHBOARD_LIVE) ||
  env.siteAccess === "team" ||
  !env.isProductionBuild;
