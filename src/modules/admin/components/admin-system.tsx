"use client";

import { useState, type FormEvent } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { adminContent } from "../content";
import { adminApi, type SystemStatus } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { AdminButton, Panel, Pill } from "./admin-ui";
import { useAdminAction } from "./use-admin-action";

const copy = adminContent.system;
const passwordCopy = adminContent.password;
const fieldStyles =
  "min-h-10 rounded-xl border border-line bg-background px-3 text-sm";

function Row({
  label,
  state,
  ok,
  notes,
}: {
  label: string;
  state: string;
  ok: boolean;
  notes?: (string | false)[];
}) {
  const shown = (notes ?? []).filter(Boolean);
  return (
    <div className="grid gap-1 border-t border-line py-3 first:border-t-0 sm:grid-cols-[11rem_1fr]">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="grid justify-items-start gap-1 text-sm">
        <Pill tone={ok ? "good" : "warn"}>{state}</Pill>
        {shown.map((note) => (
          <span key={String(note)} className="text-muted">
            {note}
          </span>
        ))}
      </dd>
    </div>
  );
}

/**
 * Whether email, WhatsApp and the bot check are really switched on, and a test
 * email. An API without this (older deploy) shows nothing.
 */
export function AdminSystem({ canTest }: { canTest: boolean }) {
  const { data } = useAdminQuery(adminApi.system);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (!data) return null;

  async function testEmail() {
    if (busy) return;
    setBusy(true);
    setResult(null);
    try {
      setResult(await adminApi.sendTestEmail());
    } catch (error) {
      // The email provider's own reason (e.g. the domain isn't verified).
      setResult(
        error instanceof ApiError ? error.message : adminContent.actionFailed,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="grid gap-3 p-5">
      <h2 className="font-display text-lg font-extrabold">{copy.title}</h2>
      <p className="text-sm text-muted">{copy.intro}</p>
      <dl>
        <Row
          label={copy.email}
          state={copy.emailState[data.email]}
          ok={data.email === "sending"}
          notes={[
            copy.from(data.email_from),
            data.email !== "sending" && copy.emailFix,
          ]}
        />
        <Row
          label={copy.whatsapp}
          state={copy.whatsappState[data.whatsapp]}
          ok={
            data.whatsapp === "sending" &&
            data.whatsapp_webhook_ready &&
            data.whatsapp_number_set
          }
          notes={[
            data.whatsapp !== "sending" && copy.whatsappFix,
            !data.whatsapp_webhook_ready && copy.webhookMissing,
            !data.whatsapp_number_set && copy.numberMissing,
          ]}
        />
        <Row
          label={copy.botCheck}
          state={copy.botState[data.bot_check]}
          ok={data.bot_check === "on"}
          notes={[data.bot_check === "not_configured" && copy.botFix]}
        />
        <Row
          label={copy.links}
          state={hostOf(data.customer_app_url)}
          ok={!isLocal(data)}
          notes={[data.venue_app_url, data.admin_app_url]}
        />
      </dl>
      <div className="flex flex-wrap items-center gap-3">
        {canTest && (
          <AdminButton tone="dark" disabled={busy} onClick={testEmail}>
            {busy ? copy.testing : copy.testEmail}
          </AdminButton>
        )}
        <span className="text-xs text-muted">
          {copy.environment(data.environment, data.version)}
        </span>
      </div>
      {result && (
        <p role="status" className="text-sm font-semibold break-words">
          {result}
        </p>
      )}
    </Panel>
  );
}

const hostOf = (url: string) => url.replace(/^https?:\/\//, "");

/** Links that only work on someone's own computer. */
const isLocal = (status: SystemStatus) =>
  [status.customer_app_url, status.venue_app_url, status.admin_app_url].some(
    (url) => url.includes("localhost"),
  );

/** Every admin can change their own password. */
export function ChangeMyPassword() {
  const action = useAdminAction();
  const [done, setDone] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setDone(false);
    const changed = await action.run(() =>
      adminApi.changePassword(
        String(data.get("current")),
        String(data.get("next")),
      ),
    );
    if (changed) {
      setDone(true);
      form.reset();
    }
  }

  return (
    <Panel className="p-5">
      <form onSubmit={submit} className="grid gap-4">
        <h2 className="font-display text-lg font-extrabold">
          {passwordCopy.title}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="text-muted">{passwordCopy.current}</span>
            <input
              name="current"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
              className={fieldStyles}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted">{passwordCopy.next}</span>
            <input
              name="next"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              maxLength={128}
              className={fieldStyles}
            />
          </label>
        </div>
        <AdminButton
          type="submit"
          tone="dark"
          disabled={action.busy}
          className="justify-self-start"
        >
          {passwordCopy.save}
        </AdminButton>
        {(action.message ?? (done && passwordCopy.done)) && (
          <p role="alert" className="text-sm font-semibold">
            {action.message ?? passwordCopy.done}
          </p>
        )}
      </form>
    </Panel>
  );
}
