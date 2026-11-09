"use client";

import { useCallback, useState } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type AdminVenue } from "../lib/api";
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

const copy = adminContent.venues;

export function AdminVenues() {
  const { label, description } = adminSectionByKey("venues");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const fetcher = useCallback(
    () =>
      adminApi.venues({
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

  const change = (venue: AdminVenue, next: string) => {
    if (next === "closed" && !window.confirm(copy.confirmClose(venue.name)))
      return;
    void action.run(
      () => adminApi.setVenueStatus(venue.venue_code, next),
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
            {data.items.map((venue) => (
              <tr key={venue.venue_code}>
                <Td>
                  <b className="block">{venue.name}</b>
                  <span className="font-mono text-xs text-muted">
                    {venue.venue_code}
                  </span>
                </Td>
                <Td>
                  {copy.category[venue.category] ?? venue.category}
                  <span className="block text-xs text-muted">
                    {venue.area ?? adminContent.emptyValue}
                  </span>
                </Td>
                <Td>
                  <Pill
                    tone={
                      venue.status === "counter_live"
                        ? "good"
                        : venue.status === "closed" || venue.status === "paused"
                          ? "warn"
                          : "plain"
                    }
                  >
                    {copy.statusLabel[venue.status] ?? venue.status}
                  </Pill>
                </Td>
                <Td>
                  {!venue.counter_paired
                    ? copy.notPaired
                    : venue.counter_online
                      ? copy.online
                      : copy.offline}
                  <span className="block text-xs text-muted">
                    {formatDateTime(venue.counter_last_seen_at)}
                  </span>
                </Td>
                <Td className="tabular-nums">
                  {venue.notchs_7d} / {venue.notchs_total}
                </Td>
                <Td>{formatDateTime(venue.joined_at)}</Td>
                <Td>
                  {canChange && (
                    <span className="flex flex-wrap gap-2">
                      {(venue.status === "counter_live" ||
                        venue.status === "signed") && (
                        <AdminButton
                          disabled={action.busy}
                          onClick={() => change(venue, "paused")}
                        >
                          {copy.pause}
                        </AdminButton>
                      )}
                      {venue.status === "paused" && (
                        <AdminButton
                          disabled={action.busy}
                          onClick={() => change(venue, "counter_live")}
                        >
                          {copy.resume}
                        </AdminButton>
                      )}
                      {venue.status !== "closed" && (
                        <AdminButton
                          tone="danger"
                          disabled={action.busy}
                          onClick={() => change(venue, "closed")}
                        >
                          {copy.close}
                        </AdminButton>
                      )}
                    </span>
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
