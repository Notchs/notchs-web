"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useState } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ApiError } from "@/shared/lib/api-client";

import { displayContent } from "../content";
import {
  getDisplayConfig,
  sendHeartbeat,
  type DisplayConfig,
} from "../lib/api";
import { codeAt, importSecret, slotOf } from "../lib/totp";
import { DisplayMessage } from "./display-message";

const copy = displayContent.screen;
const HEARTBEAT_MS = 60_000;
const CONFIG_REFRESH_MS = 30 * 60_000;

type Load =
  | { state: "loading" }
  | { state: "notPaired" }
  | { state: "error" }
  | { state: "ready"; config: DisplayConfig; key: CryptoKey };

/**
 * The counter phone's screen (E4). The code is made here from the paired
 * secret every 30 seconds, so it keeps working when the internet drops; the
 * guest's own phone sends it to Notchs. A heartbeat every minute tells the
 * owner the phone is on.
 */
export function CounterDisplay() {
  const [load, setLoad] = useState<Load>({ state: "loading" });
  const [online, setOnline] = useState(true);
  // 0 until mounted: the clock is only read in the browser.
  const [now, setNow] = useState(0);
  const [code, setCode] = useState<string | null>(null);

  const start = useCallback(async () => {
    try {
      const config = await getDisplayConfig();
      const key = await importSecret(config.totp.secret);
      setLoad({ state: "ready", config, key });
      setOnline(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setLoad({ state: "notPaired" });
      } else {
        setLoad((current) =>
          current.state === "ready" ? current : { state: "error" },
        );
        setOnline(false);
      }
    }
  }, []);

  useEffect(() => {
    // Loading the config is the screen's first data fetch (an external system).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void start();
    const refresh = setInterval(() => void start(), CONFIG_REFRESH_MS);
    return () => clearInterval(refresh);
  }, [start]);

  // Heartbeat: also how the screen learns it is offline or was unpaired.
  useEffect(() => {
    if (load.state !== "ready") return;
    const beat = () =>
      sendHeartbeat().then(
        () => setOnline(true),
        (error: unknown) => {
          if (error instanceof ApiError && error.status === 401) {
            setLoad({ state: "notPaired" });
          } else {
            setOnline(false);
          }
        },
      );
    const timer = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(timer);
  }, [load.state]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  // Keep the screen awake where the browser allows it.
  useEffect(() => {
    if (load.state !== "ready" || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    const acquire = () => {
      if (document.visibilityState !== "visible") return;
      navigator.wakeLock.request("screen").then(
        (sentinel) => {
          lock = sentinel;
        },
        () => {},
      );
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      void lock?.release();
    };
  }, [load.state]);

  const ready = load.state === "ready" && now > 0 ? load : null;
  const interval = ready?.config.totp.interval_s ?? 30;
  const slot = slotOf(Math.floor(now / 1000), interval);

  useEffect(() => {
    if (!ready) return;
    let current = true;
    void codeAt(ready.key, slot, ready.config.totp.digits).then((next) => {
      if (current) setCode(next);
    });
    return () => {
      current = false;
    };
  }, [ready, slot]);

  if (load.state === "loading" || (load.state === "ready" && !ready)) {
    return <DisplayMessage title={copy.loading} />;
  }
  if (load.state === "notPaired") {
    return (
      <DisplayMessage title={copy.notPairedTitle} body={copy.notPairedBody} />
    );
  }
  if (load.state === "error" || !ready) {
    return (
      <DisplayMessage title={copy.errorTitle} body={copy.errorBody}>
        <button
          type="button"
          onClick={() => void start()}
          className="min-h-11 cursor-pointer rounded-full bg-volt px-6 font-semibold text-ink"
        >
          {copy.retry}
        </button>
      </DisplayMessage>
    );
  }

  const { config } = ready;
  const secondsLeft = interval - (Math.floor(now / 1000) % interval);
  const link =
    config.scan && code
      ? config.scan.link_template.replace("{code}", code)
      : null;

  return (
    <main className="row-span-full flex min-h-svh flex-col bg-ink text-paper">
      <header className="flex items-center justify-between p-5">
        <span className="flex flex-col gap-0.5">
          <h1 className="m-0 font-display text-xl">{config.venue.name}</h1>
          <span className="text-sm text-stone-light">{config.label}</span>
        </span>
        <NotchGlyph className="size-6 text-volt" />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5">
        {link ? (
          <div className="relative aspect-square w-full max-w-[min(80vw,60svh)] rounded-3xl bg-paper p-4">
            <QRCodeSVG
              value={link}
              title={copy.qrLabel}
              size={512}
              level="H"
              bgColor="transparent"
              fgColor="#0f0f14"
              className="size-full"
            />
            <span className="absolute top-1/2 left-1/2 grid size-[20%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-ink text-volt shadow-[0_0_0_4px_var(--paper)]">
              <NotchGlyph className="size-3/5" />
            </span>
          </div>
        ) : (
          config.scan === null && (
            <div className="flex max-w-[36ch] flex-col gap-2 text-center">
              <b className="font-display text-xl">{copy.noScanTitle}</b>
              <span className="text-stone-light">{copy.noScanBody}</span>
            </div>
          )
        )}
        <b className="font-display text-2xl">{copy.scan}</b>
        <div className="flex w-full max-w-[min(80vw,60svh)] flex-col gap-2">
          <div className="h-2 overflow-hidden rounded bg-paper/14">
            <i
              className="block h-full bg-volt transition-[width] duration-1000 ease-linear"
              style={{ width: `${(secondsLeft / interval) * 100}%` }}
            />
          </div>
          <span className="flex justify-between text-sm text-stone-light">
            <span className="font-mono">{code ?? "······"}</span>
            <span>{copy.newCode(secondsLeft)}</span>
          </span>
        </div>
        {!online && (
          <span role="status" className="text-center text-sm text-stone-light">
            {copy.offline}
          </span>
        )}
      </div>
      <footer className="p-5 text-center text-xs text-stone-light">
        {copy.keepOn}
      </footer>
    </main>
  );
}
