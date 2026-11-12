import Link from "next/link";

import { routes } from "@/config/routes";
import { StatusPage } from "@/shared/components/status-page";

import { loginConsent } from "../content";
import { WhatsAppLoginButton } from "./whatsapp-login-button";
import { WhatsAppLoginQr } from "./whatsapp-login-qr";

export function LoginPage() {
  return (
    <StatusPage
      kicker="Log in"
      mark={<WhatsAppLoginQr />}
      markClassName="aspect-auto w-full max-w-64 split:max-w-none"
      title="Your Notchs, one message away."
      action={
        <div className="flex flex-col gap-4">
          <WhatsAppLoginButton />
          <p className="max-w-sm text-sm text-muted">
            {loginConsent.before}{" "}
            <Link href={routes.terms} className="underline">
              {loginConsent.terms}
            </Link>{" "}
            {loginConsent.and}{" "}
            <Link href={routes.privacy} className="underline">
              {loginConsent.privacy}
            </Link>
            {loginConsent.after}
          </p>
        </div>
      }
    />
  );
}
