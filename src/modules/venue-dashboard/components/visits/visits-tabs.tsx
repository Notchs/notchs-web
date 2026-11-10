import { venueRoutes } from "@/config/routes";

import { content } from "../../content";
import { LinkTabs } from "../ui/link-tabs";

const tabs = [
  { href: venueRoutes.visits, label: content.visits.tabs.log },
  { href: venueRoutes.notchCard, label: content.visits.tabs.card },
  { href: venueRoutes.foundingVenue, label: content.visits.tabs.founding },
];

export function VisitsTabs({ current }: { current: string }) {
  return (
    <LinkTabs tabs={tabs} current={current} label={content.visits.tabs.log} />
  );
}
