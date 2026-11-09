"use client";

import { useCallback, useMemo, useState } from "react";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useDateRange } from "../../hooks/use-date-range";
import { usePagedRows, useSort } from "../../hooks/use-data-table";
import { useSession } from "../../hooks/use-session";
import { useToast } from "../../hooks/use-toast";
import { useCustomers } from "../../hooks/use-venue-data";
import { exportCustomersCsv } from "../../lib/exports";
import { formatDay, formatNumber, formatRecentDay } from "../../lib/format";
import type { Customer, CustomerSegment, CustomersResponse } from "../../types";
import { chartColors } from "../charts/chart-frame";
import { RangePicker } from "../shell/range-picker";
import { VenuePage } from "../shell/venue-page";
import { Badge, InfoTip, KeyValues, ValueMeter } from "../ui/badges";
import { Button, ButtonLink } from "../ui/button";
import { Card, Grid, Overline, SectionHead, SideGrid } from "../ui/card";
import { Chip, SearchField } from "../ui/controls";
import { Drawer } from "../ui/drawer";
import { Icon } from "../ui/icon";
import { MetricCard } from "../ui/metric-card";
import { QueryBoundary } from "../ui/query-boundary";
import { EmptyState } from "../ui/states";
import {
  ClickableRow,
  Pager,
  SortableTh,
  Table,
  TableWrap,
  Td,
  Th,
} from "../ui/table";
import { CohortTable } from "./cohort-table";

const copy = content.customers;
const PAGE_SIZE = 6;
const FREQUENCY_COLORS = [
  chartColors.ink,
  chartColors.stone,
  chartColors.stoneLight,
];

type SortKey = "visits" | "first" | "last" | "gap";
type SegmentFilter = CustomerSegment | "all";

const sortValue: Record<SortKey, (row: Customer) => number> = {
  visits: (row) => row.totalVisits,
  first: (row) => Date.parse(row.firstVisitAt),
  last: (row) => Date.parse(row.lastVisitAt),
  gap: (row) => row.averageGapDays ?? -1,
};

