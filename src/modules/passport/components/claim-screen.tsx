import Link from "next/link";

import { routes } from "@/config/routes";
import { ArrowLeftIcon } from "@/shared/components/icons";

import { claimsContent as copy } from "../content";
import { ClaimCard } from "./claim-card";

/** "Missed a Notch?": claim a visit with a bill photo, and earlier claims. */
export function ClaimScreen() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <Link
        href={routes.passportNotchs}
        className="inline-flex min-h-11 items-center gap-2 self-start text-[.9375rem] font-semibold text-muted hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4.5" />
        {copy.back}
      </Link>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[2rem] font-extrabold tracking-[-.03em] sm:text-5xl">
          {copy.title}
        </h1>
        <p className="text-[.9375rem] leading-normal text-muted">{copy.body}</p>
      </div>
      <ClaimCard />
    </div>
  );
}
