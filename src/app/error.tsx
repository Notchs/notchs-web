"use client";

import { useEffect } from "react";

import { GhostMark } from "@/shared/components/brand/status-marks";
import { StatusPage } from "@/shared/components/status-page";
import { Button } from "@/shared/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      kicker="Error"
      title="Something went wrong."
      description="An unexpected error occurred. Please try again."
      mark={<GhostMark />}
      action={<Button onClick={retry}>Try again</Button>}
    />
  );
}
