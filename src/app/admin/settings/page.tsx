import { AdminSectionPage, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("settings");

export default function AdminSettingsPage() {
  return <AdminSectionPage section="settings" />;
}
