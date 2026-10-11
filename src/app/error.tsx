"use client";

import { useEffect } from "react";

import { StatusScreen } from "@/shared/components/status-screen";
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
    <StatusScreen
      title="Something went wrong"
      description="An unexpected error occurred. Please try again."
    >
      <Button onClick={retry}>Try again</Button>
    </StatusScreen>
  );
}
