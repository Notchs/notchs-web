"use client";

import { venueRoutes } from "@/config/routes";

import { content, pageTitles } from "../../content";
import { useToast } from "../../hooks/use-toast";
import { useVenueDraft } from "../../hooks/use-venue-draft";
import type { DayHours, PublicStats, VenueProfile } from "../../types";
import { CityMapArt } from "../discover/city-map-art";
import { VenuePage } from "../shell/venue-page";
import { Badge } from "../ui/badges";
import { Button, ButtonLink } from "../ui/button";
import { Card, Grid, Overline, SectionHead, SideGrid } from "../ui/card";
import { Chip, SelectField, TextField, Toggle } from "../ui/controls";
import { Icon } from "../ui/icon";
import { ErrorState, PageSkeleton } from "../ui/states";
import { PublicVenuePreview } from "./public-venue-preview";
import { SaveBar } from "./save-bar";

const copy = content.venuePage.profileEditor;

export function ProfileScreen() {
  const { profile, stats, options, error, retry } = useVenueDraft();
  return (
    <VenuePage title={pageTitles.profile} scenarioPage="venue-page">
      {error ? (
        <ErrorState onRetry={retry} />
      ) : !profile || !stats || !options ? (
        <PageSkeleton />
      ) : (
        <>
          <SideGrid>
            <ProfileForm
              profile={profile}
              stats={stats}
              categories={options.categories}
              categoryEditable={options.categoryEditable}
              areaOptions={options.areaOptions}
              amenityOptions={options.amenityOptions}
            />
            <div className="flex min-w-0 flex-col gap-3 self-start wide:sticky wide:top-0">
              <Overline>{copy.preview}</Overline>
              <Card className="overflow-hidden p-0">
                <PublicVenuePreview profile={profile} stats={stats} />
              </Card>
              <ButtonLink
                variant="text"
                iconRight="arrowR"
                href={venueRoutes.content}
                className="self-start"
              >
                {copy.photosLink}
              </ButtonLink>
            </div>
          </SideGrid>
          <SaveBar />
        </>
      )}
    </VenuePage>
  );
}

function ProfileForm({
  profile,
  stats,
  categories,
  categoryEditable,
  areaOptions,
  amenityOptions,
}: {
  profile: VenueProfile;
  stats: PublicStats;
  categories: string[];
  categoryEditable: boolean;
  areaOptions: string[];
  amenityOptions: string[];
}) {
  const { update, errors } = useVenueDraft();
  const toast = useToast();

  const setDay = (index: number, changes: Partial<DayHours>) =>
    update({
      hours: profile.hours.map((day, i) =>
        i === index ? { ...day, ...changes } : day,
      ),
    });

  const timeInput =
    "h-10 w-[120px] rounded-[10px] bg-card px-3 text-[15px] shadow-[inset_0_0_0_1px_rgb(15_15_20/0.16)] outline-none focus:shadow-[inset_0_0_0_2px_var(--ink)]";

  return (
    <div className="flex min-w-0 flex-col gap-5">
      <Card className="gap-4">
        <SectionHead title={copy.identity}>
          <Badge tone="line">
            <Icon name="shield" size={12} />
            {copy.reviewed}
          </Badge>
        </SectionHead>
        <Grid columns={2}>
          <TextField
            label={copy.name}
            error={errors.name}
            value={profile.name}
            onChange={(event) => update({ name: event.target.value })}
          />
          <SelectField
            label={copy.category}
            options={categories}
            value={profile.category}
            disabled={!categoryEditable}
            title={categoryEditable ? undefined : copy.categoryLocked}
            onChange={(event) => update({ category: event.target.value })}
          />
        </Grid>
      </Card>

      <Card className="gap-4">
        <SectionHead title={copy.location} />
        <TextField
          label={copy.address}
          error={errors.address}
          value={profile.address}
          onChange={(event) => update({ address: event.target.value })}
        />
        <Grid columns={2}>
          <SelectField
            label={copy.area}
            options={["", ...areaOptions]}
            value={profile.area}
            onChange={(event) => update({ area: event.target.value })}
          />
          <TextField
            label={copy.city}
            hint={copy.cityHint}
            value={profile.city}
            disabled
          />
        </Grid>
        <div className="relative min-h-45 overflow-hidden rounded-[14px] border border-line bg-[#e9e6db]">
          <CityMapArt />
          <span className="absolute top-[56%] left-[46%] z-2 flex -translate-x-1/2 -translate-y-full flex-col items-center after:h-2 after:w-0.5 after:bg-ink">
            <b className="flex items-center gap-1.5 rounded-lg bg-ink px-2 py-[5px] text-xs font-semibold whitespace-nowrap text-paper">
              <Icon name="pin" size={12} />
              {profile.name || copy.yourVenue}
            </b>
          </span>
          <span className="absolute bottom-2 left-2.5 z-3 rounded bg-white/75 px-1.5 py-0.5 font-mono text-[10px] text-muted uppercase">
            {copy.mapAttribution}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" icon="target" onClick={() => toast(copy.pinToast)}>
            {copy.adjustPin}
          </Button>
          <span className="font-mono text-xs text-muted">
            {stats.coordinates}
          </span>
        </div>
      </Card>

      <Card>
        <SectionHead title={copy.hours}>
          <span className="text-[13px] text-muted">{copy.timezone}</span>
        </SectionHead>
        {profile.hours.map((day, index) => {
          const name = copy.days[index];
          return (
            <div
              key={name}
              className="flex min-h-[46px] flex-wrap items-center gap-2"
            >
              <b className="w-10 text-sm">{name}</b>
              {day.closed ? (
                <span className="flex-1 text-sm text-muted">{copy.closed}</span>
              ) : (
                <>
                  <input
                    type="time"
                    aria-label={copy.opens(name)}
                    value={day.opens}
                    onChange={(event) =>
                      setDay(index, { opens: event.target.value })
                    }
                    className={timeInput}
                  />
                  <span className="text-muted">{copy.to}</span>
                  <input
                    type="time"
                    aria-label={copy.closes(name)}
                    value={day.closes}
                    onChange={(event) =>
                      setDay(index, { closes: event.target.value })
                    }
                    className={timeInput}
                  />
                  <span className="flex-1" />
                </>
              )}
              <Toggle
                label={copy.openOn(name)}
                checked={!day.closed}
                onChange={(open) => setDay(index, { closed: !open })}
              />
            </div>
          );
        })}
      </Card>

      <Card className="gap-4">
        <SectionHead title={copy.contact} />
        <TextField
          label={copy.phone}
          hint={copy.phoneHint}
          error={errors.phone}
          value={profile.phone}
          onChange={(event) => update({ phone: event.target.value })}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">{copy.amenities}</span>
          <div className="flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => {
              const selected = profile.amenities.includes(amenity);
              return (
                <Chip
                  key={amenity}
                  selected={selected}
                  onClick={() =>
                    update({
                      amenities: selected
                        ? profile.amenities.filter((item) => item !== amenity)
                        : [...profile.amenities, amenity],
                    })
                  }
                >
                  {amenity}
                </Chip>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="flex-row items-center gap-4">
        <span className="min-w-0 flex-1">
          <b className="block">{copy.discover}</b>
          <span className="text-sm text-muted">
            {profile.visibleOnDiscover ? copy.visible : copy.hidden}
          </span>
        </span>
        <Toggle
          label={copy.discover}
          checked={profile.visibleOnDiscover}
          onChange={(visibleOnDiscover) => update({ visibleOnDiscover })}
        />
      </Card>
    </div>
  );
}
