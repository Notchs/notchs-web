"use client";

import { useState } from "react";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useDateRange } from "../../hooks/use-date-range";
import { useSession } from "../../hooks/use-session";
import { useAnalytics, useRevenue } from "../../hooks/use-venue-data";
import { formatNumber, percentChange, sum } from "../../lib/format";
import { venueData } from "../../services/venue-data.service";
import type { AnalyticsResponse } from "../../types";
import { ChartLegend, chartColors } from "../charts/chart-frame";
import { Heatmap } from "../charts/heatmap";
import { LineChart } from "../charts/line-chart";
import { CohortTable } from "../customers/cohort-table";
import { RangePicker } from "../shell/range-picker";
import { VenuePage } from "../shell/venue-page";
import { Badge } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, Grid, SectionHead } from "../ui/card";
import { SegmentedTabs } from "../ui/controls";
import { Icon } from "../ui/icon";
import { MetricCard } from "../ui/metric-card";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner, UnavailableBox } from "../ui/states";

const copy = content.analytics;
type Tab = (typeof copy.tabs)[number]["value"];

export function AnalyticsScreen() {
  const query = useAnalytics();
  const [tab, setTab] = useState<Tab>("visits");
  return (
    <VenuePage
      title={pageTitles.analytics}
      scenarioPage="analytics"
      actions={<RangePicker />}
    >
      <div>
        <SegmentedTabs
          options={copy.tabs}
          value={tab}
          onChange={setTab}
          label={copy.tabsLabel}
        />
      </div>
      <QueryBoundary query={query}>
        {(data) => (
          <>
            {tab === "visits" && <VisitsTab data={data} />}
            {tab === "retention" && <RetentionTab data={data} />}
            {tab === "discovery" && <DiscoveryTab data={data} />}
            {tab === "revenue" && <RevenueTab />}
          </>
        )}
      </QueryBoundary>
    </VenuePage>
  );
}

function VisitsTab({ data }: { data: AnalyticsResponse }) {
  const { compare, range } = useDateRange();
  const rangeLabel =
    useSession().data?.ranges.find((item) => item.key === range)?.label ?? "";
  const { activity } = data;
  const visits = sum(activity.visits);
  return (
    <>
      <Grid columns={4}>
        <MetricCard
          label={copy.visitsMetric}
          value={formatNumber(visits)}
          delta={
            compare ? percentChange(visits, sum(activity.previousVisits)) : null
          }
          foot={rangeLabel}
        />
        <MetricCard
          label={copy.perDay}
          value={(visits / activity.visits.length).toFixed(1)}
          foot={copy.average}
        />
        <MetricCard
          label={copy.busiestDay}
          value={data.busiestDay.label}
          foot={copy.avgVisits(data.busiestDay.averageVisits)}
        />
        <MetricCard
          label={copy.busiestHour}
          value={data.busiestHours.label}
          unit={data.busiestHours.unit}
          foot={data.busiestHours.note}
        />
      </Grid>
      <Card>
        <SectionHead title={copy.byDay}>
          <ChartLegend
            className="text-muted"
            items={[
              { label: rangeLabel, color: chartColors.ink },
              ...(compare
                ? [{ label: copy.previous, color: chartColors.stoneLight }]
                : []),
            ]}
          />
        </SectionHead>
        <LineChart
          height={220}
          label={copy.byDay}
          labels={activity.labels}
          series={[
            {
              name: copy.visitsMetric,
              data: activity.visits,
              color: chartColors.ink,
              area: true,
            },
            ...(compare
              ? [
                  {
                    name: copy.previous,
                    data: activity.previousVisits,
                    color: chartColors.stoneLight,
                    dashed: true,
                    strokeWidth: 1.5,
                  },
                ]
              : []),
          ]}
        />
      </Card>
      <Card>
        <SectionHead title={copy.whenTitle}>
          <span className="text-xs text-muted">{copy.whenNote}</span>
        </SectionHead>
        <Heatmap
          days={data.days}
          hours={data.hours}
          cells={data.heatmap}
          label={copy.whenLabel}
        />
      </Card>
    </>
  );
}

