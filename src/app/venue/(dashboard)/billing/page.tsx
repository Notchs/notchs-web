import { BillingScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("billing");

export default function Page() {
  return <BillingScreen />;
}
