"use client";

import { venueRoutes } from "@/config/routes";
import { cn } from "@/shared/lib/cn";

import { content, pageTitles } from "../../content";
import { useVenueDraft } from "../../hooks/use-venue-draft";
import { VENUE_DATA_MODE } from "../../services/config";
import {
  profileCompleteness,
  VENUE_PAGE_LIMITS,
} from "../../lib/venue-profile";
import type { VenueProfile } from "../../types";
import { VenuePage } from "../shell/venue-page";
import { Badge, Meter } from "../ui/badges";
import { Button, ButtonLink } from "../ui/button";
import { Card, Grid, Overline, SectionHead, SideGrid } from "../ui/card";
import { TextAreaField, TextField } from "../ui/controls";
import { Icon } from "../ui/icon";
import { ErrorState, PageSkeleton } from "../ui/states";
import { PhoneFrame, PublicVenuePreview } from "./public-venue-preview";
import { SaveBar } from "./save-bar";

const copy = content.venuePage.contentEditor;
const GALLERY_SHADES = ["bg-[#2a2a33]", "bg-[#35353f]", "bg-[#1f1f26]"];

export function ContentScreen() {
  const { profile, stats, error, retry } = useVenueDraft();
  return (
    <VenuePage
      title={pageTitles.content}
      scenarioPage="venue-page"
      actions={
        <span className="max-sm:hidden">
          <ButtonLink size="sm" icon="eye" href={venueRoutes.discover}>
            {copy.viewPublic}
          </ButtonLink>
        </span>
      }
    >
      {error ? (
        <ErrorState onRetry={retry} />
      ) : !profile || !stats ? (
        <PageSkeleton />
      ) : (
        <>
          <SideGrid width="400px">
            <ContentForm profile={profile} />
            <div className="flex min-w-0 flex-col gap-3 self-start wide:sticky wide:top-0">
              <Overline>{copy.livePreview}</Overline>
              <PhoneFrame>
                <PublicVenuePreview profile={profile} stats={stats} />
              </PhoneFrame>
            </div>
          </SideGrid>
          <SaveBar />
        </>
      )}
    </VenuePage>
  );
}

