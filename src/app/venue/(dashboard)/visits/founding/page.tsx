import {
  FoundingVenueScreen,
  venuePageMetadata,
} from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("visits");

export default function Page() {
  return <FoundingVenueScreen />;
}
