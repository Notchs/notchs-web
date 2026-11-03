import type { ReactNode } from "react";

import { content } from "../../content";
import type { PublicStats, VenueProfile } from "../../types";
import { Badge } from "../ui/badges";
import { Icon } from "../ui/icon";

const copy = content.venuePage.preview;
const GALLERY_SHADES = ["bg-[#2a2a33]", "bg-[#35353f]", "bg-[#1f1f26]"];
const TODAY_INDEX = 6;

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto h-155 w-75 max-w-full flex-none rounded-[32px] bg-black p-2">
      <div className="h-full overflow-y-auto rounded-[25px] bg-paper">
        {children}
      </div>
    </div>
  );
}

/** The public venue page, as guests will see the current edits. */
export function PublicVenuePreview({
  profile,
  stats,
}: {
  profile: VenueProfile;
  stats: PublicStats;
}) {
  const today = profile.hours[TODAY_INDEX];
  const openLabel = today.closed ? copy.closed : copy.open(today.closes);
  return (
    <div className="flex flex-col bg-background">
      <div className="relative h-30 bg-graphite">
        {profile.hasCover ? (
          <span className="absolute inset-0 bg-[repeating-linear-gradient(120deg,#2a2a33_0_18px,#24242c_18px_36px)]" />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-xs text-stone-light">
            {copy.noCover}
          </span>
        )}
      </div>
      <div className="relative -mt-7 flex flex-col gap-3 px-4 pb-4">
        <div className="flex items-end gap-3">
          <span className="grid size-16 place-items-center rounded-2xl bg-ink font-display text-[22px] text-paper shadow-[0_0_0_3px_var(--paper)]">
            {profile.hasLogo ? (
              (profile.name || "?")[0]
            ) : (
              <Icon name="camera" />
            )}
          </span>
          <Badge tone="ink" className="ml-auto">
            <Icon name="award" size={12} />
            {stats.foundingBadge}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <b className="font-display text-xl leading-[1.15]">
            {profile.name || copy.placeholderName}
          </b>
          <span className="text-[13px] text-muted">
            {profile.category} · {profile.area} · {openLabel}
          </span>
        </div>
        {profile.tagline && (
          <span className="text-sm font-semibold">{profile.tagline}</span>
        )}
        <div className="flex border-y border-line py-2.5 text-center">
          {[
            [stats.visitsLabel, copy.visits],
            [stats.ratingLabel, copy.rating],
            [stats.rankLabel, copy.rank],
          ].map(([value, label]) => (
            <span key={label} className="flex flex-1 flex-col">
              <b className="font-display text-base">{value}</b>
              <span className="text-[11px] text-muted">{label}</span>
            </span>
          ))}
        </div>
        {profile.description && (
          <span className="text-[13px] leading-normal text-muted">
            {profile.description}
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-ink px-3.5 text-[15px] font-semibold text-paper">
            <Icon name="pin" size={16} />
            {copy.directions}
          </span>
          {profile.menuUrl && (
            <span className="inline-flex h-10 items-center rounded-[10px] px-3.5 text-[15px] font-semibold shadow-[inset_0_0_0_1.5px_rgb(15_15_20/0.16)]">
              {copy.menu}
            </span>
          )}
          {profile.instagram && (
            <Badge tone="line" className="font-mono text-[11px] font-medium">
              @{profile.instagram}
            </Badge>
          )}
        </div>
        {profile.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.amenities.map((amenity) => (
              <Badge key={amenity}>{amenity}</Badge>
            ))}
          </div>
        )}
      </div>
      {profile.hasVideo && (
        <div className="mx-4 mb-3 grid h-[90px] place-items-center rounded-xl bg-graphite text-paper">
          <Icon name="video" size={24} />
        </div>
      )}
      <div className="grid grid-cols-3 gap-0.5">
        {Array.from({ length: profile.galleryCount }, (_, index) => (
          <i
            key={index}
            className={`block aspect-square ${GALLERY_SHADES[index % 3]}`}
          />
        ))}
      </div>
    </div>
  );
}
