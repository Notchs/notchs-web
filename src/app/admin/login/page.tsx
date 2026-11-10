import type { Metadata } from "next";

import { AdminLogin } from "@/modules/admin";

export const metadata: Metadata = {
  title: { absolute: "Log in · Notchs Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
