"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { venueRoutes } from "@/config/routes";
import { cn } from "@/shared/lib/cn";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useSession } from "../../hooks/use-session";
import { useToast } from "../../hooks/use-toast";
import { useCounter } from "../../hooks/use-venue-data";
import { copyText } from "../../lib/browser-actions";
import { formatTime } from "../../lib/format";
import { venueData } from "../../services/venue-data.service";
import type { CounterResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge, KeyValues } from "../ui/badges";
import { Button, ButtonLink } from "../ui/button";
import { Card, Overline, SectionHead, SideGrid } from "../ui/card";
import { Icon } from "../ui/icon";
import { Modal } from "../ui/modal";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner, EmptyState } from "../ui/states";
import { CounterPreview } from "./counter-preview";
import { CounterTabs } from "./counter-tabs";

const copy = content.counter;

export function CounterScreen() {
  const query = useCounter();
  return (
    <VenuePage title={pageTitles.counter} scenarioPage="counter">
      <QueryBoundary query={query}>
        {(data) => <CounterBody data={data} onChanged={query.refresh} />}
      </QueryBoundary>
    </VenuePage>
  );
}

function PairModal({
  onClose,
  onPaired,
}: {
  onClose: () => void;
  onPaired: () => void;
}) {
  const toast = useToast();
  const { run, isBusy } = useAction();
  return (
    <Modal
      title={copy.pairTitle}
      closable
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button
            icon="copy"
            onClick={async () => {
              const copied = await copyText(copy.pairLink);
              toast(copied ? content.common.copied : content.common.copyFailed);
            }}
          >
            {copy.copyLink}
          </Button>
          <Button
            variant="dark"
            disabled={isBusy}
            onClick={async () => {
              if (await run(venueData.pairCounter, copy.pairedDone)) onPaired();
            }}
          >
            {copy.paired}
          </Button>
        </>
      }
    >
      <p className="m-0 text-muted">{copy.pairBody}</p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="size-35 rounded-xl bg-paper p-2.5">
          <QRCodeSVG
            value={`Example pairing ${copy.pairLink}`}
            size={256}
            bgColor="transparent"
            fgColor="#0f0f14"
            className="size-full"
          />
        </div>
        <div className="min-w-40 flex-1">
          <KeyValues
            items={[
              {
                label: copy.pairExpires,
                value: copy.pairExpiresValue,
                mono: true,
              },
              { label: copy.pairUses, value: copy.pairUsesValue },
            ]}
          />
        </div>
      </div>
      <span className="text-xs text-muted">{copy.pairNote}</span>
    </Modal>
  );
}