export function CustomersScreen() {
  const query = useCustomers();
  return (
    <VenuePage
      title={pageTitles.customers}
      scenarioPage="customers"
      actions={<RangePicker />}
    >
      <QueryBoundary query={query}>
        {(data) =>
          data.customers.length === 0 ? (
            <EmptyState
              icon="users"
              title={copy.emptyTitle}
              body={copy.emptyBody}
            >
              <ButtonLink variant="dark" href={venueRoutes.counter}>
                {copy.checkCounter}
              </ButtonLink>
              <ButtonLink href={venueRoutes.counterSigns}>
                {copy.getSigns}
              </ButtonLink>
            </EmptyState>
          ) : (
            <CustomersBody data={data} />
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}

function CustomersBody({ data }: { data: CustomersResponse }) {
  const toast = useToast();
  const { range } = useDateRange();
  const rangeLabel = useSession().data?.ranges.find(
    (item) => item.key === range,
  )?.label;
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<SegmentFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const { sort, toggle } = useSort<SortKey>({ key: "last", ascending: false });
  const { summary, customers } = data;
  const closeDrawer = useCallback(() => setOpenId(null), []);

  const rows = useMemo(() => {
    const term = search.trim().toUpperCase();
    const direction = sort.ascending ? 1 : -1;
    return customers
      .filter(
        (row) =>
          (segment === "all" || row.segment === segment) &&
          (!term || row.id.includes(term)),
      )
      .sort(
        (a, b) =>
          (sortValue[sort.key](a) - sortValue[sort.key](b)) * direction ||
          a.id.localeCompare(b.id),
      );
  }, [customers, search, segment, sort]);

  const { page, pageCount, pageRows, setPage } = usePagedRows(rows, PAGE_SIZE);
  const open = customers.find((row) => row.id === openId);
  const metrics = copy.metrics;
  const sortProps = (key: SortKey) => ({
    active: sort.key === key,
    ascending: sort.ascending,
    onSort: () => {
      toggle(key);
      setPage(0);
    },
  });
  const countFor = (value: string) =>
    value === "all"
      ? customers.length
      : customers.filter((row) => row.segment === value).length;

  return (
    <>
      <Grid columns={5} className="gap-3">
        <MetricCard
          label={metrics.guests.label}
          tip={metrics.guests.tip}
          value={formatNumber(summary.guests)}
          foot={rangeLabel}
        />
        <MetricCard
          label={metrics.fresh.label}
          tip={metrics.fresh.tip}
          value={formatNumber(summary.newGuests)}
          foot={metrics.fresh.foot}
        />
        <MetricCard
          label={metrics.returning.label}
          tip={metrics.returning.tip}
          value={formatNumber(summary.returning)}
          foot={metrics.returning.foot}
        />
        <MetricCard
          label={metrics.regulars.label}
          tip={metrics.regulars.tip}
          value={summary.regulars}
          foot={metrics.regulars.foot}
        />
        <MetricCard
          label={metrics.atRisk.label}
          tip={metrics.atRisk.tip}
          value={summary.atRisk}
          foot={metrics.atRisk.foot}
        />
      </Grid>

      <SideGrid>
        <Card className="gap-0 p-0">
          <div className="flex flex-wrap items-center gap-3 px-4 py-3.5">
            <SearchField
              label={copy.search}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(0);
              }}
              className="max-w-65 min-w-30 flex-1"
            />
            <div className="flex flex-wrap gap-2">
              {copy.filters.map((filter) => (
                <Chip
                  key={filter.value}
                  selected={segment === filter.value}
                  count={countFor(filter.value)}
                  onClick={() => {
                    setSegment(filter.value);
                    setPage(0);
                  }}
                >
                  {filter.label}
                </Chip>
              ))}
            </div>
            <Button
              size="sm"
              icon="download"
              onClick={() => {
                exportCustomersCsv(rows);
                toast(content.common.exportDone);
              }}
            >
              {copy.exportCsv}
            </Button>
          </div>
          {rows.length ? (
            <>
              <TableWrap>
                <Table>
                  <thead>
                    <tr>
                      <Th>{copy.columns.guest}</Th>
                      <Th>{copy.columns.segment}</Th>
                      <SortableTh
                        label={copy.columns.visits}
                        {...sortProps("visits")}
                      />
                      <SortableTh
                        label={copy.columns.first}
                        className="max-sm:hidden"
                        {...sortProps("first")}
                      />
                      <SortableTh
                        label={copy.columns.last}
                        {...sortProps("last")}
                      />
                      <SortableTh
                        label={copy.columns.gap}
                        className="max-sm:hidden"
                        {...sortProps("gap")}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row) => (
                      <ClickableRow
                        key={row.id}
                        selected={row.id === openId}
                        onOpen={() => setOpenId(row.id)}
                      >
                        <Td className="font-mono">
                          <b className="font-medium">{row.id}</b>
                        </Td>
                        <Td>
                          <Badge tone={content.segments[row.segment]}>
                            {row.segment}
                          </Badge>
                        </Td>
                        <Td className="font-mono">{row.totalVisits}</Td>
                        <Td className="font-mono text-muted max-sm:hidden">
                          {formatDay(row.firstVisitAt)}
                        </Td>
                        <Td className="whitespace-nowrap">
                          {formatRecentDay(row.lastVisitAt, data.asOf)}
                        </Td>
                        <Td className="font-mono text-muted max-sm:hidden">
                          {row.averageGapDays == null
                            ? "—"
                            : copy.gapDays(row.averageGapDays)}
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
            <div className="flex flex-col items-start gap-3 px-5 py-10">
              <Icon name="search" size={28} />
              <b className="text-[17px]">{copy.noMatchTitle}</b>
              <span className="text-sm text-muted">{copy.noMatchBody}</span>
              <Button
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSegment("all");
                  setPage(0);
                }}
              >
                {copy.clearFilters}
              </Button>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <SectionHead title={copy.cameBack}>
              <InfoTip text={copy.cameBackTip} />
            </SectionHead>
            {data.cameBackWithin.map((item) => (
              <ValueMeter
                key={item.label}
                label={item.label}
                value={`${item.percent}%`}
                percent={item.percent}
              />
            ))}
          </Card>
          <Card>
            <SectionHead title={copy.frequency}>
              <span className="text-xs text-muted">{copy.frequencyPeriod}</span>
            </SectionHead>
            <div className="flex h-3 gap-0.5 overflow-hidden rounded-md">
              {data.visitFrequency.map((item, index) => (
                <i
                  key={item.label}
                  style={{
                    flex: item.percent,
                    background: FREQUENCY_COLORS[index],
                  }}
                />
              ))}
            </div>
            {data.visitFrequency.map((item, index) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm"
              >
                <i
                  className="size-2.5 rounded-[3px]"
                  style={{ background: FREQUENCY_COLORS[index] }}
                />
                {item.label}
                <b className="ml-auto font-mono font-medium">{item.percent}%</b>
              </span>
            ))}
          </Card>
          <Card className="gap-2 border-0 bg-block">
            <span className="flex items-center gap-2 font-semibold">
              <Icon name="shield" />
              {copy.privacyTitle}
            </span>
            <span className="text-sm leading-normal text-muted">
              {copy.privacyBody}
            </span>
          </Card>
        </div>
      </SideGrid>

      <CohortTable cohorts={data.cohorts} />

      {open && (
        <CustomerDrawer customer={open} data={data} onClose={closeDrawer} />
      )}
    </>
  );
}

