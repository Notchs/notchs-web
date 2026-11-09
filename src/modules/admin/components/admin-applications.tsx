"use client";

import { useCallback, useState } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type Application } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { useAdmin } from "./admin-gate";
import { AdminPageHeader } from "./admin-page-header";
import {
  AdminButton,
  LoadState,
  Pager,
  Panel,
  Pill,
  SelectBox,
  formatDateTime,
} from "./admin-ui";
import { useAdminAction } from "./use-admin-action";

const copy = adminContent.applications;

/** Venues that registered themselves, waiting for the team's review. */
export function AdminApplications() {
  const { label, description } = adminSectionByKey("applications");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("pending");
  const fetcher = useCallback(
    () => adminApi.applications({ page, size: 20, status }),
    [page, status],
  );
  const { data, error, refresh } = useAdminQuery(fetcher);

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <div className="mb-4">
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
      {!data ? (
        <LoadState error={error} onRetry={refresh} />
      ) : data.items.length === 0 ? (
        <p className="py-10 text-center text-muted">{copy.empty}</p>
      ) : (
        <>
          <ul className="grid gap-3">
            {data.items.map((application) => (
              <li key={application.id}>
                <ApplicationCard
                  application={application}
                  onChanged={refresh}
                />
              </li>
            ))}
          </ul>
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

function ApplicationCard({
  application,
  onChanged,
}: {
  application: Application;
  onChanged: () => void;
}) {
  const canReview = useAdmin().role === "admin";
  const action = useAdminAction();
  const [area, setArea] = useState("");
  const areas = useAdminQuery(
    useCallback(
      () => adminApi.areas(application.city_id),
      [application.city_id],
    ),
  );
  const pending = application.status === "pending";

  const approve = () => {
    if (
      !window.confirm(
        copy.confirmApprove(application.venue_name, application.email),
      )
    )
      return;
    void action.run(
      () => adminApi.approve(application.id, area || null),
      onChanged,
    );
  };
  const reject = () => {
    const reason = window.prompt(copy.rejectPrompt(application.venue_name));
    if (reason === null) return;
    void action.run(
      () => adminApi.reject(application.id, reason.trim(), true),
      onChanged,
    );
  };

  return (
    <Panel className="grid gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <b className="font-display text-xl">{application.venue_name}</b>
          <p className="text-sm text-muted">
            {copy.category[application.category] ?? application.category} ·{" "}
            {application.application_code} ·{" "}
            {formatDateTime(application.created_at)}
          </p>
        </div>
        <Pill
          tone={
            pending
              ? "plain"
              : application.status === "approved"
                ? "good"
                : "warn"
          }
        >
          {copy.statusLabel[application.status]}
        </Pill>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">{copy.contact}</dt>
          <dd>
            {application.contact_name} · {application.phone_e164}
          </dd>
        </div>
        <div>
          <dt className="text-muted">{copy.email}</dt>
          <dd className="break-all">{application.email}</dd>
        </div>
        <div>
          <dt className="text-muted">{copy.landmark}</dt>
          <dd>{application.landmark ?? adminContent.emptyValue}</dd>
        </div>
        <div>
          <dt className="text-muted">{copy.maps}</dt>
          <dd>
            <a
              href={application.google_maps_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline"
            >
              {copy.openMaps}
            </a>
          </dd>
        </div>
        {application.notes && (
          <div className="sm:col-span-2">
            <dt className="text-muted">{copy.notes}</dt>
            <dd>{application.notes}</dd>
          </div>
        )}
      </dl>
      {pending && canReview && (
        <div className="flex flex-wrap items-end gap-3">
          <SelectBox
            label={copy.area}
            value={area}
            options={[{ value: "", label: copy.noArea }, ...(areas.data ?? [])]}
            onChange={setArea}
          />
          <AdminButton tone="dark" disabled={action.busy} onClick={approve}>
            {copy.approve}
          </AdminButton>
          <AdminButton tone="danger" disabled={action.busy} onClick={reject}>
            {copy.reject}
          </AdminButton>
        </div>
      )}
      {action.message && (
        <p role="alert" className="text-sm font-semibold">
          {action.message}
        </p>
      )}
    </Panel>
  );
}
