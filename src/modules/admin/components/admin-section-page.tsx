import { adminSectionByKey, type AdminSectionKey } from "../content";
import { AdminPageHeader } from "./admin-page-header";
import { PendingApiNotice } from "./pending-api-notice";

/** A section page before its API exists: title, description, empty state. */
export function AdminSectionPage({ section }: { section: AdminSectionKey }) {
  const { label, description } = adminSectionByKey(section);
  return (
    <>
      <AdminPageHeader title={label} description={description} />
      <PendingApiNotice section={section} />
    </>
  );
}
