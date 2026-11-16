"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { adminRoutes } from "@/config/routes";
import {
  AuthBackButton,
  AuthBrandPanel,
  AuthButton,
  AuthError,
  AuthFormPanel,
  AuthHeader,
  AuthInput,
  AuthLayout,
  AuthPasswordInput,
  AuthSuccess,
  AuthTextButton,
} from "@/shared/components/auth";
import { MailIcon } from "@/shared/components/icons";
import { useTurnstile } from "@/shared/components/turnstile";
import { ApiError } from "@/shared/lib/api-client";

import { adminContent } from "../content";
import { adminApi } from "../lib/api";

const copy = adminContent.auth;

/**
 * Admin auth on the shared auth layout. There is no public admin sign-up:
 * new admins are added by the team and set their password from an emailed link.
 */
function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthLayout
      brand={<AuthBrandPanel {...copy.brand} />}
      helpSubject={copy.helpSubject}
    >
      {children}
    </AuthLayout>
  );
}

const messageOf = (error: unknown) =>
  error instanceof ApiError && error.status < 500
    ? error.message
    : adminContent.actionFailed;

export function AdminLogin() {
  const [forgot, setForgot] = useState(false);

  return (
    <AdminAuthLayout>
      {forgot ? (
        <AdminForgotPassword onBack={() => setForgot(false)} />
      ) : (
        <AdminLoginForm onForgot={() => setForgot(true)} />
      )}
    </AdminAuthLayout>
  );
}

function AdminLoginForm({ onForgot }: { onForgot: () => void }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await adminApi.login(
        String(form.get("email")),
        String(form.get("password")),
      );
      router.replace(adminRoutes.dashboard);
    } catch (caught) {
      setError(messageOf(caught));
      setBusy(false);
    }
  }

  return (
    <AuthFormPanel screenKey="login">
      <AuthHeader title={copy.loginTitle} compact />
      <form onSubmit={submit} className="flex flex-col gap-5">
        <AuthInput
          label={copy.email}
          icon={<MailIcon />}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          maxLength={120}
        />
        <AuthPasswordInput
          label={copy.password}
          name="password"
          autoComplete="current-password"
          required
          maxLength={128}
          labelAction={
            <AuthTextButton onClick={onForgot}>{copy.forgot}</AuthTextButton>
          }
        />
        <AuthError message={error} />
        <AuthButton busy={busy} busyLabel={copy.loggingIn} arrow>
          {copy.login}
        </AuthButton>
      </form>
      <p className="leading-relaxed text-muted">{copy.loginHelp}</p>
    </AuthFormPanel>
  );
}

/** Emails a set-password link (the API sends the same answer for any email). */
function AdminForgotPassword({ onBack }: { onBack: () => void }) {
  const turnstile = useTurnstile();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !turnstile.ready) return;
    const email = String(new FormData(event.currentTarget).get("email"));
    setBusy(true);
    setError(null);
    try {
      await adminApi.forgotPassword(email, turnstile.token);
      setSent(true);
    } catch (caught) {
      setError(messageOf(caught));
    } finally {
      turnstile.reset();
      setBusy(false);
    }
  }

  const back = <AuthBackButton label={copy.backToLogin} onClick={onBack} />;

  if (sent) {
    return (
      <AuthFormPanel screenKey="sent">
        <AuthSuccess
          stamp={copy.forgotSentStamp}
          title={copy.forgotSentTitle}
          body={copy.forgotSent}
        >
          {back}
        </AuthSuccess>
      </AuthFormPanel>
    );
  }

  return (
    <AuthFormPanel screenKey="forgot">
      <AuthHeader
        back={back}
        title={copy.forgotTitle}
        description={copy.forgotHelp}
      />
      <form onSubmit={submit} className="flex flex-col gap-5">
        <AuthInput
          label={copy.email}
          icon={<MailIcon />}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          required
          maxLength={120}
          autoFocus
        />
        {turnstile.widget}
        <AuthError message={error} />
        <AuthButton
          busy={busy}
          busyLabel={copy.sending}
          disabled={!turnstile.ready}
        >
          {copy.forgotSend}
        </AuthButton>
      </form>
    </AuthFormPanel>
  );
}

/** Reads the emailed token once and removes it from the address bar. */
function takeToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (token !== null) {
    url.searchParams.delete("token");
    window.history.replaceState(null, "", url);
  }
  return token;
}

export function AdminSetPassword() {
  const router = useRouter();
  // undefined until read in the browser, then the token or null.
  const [token, setToken] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    // Reading the address bar once on mount (outside React).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(takeToken());
  }, []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !token) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setError(copy.mismatch);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await adminApi.setPassword(token, password);
      router.replace(adminRoutes.dashboard);
    } catch (caught) {
      setError(messageOf(caught));
      setBusy(false);
    }
  }

  return (
    <AdminAuthLayout>
      <AuthFormPanel screenKey={token ? "form" : "wait"}>
        <AuthHeader kicker={copy.kicker} title={copy.setTitle} />
        {token === undefined ? null : !token ? (
          <p className="leading-relaxed text-muted">{copy.noToken}</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-5">
            <AuthPasswordInput
              label={copy.newPassword}
              name="password"
              autoComplete="new-password"
              required
              minLength={10}
              maxLength={128}
            />
            <AuthPasswordInput
              label={copy.confirm}
              name="confirm"
              autoComplete="new-password"
              required
              minLength={10}
              maxLength={128}
            />
            <AuthError message={error} />
            <AuthButton busy={busy} busyLabel={copy.saving}>
              {copy.save}
            </AuthButton>
          </form>
        )}
      </AuthFormPanel>
    </AdminAuthLayout>
  );
}
