"use client";

import { useState, type ReactNode } from "react";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useDateRange } from "../../hooks/use-date-range";
import { useLogOut } from "../../hooks/use-log-out";
import { useToast } from "../../hooks/use-toast";
import { useSettings } from "../../hooks/use-venue-data";
import { useSession } from "../../hooks/use-session";
import { copyText } from "../../lib/browser-actions";
import { exportCustomersCsv, exportVisitsCsv } from "../../lib/exports";
import { venueData } from "../../services/venue-data.service";
import type { NotificationPreferences, SettingsResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge } from "../ui/badges";
import { Button, ButtonLink } from "../ui/button";
import { Card, Grid, Overline } from "../ui/card";
import { Toggle } from "../ui/controls";
import { QueryBoundary } from "../ui/query-boundary";
import {
  ChangeEmailModal,
  ChangePasswordModal,
  DeleteVenueModal,
} from "./settings-modals";

const copy = content.settings;
const TOGGLE_KEYS = Object.keys(
  copy.toggles,
) as (keyof NotificationPreferences)[];

export function SettingsScreen() {
  const query = useSettings();
  return (
    <VenuePage title={pageTitles.settings} scenarioPage="settings">
      <QueryBoundary query={query}>
        {(data) => <SettingsBody data={data} />}
      </QueryBoundary>
    </VenuePage>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card className="gap-0 divide-y divide-line px-5 py-2">
      <div className="flex min-h-14 items-center">
        <Overline>{title}</Overline>
      </div>
      {children}
    </Card>
  );
}

function Row({
  label,
  note,
  children,
}: {
  label: ReactNode;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-14 items-center gap-3 py-1.5">
      <span className="min-w-0 flex-1 text-[15px]">
        {label}
        {note && <span className="block text-[13px] text-muted">{note}</span>}
      </span>
      {children}
    </div>
  );
}

function SettingsBody({ data }: { data: SettingsResponse }) {
  const toast = useToast();
  const logOut = useLogOut();
  const { range } = useDateRange();
  const venueName = useSession().data?.session.venueName ?? "";
  const { run } = useAction();
  const [email, setEmail] = useState(data.email);
  const [preferences, setPreferences] = useState(data.preferences);
  const [dialog, setDialog] = useState<"password" | "email" | "delete" | null>(
    null,
  );
  const close = () => setDialog(null);

  const setPreference = (
    key: keyof NotificationPreferences,
    value: boolean,
  ) => {
    const previous = preferences;
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    void run(() => venueData.saveNotificationPreferences(next)).then((done) => {
      if (!done) setPreferences(previous);
    });
  };

  return (
    <>
      <Grid columns={2} className="items-start">
        <SectionCard title={copy.account}>
          <Row label={copy.email} note={email}>
            <Button variant="text" size="sm" onClick={() => setDialog("email")}>
              {copy.change}
            </Button>
          </Row>
          <Row label={copy.password}>
            <Button
              variant="text"
              size="sm"
              onClick={() => setDialog("password")}
            >
              {copy.change}
            </Button>
          </Row>
          <Row label={copy.venueProfile}>
            <ButtonLink variant="text" href={venueRoutes.profile}>
              {content.common.open}
            </ButtonLink>
          </Row>
          <Row label={copy.teamAccess}>
            <ButtonLink variant="text" href={venueRoutes.team}>
              {content.common.open}
            </ButtonLink>
          </Row>
          <Row label={copy.billingPlan}>
            <ButtonLink variant="text" href={venueRoutes.billing}>
              {content.common.open}
            </ButtonLink>
          </Row>
        </SectionCard>

        <SectionCard title={copy.notifications}>
          {TOGGLE_KEYS.map((key) => (
            <Row
              key={key}
              label={copy.toggles[key].label}
              note={copy.toggles[key].note}
            >
              <Toggle
                label={copy.toggles[key].label}
                checked={preferences[key]}
                onChange={(value) => setPreference(key, value)}
              />
            </Row>
          ))}
        </SectionCard>

        <SectionCard title={copy.data}>
          <Row label={copy.exportVisits}>
            <Button
              variant="text"
              size="sm"
              icon="download"
              onClick={() =>
                run(async () => {
                  const { visits } = await venueData.getVisits(range);
                  exportVisitsCsv(
                    visits.filter((visit) => visit.status === "Verified"),
                  );
                }, content.common.exportDone)
              }
            >
              {copy.exportAction}
            </Button>
          </Row>
          <Row label={copy.exportSegments}>
            <Button
              variant="text"
              size="sm"
              icon="download"
              onClick={() =>
                run(async () => {
                  const { customers } = await venueData.getCustomers(range);
                  exportCustomersCsv(customers);
                }, content.common.exportDone)
              }
            >
              {copy.exportAction}
            </Button>
          </Row>
          <span className="block py-2.5 text-[13px] text-muted">
            {copy.exportNote}
          </span>
        </SectionCard>

        <SectionCard title={copy.help}>
          <Row label={copy.setupGuide}>
            <ButtonLink variant="text" href={venueRoutes.counter}>
              {content.common.open}
            </ButtonLink>
          </Row>
          <Row label={copy.whatsapp} note={data.supportHours}>
            <Button
              variant="text"
              size="sm"
              icon="chat"
              onClick={() => toast(copy.chatToast)}
            >
              {copy.chat}
            </Button>
          </Row>
          <Row label={copy.emailSupport} note={data.supportEmail}>
            <Button
              variant="text"
              size="sm"
              icon="copy"
              onClick={async () => {
                const copied = await copyText(data.supportEmail);
                toast(
                  copied ? content.common.copied : content.common.copyFailed,
                );
              }}
            >
              {copy.copy}
            </Button>
          </Row>
          <Row
            label={
              <span className="flex items-center gap-2">
                {copy.bookVisit}
                <Badge tone="line" className="h-5 text-[11px]">
                  {copy.pilot}
                </Badge>
              </span>
            }
          >
            <Button
              variant="text"
              size="sm"
              onClick={() => toast(copy.bookToast)}
            >
              {copy.book}
            </Button>
          </Row>
        </SectionCard>
      </Grid>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button icon="logout" onClick={logOut}>
          {copy.logOut}
        </Button>
        <Button
          variant="danger"
          icon="trash"
          onClick={() => setDialog("delete")}
        >
          {copy.deleteVenue}
        </Button>
      </div>

      {dialog === "password" && <ChangePasswordModal onClose={close} />}
      {dialog === "email" && (
        <ChangeEmailModal
          onClose={close}
          onChanged={(next) => {
            setEmail(next);
            close();
          }}
        />
      )}
      {dialog === "delete" && (
        <DeleteVenueModal venueName={venueName} onClose={close} />
      )}
    </>
  );
}
