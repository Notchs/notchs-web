"use client";

import { useCallback, useState } from "react";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi, type AdminClaim } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
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

const copy = adminContent.claims;

/** Customers' bill photos for Notchs the counter phone couldn't give. */
export function AdminClaims() {
  const { label, description } = adminSectionByKey("claims");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("in_review");
  const fetcher = useCallback(
    () => adminApi.claims({ page, size: 20, status }),
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
            {data.items.map((claim) => (
              <li key={claim.claim_code}>
                <ClaimCard claim={claim} onChanged={refresh} />
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

function ClaimCard({
  claim,
  onChanged,
}: {
  claim: AdminClaim;
  onChanged: () => void;
}) {
  const action = useAdminAction();
  const [notice, setNotice] = useState<string | null>(null);
  const inReview = claim.status === "in_review";

  const approve = () => {
    if (
      !window.confirm(
        copy.confirmApprove(claim.venue_name, claim.customer_handle),
      )
    )
      return;
    void action.run(async () => {
      const decision = await adminApi.approveClaim(claim.claim_code);
      setNotice(decision.customer_notified ? copy.notified : copy.notNotified);
    }, onChanged);
  };
  const reject = () => {
    const reason = window.prompt(copy.rejectPrompt(claim.venue_name));
    if (reason === null) return;
    void action.run(async () => {
      const decision = await adminApi.rejectClaim(
        claim.claim_code,
        reason.trim(),
      );
      setNotice(decision.customer_notified ? copy.notified : copy.notNotified);
    }, onChanged);
  };

  return (
    <Panel className="grid gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <b className="font-display text-xl">{claim.venue_name}</b>
          <p className="text-sm text-muted">
            {claim.niche} · {claim.venue_code} · {claim.claim_code}
          </p>
        </div>
        <Pill
          tone={
            claim.status === "approved"
              ? "good"
              : claim.status === "rejected"
                ? "warn"
                : "plain"
          }
        >
          {copy.statusLabel[claim.status]}
        </Pill>
      </div>
      <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <Fact label={copy.customer} value={`@${claim.customer_handle}`} />
        <Fact label={copy.visitDay} value={claim.visit_date} />
        <Fact
          label={copy.photoAt}
          value={formatDateTime(claim.photo_received_at)}
        />
        <Fact
          label={copy.counter}
          value={
            claim.counter_last_seen_at
              ? formatDateTime(claim.counter_last_seen_at)
              : copy.counterNever
          }
        />
        {claim.reviewed_at && (
          <Fact
            label={copy.reviewed}
            value={`${formatDateTime(claim.reviewed_at)}${claim.reviewed_by ? ` · ${claim.reviewed_by}` : ""}${claim.notch_no != null ? ` · ${copy.notch(claim.notch_no)}` : ""}`}
          />
        )}
        {claim.reject_reason && (
          <Fact label={copy.reason} value={claim.reject_reason} />
        )}
      </dl>
      {claim.photo_received_at &&
        (claim.photo_available ? (
          <BillPhoto claim={claim} />
        ) : (
          <p className="text-sm text-muted">{copy.photoGone}</p>
        ))}
      {inReview && (
        <div className="flex flex-wrap gap-3">
          <AdminButton tone="dark" disabled={action.busy} onClick={approve}>
            {copy.approve}
          </AdminButton>
          <AdminButton tone="danger" disabled={action.busy} onClick={reject}>
            {copy.reject}
          </AdminButton>
        </div>
      )}
      {(action.message ?? notice) && (
        <p role="alert" className="text-sm font-semibold">
          {action.message ?? notice}
        </p>
      )}
    </Panel>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="break-words">{value || adminContent.emptyValue}</dd>
    </div>
  );
}

/** Loaded only when asked: each view fetches the photo from WhatsApp. */
function BillPhoto({ claim }: { claim: AdminClaim }) {
  const [shown, setShown] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!shown)
    return (
      <AdminButton
        tone="plain"
        className="justify-self-start"
        onClick={() => setShown(true)}
      >
        {copy.showPhoto}
      </AdminButton>
    );
  if (failed) return <p className="text-sm text-muted">{copy.photoFailed}</p>;
  return (
    // A plain <img>: next/image would copy the customer's bill into its cache.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={adminApi.claimPhotoUrl(claim.claim_code)}
      alt={copy.photoAlt(claim.venue_name)}
      onError={() => setFailed(true)}
      className="max-h-[70vh] w-auto max-w-full justify-self-start rounded-xl border border-line"
    />
  );
}
