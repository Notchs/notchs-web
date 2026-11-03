import { venueRoutes } from "@/config/routes";

import { content } from "../../content";
import { LinkTabs } from "../ui/link-tabs";

const tabs = [
  { href: venueRoutes.counter, label: content.counter.tabs.status },
  { href: venueRoutes.counterSigns, label: content.counter.tabs.signs },
];

export function CounterTabs({ current }: { current: string }) {
  return (
    <LinkTabs
      tabs={tabs}
      current={current}
      label={content.counter.tabs.status}
    />
  );
}
