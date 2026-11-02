import { adminContent, type AdminSectionKey } from "../content";
import { SectionIcon } from "./section-icon";

/** Empty state for a section whose backend endpoints are not live yet. */
export function PendingApiNotice({ section }: { section: AdminSectionKey }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-block text-muted">
        <SectionIcon section={section} className="size-6" />
      </span>
      <p className="font-semibold">{adminContent.pendingTitle}</p>
      <p className="max-w-[44ch] text-[.9375rem] text-muted">
        {adminContent.pendingBody}
      </p>
    </div>
  );
}
