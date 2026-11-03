"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { usePagedRows } from "../../hooks/use-data-table";
import { useAction } from "../../hooks/use-action";
import { useToast } from "../../hooks/use-toast";
import { useVisits } from "../../hooks/use-venue-data";
import { copyText } from "../../lib/browser-actions";
import { exportVisitsCsv } from "../../lib/exports";
import {
  formatDay,
  formatNumber,
  formatTime,
  formatTimeSeconds,
} from "../../lib/format";
import { venueData } from "../../services/venue-data.service";
import type { VisitRecord, VisitStatus, VisitsResponse } from "../../types";
import { RangePicker } from "../shell/range-picker";
import { VenuePage } from "../shell/venue-page";
import { Badge, KeyValues } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, Grid } from "../ui/card";
import { Chip } from "../ui/controls";
import { Drawer } from "../ui/drawer";
import { Icon } from "../ui/icon";
import { MetricCard } from "../ui/metric-card";
import { QueryBoundary } from "../ui/query-boundary";
import { ClickableRow, Pager, Table, TableWrap, Td, Th } from "../ui/table";
import { VisitsTabs } from "./visits-tabs";

const copy = content.visits;
const PAGE_SIZE = 6;
/** The guest filter comes from the URL, so only a well-formed ID is used. */
const GUEST_ID = /^G-[0-9A-F]{4}$/;

export function VisitLogScreen() {
  const query = useVisits();
  return (
    <VenuePage
      title={pageTitles.visits}
      scenarioPage="visits"
      actions={<RangePicker />}
    >
      <VisitsTabs current={venueRoutes.visits} />
      <QueryBoundary query={query}>
        {(data) => <VisitLogBody data={data} />}
      </QueryBoundary>
    </VenuePage>
  );
}

function VisitLogBody({ data }: { data: VisitsResponse }) {
  const router = useRouter();
  const toast = useToast();
  const guestParam = useSearchParams().get("guest");
  const guest = guestParam && GUEST_ID.test(guestParam) ? guestParam : null;
  const [status, setStatus] = useState<VisitStatus | "all">("all");
  const [openRef, setOpenRef] = useState<string | null>(null);
  const { funnel, visits } = data;
  const metrics = copy.metrics;
  const closeDrawer = useCallback(() => setOpenRef(null), []);

  const guestVisits = useMemo(
    () => visits.filter((row) => !guest || row.guestId === guest),
    [visits, guest],
  );
  const rows = useMemo(
    () =>
      guestVisits.filter((row) => status === "all" || row.status === status),
    [guestVisits, status],
  );
  const { page, pageCount, pageRows, setPage } = usePagedRows(rows, PAGE_SIZE);
  const open = visits.find((row) => row.reference === openRef);
  const c = copy.columns;

  return (
    <>
      <Grid columns={5} className="gap-3">
        <MetricCard
          label={metrics.attempts.label}
          tip={metrics.attempts.tip}
          foot={metrics.attempts.foot}
          value={formatNumber(funnel.attempts)}
        />
        <MetricCard
          label={metrics.verified.label}
          tip={metrics.verified.tip}
          foot={metrics.verified.foot}
          value={formatNumber(funnel.verified)}
        />
        <MetricCard
          label={metrics.duplicate.label}
          tip={metrics.duplicate.tip}
          foot={metrics.duplicate.foot}
          value={funnel.duplicate}
        />
        <MetricCard
          label={metrics.expired.label}
          tip={metrics.expired.tip}
          foot={metrics.expired.foot}
          value={funnel.expired}
        />
        <MetricCard
          label={metrics.inReview.label}
          tip={metrics.inReview.tip}
          foot={metrics.inReview.foot}
          value={funnel.inReview}
        />
      </Grid>
      <Card className="gap-0 p-0">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
          <div className="flex flex-wrap gap-2">
            <Chip
              selected={status === "all"}
              count={guestVisits.length}
              onClick={() => {
                setStatus("all");
                setPage(0);
              }}
            >
              {copy.all}
            </Chip>
            {copy.statuses.map((value) => (
              <Chip
                key={value}
                selected={status === value}
                count={guestVisits.filter((row) => row.status === value).length}
                onClick={() => {
                  setStatus(value);
                  setPage(0);
                }}
              >
                {value}
              </Chip>
            ))}
            {guest && (
              <Chip
                selected
                aria-label={copy.clearGuest}
                onClick={() => router.push(venueRoutes.visits)}
              >
                {copy.guestFilter(guest)}
                <Icon name="x" size={12} />
              </Chip>
            )}
          </div>
          <Button
            size="sm"
            icon="download"
            className="ml-auto"
            onClick={() => {
              exportVisitsCsv(rows);
              toast(content.common.exportDone);
            }}
          >
            {content.customers.exportCsv}
          </Button>
        </div>
        {rows.length ? (
          <>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>{c.time}</Th>
                    <Th>{c.notch}</Th>
                    <Th>{c.status}</Th>
                    <Th>{c.guest}</Th>
                    <Th className="max-sm:hidden">{c.detail}</Th>
                    <Th className="max-sm:hidden">{c.code}</Th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <ClickableRow
                      key={row.reference}
                      selected={row.reference === openRef}
                      onOpen={() => setOpenRef(row.reference)}
                    >
                      <Td className="font-mono">
                        {formatTime(row.receivedAt)}
                      </Td>
                      <Td className="font-mono">
                        {row.notchNumber ?? copy.noNotch}
                      </Td>
                      <Td>
                        <Badge tone={content.visitStatusTones[row.status]}>
                          {row.status}
                        </Badge>
                      </Td>
                      <Td className="font-mono text-muted">{row.guestId}</Td>
                      <Td className="text-sm max-sm:hidden">{row.detail}</Td>
                      <Td className="font-mono text-muted max-sm:hidden">
                        {row.code}
                      </Td>
                    </ClickableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
            <Pager
              page={page}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={rows.length}
              onPage={setPage}
            />
          </>
        ) : (
          <p className="m-0 px-5 py-10 text-muted">{copy.empty}</p>
        )}
      </Card>
      {open && <VisitDrawer visit={open} onClose={closeDrawer} />}
    </>
  );
}

