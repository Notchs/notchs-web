import { AdminDashboard, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("dashboard");

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
