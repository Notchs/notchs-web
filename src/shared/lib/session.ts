import { ApiError, apiRequest, type ApiRequestOptions } from "./api-client";

/**
 * The `{audience}` in the API's `/auth/{audience}/refresh` and `/logout`:
 * one per app. Customers are "user" (not "customer").
 */
export type SessionAudience = "user" | "venue" | "admin";

const renewing: Partial<Record<SessionAudience, Promise<boolean>>> = {};

/** Swaps the refresh cookie for a new session; one renewal at a time per app. */
export function renewSession(audience: SessionAudience): Promise<boolean> {
  renewing[audience] ??= apiRequest(`/auth/${audience}/refresh`, {
    method: "POST",
  })
    .then(
      () => true,
      () => false,
    )
    .finally(() => {
      renewing[audience] = undefined;
    });
  return renewing[audience];
}

/**
 * `apiRequest` for a logged-in app. Logins last 15 minutes and renew for 30
 * days, so a 401 is retried once after renewing; a second 401 means logged out.
 * Login and other `/auth/` calls are never retried.
 */
export function sessionRequest(audience: SessionAudience) {
  return async function request<T>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T> {
    try {
      return await apiRequest<T>(path, options);
    } catch (error) {
      if (
        path.includes("/auth/") ||
        !(error instanceof ApiError && error.status === 401) ||
        !(await renewSession(audience))
      ) {
        throw error;
      }
      return apiRequest<T>(path, options);
    }
  };
}

/** Ends the session; the API clears its cookies. */
export const endSession = (audience: SessionAudience) =>
  apiRequest(`/auth/${audience}/logout`, { method: "POST" });
