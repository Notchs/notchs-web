import { env } from "@/config/env";

export type PassportDataMode = "mock" | "api";

/**
 * Where the passport gets its data. "api" is the real backend and the only
 * value to commit. Set "mock" on your own machine to see every page with
 * example data and no login, for design work only.
 */
export const PASSPORT_DATA_MODE = "api" as PassportDataMode;

/** Mock data never reaches the live site, whatever the setting says. */
export const USES_MOCK =
  PASSPORT_DATA_MODE === "mock" &&
  (env.siteAccess === "team" || !env.isProductionBuild);
