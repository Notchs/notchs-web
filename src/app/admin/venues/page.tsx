import { AdminSectionPage, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("venues");

export default function AdminVenuesPage() {
  return <AdminSectionPage section="venues" />;
}
