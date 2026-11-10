"use client";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useDateRange } from "../../hooks/use-date-range";
import { useSession } from "../../hooks/use-session";
import { useOverview } from "../../hooks/use-venue-data";
import { formatNumber, formatTime, percentChange, sum } from "../../lib/format";
import type { OverviewResponse } from "../../types";
import { ChartLegend, chartColors } from "../charts/chart-frame";
import { LineChart } from "../charts/line-chart";
import { StackedBars } from "../charts/stacked-bars";
import { RangePicker } from "../shell/range-picker";
import { VenuePage } from "../shell/venue-page";
import { Badge, InfoTip, KeyValues, Stars } from "../ui/badges";
import { ButtonLink } from "../ui/button";
import {
  Card,
  Grid,
  InkCard,
  Overline,
  SectionHead,
  SideGrid,
} from "../ui/card";
import { MetricCard } from "../ui/metric-card";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner } from "../ui/states";
import { SHOWS_EXAMPLES, VENUE_DATA_MODE } from "../../services/config";
import { FirstDays } from "./first-days";

const copy = content.overview;

/** The hour in India (0–23) of an ISO moment. */
const istHour = (iso: string) =>
  Number(
    new Date(iso).toLocaleString("en-GB", {
      hour: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }),
  ) % 24;

