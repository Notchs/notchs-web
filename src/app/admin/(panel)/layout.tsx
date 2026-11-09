import type { ReactNode } from "react";

import { AdminGate, AdminShell } from "@/modules/admin";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
