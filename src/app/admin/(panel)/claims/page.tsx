import { AdminClaims, adminSectionMetadata } from "@/modules/admin";

export const metadata = adminSectionMetadata("claims");

export default function AdminClaimsPage() {
  return <AdminClaims />;
}
