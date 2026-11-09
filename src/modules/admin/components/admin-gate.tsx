"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";

import { adminRoutes } from "@/config/routes";
import { ApiError } from "@/shared/lib/api-client";

import { adminContent } from "../content";
import { adminApi, type AdminMe } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";

const AdminContext = createContext<AdminMe | null>(null);

/** The logged-in admin. Only inside AdminGate. */
export function useAdmin() {
  const admin = useContext(AdminContext);
  if (!admin) throw new Error("useAdmin needs AdminGate");
  return admin;
}

/** Shows the panel only to a logged-in admin; others go to the admin login. */
export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, error, refresh } = useAdminQuery(adminApi.me);

  useEffect(() => {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      router.replace(adminRoutes.login);
    }
  }, [error, router]);

  if (error && !(error instanceof ApiError && error.status < 500)) {
    return (
      <div className="grid min-h-svh place-items-center p-6 text-center">
        <div className="grid gap-3">
          <p className="font-semibold">{adminContent.loadFailed}</p>
          <button
            type="button"
            onClick={refresh}
            className="min-h-11 cursor-pointer rounded-full border border-line px-5"
          >
            {adminContent.retry}
          </button>
        </div>
      </div>
    );
  }
  if (!data) return <div className="min-h-svh" aria-busy="true" />;
  return <AdminContext.Provider value={data}>{children}</AdminContext.Provider>;
}
