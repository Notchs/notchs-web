import { AdminSectionPage, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("customers");

export default function AdminCustomersPage() {
  return <AdminSectionPage section="customers" />;
}
