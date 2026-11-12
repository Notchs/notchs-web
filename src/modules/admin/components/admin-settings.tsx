"use client";

import { useState, type FormEvent } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type AdminAccount } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { useAdmin } from "./admin-gate";
import { AdminPageHeader } from "./admin-page-header";
import { AdminSystem, ChangeMyPassword } from "./admin-system";
import {
  AdminButton,
  LoadState,
  Panel,
  Pill,
  SelectBox,
  Table,
  Td,
  formatDateTime,
} from "./admin-ui";
import { useAdminAction } from "./use-admin-action";

const copy = adminContent.settings;
const fieldStyles =
  "min-h-10 rounded-xl border border-line bg-background px-3 text-sm";

/** The team's admin accounts: add people, change roles, turn them off. */
export function AdminSettings() {
  const { label, description } = adminSectionByKey("settings");
  const me = useAdmin();

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <div className="grid gap-6">
        <AdminSystem canTest={me.role === "admin"} />
        {me.role === "admin" ? (
          <Team myId={me.id} />
        ) : (
          <p className="py-4 text-center text-muted">{copy.adminsOnly}</p>
        )}
        <ChangeMyPassword />
      </div>
    </>
  );
}

function Team({ myId }: { myId: string }) {
  const { data, error, refresh } = useAdminQuery(adminApi.admins);

  return (
    <div className="grid gap-6">
      <AddAdmin onAdded={refresh} />
      {!data ? (
        <LoadState error={error} onRetry={refresh} />
      ) : (
        <Table head={copy.head} empty={data.length === 0}>
          {data.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              isMe={account.id === myId}
              onChanged={refresh}
            />
          ))}
        </Table>
      )}
    </div>
  );
}

function AddAdmin({ onAdded }: { onAdded: () => void }) {
  const action = useAdminAction();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("reviewer");
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const added = email.trim();
    const done = await action.run(
      () => adminApi.addAdmin(name.trim(), added, role),
      onAdded,
    );
    if (done) {
      setNotice(copy.added(added));
      setName("");
      setEmail("");
    }
  }

  return (
    <Panel className="p-5">
      <form onSubmit={submit} className="grid gap-4">
        <h2 className="font-display text-lg font-extrabold">{copy.addTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <label className="grid gap-1 text-sm">
            <span className="text-muted">{copy.name}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={60}
              className={fieldStyles}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted">{copy.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={120}
              autoComplete="off"
              className={fieldStyles}
            />
          </label>
          <SelectBox
            label={copy.role}
            value={role}
            options={copy.roles}
            onChange={setRole}
          />
        </div>
        <AdminButton
          type="submit"
          tone="dark"
          disabled={action.busy}
          className="justify-self-start"
        >
          {copy.add}
        </AdminButton>
        {(action.message ?? notice) && (
          <p role="alert" className="text-sm font-semibold">
            {action.message ?? notice}
          </p>
        )}
      </form>
    </Panel>
  );
}

function AccountRow({
  account,
  isMe,
  onChanged,
}: {
  account: AdminAccount;
  isMe: boolean;
  onChanged: () => void;
}) {
  const action = useAdminAction();
  const [notice, setNotice] = useState<string | null>(null);
  const code = account.admin_user_code;

  const setRole = (role: string) =>
    void action.run(() => adminApi.updateAdmin(code, { role }), onChanged);
  const toggle = () => {
    if (account.is_active && !window.confirm(copy.confirmOff(account.name)))
      return;
    void action.run(
      () => adminApi.updateAdmin(code, { is_active: !account.is_active }),
      onChanged,
    );
  };
  const sendLink = async () => {
    if (await action.run(() => adminApi.sendAdminLink(code)))
      setNotice(copy.linkSent);
  };

  return (
    <tr>
      <Td>
        <b>{account.name}</b>
        {isMe && <span className="text-muted"> · {copy.you}</span>}
      </Td>
      <Td className="break-all">{account.email}</Td>
      <Td>
        {isMe ? (
          copy.roleLabel[account.role]
        ) : (
          <select
            aria-label={`${copy.role}: ${account.name}`}
            value={account.role}
            disabled={action.busy}
            onChange={(e) => setRole(e.target.value)}
            className={fieldStyles}
          >
            {copy.roles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Td>
      <Td>
        <div className="grid justify-items-start gap-1">
          <Pill tone={account.is_active ? "good" : "warn"}>
            {account.is_active ? copy.active : copy.off}
          </Pill>
          {!account.has_password && (
            <span className="text-xs text-muted">{copy.noPassword}</span>
          )}
        </div>
      </Td>
      <Td>{formatDateTime(account.last_login_at)}</Td>
      <Td>
        {!isMe && (
          <div className="flex flex-wrap gap-2">
            <AdminButton
              tone={account.is_active ? "danger" : "plain"}
              disabled={action.busy}
              onClick={toggle}
            >
              {account.is_active ? copy.turnOff : copy.turnOn}
            </AdminButton>
            {account.is_active && (
              <AdminButton disabled={action.busy} onClick={sendLink}>
                {copy.sendLink}
              </AdminButton>
            )}
          </div>
        )}
        {(action.message ?? notice) && (
          <p role="alert" className="mt-1 text-xs font-semibold">
            {action.message ?? notice}
          </p>
        )}
      </Td>
    </tr>
  );
}
