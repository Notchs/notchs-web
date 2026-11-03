import { ProfileScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("profile");

export default function Page() {
  return <ProfileScreen />;
}
