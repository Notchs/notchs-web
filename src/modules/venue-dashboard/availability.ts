import { env } from "@/config/env";

import { VENUE_DATA_MODE } from "./services/config";

/**
 * Example data must never reach the public: while the dashboard runs on mock
 * data, the live build serves a 404. Team builds and local dev can see it.
 */
export const isVenueDashboardAvailable = () =>
  VENUE_DATA_MODE !== "mock" ||
  env.siteAccess === "team" ||
  !env.isProductionBuild;
