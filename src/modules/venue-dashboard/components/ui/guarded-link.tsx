"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useVenueDraft } from "../../hooks/use-venue-draft";

type GuardedLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** A link that asks first when the venue page has unpublished edits. */
export function GuardedLink({ href, onClick, ...props }: GuardedLinkProps) {
  const { holdNavigation } = useVenueDraft();
  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (holdNavigation(href)) event.preventDefault();
      }}
      {...props}
    />
  );
}
