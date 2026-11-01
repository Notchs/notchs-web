import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  VenueShell,
  isVenueDashboardAvailable,
} from "@/modules/venue-dashboard";

export default function VenueDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (!isVenueDashboardAvailable()) notFound();
  return <VenueShell>{children}</VenueShell>;
}
