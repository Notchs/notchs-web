"use client";

import Link from "next/link";

import { adminRoutes } from "@/config/routes";

import { adminContent, adminSectionByKey } from "../content";
import { adminApi } from "../lib/api";
import { useAdminQuery } from "../lib/use-admin-query";
import { AdminPageHeader } from "./admin-page-header";
import { LoadState } from "./admin-ui";

const copy = adminContent.dashboard;

/** Overview: real totals from the API. */
export function AdminDashboard() {
  const { label, description } = adminSectionByKey("dashboard");
  const { data, error, refresh } = useAdminQuery(adminApi.overview);

  const stats = data
    ? [
        {
          label: copy.live,
          value: data.venues_live,
          hint: copy.liveHint(data.venues_signed, data.venues_paused),
          href: adminRoutes.venues,
        },
        {
          label: copy.applications,
          value: data.applications_pending,
          hint: copy.applicationsHint,
          href: adminRoutes.applications,
        },
        {
          label: copy.customers,
          value: data.customers,
          hint: copy.customersHint(data.customers_new_7d),
          href: adminRoutes.customers,
        },
        {
          label: copy.notchs,
          value: data.notchs_today,
          hint: copy.notchsHint(data.notchs_7d, data.scans_refused_today),
          href: adminRoutes.notchs,
        },
      ]
    : [];

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      {!data ? (
        <LoadState error={error} onRetry={refresh} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label}>
              <Link
                href={stat.href}
                className="block h-full rounded-2xl border border-line bg-card p-5 hover:bg-block"
              >
                <p className="text-sm font-medium text-muted">{stat.label}</p>
                <p className="mt-3 font-display text-4xl leading-none font-extrabold tabular-nums">
                  {stat.value.toLocaleString("en-IN")}
                </p>
                <p className="mt-2 text-sm text-muted">{stat.hint}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
