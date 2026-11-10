"use client";

import { useRef, type ReactNode } from "react";

import { content } from "../../content";
import { useAction } from "../../hooks/use-action";
import { useToast } from "../../hooks/use-toast";
import {
  copyText,
  downloadElementPng,
  shareText,
} from "../../lib/browser-actions";
import { Button } from "../ui/button";

const copy = content.visits.card;

/** A shareable card beside its text, with working share and download. */
export function ShareablePanel({
  art,
  intro,
  footer,
  filename,
  shareTitle,
  shareBody,
}: {
  art: ReactNode;
  intro: ReactNode;
  footer?: ReactNode;
  filename: string;
  shareTitle: string;
  shareBody: string;
}) {
  const toast = useToast();
  const { run, isBusy } = useAction();
  const artRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-wrap items-center gap-8">
      <div ref={artRef} className="max-w-full">
        {art}
      </div>
      <div className="flex max-w-105 min-w-60 flex-1 flex-col gap-5">
        {intro}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="dark"
            size="lg"
            icon="share"
            onClick={async () => {
              if (await shareText(shareTitle, shareBody)) return;
              const copied = await copyText(shareBody);
              toast(copied ? content.common.copied : content.common.copyFailed);
            }}
          >
            {copy.share}
          </Button>
          <Button
            size="lg"
            icon="download"
            disabled={isBusy}
            onClick={() =>
              run(async () => {
                if (artRef.current) {
                  await downloadElementPng(artRef.current, filename);
                }
              }, copy.downloaded)
            }
          >
            {copy.download}
          </Button>
        </div>
        {footer}
      </div>
    </div>
  );
}
