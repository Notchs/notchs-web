import { apiConfig } from "@/config/api";
import type { ApiFailure } from "@/shared/types/api";

/** Thrown for every non-2xx response, carrying the backend's error code. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | null | undefined;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
  /** Sent as JSON. */
  body?: unknown;
  /** Appended as a query string; null and undefined values are skipped. */
  query?: Record<string, QueryValue>;
};

function buildUrl(path: string, query: ApiRequestOptions["query"] = {}) {
  const url = new URL(`${apiConfig.baseUrl}${path}`);
  for (const [key, value] of Object.entries(query)) {
    if (value != null) url.searchParams.set(key, String(value));
  }
  return url;
}

/**
 * Single entry point for backend calls. `path` is relative to the API base,
 * e.g. `apiRequest<HealthStatus>("/health")`.
 */
export async function apiRequest<T>(
  path: string,
  { body, query, headers, ...init }: ApiRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path, query), {
    ...init,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = (payload as Partial<ApiFailure> | null)?.error;
    throw new ApiError(
      response.status,
      error?.code ?? "http_error",
      error?.message ?? response.statusText,
      error?.details,
    );
  }

  return payload as T;
}
