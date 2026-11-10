import { AdminApplications, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("applications");

export default function AdminApplicationsPage() {
  return <AdminApplications />;
}
