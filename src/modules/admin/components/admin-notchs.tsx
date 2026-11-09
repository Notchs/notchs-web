"use client";

import { useCallback, useState } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type AdminNotch } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { AdminPageHeader } from "./admin-page-header";
import {
  AdminButton,
  LoadState,
  Pager,
  Pill,
  SelectBox,
  Table,
  Td,
  formatDateTime,
} from "./admin-ui";
import { useAdminAction } from "./use-admin-action";

const copy = adminContent.notchs;
const VENUE_CODE = /^VEN-[0-9A-Z]{8}$/;

export function AdminNotchs() {
  const { label, description } = adminSectionByKey("notchs");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [venue, setVenue] = useState("");
  const venueCode = venue.trim().toUpperCase();
  const fetcher = useCallback(
    () =>
      adminApi.notchs({
        page,
        size: 25,
        status: status || undefined,
        venue_code: VENUE_CODE.test(venueCode) ? venueCode : undefined,
      }),
    [page, status, venueCode],
  );
  const { data, error, refresh } = useAdminQuery(fetcher);
  const action = useAdminAction();

  const remove = (notch: AdminNotch) => {
    const reason = window.prompt(
      copy.reasonPrompt(notch.notch_no, notch.venue_name),
    );
    if (!reason || reason.trim().length < 3) return;
    void action.run(
      () => adminApi.revoke(notch.venue_code, notch.notch_no, reason.trim()),
      refresh,
    );
  };

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <div className="mb-4 flex flex-wrap gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-muted">{copy.venueFilter}</span>
          <input
            value={venue}
            placeholder="VEN-…"
            maxLength={12}
            onChange={(event) => {
              setVenue(event.target.value);
              setPage(1);
            }}
            className="min-h-10 rounded-xl border border-line bg-background px-3 font-mono uppercase"
          />
        </label>
        <SelectBox
          label={copy.status}
          value={status}
          options={copy.statusOptions}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>
      {action.message && (
        <p role="alert" className="mb-3 text-sm font-semibold">
          {action.message}
        </p>
      )}
      {!data ? (
        <LoadState error={error} onRetry={refresh} />
      ) : (
        <>
          <Table head={copy.columns} empty={data.items.length === 0}>
            {data.items.map((notch) => (
              <tr key={`${notch.venue_code}-${notch.notch_no}`}>
                <Td className="font-mono">
                  #{String(notch.notch_no).padStart(4, "0")}
                </Td>
                <Td>
                  <b className="block">{notch.venue_name}</b>
                  <span className="font-mono text-xs text-muted">
                    {notch.venue_code}
                  </span>
                </Td>
                <Td className="font-mono">
                  {notch.customer_handle ?? copy.deletedCustomer}
                </Td>
                <Td>
                  {formatDateTime(notch.visited_at)}
                  <span className="block text-xs text-muted">
                    {copy.visitNo(notch.visit_no_at_venue)}
                  </span>
                </Td>
                <Td className="tabular-nums">{notch.points}</Td>
                <Td>
                  <Pill tone={notch.status === "valid" ? "good" : "warn"}>
                    {copy.statusLabel[notch.status]}
                  </Pill>
                </Td>
                <Td>
                  {notch.status === "valid" && (
                    <AdminButton
                      tone="danger"
                      disabled={action.busy}
                      onClick={() => remove(notch)}
                    >
                      {copy.remove}
                    </AdminButton>
                  )}
                </Td>
              </tr>
            ))}
          </Table>
          <Pager
            page={data.page}
            pages={data.pages}
            total={data.total}
            onPage={setPage}
          />
        </>
      )}
    </>
  );
}
