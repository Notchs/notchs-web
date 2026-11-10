"use client";

import { useState } from "react";

import { content, pageTitles } from "../../content";
import { useToast } from "../../hooks/use-toast";
import { useBilling } from "../../hooks/use-venue-data";
import { formatNumber } from "../../lib/format";
import type { BillingResponse } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Button } from "../ui/button";
import { Card, Grid, InkCard, Overline } from "../ui/card";
import { Modal } from "../ui/modal";
import { QueryBoundary } from "../ui/query-boundary";
import { Banner } from "../ui/states";
import { Table, TableWrap, Td, Th } from "../ui/table";

const copy = content.billing;

export function BillingScreen() {
  const query = useBilling();
  return (
    <VenuePage title={pageTitles.billing} scenarioPage="billing">
      <QueryBoundary query={query}>
        {(data) => {
          if (data.state === "failed") return <FailedPayment data={data} />;
          if (data.state === "paying") return <PayingPlan data={data} />;
          return <FreeMonths data={data} />;
        }}
      </QueryBoundary>
    </VenuePage>
  );
}

function FreeMonths({ data }: { data: BillingResponse }) {
  const toast = useToast();
  // Real data has no price or end date yet: charges apply after the free months.
  const priced = Boolean(data.priceLabel);
  return (
    <>
      <Grid columns={2}>
        <InkCard className="gap-4">
          <Overline className="text-stone-light">
            {data.founding?.number ? copy.currentPlan : copy.currentPlanPlain}
          </Overline>
          <span className="font-display text-[26px]">
            {data.freeUntil
              ? copy.freeUntil(data.freeUntil)
              : copy.freeMonths(data.freeMonths)}
          </span>
          {data.freeUntil ? (
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[44px] text-volt">
                {formatNumber(data.visitsThisCycle)}
              </span>
              <span className="text-stone-light">{copy.visitsCycle}</span>
            </div>
          ) : (
            <span className="font-display text-[44px] text-volt">
              {copy.zero}
            </span>
          )}
        </InkCard>
        <Card className="gap-4">
          <Overline>{copy.after}</Overline>
          {priced ? (
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-2xl">{data.priceLabel}</span>
              <span className="text-muted">{copy.perOutlet}</span>
            </div>
          ) : (
            <b className="text-lg">{copy.chargesApply(data.freeMonths)}</b>
          )}
          {data.founding && <FoundingLine founding={data.founding} />}
          <span className="text-[15px] text-muted">{copy.cancelAnyTime}</span>
          {priced && (
            <Button
              variant="dark"
              size="lg"
              icon="zap"
              className="self-start"
              onClick={() => toast(copy.autopayToast)}
            >
              {copy.setupAutopay}
            </Button>
          )}
        </Card>
      </Grid>
      <Card className="gap-2">
        <Overline>{copy.invoices}</Overline>
        <b>{copy.noInvoices}</b>
        <span className="text-[15px] text-muted">
          {data.freeUntil
            ? copy.firstInvoice(data.freeUntil)
            : copy.firstInvoiceLater(data.freeMonths)}
        </span>
      </Card>
    </>
  );
}

function FoundingLine({
  founding,
}: {
  founding: NonNullable<BillingResponse["founding"]>;
}) {
  return (
    <span className="rounded-xl bg-block p-3 text-[15px]">
      {founding.number
        ? copy.foundingYes(
            founding.number,
            founding.spots,
            founding.niche,
            founding.discountPercent,
          )
        : copy.foundingNo(founding.spots, founding.niche)}
    </span>
  );
}

function PayingPlan({ data }: { data: BillingResponse }) {
  const toast = useToast();
  const [cancelling, setCancelling] = useState(false);
  const c = copy.columns;
  return (
    <>
      <Card className="flex-row flex-wrap items-center gap-5">
        <div className="flex min-w-50 flex-1 flex-col gap-1">
          <Overline>{copy.plan}</Overline>
          <b className="text-xl">{copy.planLine(data.priceLabel)}</b>
          <span className="text-[15px] text-muted">
            {copy.autopayLine(data.autopayHandle, data.nextCharge)}
          </span>
        </div>
        <Button onClick={() => toast(copy.autopayToast)}>
          {copy.changeUpi}
        </Button>
        <Button variant="text" onClick={() => setCancelling(true)}>
          {copy.cancelPlan}
        </Button>
      </Card>
      <Card className="p-0">
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{c.invoice}</Th>
                <Th>{c.period}</Th>
                <Th>{c.visits}</Th>
                <Th>{c.amount}</Th>
                <Th>
                  <span className="sr-only">{c.file}</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <Td className="font-mono">{invoice.id}</Td>
                  <Td>{invoice.period}</Td>
                  <Td className="font-mono">
                    {formatNumber(invoice.verifiedVisits)}
                  </Td>
                  <Td className="font-mono">{invoice.amountLabel}</Td>
                  <Td className="text-right">
                    <Button
                      variant="text"
                      icon="download"
                      onClick={() => toast(copy.invoiceQueued)}
                    >
                      {copy.pdf}
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Card>
      {cancelling && (
        <Modal
          title={copy.cancelTitle}
          icon="alert"
          danger
          onClose={() => setCancelling(false)}
          actions={
            <>
              <Button onClick={() => setCancelling(false)}>
                {copy.keepPlan}
              </Button>
              <Button
                variant="dangerSolid"
                onClick={() => {
                  setCancelling(false);
                  toast(copy.cancelDone);
                }}
              >
                {copy.cancelConfirm}
              </Button>
            </>
          }
        >
          <p className="m-0 text-muted">{copy.cancelBody}</p>
        </Modal>
      )}
    </>
  );
}

function FailedPayment({ data }: { data: BillingResponse }) {
  const toast = useToast();
  return (
    <Banner
      icon="card"
      title={copy.failedTitle}
      body={copy.failedBody(data.failedOn)}
    >
      <Button variant="dark" onClick={() => toast(copy.autopayToast)}>
        {copy.updatePayment}
      </Button>
    </Banner>
  );
}