function ContentForm({ profile }: { profile: VenueProfile }) {
  const { update, errors } = useVenueDraft();
  const completeness = profileCompleteness(profile);
  const count = profile.galleryCount;

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <Card>
        <SectionHead title={copy.completeness}>
          <span className="font-mono text-[13px]">{completeness.percent}%</span>
        </SectionHead>
        <Meter percent={completeness.percent} />
        <div className="flex flex-wrap gap-2">
          {completeness.missing.length ? (
            completeness.missing.map((item) => (
              <Badge key={item} tone="line">
                <Icon name="plus" size={12} />
                {item}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted">{copy.complete}</span>
          )}
        </div>
      </Card>

      {/* Photos need file storage, which isn't connected yet: on real data the
          buttons would only pretend to upload. */}
      {VENUE_DATA_MODE === "mock" ? (
        <>
          <Card className="gap-4">
            <SectionHead title={copy.branding} />
            <div className="relative h-37.5 overflow-hidden rounded-[14px] bg-graphite">
              {profile.hasCover ? (
                <span className="absolute inset-0 bg-[repeating-linear-gradient(120deg,#2a2a33_0_18px,#24242c_18px_36px)]" />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[13px] text-stone-light">
                  {copy.coverHint}
                </span>
              )}
              <span className="absolute right-3 bottom-3">
                <Button
                  variant="paper"
                  size="sm"
                  icon={profile.hasCover ? "trash" : "upload"}
                  onClick={() => update({ hasCover: !profile.hasCover })}
                >
                  {profile.hasCover ? copy.removeCover : copy.uploadCover}
                </Button>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="grid size-18 flex-none place-items-center rounded-[18px] bg-ink font-display text-[26px] text-paper">
                {profile.hasLogo ? (
                  (profile.name || "?")[0]
                ) : (
                  <Icon name="camera" size={22} />
                )}
              </span>
              <span className="flex flex-col items-start gap-2">
                <Button
                  size="sm"
                  icon={profile.hasLogo ? "trash" : "upload"}
                  onClick={() => update({ hasLogo: !profile.hasLogo })}
                >
                  {profile.hasLogo ? copy.removeLogo : copy.uploadLogo}
                </Button>
                <span className="text-[13px] text-muted">{copy.logoHint}</span>
              </span>
            </div>
          </Card>

          <Card className="gap-4">
            <SectionHead title={copy.media}>
              <span className="text-[13px] text-muted">
                {copy.photoCount(count, VENUE_PAGE_LIMITS.gallery)}
              </span>
            </SectionHead>
            <div className="grid max-w-105 grid-cols-3 gap-2">
              {Array.from({ length: VENUE_PAGE_LIMITS.gallery }, (_, index) => {
                if (index < count) {
                  return (
                    <span
                      key={index}
                      className={cn(
                        "relative aspect-square rounded-[10px]",
                        GALLERY_SHADES[index % 3],
                      )}
                    >
                      <button
                        type="button"
                        aria-label={copy.removePhoto(index + 1)}
                        onClick={() => update({ galleryCount: count - 1 })}
                        className="absolute top-1 right-1 grid size-7 cursor-pointer place-items-center rounded-lg bg-paper/90 text-ink"
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </span>
                  );
                }
                if (index === count) {
                  return (
                    <button
                      key={index}
                      type="button"
                      aria-label={copy.addPhoto}
                      onClick={() => update({ galleryCount: count + 1 })}
                      className="grid aspect-square cursor-pointer place-items-center rounded-[10px] border-[1.5px] border-dashed border-ink/16 text-muted hover:bg-ink/5"
                    >
                      <Icon name="plus" />
                    </button>
                  );
                }
                return (
                  <span
                    key={index}
                    className="aspect-square rounded-[10px] border border-dashed border-line"
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-block p-3">
              <Icon name="video" />
              <span className="min-w-30 flex-1">
                <b className="block text-sm">
                  {profile.hasVideo ? copy.videoReady : copy.videoTitle}
                </b>
                <span className="text-[13px] text-muted">
                  {profile.hasVideo ? copy.videoReadyHint : copy.videoHint}
                </span>
              </span>
              <Button
                size="sm"
                onClick={() => update({ hasVideo: !profile.hasVideo })}
              >
                {profile.hasVideo ? copy.remove : copy.upload}
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card className="gap-2">
          <SectionHead title={copy.media}>
            <Badge tone="soft">{content.common.notLiveBadge}</Badge>
          </SectionHead>
          <span className="text-[15px] text-muted">{copy.mediaSoon}</span>
        </Card>
      )}

      <Card className="gap-4">
        <SectionHead title={copy.about} />
        <TextField
          label={copy.tagline}
          aside={`${profile.tagline.length} / ${VENUE_PAGE_LIMITS.tagline}`}
          error={errors.tagline}
          value={profile.tagline}
          onChange={(event) => update({ tagline: event.target.value })}
        />
        <TextAreaField
          label={copy.description}
          aside={`${profile.description.length} / ${VENUE_PAGE_LIMITS.description}`}
          error={errors.description}
          rows={4}
          value={profile.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </Card>

      <Card className="gap-4">
        <SectionHead title={copy.links} />
        <Grid columns={2}>
          <TextField
            label={copy.menu}
            aside={content.common.optional}
            placeholder="https://"
            error={errors.menuUrl}
            value={profile.menuUrl}
            onChange={(event) => update({ menuUrl: event.target.value })}
          />
          <TextField
            label={copy.website}
            aside={content.common.optional}
            placeholder="https://"
            error={errors.websiteUrl}
            value={profile.websiteUrl}
            onChange={(event) => update({ websiteUrl: event.target.value })}
          />
        </Grid>
        <TextField
          label={copy.instagram}
          aside={content.common.optional}
          hint={copy.instagramHint}
          error={errors.instagram}
          value={profile.instagram}
          onChange={(event) => update({ instagram: event.target.value })}
        />
      </Card>
    </div>
  );
}
