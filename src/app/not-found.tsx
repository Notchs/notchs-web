import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { StatusScreen } from "@/shared/components/status-screen";
import { buttonStyles } from "@/shared/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <StatusScreen
      title="Page not found"
      description="The page you are looking for does not exist or has been moved."
    >
      <Link href={routes.home} className={buttonStyles()}>
        Back to home
      </Link>
    </StatusScreen>
  );
}
