import { env } from "./env";

export const apiConfig = {
  /** Root of the versioned backend API; request paths are appended to this. */
  baseUrl: `${env.apiUrl}/api/v1`,
} as const;
