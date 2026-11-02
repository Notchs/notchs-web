"use client";

import { useEffect, useRef, useState } from "react";

import { env } from "@/config/env";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      appearance: "interaction-only";
      size: "flexible";
      theme: "auto";
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<TurnstileApi> | undefined;

/** Loads Cloudflare's script once per page, however many widgets render. */
function loadTurnstile() {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () =>
      window.turnstile ? resolve(window.turnstile) : reject();
    script.onerror = () => {
      scriptPromise = undefined;
      reject();
    };
    document.head.append(script);
  });
  return scriptPromise;
}

function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !env.turnstileSiteKey) return;
    let widgetId: string | undefined;
    let live = true;

    loadTurnstile().then(
      (turnstile) => {
        if (!live) return;
        widgetId = turnstile.render(container, {
          sitekey: env.turnstileSiteKey,
          callback: onToken,
          "expired-callback": () => onToken(""),
          "error-callback": () => onToken(""),
          // Stays hidden unless Cloudflare needs the person to tick a box.
          appearance: "interaction-only",
          size: "flexible",
          theme: "auto",
        });
      },
      () => {},
    );

    return () => {
      live = false;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [onToken]);

  return <div ref={containerRef} className="empty:hidden" />;
}

/**
 * Cloudflare Turnstile bot check for forms the backend protects. Render
 * `widget` inside the form, send `token` with the request, and call `reset`
 * after each request: a token works only once.
 */
export function useTurnstile() {
  const [token, setToken] = useState("");
  const [round, setRound] = useState(0);

  return {
    token,
    /** True when no site key is set, so forms don't wait for a token. */
    disabled: !env.turnstileSiteKey,
    widget: <TurnstileWidget key={round} onToken={setToken} />,
    reset() {
      setToken("");
      setRound((n) => n + 1);
    },
  };
}
