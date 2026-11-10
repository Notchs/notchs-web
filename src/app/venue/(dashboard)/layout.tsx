import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { routes } from "@/config/routes";
import {
  VenueShell,
  isVenueDashboardAvailable,
} from "@/modules/venue-dashboard";

export default function VenueDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // While the live build can't show it, the login page is the venue homepage.
  if (!isVenueDashboardAvailable()) redirect(routes.venueLogin);
  return <VenueShell>{children}</VenueShell>;
}
