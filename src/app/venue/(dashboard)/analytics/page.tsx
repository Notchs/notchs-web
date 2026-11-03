import { AnalyticsScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("analytics");

export default function Page() {
  return <AnalyticsScreen />;
}
