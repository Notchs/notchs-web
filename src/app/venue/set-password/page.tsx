import { routes } from "@/config/routes";
import {
  VenueSetPasswordPage,
  setPasswordMetadata,
} from "@/modules/venue-auth";
import { isVenueDashboardAvailable } from "@/modules/venue-dashboard";

export const metadata = setPasswordMetadata;

export default function VenueSetPassword() {
  return (
    <VenueSetPasswordPage
      dashboardHref={isVenueDashboardAvailable() ? routes.venueHome : undefined}
    />
  );
}
