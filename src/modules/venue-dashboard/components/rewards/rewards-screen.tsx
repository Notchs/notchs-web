"use client";

import { useState } from "react";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useRewards } from "../../hooks/use-venue-data";
import { formatWindow } from "../../lib/format";
import { venueData } from "../../services/venue-data.service";
import type { Campaign, CampaignStatus, RewardsResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge } from "../ui/badges";
import { Button } from "../ui/button";
import { Card, Grid } from "../ui/card";
import { Chip } from "../ui/controls";
import { MetricCard } from "../ui/metric-card";
import { Modal } from "../ui/modal";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner, UnavailableBox } from "../ui/states";
import { Table, TableWrap, Td, Th } from "../ui/table";
import { CampaignFormModal } from "./campaign-form-modal";

const copy = content.rewards;

const statusTone = (status: CampaignStatus) =>
  status === "Active" ? "ink" : status === "Draft" ? "line" : "soft";

type Dialog =
  | { kind: "form"; campaign: Campaign | null }
  | { kind: "delete" | "end"; campaign: Campaign }
  | null;

export function RewardsScreen() {
  const query = useRewards();
  return (
    <VenuePage example title={pageTitles.rewards} scenarioPage="rewards">
      <QueryBoundary query={query}>
        {(data) =>
          data.enabled ? (
            <RewardsBody data={data} onChanged={query.refresh} />
          ) : (
            <NotAvailable />
          )
        }
      </QueryBoundary>
    </VenuePage>
  );
}

function NotAvailable() {
  const { run, isBusy } = useAction();
  return (
    <UnavailableBox
      badge={<Badge tone="line">{copy.unavailableBadge}</Badge>}
      title={copy.unavailableTitle}
      body={copy.unavailableBody}
    >
      <Button
        variant="dark"
        disabled={isBusy}
        onClick={() =>
          run(venueData.requestRewardsAccess, copy.earlyAccessDone)
        }
      >
        {copy.earlyAccess}
      </Button>
    </UnavailableBox>
  );
}

function RewardsBody({
  data,
  onChanged,
}: {
  data: RewardsResponse;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState<CampaignStatus | "all">("all");
  const [dialog, setDialog] = useState<Dialog>(null);
  const { run, isBusy } = useAction();
  const { campaigns } = data;
  const list = campaigns.filter(
    (row) => status === "all" || row.status === status,
  );
  const close = () => setDialog(null);
  const c = copy.columns;

  const confirm = async (action: () => Promise<void>, success: string) => {
    const done = await run(action, success);
    if (done) {
      close();
      onChanged();
    }
  };

  const newCampaign = (
    <Button
      variant="dark"
      size="sm"
      icon="plus"
      onClick={() => setDialog({ kind: "form", campaign: null })}
    >
      {copy.newCampaign}
    </Button>
  );

  return (
    <>
      <Banner
        tone="info"
        icon="info"
        title={copy.noticeTitle}
        body={copy.noticeBody}
      />
      <Grid columns={3}>
        <MetricCard
          label={copy.active}
          value={campaigns.filter((row) => row.status === "Active").length}
        />
        <MetricCard
          label={copy.redemptions.label}
          tip={copy.redemptions.tip}
          foot={copy.redemptions.foot}
          value={data.redemptionsLast30Days}
        />
        <MetricCard
          label={copy.redeemerVisits.label}
          tip={copy.redeemerVisits.tip}
          foot={copy.redeemerVisits.foot}
          value={data.visitsByRedeemingGuests}
        />
      </Grid>
      <div className="flex flex-wrap items-center gap-3">
        <Chip
          selected={status === "all"}
          count={campaigns.length}
          onClick={() => setStatus("all")}
        >
          {copy.all}
        </Chip>
        {(copy.statuses as readonly CampaignStatus[]).map((value) => (
          <Chip
            key={value}
            selected={status === value}
            count={campaigns.filter((row) => row.status === value).length}
            onClick={() => setStatus(value)}
          >
            {value}
          </Chip>
        ))}
        <span className="ml-auto">{newCampaign}</span>
      </div>
      <Card className="p-0">
        {list.length ? (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>{c.campaign}</Th>
                  <Th>{c.status}</Th>
                  <Th className="max-sm:hidden">{c.audience}</Th>
                  <Th className="max-sm:hidden">{c.window}</Th>
                  <Th>{c.redeemed}</Th>
                  <Th>
                    <span className="sr-only">{c.actions}</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {list.map((row) => (
                  <tr key={row.id}>
                    <Td className="py-2">
                      <b className="block text-sm">{row.name}</b>
                      <span className="text-xs text-muted">
                        {row.rewardLabel} ·{" "}
                        {copy.perGuest(row.perGuest, row.totalLimit)}
                      </span>
                    </Td>
                    <Td>
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                    </Td>
                    <Td className="text-sm max-sm:hidden">{row.audience}</Td>
                    <Td className="font-mono text-[13px] whitespace-nowrap text-muted max-sm:hidden">
                      {formatWindow(row.startsOn, row.endsOn) ?? copy.notSet}
                    </Td>
                    <Td className="font-mono">{row.redemptions}</Td>
                    <Td className="text-right whitespace-nowrap">
                      {(row.status === "Draft" ||
                        row.status === "Scheduled") && (
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() =>
                            setDialog({ kind: "form", campaign: row })
                          }
                        >
                          {copy.edit}
                        </Button>
                      )}
                      {row.status === "Draft" && (
                        <Button
                          variant="text"
                          size="sm"
                          className="ml-2"
                          onClick={() =>
                            setDialog({ kind: "delete", campaign: row })
                          }
                        >
                          {copy.remove}
                        </Button>
                      )}
                      {row.status === "Active" && (
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() =>
                            setDialog({ kind: "end", campaign: row })
                          }
                        >
                          {copy.end}
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <div className="flex flex-col items-start gap-3 px-5 py-8">
            <b>{copy.noneWithStatus(status)}</b>
            {newCampaign}
          </div>
        )}
      </Card>

      {dialog?.kind === "form" && (
        <CampaignFormModal
          campaign={dialog.campaign}
          onClose={close}
          onSaved={() => {
            close();
            setStatus("all");
            onChanged();
          }}
        />
      )}
      {dialog?.kind === "delete" && (
        <Modal
          title={copy.deleteTitle(dialog.campaign.name)}
          icon="trash"
          danger
          onClose={close}
          actions={
            <>
              <Button onClick={close}>{content.common.cancel}</Button>
              <Button
                variant="dangerSolid"
                disabled={isBusy}
                onClick={() =>
                  confirm(
                    () => venueData.deleteCampaign(dialog.campaign.id),
                    copy.deleted,
                  )
                }
              >
                {copy.deleteConfirm}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">{copy.deleteBody}</p>
        </Modal>
      )}
      {dialog?.kind === "end" && (
        <Modal
          title={copy.endTitle(dialog.campaign.name)}
          icon="alert"
          danger
          onClose={close}
          actions={
            <>
              <Button onClick={close}>{copy.keepRunning}</Button>
              <Button
                variant="dangerSolid"
                disabled={isBusy}
                onClick={() =>
                  confirm(
                    () => venueData.endCampaign(dialog.campaign.id),
                    copy.ended,
                  )
                }
              >
                {copy.endConfirm}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">
            {copy.endBody(dialog.campaign.redemptions)}
          </p>
        </Modal>
      )}
    </>
  );
}
