import { StatusPage } from "@/shared/components/status-page";

import { WhatsAppLoginButton } from "./whatsapp-login-button";
import { WhatsAppLoginQr } from "./whatsapp-login-qr";

export function LoginPage() {
  return (
    <StatusPage
      kicker="Log in"
      mark={<WhatsAppLoginQr />}
      markClassName="aspect-auto w-full max-w-64 split:max-w-none"
      title="Your Notchs, one message away."
      action={<WhatsAppLoginButton />}
    />
  );
}
