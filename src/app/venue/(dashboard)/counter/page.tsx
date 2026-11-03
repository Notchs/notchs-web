import { CounterScreen, venuePageMetadata } from "@/modules/venue-dashboard";

export const metadata = venuePageMetadata("counter");

export default function Page() {
  return <CounterScreen />;
}
