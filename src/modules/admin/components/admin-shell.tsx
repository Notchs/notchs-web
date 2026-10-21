import type { ReactNode } from "react";

import { AdminSidebar } from "./admin-sidebar";

/** Frame of every admin page: sidebar (or top bar on phones) and content. */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="row-span-full grid min-h-svh lg:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminSidebar />
      <main className="min-w-0 px-gutter py-8 lg:py-12">
        <div className="mx-auto max-w-[72rem]">{children}</div>
      </main>
    </div>
  );
}
