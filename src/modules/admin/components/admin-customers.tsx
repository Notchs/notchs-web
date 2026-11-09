"use client";

import { useCallback, useState } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type AdminCustomer } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { useAdmin } from "./admin-gate";
import { AdminPageHeader } from "./admin-page-header";
import {
  AdminButton,
  LoadState,
  Pager,
  Pill,
  SearchBox,
  SelectBox,
  Table,
  Td,
  formatDateTime,
} from "./admin-ui";
import { useAdminAction } from "./use-admin-action";

const copy = adminContent.customers;

/** Customers by handle; only the last 4 digits of a phone number, ever. */
export function AdminCustomers() {
  const { label, description } = adminSectionByKey("customers");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const fetcher = useCallback(
    () =>
      adminApi.customers({
        page,
        size: 25,
        status: status || undefined,
        q: q.trim() || undefined,
      }),
    [page, status, q],
  );
  const { data, error, refresh } = useAdminQuery(fetcher);
  const action = useAdminAction();
  const canChange = useAdmin().role === "admin";

  const toggle = (customer: AdminCustomer) => {
    const next = customer.status === "active" ? "blocked" : "active";
    if (
      next === "blocked" &&
      !window.confirm(copy.confirmBlock(customer.handle))
    )
      return;
    void action.run(
      () => adminApi.setCustomerStatus(customer.handle, next),
      refresh,
    );
  };

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchBox
          label={copy.search}
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
        />
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
            {data.items.map((customer) => (
              <tr key={customer.handle}>
                <Td>
                  <b className="block font-mono">{customer.handle}</b>
                  <span className="text-xs text-muted">
                    {customer.name ?? adminContent.emptyValue}
                  </span>
                </Td>
                <Td className="font-mono">{customer.phone_last4}</Td>
                <Td>{customer.city ?? adminContent.emptyValue}</Td>
                <Td className="tabular-nums">{customer.notchs}</Td>
                <Td>
                  {customer.founding_member_no
                    ? `#${customer.founding_member_no}`
                    : adminContent.emptyValue}
                </Td>
                <Td>
                  {formatDateTime(customer.joined_at)}
                  <span className="block text-xs text-muted">
                    {formatDateTime(customer.last_seen_at)}
                  </span>
                </Td>
                <Td>
                  <Pill tone={customer.status === "active" ? "good" : "warn"}>
                    {copy.statusLabel[customer.status]}
                  </Pill>
                </Td>
                <Td>
                  {canChange && (
                    <AdminButton
                      tone={customer.status === "active" ? "danger" : "plain"}
                      disabled={action.busy}
                      onClick={() => toggle(customer)}
                    >
                      {customer.status === "active" ? copy.block : copy.unblock}
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