function RetentionTab({ data }: { data: AnalyticsResponse }) {
  const labels = copy.retention;
  return (
    <>
      <Grid columns={3}>
        <MetricCard
          label={labels.seven.label}
          tip={labels.seven.tip}
          value={data.retention.backWithin7Days}
          unit="%"
        />
        <MetricCard
          label={labels.thirty.label}
          tip={labels.thirty.tip}
          value={data.retention.backWithin30Days}
          unit="%"
        />
        <MetricCard
          label={labels.gap.label}
          tip={labels.gap.tip}
          value={data.retention.medianGapDays}
          unit={labels.gap.unit}
        />
      </Grid>
      <Grid columns={2}>
        <CohortTable cohorts={data.cohorts} />
        <Card>
          <SectionHead title={content.overview.returningWeekly} />
          <LineChart
            unit="%"
            label={content.overview.returningWeekly}
            labels={data.returningWeekly.map((point) => point.label)}
            series={[
              {
                name: content.overview.returningSeries,
                data: data.returningWeekly.map((point) => point.value),
                color: chartColors.ink,
              },
            ]}
          />
        </Card>
      </Grid>
    </>
  );
}

function DiscoveryTab({ data }: { data: AnalyticsResponse }) {
  const { compare } = useDateRange();
  const { activity, discovery } = data;
  const views = sum(activity.profileViews);
  const labels = copy.discoveryMetrics;
  return (
    <>
      <Grid columns={4}>
        <MetricCard
          label={labels.seen.label}
          tip={labels.seen.tip}
          value={formatNumber(discovery.seen)}
        />
        <MetricCard
          label={labels.views.label}
          tip={labels.views.tip}
          value={formatNumber(views)}
          delta={
            compare ? percentChange(views, activity.profileViewsPrevious) : null
          }
        />
        <MetricCard
          label={labels.directions.label}
          tip={labels.directions.tip}
          value={formatNumber(discovery.directions)}
        />
        <MetricCard
          label={labels.saves.label}
          tip={labels.saves.tip}
          value={formatNumber(discovery.saves)}
        />
      </Grid>
      <Card>
        <SectionHead title={copy.viewsByDay} />
        <LineChart
          height={220}
          label={copy.viewsByDay}
          labels={activity.labels}
          series={[
            {
              name: copy.viewsSeries,
              data: activity.profileViews,
              color: chartColors.ink,
              area: true,
            },
          ]}
        />
      </Card>
      <Banner
        tone="info"
        icon="info"
        title={copy.viewsNotVisitsTitle}
        body={copy.viewsNotVisitsBody}
      />
    </>
  );
}

function RevenueTab() {
  const query = useRevenue();
  const { run, isBusy } = useAction();
  const labels = copy.revenue;
  return (
    <QueryBoundary query={query}>
      {(revenue) => {
        const values = [
          revenue.revenue,
          revenue.averageOrderValue,
          revenue.transactions,
        ];
        return (
          <UnavailableBox
            badge={
              <Badge tone="warn">
                <Icon name="lock" size={12} />
                {labels.badge}
              </Badge>
            }
            title={labels.title}
            body={labels.body}
          >
            <Grid columns={3} className="w-full">
              {labels.metrics.map((label, index) => (
                <MetricCard
                  key={label}
                  label={label}
                  unavailable={values[index] == null}
                  value={
                    values[index] == null ? "—" : formatNumber(values[index])
                  }
                  foot={labels.foot}
                />
              ))}
            </Grid>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="dark"
                icon="link"
                disabled={isBusy}
                onClick={() =>
                  run(venueData.requestPosIntegration, labels.thanks)
                }
              >
                {labels.cta}
              </Button>
              <span className="text-[13px] text-muted">{labels.note}</span>
            </div>
          </UnavailableBox>
        );
      }}
    </QueryBoundary>
  );
}
