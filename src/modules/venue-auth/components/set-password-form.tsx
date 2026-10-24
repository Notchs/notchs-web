"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";

import { routes } from "@/config/routes";
import { ButtonLink, Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api-client";

import { flowContent } from "../content";
import { setVenuePassword, type VenueMember } from "../lib/api";
import { errorMessage, fieldErrors } from "../lib/errors";
import { PasswordField } from "./field";
import { LoggedInPanel } from "./logged-in-panel";
import { FormError, ScreenFrame, ScreenHeading } from "./venue-auth-shell";

const copy = flowContent.setPassword;

/** Reads the token and removes it from the address bar, so it isn't kept in history. */
function takeTokenFromUrl() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (token !== null) {
    url.searchParams.delete("token");
    window.history.replaceState(window.history.state, "", url);
  }
  return token ?? "";
}

type State =
  | { status: "form" }
  | { status: "invalid" }
  | { status: "done"; member: VenueMember | undefined };

/**
 * Landing page for the emailed link (first password after approval, or a
 * reset). Setting the password also logs the owner in.
 */
export function SetPasswordForm() {
  const [state, setState] = useState<State>({ status: "form" });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  /** Kept across renders: StrictMode runs effects twice, the URL is already clean on the second run. */
  const tokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (tokenRef.current !== undefined) return;
    tokenRef.current = takeTokenFromUrl();
    if (!tokenRef.current) setState({ status: "invalid" });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!password) next.password = copy.missing;
    else if (password !== confirm) next.confirm = copy.mismatch;
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const response = await setVenuePassword(tokenRef.current ?? "", password);
      setState({ status: "done", member: response.data });
    } catch (error) {
      const fields = fieldErrors(error);
      if (
        "token" in fields ||
        (error instanceof ApiError && error.code === "auth.token_invalid")
      ) {
        setState({ status: "invalid" });
        return;
      }
      setErrors(fields);
      if (!fields.password) setFormError(errorMessage(error));
      setBusy(false);
    }
  }

  return (
    <>
      <ScreenFrame screenKey={state.status}>
        {state.status === "done" ? (
          <LoggedInPanel
            stamp={flowContent.done.passwordStamp}
            member={state.member}
            onLoggedOut={() => window.location.assign(routes.venueLogin)}
          />
        ) : state.status === "invalid" ? (
          <>
            <ScreenHeading
              kicker={copy.kicker}
              title={copy.invalidTitle}
              description={copy.invalidBody}
            />
            <ButtonLink
              href={`${routes.venueLogin}?view=forgot`}
              className="w-full"
            >
              {copy.invalidCta}
            </ButtonLink>
          </>
        ) : (
          <>
            <ScreenHeading
              kicker={copy.kicker}
              title={copy.title}
              description={copy.description}
            />
            <form onSubmit={submit} noValidate className="flex flex-col gap-5">
              <PasswordField
                label={copy.password}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoFocus
              />
              <PasswordField
                label={copy.confirm}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
              <FormError message={formError} />
              <Button type="submit" disabled={busy}>
                {busy ? copy.busy : copy.cta}
              </Button>
            </form>
          </>
        )}
        {state.status !== "done" && (
          <p className="text-center">
            <Link
              href={routes.venueLogin}
              className="inline-block py-3 font-semibold underline underline-offset-[3px] hover:text-muted"
            >
              {copy.backToLogin}
            </Link>
          </p>
        )}
      </ScreenFrame>
    </>
  );
}
