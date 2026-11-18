"use client";

import { useId, useRef, useState, type FormEvent } from "react";

import { routes } from "@/config/routes";
import { chooseTheme } from "@/shared/components/layout/theme-toggle";
import { Button } from "@/shared/components/ui/button";

import { profileContent as copy, shellContent } from "../content";
import {
  errorMessage,
  getAreas,
  getMe,
  logOut,
  updateMe,
  type MeUpdate,
  type Theme,
} from "../lib/api";
import { monthYear } from "../lib/format";
import { useLoad } from "../lib/use-load";
import { BirthdayCard } from "./birthday-card";
import { DeleteAccountCard } from "./delete-account";
import { InactivityNote } from "./inactivity-note";
import { InviteCard } from "./invite-card";
import { useMe } from "./me-context";
import { PhoneCard } from "./phone-change";
import { PhotoEditor } from "./photo-editor";
import { LoadError, Loading } from "./states";
import { TotalsGrid } from "./totals-grid";
import { fieldClass, PillButton, Section, Switch, Tabs } from "./ui";
import { VisibilitySwitch } from "./visibility-switch";

const labelClass =
  "flex flex-col gap-1.5 text-[.8125rem] font-semibold text-muted";

/** Picture, name, where they are, how long they've been here, and totals. */
function ProfileHeader({ onExpired }: { onExpired: () => void }) {
  const { me } = useMe();
  const location = copy.location(me.city?.name ?? null, me.area?.name ?? null);
  const details = [
    `@${me.handle}`,
    location,
    copy.memberSince(monthYear(me.member_since)),
    me.founding_member_no ? copy.foundingMember(me.founding_member_no) : null,
  ].filter(Boolean);

  return (
    <section className="flex flex-col gap-5">
      <PhotoEditor onExpired={onExpired} />
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-3.5 text-xs font-semibold tracking-[.18em] text-muted uppercase before:h-px before:w-8 before:bg-current">
          {copy.kicker}
        </p>
        <h1 className="font-display text-[2rem] leading-[1.05] font-extrabold tracking-[-.03em] break-words md:text-5xl">
          {me.name ?? copy.noName}
        </h1>
        <p className="text-[.9375rem] text-muted">{details.join(" · ")}</p>
      </div>
      <div className="rounded-[24px] bg-panel px-5 py-5 text-paper md:px-6">
        <TotalsGrid totals={me.totals} compact />
      </div>
    </section>
  );
}

/** Their Instagram, and whether venues may see it (PATCHed straight away). */
function InstagramCard() {
  const { me, setMe } = useMe();
  const titleId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handle = me.instagram_handle;

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      setMe(
        await updateMe({
          show_instagram_to_venues: !me.show_instagram_to_venues,
        }),
      );
    } catch (caught) {
      setError(errorMessage(caught, copy.showInstagramFailed));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Section title={copy.instagramTitle}>
      <p className="font-semibold">
        {handle ? `@${handle}` : copy.instagramNone}
      </p>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span id={titleId} className="text-[.9375rem] font-bold">
            {copy.showInstagram}
          </span>
          <span className="text-[.8125rem] text-muted">
            {copy.showInstagramNote}
          </span>
        </div>
        <Switch
          checked={Boolean(handle) && me.show_instagram_to_venues}
          aria-labelledby={titleId}
          onClick={toggle}
          disabled={busy || !handle}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}
    </Section>
  );
}

/** Name, area, Instagram and theme. Sends only what changed. */
function EditProfileForm() {
  const { me, setMe } = useMe();
  const [name, setName] = useState(me.name ?? "");
  const [areaId, setAreaId] = useState(me.area?.id ?? "");
  const [instagram, setInstagram] = useState(me.instagram_handle ?? "");
  const [theme, setTheme] = useState<Theme>(me.theme);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const cityId = me.city?.id;
  const areas = useLoad(
    () => (cityId ? getAreas(cityId) : Promise.resolve([])),
    cityId,
  );

  function changes(): MeUpdate {
    const update: MeUpdate = {};
    const cleanName = name.trim();
    if (cleanName && cleanName !== (me.name ?? "")) update.name = cleanName;
    if (areaId && areaId !== (me.area?.id ?? "")) update.area_id = areaId;
    if (theme !== me.theme) update.theme = theme;
    const handle = instagram.trim().replace(/^@/, "");
    if (handle.toLowerCase() !== (me.instagram_handle ?? ""))
      update.instagram_handle = handle || null;
    return update;
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const update = changes();
    if (Object.keys(update).length === 0) {
      setStatus(copy.edit.nothingChanged);
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      const updated = await updateMe(update);
      setMe(updated);
      setInstagram(updated.instagram_handle ?? "");
      if (update.theme) chooseTheme(updated.theme);
      setStatus(copy.saved);
    } catch (caught) {
      setStatus(errorMessage(caught, copy.saveFailed));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section title={copy.edit.title}>
      <form onSubmit={save} className="flex flex-col gap-4">
        <label className={labelClass}>
          {copy.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            maxLength={80}
            className={fieldClass}
          />
        </label>
        {cityId && (
          <label className={labelClass}>
            {copy.area(me.city?.name ?? null)}
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className={fieldClass}
            >
              {!me.area && <option value="">{copy.chooseArea}</option>}
              {(areas.data ?? []).map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={labelClass}>
          {copy.instagram}
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder={copy.instagramPlaceholder}
            autoCapitalize="none"
            spellCheck={false}
            maxLength={31}
            className={fieldClass}
          />
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="text-[.8125rem] font-semibold text-muted">
            {copy.edit.theme}
          </span>
          <Tabs
            label={copy.edit.theme}
            options={(["light", "dark"] as const).map((value) => ({
              value,
              label: copy.edit.themes[value],
            }))}
            value={theme}
            onChange={setTheme}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={saving} className="w-auto" size="sm">
            {saving ? copy.saving : copy.save}
          </Button>
          <p role="status" className="text-sm text-muted">
            {status}
          </p>
        </div>
      </form>
    </Section>
  );
}

/**
 * The customer's profile. It loads /me again whenever it opens: the picture
 * link only works for 15 minutes, so it's never kept.
 */
export function ProfileScreen() {
  const { setMe } = useMe();
  const fresh = useLoad(
    () =>
      getMe().then((me) => {
        setMe(me);
        return me;
      }),
    "profile",
  );
  // A picture that stops loading gets one fresh link per visit.
  const refreshed = useRef(false);
  const [leaving, setLeaving] = useState(false);

  function photoExpired() {
    if (refreshed.current) return;
    refreshed.current = true;
    fresh.reload();
  }

  async function leave() {
    setLeaving(true);
    await logOut().catch(() => {});
    window.location.assign(routes.login);
  }

  if (!fresh.data) {
    return fresh.error ? <LoadError onRetry={fresh.reload} /> : <Loading />;
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="flex min-w-0 flex-col gap-5">
        <ProfileHeader onExpired={photoExpired} />
        <InactivityNote />
        <PhoneCard />
        <InstagramCard />
        <BirthdayCard />
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <EditProfileForm />
        <InviteCard />
        <VisibilitySwitch />
        <PillButton onClick={leave} disabled={leaving}>
          {leaving ? shellContent.loggingOut : shellContent.logOut}
        </PillButton>
        <DeleteAccountCard />
      </div>
    </div>
  );
}
