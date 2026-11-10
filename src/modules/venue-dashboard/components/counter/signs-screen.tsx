"use client";

import { createRef, useState, type ReactNode, type RefObject } from "react";

import { venueRoutes } from "@/config/routes";
import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { content, pageTitles } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useToast } from "../../hooks/use-toast";
import { downloadElementPng } from "../../lib/browser-actions";
import { VENUE_DATA_MODE } from "../../services/config";
import { VenuePage } from "../shell/venue-page";
import { Button } from "../ui/button";
import { Card, Grid } from "../ui/card";
import { Icon } from "../ui/icon";
import { Banner } from "../ui/states";
import { CounterTabs } from "./counter-tabs";

const copy = content.counter;
const art = copy.signArt;

const signArt: Record<string, ReactNode> = {
  standee: (
    <div className="flex h-full flex-col justify-between rounded-[10px] bg-ink p-4 text-paper">
      <NotchGlyph className="size-[22px]" />
      <b className="font-display text-[22px] leading-[1.05]">
        {art.standeeTitle}
      </b>
      <span className="text-[11px] text-stone-light">{art.standeeNote}</span>
    </div>
  ),
  tent: (
    <div className="flex h-full flex-col justify-between rounded-[10px] border border-ink/16 bg-paper p-4 text-ink">
      <span className="text-xs text-muted">{art.tentTop}</span>
      <b className="font-display text-xl leading-[1.1]">{art.tentTitle}</b>
      <span className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-ink text-volt">
          <NotchGlyph className="size-4.5" />
        </span>
        <b className="font-display text-lg leading-none">{art.brand}</b>
      </span>
    </div>
  ),
  sticker: (
    <div className="grid h-full place-items-center rounded-[10px] border border-ink/16 bg-white text-ink">
      <div className="flex flex-col items-center gap-2">
        <span className="grid size-14 place-items-center rounded-[14px] bg-ink text-volt">
          <NotchGlyph className="size-8" />
        </span>
        <b className="font-display text-base">{art.brand}</b>
      </div>
    </div>
  ),
};

function SignCard({
  sign,
  artRef,
}: {
  sign: (typeof copy.signs)[number];
  artRef: RefObject<HTMLDivElement | null>;
}) {
  const toast = useToast();
  const { run, isBusy } = useAction();
  return (
    <Card className="gap-4 p-4">
      <div ref={artRef} className="h-50">
        {signArt[sign.key]}
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-base font-bold">{sign.name}</h2>
        <span className="text-sm text-muted">{sign.line}</span>
        <span className="font-mono text-xs text-muted">{sign.size}</span>
      </div>
      <div className="flex gap-2">
        {/* Real venues: no print-ready PDF is emailed yet, so only the PNG. */}
        {VENUE_DATA_MODE === "mock" && (
          <Button
            size="sm"
            icon="download"
            onClick={() => toast(copy.pdfQueued)}
          >
            {copy.pdf}
          </Button>
        )}
        <Button
          size="sm"
          icon="download"
          disabled={isBusy}
          onClick={() =>
            run(async () => {
              if (artRef.current) {
                await downloadElementPng(
                  artRef.current,
                  `notchs-${sign.key}.png`,
                );
              }
            }, copy.pngDone)
          }
        >
          {copy.png}
        </Button>
      </div>
    </Card>
  );
}

export function SignsScreen() {
  const toast = useToast();
  const { run, isBusy } = useAction();
  // One ref per sign, made once: "Download all" reads them on click.
  const [refs] = useState(() =>
    copy.signs.map(() => createRef<HTMLDivElement>()),
  );

  /** Every sign as a PNG, one after another (real venues). */
  const downloadAll = () =>
    run(async () => {
      for (const [index, sign] of copy.signs.entries()) {
        const element = refs[index].current;
        if (element)
          await downloadElementPng(element, `notchs-${sign.key}.png`);
      }
    }, copy.pngDone);
  return (
    <VenuePage title={pageTitles.counter} scenarioPage="counter">
      <CounterTabs current={venueRoutes.counterSigns} />
      <Banner
        tone="info"
        icon="info"
        title={copy.signsNoticeTitle}
        body={copy.signsNoticeBody}
      />
      <Grid columns={3}>
        {copy.signs.map((sign, index) => (
          <SignCard key={sign.key} sign={sign} artRef={refs[index]} />
        ))}
      </Grid>
      <Card className="flex-row flex-wrap items-center gap-4 px-5 py-[18px]">
        <Icon name="users" size={22} />
        <span className="min-w-50 flex-1">
          <b>{copy.staffLineLead}</b>{" "}
          <span className="text-muted">{copy.staffLine}</span>
        </span>
        <Button
          variant="dark"
          icon="printer"
          disabled={isBusy}
          onClick={() =>
            VENUE_DATA_MODE === "mock" ? toast(copy.allQueued) : downloadAll()
          }
        >
          {copy.downloadAll}
        </Button>
      </Card>
    </VenuePage>
  );
}
