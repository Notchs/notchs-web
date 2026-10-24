import { apiRequest } from "@/shared/lib/api-client";
import type { ApiSuccess } from "@/shared/types/api";

/** What the backend returns after a login: enough to greet the customer. */
export type CustomerBrief = {
  id: string;
  name: string | null;
  handle: string | null;
  is_public: boolean;
};

/**
 * Trades the single-use token from the WhatsApp link for a session.
 * The backend sets the HttpOnly session cookies itself.
 */
export function consumeLoginLink(token: string) {
  return apiRequest<ApiSuccess<CustomerBrief>>("/auth/customer/consume", {
    method: "POST",
    body: { token },
  });
}
