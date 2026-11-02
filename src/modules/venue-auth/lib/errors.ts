import { ApiError } from "@/shared/lib/api-client";

type ValidationDetail = { loc?: (string | number)[]; msg?: string };

/** Pydantic prefixes custom messages with "Value error, ". */
const clean = (msg: string) => msg.replace(/^Value error,\s*/i, "");

function validationDetails(error: unknown): ValidationDetail[] {
  if (!(error instanceof ApiError) || !Array.isArray(error.details)) return [];
  return error.details as ValidationDetail[];
}

/** One sentence to show the owner for any failed request. */
export function errorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return "Can't reach Notchs right now. Check your connection and try again.";
  }
  if (error.status === 429) {
    return "Too many tries. Wait a minute, then try again.";
  }
  const first = validationDetails(error)[0]?.msg;
  if (error.code === "validation_error" && first) return clean(first);
  if (error.status >= 500) {
    return "Something went wrong on our side. Please try again.";
  }
  return error.message;
}

/** Validation messages keyed by body field, e.g. `{ email: "Enter a valid…" }`. */
export function fieldErrors(error: unknown) {
  const errors: Record<string, string> = {};
  for (const { loc, msg } of validationDetails(error)) {
    const field = loc?.[0] === "body" ? loc[1] : undefined;
    if (typeof field === "string" && msg && !errors[field]) {
      errors[field] = clean(msg);
    }
  }
  return errors;
}
