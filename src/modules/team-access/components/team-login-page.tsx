import { LockedMark } from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";

import { teamLoginContent as content } from "../content";
import { TeamLoginForm } from "./team-login-form";

/** Sign-in page for the team login that locks test links. */
export function TeamLoginPage() {
  return (
    <StatusPage
      kicker={content.kicker}
      title={content.title}
      description={content.description}
      mark={<LockedMark />}
      action={<TeamLoginForm />}
    />
  );
}
