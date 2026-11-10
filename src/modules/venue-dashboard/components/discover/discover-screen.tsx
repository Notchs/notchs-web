"use client";

import { useState } from "react";

import { content, pageTitles } from "../../content";
import { useDiscover } from "../../hooks/use-venue-data";
import { VenuePage } from "../shell/venue-page";
import { SegmentedTabs } from "../ui/controls";
import { QueryBoundary } from "../ui/query-boundary";
import { CityMapTab } from "./city-map-tab";
import { CityRankingTab } from "./city-ranking-tab";
import { DiscoverPreviewTab } from "./discover-preview-tab";

const copy = content.discover;
type Tab = (typeof copy.tabs)[number]["value"];

export function DiscoverScreen() {
  const query = useDiscover();
  const [tab, setTab] = useState<Tab>("map");
  return (
    <VenuePage title={pageTitles.discover} scenarioPage="discover">
      <div>
        <SegmentedTabs
          options={copy.tabs}
          value={tab}
          onChange={setTab}
          label={copy.tabsLabel}
        />
      </div>
      <QueryBoundary query={query}>
        {(data) => (
          <>
            {tab === "preview" && <DiscoverPreviewTab data={data} />}
            {tab === "map" && (
              <CityMapTab data={data} onRetry={query.refresh} />
            )}
            {tab === "ranking" && <CityRankingTab data={data} />}
          </>
        )}
      </QueryBoundary>
    </VenuePage>
  );
}
