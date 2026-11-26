"use client";

import { useId, useState } from "react";

import { INK_GROUND } from "@/shared/lib/glass/ink-ground";

import { calculatorContent as content } from "../content";

const inr = new Intl.NumberFormat("en-IN");

/** A whole number of rupees from an input, or null while it's empty or invalid. */
function rupees(value: string) {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : null;
}

const inputStyles =
  "min-h-13 w-full rounded-xl border border-line bg-background px-4 text-xl text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/** Average bill and fee in, "customers needed to cover the fee" out. */
export function FeeCalculator() {
  const billId = useId();
  const feeId = useId();
  const noteId = useId();
  const [bill, setBill] = useState(String(content.defaultBill));
  const [fee, setFee] = useState(String(content.defaultFee));

  const billValue = rupees(bill);
  const feeValue = rupees(fee) ?? 0;
  const needed = billValue ? Math.ceil(feeValue / billValue) : null;
  const { firstTimers, returners, returnVisits } = content.example;
  const exampleSales = billValue
    ? (firstTimers + returners * returnVisits) * billValue
    : null;

  return (
    <div className="grid gap-4 rounded-3xl bg-block p-4 sm:p-6 lg:grid-cols-2 lg:gap-6 lg:p-8">
      <div className="flex flex-col gap-5 p-2 sm:p-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={billId} className="text-sm font-semibold">
            {content.billLabel}
          </label>
          <input
            id={billId}
            type="number"
            inputMode="numeric"
            min={1}
            value={bill}
            onChange={(event) => setBill(event.target.value)}
            className={inputStyles}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor={feeId} className="text-sm font-semibold">
            {content.feeLabel}
          </label>
          <input
            id={feeId}
            type="number"
            inputMode="numeric"
            min={0}
            value={fee}
            onChange={(event) => setFee(event.target.value)}
            aria-describedby={noteId}
            className={inputStyles}
          />
          <p id={noteId} className="text-sm text-muted">
            {content.feeNote}
          </p>
        </div>
      </div>

      <div
        {...INK_GROUND}
        aria-live="polite"
        className="rounded-2xl bg-ink p-6 text-paper sm:p-8"
      >
        <p className="text-stone-light">{content.resultLabel}</p>
        <p className="mt-2 font-display text-6xl leading-none font-extrabold text-volt sm:text-7xl">
          {needed ?? "–"}
        </p>
        {exampleSales !== null && (
          <p className="mt-6 leading-relaxed text-stone-light">
            {content.exampleLead}{" "}
            <strong className="text-paper">₹{inr.format(exampleSales)}</strong>{" "}
            {content.exampleTail}
          </p>
        )}
      </div>
    </div>
  );
}
