"use client";

import { useState, type FormEvent } from "react";

import {
  AuthBackButton,
  AuthButton,
  AuthError,
  AuthHeader,
  AuthInput,
  AuthPasswordInput,
  AuthTextButton,
} from "@/shared/components/auth";
import { MailIcon } from "@/shared/components/icons";
import { useTurnstile } from "@/shared/components/turnstile";

import { flowContent } from "../content";
import { loginVenue, requestPasswordReset, type VenueMember } from "../lib/api";
import { errorMessage, fieldErrors } from "../lib/errors";
import { isEmail, normaliseEmail } from "../lib/validation";

const { login: copy, forgot: forgotCopy } = flowContent;

/** Says why the send button is waiting while the bot check is open. */
export function VerifyHint({ show }: { show: boolean }) {
  return (
    <p role="status" className="text-[.9375rem] text-muted empty:hidden">
      {show ? flowContent.verifyHint : null}
    </p>
  );
}

type LoginFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onForgot: () => void;
  onLoggedIn: (member: VenueMember | undefined) => void;
};

export function LoginForm({
  email,
  onEmailChange,
  onForgot,
  onLoggedIn,
}: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const address = normaliseEmail(email);
    const next: Record<string, string> = {};
    if (!isEmail(address)) next.email = flowContent.emailInvalid;
    if (!password) next.password = copy.passwordMissing;
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const response = await loginVenue(address, password);
      onLoggedIn(response.data);
    } catch (error) {
      setErrors(fieldErrors(error));
      setFormError(errorMessage(error));
      setBusy(false);
    }
  }

  return (
    <>
      <AuthHeader title={copy.title} compact />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label={flowContent.emailLabel}
          icon={<MailIcon />}
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder={flowContent.emailPlaceholder}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={errors.email}
        />
        <AuthPasswordInput
          label={copy.password}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          labelAction={
            <AuthTextButton onClick={onForgot}>{copy.forgot}</AuthTextButton>
          }
        />
        <AuthError message={formError} />
        <AuthButton busy={busy} busyLabel={copy.busy} arrow>
          {copy.cta}
        </AuthButton>
      </form>
    </>
  );
}

type ForgotFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onBack: () => void;
  onSent: () => void;
};

export function ForgotForm({
  email,
  onEmailChange,
  onBack,
  onSent,
}: ForgotFormProps) {
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const turnstile = useTurnstile();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const address = normaliseEmail(email);
    setFormError(undefined);
    if (!isEmail(address)) return setError(flowContent.emailInvalid);
    setError(undefined);

    if (!turnstile.ready) return setFormError(flowContent.verifyHint);

    setBusy(true);
    try {
      await requestPasswordReset(address, turnstile.token);
      onSent();
    } catch (err) {
      setError(fieldErrors(err).email);
      setFormError(errorMessage(err));
      turnstile.reset();
      setBusy(false);
    }
  }

  return (
    <>
      <AuthHeader
        back={<AuthBackButton label={forgotCopy.back} onClick={onBack} />}
        title={forgotCopy.title}
        description={forgotCopy.description}
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <AuthInput
          label={flowContent.emailLabel}
          icon={<MailIcon />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={flowContent.emailPlaceholder}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={error}
          autoFocus
        />
        {turnstile.widget}
        <AuthError message={formError} />
        <VerifyHint show={!turnstile.ready} />
        <AuthButton
          busy={busy}
          busyLabel={forgotCopy.busy}
          disabled={!turnstile.ready}
        >
          {forgotCopy.cta}
        </AuthButton>
      </form>
    </>
  );
}
