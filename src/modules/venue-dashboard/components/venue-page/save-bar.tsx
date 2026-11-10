"use client";

import { content } from "../../content";
import { useVenueDraft } from "../../hooks/use-venue-draft";
import { Button } from "../ui/button";

const copy = content.venuePage.saveBar;

/** Sticks to the bottom of the page body while there are unpublished edits. */
export function SaveBar() {
  const { isDirty, errors, needsReview, isPublishing, discard, publish } =
    useVenueDraft();
  if (!isDirty) return null;
  const errorCount = Object.keys(errors).length;
  return (
    <div
      role="region"
      aria-label={copy.region}
      className="sticky -bottom-4 z-4 -mx-4 -mb-4 flex flex-wrap items-center gap-3 bg-ink px-4 py-3 text-paper sm:-bottom-6 sm:-mx-6 sm:-mb-6 sm:px-6"
    >
      <span className="min-w-50 flex-1 text-sm">
        <b>{copy.title}</b>{" "}
        <span className="text-stone-light">
          {errorCount
            ? copy.fix(errorCount)
            : needsReview
              ? copy.review
              : copy.live}
        </span>
      </span>
      <Button variant="ghostOnInk" size="sm" onClick={discard}>
        {copy.discard}
      </Button>
      <Button
        variant="volt"
        size="sm"
        disabled={errorCount > 0 || isPublishing}
        onClick={publish}
      >
        {needsReview ? copy.submit : copy.publish}
      </Button>
    </div>
  );
}
