"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";

import { content } from "../../content";
import type { CounterDevice } from "../../types";
import { Icon } from "../ui/icon";

const copy = content.counter.screen;

/** What the counter phone shows, with an example code rotating on schedule. */
export function CounterPreview({
  device,
  venueName,
  area,
  codes,
  rotationSeconds,
}: {
  device: CounterDevice;
  venueName: string;
  area: string;
  codes: string[];
  rotationSeconds: number;
}) {
  const [now, setNow] = useState(() => Date.now());
  const isOffline = device.status === "offline";

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = Math.floor(now / 1000);
  const left = rotationSeconds - (seconds % rotationSeconds);
  const code = codes[Math.floor(seconds / rotationSeconds) % codes.length];

  return (
    <div className="h-[500px] w-60 flex-none rounded-[32px] bg-black p-2 shadow-[0_20px_50px_-24px_rgb(15_15_20/0.5)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[25px] bg-ink text-paper">
        <div className="flex items-center justify-between px-[18px] pt-[18px]">
          <span className="flex flex-col gap-0.5">
            <b className="font-display text-base">{venueName}</b>
            <span className="text-xs text-stone-light">{area}</span>
          </span>
          <NotchGlyph className="size-5" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-[18px]">
          <div className="relative aspect-square w-[72%] flex-none rounded-2xl bg-paper p-3">
            {/* Level H error correction keeps the code readable under the logo. */}
            <QRCodeSVG
              value={`Example code ${code}`}
              title={copy.qrLabel}
              size={256}
              level="H"
              bgColor="transparent"
              fgColor="#0f0f14"
              className="size-full"
            />
            {/* Volt is unreadable on Paper, so the mark sits on an Ink tile. */}
            <span className="absolute top-1/2 left-1/2 grid size-[22%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-md bg-ink text-volt shadow-[0_0_0_3px_var(--paper)]">
              <NotchGlyph className="size-3/5" />
            </span>
          </div>
          <b className="font-display text-[19px] whitespace-nowrap">
            {copy.scan}
          </b>
          {isOffline ? (
            <span className="flex items-center gap-2 text-[13px]">
              <Icon name="wifiOff" size={16} />
              {copy.offline}
            </span>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <div className="h-1.5 overflow-hidden rounded-[3px] bg-paper/14">
                <i
                  className="block h-full bg-volt transition-[width] duration-1000 ease-linear"
                  style={{ width: `${(left / rotationSeconds) * 100}%` }}
                />
              </div>
              <span className="flex justify-between text-xs text-stone-light">
                <span className="font-mono">{code}</span>
                <span>{copy.newCode(left)}</span>
              </span>
            </div>
          )}
        </div>
        <div className="px-[18px] pb-5 text-center text-[13px] text-stone-light">
          <b className="font-display text-[15px] text-paper">
            {device.verifiedToday}
          </b>{" "}
          {copy.today}
        </div>
      </div>
    </div>
  );
}