function VisitDrawer({
  visit,
  onClose,
}: {
  visit: VisitRecord;
  onClose: () => void;
}) {
  const toast = useToast();
  const { run, isBusy } = useAction();
  const labels = copy.drawer;
  const summary =
    visit.status === "Verified"
      ? labels.countedAs(visit.detail, visit.guestId)
      : visit.status === "In review"
        ? labels.inReview
        : labels.notCounted(visit.detail);
  return (
    <Drawer
      label={labels.label(visit.reference)}
      title={
        <>
          {labels.title}{" "}
          <span className="font-mono font-medium">{visit.reference}</span>
        </>
      }
      onClose={onClose}
    >
      <Badge
        tone={content.visitStatusTones[visit.status]}
        className="self-start"
      >
        {visit.status}
      </Badge>
      <span className="text-[15px]">{summary}</span>
      <KeyValues
        items={[
          {
            label: labels.notch,
            value: visit.notchNumber ?? copy.noNotch,
            mono: true,
          },
          {
            label: labels.received,
            value: labels.receivedValue(
              formatDay(visit.receivedAt),
              formatTimeSeconds(visit.receivedAt),
            ),
            mono: true,
          },
          { label: labels.guest, value: visit.guestId, mono: true },
          { label: labels.code, value: visit.code, mono: true },
          { label: labels.window, value: visit.codeWindow },
          { label: labels.counter, value: visit.counterName },
          { label: labels.reference, value: visit.reference, mono: true },
        ]}
      />
      <span className="text-[13px] text-muted">{labels.note}</span>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          icon="copy"
          onClick={async () => {
            const copied = await copyText(visit.reference);
            toast(copied ? content.common.copied : content.common.copyFailed);
          }}
        >
          {labels.copy}
        </Button>
        <Button
          size="sm"
          icon="flag"
          disabled={isBusy}
          onClick={() =>
            run(() => venueData.reportVisit(visit.reference), labels.reported)
          }
        >
          {labels.report}
        </Button>
      </div>
    </Drawer>
  );
}
