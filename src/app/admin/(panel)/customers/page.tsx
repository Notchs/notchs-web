import { AdminCustomers, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("customers");

export default function AdminCustomersPage() {
  return <AdminCustomers />;
}
