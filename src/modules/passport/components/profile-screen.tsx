"use client";

import { useState, type FormEvent } from "react";

import { routes } from "@/config/routes";
import { Button } from "@/shared/components/ui/button";

import { profileContent as copy, shellContent } from "../content";
import { getAreas, logOut, updateMe } from "../lib/api";
import { useLoad } from "../lib/use-load";
import { useMe } from "./me-context";
import { VisibilitySwitch } from "./visibility-switch";

const fieldStyles =
  "min-h-12 rounded-xl border border-line bg-background px-3 text-[.9375rem] text-foreground";

/** Name, area and Instagram, the leaderboard switch, and log out. */
export function ProfileScreen() {
  const { me, setMe } = useMe();
  const [name, setName] = useState(me.name ?? "");
  const [areaId, setAreaId] = useState(me.area?.id ?? "");
  const [instagram, setInstagram] = useState(me.instagram_handle ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">(
    "idle",
  );
  const [leaving, setLeaving] = useState(false);
  const cityId = me.city?.id;
  const areas = useLoad(
    () => (cityId ? getAreas(cityId) : Promise.resolve([])),
    cityId,
  );

  async function save(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    try {
      const updated = await updateMe({
        name: name.trim() || null,
        area_id: areaId || null,
        instagram_handle: instagram.trim().replace(/^@/, "") || null,
      });
      setMe(updated);
      setStatus("saved");
    } catch {
      setStatus("failed");
    }
  }

  async function leave() {
    setLeaving(true);
    await logOut().catch(() => {});
    window.location.assign(routes.login);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <h1 className="font-display text-[2rem] font-extrabold tracking-[-.03em] md:text-5xl">
        {copy.title}
      </h1>

      <form
        onSubmit={save}
        className="flex flex-col gap-4 rounded-[20px] border border-line bg-card p-4 md:p-6"
      >
        <label className="flex flex-col gap-1.5 text-[.8125rem] font-semibold text-muted">
          {copy.name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={80}
            className={fieldStyles}
          />
        </label>
        {cityId && (
          <label className="flex flex-col gap-1.5 text-[.8125rem] font-semibold text-muted">
            {copy.area(me.city?.name ?? null)}
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className={fieldStyles}
            >
              <option value="">{copy.chooseArea}</option>
              {(areas.data ?? []).map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-[.8125rem] font-semibold text-muted">
          {copy.instagram}
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder={copy.instagramPlaceholder}
            autoCapitalize="none"
            spellCheck={false}
            maxLength={31}
            className={fieldStyles}
          />
        </label>
        <p className="text-[.8125rem] text-muted">{copy.phoneNote}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="submit"
            disabled={status === "saving"}
            className="w-auto"
            size="sm"
          >
            {status === "saving" ? copy.saving : copy.save}
          </Button>
          <p role="status" className="text-sm text-muted">
            {status === "saved"
              ? copy.saved
              : status === "failed"
                ? copy.saveFailed
                : null}
          </p>
        </div>
      </form>

      <VisibilitySwitch />

      <button
        type="button"
        onClick={leave}
        disabled={leaving}
        className="min-h-13 cursor-pointer rounded-full border-[1.5px] border-foreground font-bold disabled:cursor-default disabled:opacity-60"
      >
        {leaving ? shellContent.loggingOut : shellContent.logOut}
      </button>
    </div>
  );
}
