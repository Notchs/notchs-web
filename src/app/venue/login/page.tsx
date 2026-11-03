import { routes } from "@/config/routes";
import { VenueLoginPage, venueLoginMetadata } from "@/modules/venue-auth";
import { isVenueDashboardAvailable } from "@/modules/venue-dashboard";

export const metadata = venueLoginMetadata;

export default function VenueLogin() {
  return (
    <VenueLoginPage
      dashboardHref={isVenueDashboardAvailable() ? routes.venueHome : undefined}
    />
  );
}
