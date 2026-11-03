import { SettingsScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("settings");

export default function Page() {
  return <SettingsScreen />;
}
