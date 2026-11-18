"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/cn";

import { initials } from "../lib/format";

/**
 * The customer's round picture, or their initials when there is none or it
 * fails to load (the API's link only works for 15 minutes).
 */
export function Avatar({
  name,
  photoUrl,
  alt = "",
  className,
  onExpired,
}: {
  name: string | null;
  photoUrl: string | null;
  alt?: string;
  className?: string;
  /** Called once when the picture stops loading, to fetch a fresh link. */
  onExpired?: () => void;
}) {
  // Remembers which link failed, so a new link is tried again.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPhoto = photoUrl && photoUrl !== failedUrl;

  return (
    <span
      className={cn(
        "grid flex-none place-items-center overflow-hidden rounded-full bg-volt font-bold text-ink",
        className,
      )}
    >
      {showPhoto ? (
        // A plain <img>: next/image would copy the customer's photo into its cache.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => {
            setFailedUrl(photoUrl);
            onExpired?.();
          }}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden={alt ? undefined : true}>{initials(name)}</span>
      )}
    </span>
  );
}
