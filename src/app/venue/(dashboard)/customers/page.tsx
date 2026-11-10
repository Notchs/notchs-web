import { CustomersScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("customers");

export default function Page() {
  return <CustomersScreen />;
}
