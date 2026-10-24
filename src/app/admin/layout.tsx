import { AdminShell, adminMetadata } from "@/modules/admin";

export const metadata = adminMetadata;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
