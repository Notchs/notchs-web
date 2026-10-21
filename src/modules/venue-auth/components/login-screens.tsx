"use client";

import { useState, type FormEvent } from "react";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MailIcon,
} from "@/shared/components/icons";
import { useTurnstile } from "@/shared/components/turnstile";
import { Button } from "@/shared/components/ui/button";

import { flowContent } from "../content";
import { loginVenue, requestPasswordReset, type VenueMember } from "../lib/api";
import { errorMessage, fieldErrors } from "../lib/errors";
import { isEmail, normaliseEmail } from "../lib/validation";
import { Field, PasswordField } from "./field";
import { FormError, ScreenHeading } from "./venue-auth-shell";

const { login: copy, forgot: forgotCopy } = flowContent;

export function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group -ml-1 flex h-12 cursor-pointer items-center gap-2 self-start rounded-md px-1 font-semibold"
    >
      <ArrowLeftIcon className="size-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
      {label}
    </button>
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
      <ScreenHeading
        kicker={copy.kicker}
        title={copy.title}
        description={copy.description}
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field
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
        <PasswordField
          label={copy.password}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          labelAction={
            <button
              type="button"
              onClick={onForgot}
              className="cursor-pointer text-[.9375rem] font-semibold underline underline-offset-[3px] hover:text-muted"
            >
              {copy.forgot}
            </button>
          }
        />
        <FormError message={formError} />
        <Button type="submit" disabled={busy}>
          {busy ? copy.busy : copy.cta}
          {!busy && <ArrowRightIcon className="size-4.5" />}
        </Button>
      </form>
      <p className="leading-relaxed text-muted">{copy.staffNote}</p>
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

    if (!turnstile.token && !turnstile.disabled) {
      return setFormError(flowContent.checking);
    }

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
      <ScreenHeading
        back={<BackButton label={forgotCopy.back} onClick={onBack} />}
        title={forgotCopy.title}
        description={forgotCopy.description}
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field
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
        <FormError message={formError} />
        <Button type="submit" disabled={busy}>
          {busy ? forgotCopy.busy : forgotCopy.cta}
        </Button>
      </form>
    </>
  );
}
