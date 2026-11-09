"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/shared/lib/api-client";

import { claimsContent as copy } from "../content";
import {
  findClaimVenues,
  getClaims,
  startClaim,
  type ClaimStart,
  type ClaimVenue,
} from "../lib/api";
import { fullDate, notchNumber } from "../lib/format";
import { useLoad } from "../lib/use-load";

const fieldStyles =
  "min-h-12 w-full rounded-xl border border-line bg-background px-3 text-[.9375rem] text-foreground";
const SEARCH_DELAY_MS = 300;

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

/** A 4xx message from the API is written for customers; anything else isn't. */
const messageOf = (error: unknown, fallback: string) =>
  error instanceof ApiError && error.status < 500 ? error.message : fallback;

/**
 * When the counter phone was down: pick the place, send the claim code and then
 * the bill photo on WhatsApp, and see how earlier claims went.
 */
export function ClaimCard() {
  const claims = useLoad(getClaims, "claims");
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<{
    for: string;
    venues?: ClaimVenue[];
    failed?: boolean;
  } | null>(null);
  const [place, setPlace] = useState<ClaimVenue | null>(null);
  const [started, setStarted] = useState<ClaimStart | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const term = query.trim();
  useEffect(() => {
    if (term.length < 2) return;
    let live = true;
    const timer = setTimeout(() => {
      findClaimVenues(term).then(
        (venues) => live && setFound({ for: term, venues }),
        () => live && setFound({ for: term, failed: true }),
      );
    }, SEARCH_DELAY_MS);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [term]);
  const results = found?.for === term ? found : null;

  async function start() {
    if (!place || busy) return;
    setBusy(true);
    setError(null);
    try {
      setStarted(await startClaim(place.venue_code));
      claims.reload();
    } catch (caught) {
      setError(messageOf(caught, copy.startFailed));
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setPlace(null);
    setStarted(null);
    setError(null);
  }

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-card p-4 md:p-6">
      <h2 className="font-display text-lg font-extrabold">{copy.title}</h2>
      <p className="text-[.9375rem] text-muted">{copy.body}</p>

      {started ? (
        <div className="flex flex-col gap-3" role="status">
          <p className="font-semibold">{copy.step1(started.message)}</p>
          {started.whatsapp_link ? (
            <a
              href={started.whatsapp_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center self-start rounded-full bg-foreground px-6 font-bold text-background"
            >
              {copy.open}
            </a>
          ) : (
            <p className="text-sm text-muted">{copy.noLink}</p>
          )}
          <p className="font-semibold">{copy.step2}</p>
          <p className="text-sm text-muted">
            {copy.expires(timeOf(started.expires_at))}
          </p>
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer self-start text-sm font-semibold underline"
          >
            {copy.change}
          </button>
        </div>
      ) : place ? (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={start}
            disabled={busy}
            className="min-h-12 cursor-pointer self-start rounded-full bg-foreground px-6 font-bold text-background disabled:cursor-default disabled:opacity-60"
          >
            {busy ? copy.starting : copy.start(place.name)}
          </button>
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer self-start text-sm font-semibold underline"
          >
            {copy.change}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label
            htmlFor="claim-place"
            className="text-[.8125rem] font-semibold text-muted"
          >
            {copy.search}
          </label>
          <input
            id="claim-place"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={60}
            autoComplete="off"
            className={fieldStyles}
          />
          {term.length < 2 ? (
            <p className="text-[.8125rem] text-muted">{copy.searchHint}</p>
          ) : results?.failed ? (
            <p className="text-sm">{copy.searchFailed}</p>
          ) : results?.venues?.length === 0 ? (
            <p className="text-sm text-muted">{copy.noPlaces}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {results?.venues?.map((venue) => (
                <li key={venue.venue_code}>
                  <button
                    type="button"
                    onClick={() => setPlace(venue)}
                    className="flex min-h-12 w-full cursor-pointer flex-col items-start rounded-xl border border-line px-3 py-2 text-left"
                  >
                    <b>{venue.name}</b>
                    <span className="text-[.8125rem] text-muted">
                      {[venue.niche, venue.area].filter(Boolean).join(" · ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}

      {claims.data && claims.data.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <h3 className="text-[.8125rem] font-semibold text-muted">
            {copy.yours}
          </h3>
          <ul className="flex flex-col gap-2">
            {claims.data.map((claim) => (
              <li key={claim.claim_code} className="text-sm">
                <b>{claim.venue_name}</b>
                <span className="text-muted">
                  {" · "}
                  {fullDate(claim.visit_date)}
                  {" · "}
                  {copy.status[claim.status]}
                  {claim.notch_no != null &&
                    ` · ${copy.notch(notchNumber(claim.notch_no))}`}
                </span>
                {claim.reject_reason && (
                  <p className="text-muted">{claim.reject_reason}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
