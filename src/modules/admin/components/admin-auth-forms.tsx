"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

import { adminRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ApiError } from "@/shared/lib/api-client";

import { adminContent } from "../content";
import { adminApi } from "../lib/api";

const copy = adminContent.auth;

function AuthFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="row-span-full grid min-h-svh place-items-center px-gutter py-10">
      <div className="grid w-full max-w-sm gap-6">
        <span className="flex items-center gap-2.5">
          <NotchGlyph className="size-6" />
          <b className="font-display text-lg">
            {siteConfig.name} {adminContent.badge}
          </b>
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-[-.03em]">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        className="min-h-11 rounded-xl border border-line bg-background px-3 text-base"
        {...props}
      />
    </label>
  );
}

function Submit({
  busy,
  children,
}: {
  busy: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="min-h-11 cursor-pointer rounded-full bg-ink font-semibold text-paper disabled:opacity-60"
    >
      {children}
    </button>
  );
}

const messageOf = (error: unknown) =>
  error instanceof ApiError && error.status < 500
    ? error.message
    : adminContent.actionFailed;

export function AdminLogin() {
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
    <AuthFrame title={copy.loginTitle}>
      <form onSubmit={submit} className="grid gap-4">
        <Field
          label={copy.email}
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={120}
        />
        <Field
          label={copy.password}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
        {error && (
          <p role="alert" className="text-sm font-semibold">
            {error}
          </p>
        )}
        <Submit busy={busy}>{copy.login}</Submit>
      </form>
      <p className="text-sm text-muted">{copy.loginHelp}</p>
    </AuthFrame>
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
    <AuthFrame title={copy.setTitle}>
      {token === undefined ? null : !token ? (
        <p className="text-muted">{copy.noToken}</p>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <Field
            label={copy.newPassword}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            maxLength={128}
          />
          <Field
            label={copy.confirm}
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={10}
            maxLength={128}
          />
          {error && (
            <p role="alert" className="text-sm font-semibold">
              {error}
            </p>
          )}
          <Submit busy={busy}>{copy.save}</Submit>
        </form>
      )}
    </AuthFrame>
  );
}
