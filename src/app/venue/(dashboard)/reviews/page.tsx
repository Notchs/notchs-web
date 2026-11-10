import { ReviewsScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("reviews");

export default function Page() {
  return <ReviewsScreen />;
}