function CounterBody({
  data,
  onChanged,
}: {
  data: CounterResponse;
  onChanged: () => void;
}) {
  const session = useSession().data?.session;
  const toast = useToast();
  const { run, isBusy } = useAction();
  const [dialog, setDialog] = useState<"pair" | "remove" | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(data.device.name);
  const { device, checklist } = data;
  const close = () => setDialog(null);

  const pairModal = dialog === "pair" && (
    <PairModal
      onClose={close}
      onPaired={() => {
        close();
        onChanged();
      }}
    />
  );

  if (device.status === "none") {
    return (
      <>
        <EmptyState icon="phone" title={copy.noneTitle} body={copy.noneBody}>
          <Button
            variant="primary"
            size="lg"
            iconRight="arrowR"
            onClick={() => setDialog("pair")}
          >
            {copy.pairCta}
          </Button>
        </EmptyState>
        {pairModal}
      </>
    );
  }

  const offline = device.status === "offline";
  const details = copy.details;
  const doneCount = checklist.filter((item) => item.done).length;

  const saveName = async () => {
    const next = name.trim() || copy.defaultName;
    if (await run(() => venueData.renameCounter(next), copy.renamed)) {
      setName(next);
      setRenaming(false);
      onChanged();
    }
  };

  return (
    <>
      <CounterTabs current={venueRoutes.counter} />
      {offline && (
        <Banner
          icon="wifiOff"
          title={copy.offlineTitle(device.name)}
          body={copy.offlineBody(
            device.minutesSinceHeartbeat,
            formatTime(device.lastHeartbeat),
          )}
        >
          <Button
            variant="dark"
            icon="refresh"
            onClick={() => {
              onChanged();
              toast(copy.checked);
            }}
          >
            {copy.checkAgain}
          </Button>
        </Banner>
      )}
      <SideGrid>
        <div className="flex min-w-0 flex-col gap-4">
          <Card className="gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Icon name="phone" size={24} />
              {renaming ? (
                <>
                  <input
                    aria-label={copy.nameLabel}
                    value={name}
                    autoFocus
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") void saveName();
                    }}
                    className="h-10 max-w-60 min-w-0 flex-1 rounded-[10px] bg-card px-3.5 text-[15px] shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] outline-none focus:shadow-[inset_0_0_0_2px_var(--ink)]"
                  />
                  <Button
                    variant="dark"
                    size="sm"
                    disabled={isBusy}
                    onClick={saveName}
                  >
                    {copy.save}
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="m-0 min-w-0 flex-1 font-display text-xl">
                    {device.name}
                  </h2>
                  <Button
                    variant="text"
                    size="sm"
                    icon="edit"
                    onClick={() => setRenaming(true)}
                  >
                    {copy.rename}
                  </Button>
                </>
              )}
              <Badge tone={offline ? "warn" : "soft"}>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    offline ? "bg-[#ff5b35]" : "bg-ink",
                  )}
                />
                {offline ? copy.offline : copy.online}
              </Badge>
            </div>
            <KeyValues
              items={[
                {
                  label: details.heartbeat,
                  value: details.heartbeatValue(
                    formatTime(device.lastHeartbeat),
                    device.minutesSinceHeartbeat,
                  ),
                  mono: true,
                },
                {
                  label: details.lastVisit,
                  value: formatTime(device.lastVerifiedVisit),
                  mono: true,
                },
                {
                  label: details.battery,
                  value:
                    device.batteryPercent == null
                      ? details.none
                      : details.batteryValue(
                          device.batteryPercent,
                          device.charging,
                        ),
                  mono: true,
                },
                {
                  label: details.screen,
                  value: offline ? details.screenUnknown : details.screenOn,
                },
                { label: details.paired, value: device.pairedOn },
                { label: details.browser, value: device.browser, mono: true },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                icon="refresh"
                onClick={() => setDialog("pair")}
              >
                {copy.pairNew}
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="trash"
                onClick={() => setDialog("remove")}
              >
                {copy.removePhone}
              </Button>
            </div>
          </Card>
          <Card className="gap-2">
            <SectionHead title={copy.checklistTitle}>
              <span className="font-mono text-xs text-muted">
                {doneCount} / {checklist.length}
              </span>
            </SectionHead>
            <div className="flex flex-col divide-y divide-line">
              {checklist.map((item) => (
                <div
                  key={item.key}
                  className="flex min-h-11 items-center gap-3.5 py-1"
                >
                  <span
                    className={cn(
                      "grid size-6 flex-none place-items-center rounded-lg",
                      item.done
                        ? "bg-ink text-paper"
                        : "text-transparent shadow-[inset_0_0_0_1.5px_rgb(15_15_20/0.16)]",
                    )}
                  >
                    <Icon name="check" size={14} />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    {copy.checklist[item.key]}
                  </span>
                  {!item.done && (
                    <ButtonLink variant="text" href={venueRoutes.counterSigns}>
                      {copy.getSigns}
                    </ButtonLink>
                  )}
                </div>
              ))}
            </div>
          </Card>
          <Card className="gap-1">
            <SectionHead title={copy.troubleshootingTitle} />
            <div className="mt-1.5">
              {copy.troubleshooting.map((item) => (
                <details
                  key={item.q}
                  className="details-smooth border-t border-line py-2.5"
                >
                  <summary className="cursor-pointer text-sm font-semibold">
                    {item.q}
                  </summary>
                  <p className="mt-2 mb-0 text-sm leading-normal text-muted">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <span className="pt-2 text-[13px] text-muted">{copy.stuck}</span>
          </Card>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Overline>{copy.guestsSee}</Overline>
          <CounterPreview
            device={device}
            venueName={session?.venueName ?? ""}
            area={session?.area ?? ""}
            codes={data.exampleCodes}
            rotationSeconds={data.rotationSeconds}
          />
          <span className="font-mono text-xs text-muted uppercase">
            {copy.screenCaption(data.rotationSeconds)}
          </span>
          <ButtonLink
            variant="text"
            iconRight="arrowR"
            href={venueRoutes.counterSigns}
          >
            {copy.signsLink}
          </ButtonLink>
        </div>
      </SideGrid>
      {pairModal}
      {dialog === "remove" && (
        <Modal
          title={copy.removeTitle(device.name)}
          icon="alert"
          danger
          onClose={close}
          actions={
            <>
              <Button onClick={close}>{content.common.cancel}</Button>
              <Button
                variant="dangerSolid"
                disabled={isBusy}
                onClick={async () => {
                  if (await run(venueData.removeCounter, copy.removed)) {
                    close();
                    onChanged();
                  }
                }}
              >
                {copy.removePhone}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">{copy.removeBody}</p>
        </Modal>
      )}
    </>
  );
}
