import { OverviewScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("overview");

export default function Page() {
  return <OverviewScreen />;
}
