import {
  VenueSetPasswordPage,
  setPasswordMetadata,
} from "@/modules/venue-auth";

export const metadata = setPasswordMetadata;

export default function VenueSetPassword() {
  return <VenueSetPasswordPage />;
}
