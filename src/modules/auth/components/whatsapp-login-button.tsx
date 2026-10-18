import { ArrowRightIcon } from "@/shared/components/icons";
import { ButtonLink } from "@/shared/components/ui/button";

import { loginLabel, loginUnavailable } from "../content";
import { whatsappLoginUrl } from "../lib/whatsapp";

/** Opens WhatsApp with "LOGIN" ready to send to the bot. */
export function WhatsAppLoginButton() {
  if (!whatsappLoginUrl) {
    return (
      <p role="status" className="max-w-[40ch] text-muted">
        {loginUnavailable}
      </p>
    );
  }

  return (
    <ButtonLink href={whatsappLoginUrl} target="_blank" rel="noopener">
      {loginLabel}
      <ArrowRightIcon className="size-4.5 transition-transform duration-150 group-hover:translate-x-0.5" />
    </ButtonLink>
  );
}
