import { AdminSettings, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("settings");

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
