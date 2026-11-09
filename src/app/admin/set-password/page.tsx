import type { Metadata } from "next";

import { AdminSetPassword } from "@/modules/admin";

export const metadata: Metadata = {
  title: { absolute: "Set your password · Notchs Admin" },
  robots: { index: false, follow: false },
};

export default function AdminSetPasswordPage() {
  return <AdminSetPassword />;
}
