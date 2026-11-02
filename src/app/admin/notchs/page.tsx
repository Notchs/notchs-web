import { AdminSectionPage, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("notchs");

export default function AdminNotchsPage() {
  return <AdminSectionPage section="notchs" />;
}
