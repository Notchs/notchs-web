import { adminContent, adminSectionByKey } from "../content";
import { AdminPageHeader } from "./admin-page-header";
import { PendingApiNotice } from "./pending-api-notice";

/** Overview: headline numbers (empty until the API is live). */
export function AdminDashboard() {
  const { label, description } = adminSectionByKey("dashboard");

  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <ul className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminContent.stats.map((stat) => (
          <li
            key={stat.label}
            className="rounded-2xl border border-line bg-card p-5"
          >
            <p className="text-sm font-medium text-muted">{stat.label}</p>
            <p className="mt-3 font-display text-4xl leading-none font-extrabold tabular-nums">
              {adminContent.emptyValue}
            </p>
            <p className="mt-2 text-sm text-muted">{stat.hint}</p>
          </li>
        ))}
      </ul>
      <PendingApiNotice section="dashboard" />
    </>
  );
}
