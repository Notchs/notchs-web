"use client";

import { venueRoutes } from "@/config/routes";

import { content } from "../../content";
import { useDateRange } from "../../hooks/use-date-range";
import { useSession } from "../../hooks/use-session";
import { useVenueDraft } from "../../hooks/use-venue-draft";
import { formatNumber } from "../../lib/format";
import { profileCompleteness } from "../../lib/venue-profile";
import type { DiscoverResponse } from "../../types";
import { ExampleTag, Meter } from "../ui/badges";
import { ButtonLink } from "../ui/button";
import { Card, SectionHead, SideGrid } from "../ui/card";
import { Icon } from "../ui/icon";
import {
  PhoneFrame,
  PublicVenuePreview,
} from "../venue-page/public-venue-preview";

const copy = content.discover;

export function DiscoverPreviewTab({ data }: { data: DiscoverResponse }) {
  const { profile, stats } = useVenueDraft();
  const { range } = useDateRange();
  const rangeLabel = useSession().data?.ranges.find(
    (item) => item.key === range,
  )?.label;
  if (!profile || !stats) return null;
  const completeness = profileCompleteness(profile);
  return (
    <SideGrid side="left">
      <PhoneFrame>
        <div className="px-3 pt-3">
          <div className="flex h-9 items-center gap-2 rounded-[10px] bg-card px-3 shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)]">
            <Icon name="search" size={14} />
            <span className="text-[13px] text-muted">{copy.previewSearch}</span>
          </div>
        </div>
        <div className="pt-2">
          <PublicVenuePreview profile={profile} stats={stats} />
        </div>
      </PhoneFrame>
      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <SectionHead title={copy.whereTitle}>
            <span className="text-xs text-muted">{rangeLabel}</span>
          </SectionHead>
          <div className="flex flex-col divide-y divide-line">
            {data.sources.map((source) => (
              <div key={source.label} className="flex py-2.5 text-sm">
                <span className="flex-1">{source.label}</span>
                <span className="font-mono">{formatNumber(source.value)}</span>
              </div>
            ))}
          </div>
          <span className="self-start">
            <ExampleTag />
          </span>
        </Card>
        <Card>
          <SectionHead title={copy.improveTitle}>
            <span className="font-mono text-[13px]">
              {completeness.percent}%
            </span>
          </SectionHead>
          <Meter percent={completeness.percent} />
          {completeness.missing.slice(0, 4).map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm">
              <Icon name="plus" size={14} />
              {item}
            </span>
          ))}
          <ButtonLink
            variant="dark"
            size="sm"
            iconRight="arrowR"
            href={venueRoutes.content}
            className="self-start"
          >
            {copy.editContent}
          </ButtonLink>
        </Card>
      </div>
    </SideGrid>
  );
}