export function OverviewScreen() {
  const query = useOverview();
  return (
    <VenuePage
      title={pageTitles.overview}
      scenarioPage="overview"
      actions={<RangePicker />}
    >
      <QueryBoundary query={query}>
        {(data) =>
          data.stage === "firstDays" ? (
            <FirstDays data={data} />
          ) : (
            <>
              {!data.counter.online && (
                <Banner
                  icon="wifiOff"
                  title={copy.counterOffTitle}
                  body={copy.counterOffBody(
                    data.counter.lastHeartbeat
                      ? formatTime(data.counter.lastHeartbeat)
                      : content.common.never,
                  )}
                >
                  <ButtonLink variant="dark" href={venueRoutes.counter}>
                    {copy.troubleshoot}
                  </ButtonLink>
                </Banner>
              )}
              <OverviewBody data={data} />
            </>
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}

function OverviewBody({ data }: { data: OverviewResponse }) {
  const { compare, range } = useDateRange();
  const { data: sessionData } = useSession();
  const session = sessionData?.session;
  const rangeInfo = sessionData?.ranges.find((item) => item.key === range);
  const { activity, counter, discovery } = data;
  const available = data.available ?? {
    views: true,
    ratings: true,
    discovery: true,
  };
  const visits = sum(activity.visits);
  const previous = sum(activity.previousVisits);
  // A change needs something to compare with: no "0% vs before" in a first week.
  const hadBefore = compare && previous > 0;
  const fresh = sum(activity.newVisitors);
  const returningVisits = activity.visits.map(
    (value, index) => value - activity.newVisitors[index],
  );
  const views = sum(activity.profileViews);
  const metrics = copy.metrics;
  const dateLabel = new Date(data.asOf).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-50 flex-1 flex-col gap-1">
          <Overline>
            {dateLabel.replace(",", "")} · {session?.venueName}
          </Overline>
          <span className="font-display text-[26px] leading-[1.15] tracking-[-.02em]">
            {session && copy.greeting(session.firstName, istHour(data.asOf))}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* The Notch Card isn't on real data yet (test links show an example). */}
          {(VENUE_DATA_MODE === "mock" || SHOWS_EXAMPLES) && (
            <ButtonLink size="sm" icon="share" href={venueRoutes.notchCard}>
              {copy.shareCard}
            </ButtonLink>
          )}
          <ButtonLink size="sm" icon="edit" href={venueRoutes.content}>
            {copy.editPage}
          </ButtonLink>
        </div>
      </div>

      <Grid
        columns={
          available.views && available.ratings
            ? 5
            : available.views || available.ratings
              ? 4
              : 3
        }
        className="gap-3"
      >
        <MetricCard
          icon="check"
          label={metrics.visits.label}
          tip={metrics.visits.tip}
          value={formatNumber(visits)}
          delta={hadBefore ? percentChange(visits, previous) : null}
          foot={compare ? rangeInfo?.comparisonLabel : rangeInfo?.label}
          href={venueRoutes.visits}
        />
        <MetricCard
          icon="users"
          label={metrics.newVisitors.label}
          tip={metrics.newVisitors.tip}
          value={formatNumber(fresh)}
          delta={
            hadBefore
              ? percentChange(fresh, activity.newVisitorsPrevious)
              : null
          }
          foot={metrics.newVisitors.foot}
          href={venueRoutes.customers}
        />
        <MetricCard
          icon="refresh"
          label={metrics.returning.label}
          tip={metrics.returning.tip}
          value={activity.returningRate}
          unit="%"
          delta={
            hadBefore
              ? activity.returningRate - activity.returningRatePrevious
              : null
          }
          deltaUnit=" pts"
          foot={metrics.returning.foot(activity.uniqueGuests)}
          href={venueRoutes.customers}
        />
        {available.views && (
          <MetricCard
            icon="eye"
            label={metrics.views.label}
            tip={metrics.views.tip}
            value={formatNumber(views)}
            delta={
              compare
                ? percentChange(views, activity.profileViewsPrevious)
                : null
            }
            foot={metrics.views.foot}
            href={venueRoutes.discover}
          />
        )}
        {available.ratings && (
          <MetricCard
            icon="star"
            label={metrics.rating.label}
            tip={metrics.rating.tip}
            value={activity.rating.toFixed(1)}
            unit="/ 5"
            delta={
              compare
                ? Number((activity.rating - activity.ratingPrevious).toFixed(1))
                : null
            }
            deltaUnit=""
            foot={metrics.rating.foot(activity.ratingCount)}
            href={venueRoutes.reviews}
          />
        )}
      </Grid>

      <SideGrid>
        <InkCard className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex flex-col gap-1">
              <Overline className="text-stone-light">
                {copy.chartOverline}
              </Overline>
              <span className="font-display text-[22px] tracking-[-.02em]">
                {copy.chartTitle(formatNumber(visits))}{" "}
                {compare && (
                  <span className="font-sans text-sm font-medium tracking-normal text-stone-light">
                    {copy.chartVersus(formatNumber(previous))}
                  </span>
                )}
              </span>
            </span>
            <ChartLegend
              className="text-stone-light"
              items={[
                { label: rangeInfo?.label ?? "", color: chartColors.volt },
                ...(compare
                  ? [{ label: copy.previousPeriod, color: chartColors.stone }]
                  : []),
              ]}
            />
          </div>
          <LineChart
            surface="ink"
            height={270}
            label={copy.chartOverline}
            labels={activity.labels}
            series={[
              {
                name: copy.visitsSeries,
                data: activity.visits,
                color: chartColors.volt,
                area: true,
              },
              ...(compare
                ? [
                    {
                      name: copy.previousSeries,
                      data: activity.previousVisits,
                      color: chartColors.stone,
                      dashed: true,
                      strokeWidth: 1.5,
                    },
                  ]
                : []),
            ]}
          />
          <span className="text-[13px] text-stone-light">{copy.chartNote}</span>
        </InkCard>
        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <SectionHead title={copy.counterTitle}>
              <Badge tone={counter.online ? "soft" : "warn"}>
                <span
                  className={`size-2 rounded-full ${counter.online ? "bg-ink" : "bg-[#ff5b35]"}`}
                />
                {counter.online ? copy.online : copy.offline}
              </Badge>
            </SectionHead>
            <KeyValues
              items={[
                {
                  label: copy.lastHeartbeat,
                  value: formatTime(counter.lastHeartbeat),
                  mono: true,
                },
                {
                  label: copy.lastVisit,
                  value: formatTime(counter.lastVerifiedVisit),
                  mono: true,
                },
                {
                  label: copy.battery,
                  value:
                    counter.online && counter.batteryPercent != null
                      ? `${counter.batteryPercent}%`
                      : "—",
                  mono: true,
                },
              ]}
            />
            <ButtonLink
              variant="text"
              iconRight="arrowR"
              href={venueRoutes.counter}
              className="self-start"
            >
              {copy.counterLink}
            </ButtonLink>
          </Card>
          {/* The Notch Card isn't on real data yet: no "next step" pointing at it. */}
          {(VENUE_DATA_MODE === "mock" || SHOWS_EXAMPLES) && (
            <Card className="p-5">
              <Overline>{copy.nextStep}</Overline>
              <b className="text-base leading-[1.3]">{copy.nextTitle}</b>
              <span className="text-sm text-muted">{copy.nextBody}</span>
              <ButtonLink
                size="sm"
                iconRight="arrowR"
                href={venueRoutes.notchCard}
                className="self-start"
              >
                {copy.nextCta}
              </ButtonLink>
            </Card>
          )}
        </div>
      </SideGrid>

      <Grid
        columns={available.discovery ? 3 : 2}
        className={
          available.discovery ? "sm:grid-cols-2 wide:grid-cols-3" : undefined
        }
      >
        <Card>
          <SectionHead title={copy.newVsReturning}>
            <ChartLegend
              className="text-muted"
              items={[
                { label: copy.newLabel, color: chartColors.ink },
                { label: copy.returningLabel, color: chartColors.stoneLight },
              ]}
            />
          </SectionHead>
          <StackedBars
            label={copy.newVsReturningLabel}
            labels={activity.labels}
            bottom={activity.newVisitors}
            top={returningVisits}
            bottomName={copy.newLabel}
            topName={copy.returningLabel}
          />
          <span className="text-[13px] text-muted">
            {copy.newReturningNote(
              formatNumber(fresh),
              formatNumber(sum(returningVisits)),
            )}
          </span>
        </Card>
        <Card>
          <SectionHead title={copy.returningWeekly}>
            <InfoTip text={copy.returningWeeklyTip} />
          </SectionHead>
          <LineChart
            height={170}
            unit="%"
            label={copy.returningWeekly}
            labels={data.returningWeekly.map((point) => point.label)}
            series={[
              {
                name: copy.returningSeries,
                data: data.returningWeekly.map((point) => point.value),
                color: chartColors.ink,
              },
            ]}
          />
          {data.returningWeekly.length > 1 && (
            <span className="text-[13px] text-muted">
              {copy.returningNote(
                data.returningWeekly[data.returningWeekly.length - 1].value -
                  data.returningWeekly[0].value,
                data.returningWeekly.length,
              )}
            </span>
          )}
        </Card>
        {available.discovery && (
          <Card>
            <SectionHead title={copy.discovery}>
              <ButtonLink
                variant="text"
                iconRight="arrowR"
                href={venueRoutes.discover}
              >
                {content.common.open}
              </ButtonLink>
            </SectionHead>
            <div className="flex flex-col divide-y divide-line">
              {[
                { ...copy.discoveryRows.seen, value: discovery.seen },
                { ...copy.discoveryRows.views, value: views },
                {
                  ...copy.discoveryRows.directions,
                  value: discovery.directions,
                },
                { ...copy.discoveryRows.saves, value: discovery.saves },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 py-2.5">
                  <span className="min-w-0 flex-1">
                    <b className="block text-sm">{row.label}</b>
                    <span className="text-xs text-muted">{row.note}</span>
                  </span>
                  <span className="font-mono text-[15px]">
                    {formatNumber(row.value)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-muted">{copy.discoveryNote}</span>
          </Card>
        )}
      </Grid>

      <Grid columns={available.ratings ? 2 : 1}>
        <Card className="gap-2">
          <SectionHead title={copy.recentVisits}>
            <ButtonLink
              variant="text"
              iconRight="arrowR"
              href={venueRoutes.visits}
            >
              {copy.allVisits}
            </ButtonLink>
          </SectionHead>
          <div className="flex flex-col divide-y divide-line">
            {data.recentVisits.map((visit) => (
              <div
                key={visit.reference}
                className="flex items-center gap-3 py-2.5 text-sm"
              >
                <span className="w-11 font-mono text-[13px] text-muted">
                  {formatTime(visit.receivedAt)}
                </span>
                <span
                  className={`min-w-0 flex-1 ${visit.status === "Verified" ? "" : "text-muted"}`}
                >
                  {visit.detail}
                </span>
                <Badge tone={content.visitStatusTones[visit.status]}>
                  {visit.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
        {available.ratings && (
          <Card className="gap-2">
            <SectionHead title={copy.recentRatings}>
              <ButtonLink
                variant="text"
                iconRight="arrowR"
                href={venueRoutes.reviews}
              >
                {copy.allRatings}
              </ButtonLink>
            </SectionHead>
            <div className="flex flex-col divide-y divide-line">
              {data.recentRatings.map((rating) => (
                <div key={rating.id} className="flex items-start gap-3 py-2.5">
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <Stars value={rating.stars} size={12} />
                      <span className="font-mono text-xs text-muted">
                        {rating.guestId}
                      </span>
                    </span>
                    <span
                      className={`text-sm ${rating.message ? "" : "text-muted"}`}
                    >
                      {rating.message || copy.ratingOnly}
                    </span>
                  </span>
                  <span className="text-xs whitespace-nowrap text-muted">
                    {rating.whenLabel}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Grid>
    </>
  );
}
