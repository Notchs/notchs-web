import type { ReactNode } from "react";

import { adminMetadata } from "@/modules/admin";

export const metadata = adminMetadata;

/** Login and set-password stand alone; the panel pages add the shell in (panel). */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