function CustomerDrawer({
  customer,
  data,
  onClose,
}: {
  customer: Customer;
  data: CustomersResponse;
  onClose: () => void;
}) {
  const labels = copy.drawer;
  const lastIndex = customer.visitsByMonth.length - 1;
  const peak = Math.max(5, ...customer.visitsByMonth);
  return (
    <Drawer
      label={labels.label(customer.id)}
      title={<span className="font-mono">{customer.id}</span>}
      onClose={onClose}
    >
      <Badge tone={content.segments[customer.segment]} className="self-start">
        {customer.segment}
      </Badge>
      <KeyValues
        items={[
          { label: labels.first, value: formatDay(customer.firstVisitAt) },
          {
            label: labels.last,
            value: formatRecentDay(customer.lastVisitAt, data.asOf),
          },
          {
            label: labels.verified,
            value: String(customer.totalVisits),
            mono: true,
          },
          {
            label: labels.thisMonth,
            value: String(customer.visitsByMonth[lastIndex]),
            mono: true,
          },
          {
            label: labels.gap,
            value:
              customer.averageGapDays == null
                ? "—"
                : labels.gapDays(customer.averageGapDays),
            mono: true,
          },
          { label: labels.usual, value: customer.usualTime },
          ...(customer.instagram
            ? [
                {
                  label: labels.instagram,
                  value: `@${customer.instagram}`,
                  mono: true,
                },
              ]
            : []),
        ]}
      />
      <div className="flex flex-col gap-2">
        <Overline className="text-[11px]">{labels.byMonth}</Overline>
        <div className="flex h-[90px] items-end gap-3">
          {data.monthLabels.map((month, index) => (
            <span
              key={month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <i
                className={`block w-full rounded-t ${index === lastIndex ? "bg-ink" : "bg-stone-light"}`}
                style={{
                  height: Math.max(
                    4,
                    (customer.visitsByMonth[index] / peak) * 70,
                  ),
                }}
              />
              <span className="font-mono text-[11px] text-muted">
                {month} · {customer.visitsByMonth[index]}
              </span>
            </span>
          ))}
        </div>
      </div>
      <Card className="gap-2 border-0 bg-block p-3.5">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Icon name="shield" size={18} />
          {labels.whyTitle}
        </span>
        <span className="text-[13px] leading-normal text-muted">
          {labels.whyBody}
        </span>
      </Card>
      <ButtonLink
        size="sm"
        iconRight="arrowR"
        className="self-start"
        href={`${venueRoutes.visits}?guest=${encodeURIComponent(customer.id)}`}
      >
        {labels.seeVisits}
      </ButtonLink>
    </Drawer>
  );
}
