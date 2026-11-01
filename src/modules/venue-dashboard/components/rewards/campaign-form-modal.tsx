"use client";

import { useState } from "react";

import { content } from "../../content";
import { useAction } from "../../hooks/use-action";
import { venueData } from "../../services/venue-data.service";
import type { Campaign, CampaignInput, RewardType } from "../../types";
import { Button } from "../ui/button";
import { Chip, SelectField, TextAreaField, TextField } from "../ui/controls";
import { Grid } from "../ui/card";
import { Icon } from "../ui/icon";
import { Modal } from "../ui/modal";

const copy = content.rewards;
const form = copy.form;
const DEFAULT_LENGTH_DAYS = 29;

const isoDay = (date: Date) => date.toISOString().slice(0, 10);

function defaultWindow() {
  const start = new Date();
  const end = new Date(start);
  end.setDate(start.getDate() + DEFAULT_LENGTH_DAYS);
  return { start: isoDay(start), end: isoDay(end) };
}

export function CampaignFormModal({
  campaign,
  onClose,
  onSaved,
}: {
  campaign: Campaign | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { run, isBusy } = useAction();
  const [fallback] = useState(defaultWindow);
  const [name, setName] = useState(campaign?.name ?? "");
  const [rewardType, setRewardType] = useState<RewardType>(
    campaign?.rewardType ?? "Free item",
  );
  const [audience, setAudience] = useState(
    campaign?.audience ?? "Returning guests",
  );
  const [startsOn, setStartsOn] = useState(
    campaign?.startsOn ?? fallback.start,
  );
  const [endsOn, setEndsOn] = useState(campaign?.endsOn ?? fallback.end);
  const [perGuest, setPerGuest] = useState(campaign?.perGuest ?? "1");
  const [total, setTotal] = useState(campaign?.totalLimit?.toString() ?? "");
  const [terms, setTerms] = useState(campaign?.terms ?? "");
  const [tried, setTried] = useState(false);

  const nameError = tried && !name.trim() ? form.nameError : undefined;
  const dateError = tried && endsOn < startsOn ? form.endsError : undefined;

  const save = async (status: "Draft" | "Scheduled") => {
    setTried(true);
    if (!name.trim() || endsOn < startsOn) return;
    const input: CampaignInput = {
      id: campaign?.id,
      name: name.trim(),
      status,
      rewardType,
      audience,
      startsOn,
      endsOn,
      perGuest,
      totalLimit: total ? Number(total) : null,
      terms,
    };
    const done = await run(
      () => venueData.saveCampaign(input),
      status === "Draft" ? copy.draftSaved : copy.scheduled,
    );
    if (done) onSaved();
  };

  return (
    <Modal
      title={campaign ? form.editTitle : form.newTitle}
      closable
      onClose={onClose}
      actions={
        <>
          <Button onClick={onClose}>{content.common.cancel}</Button>
          <Button disabled={isBusy} onClick={() => save("Draft")}>
            {form.saveDraft}
          </Button>
          <Button
            variant="dark"
            disabled={isBusy}
            onClick={() => save("Scheduled")}
          >
            {form.schedule}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <TextField
          label={form.name}
          value={name}
          error={nameError}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">{form.reward}</span>
          <div className="flex flex-wrap gap-2">
            {(form.rewardTypes as readonly RewardType[]).map((type) => (
              <Chip
                key={type}
                selected={rewardType === type}
                onClick={() => setRewardType(type)}
              >
                {type}
              </Chip>
            ))}
          </div>
        </div>
        <SelectField
          label={form.audience}
          options={form.audiences}
          value={audience}
          onChange={(event) => setAudience(event.target.value)}
        />
        <Grid columns={2} className="gap-3">
          <TextField
            label={form.starts}
            type="date"
            value={startsOn}
            onChange={(event) => setStartsOn(event.target.value)}
          />
          <TextField
            label={form.ends}
            type="date"
            value={endsOn}
            error={dateError}
            onChange={(event) => setEndsOn(event.target.value)}
          />
        </Grid>
        <Grid columns={2} className="gap-3">
          <SelectField
            label={form.perGuest}
            options={form.perGuestOptions}
            value={perGuest}
            onChange={(event) => setPerGuest(event.target.value)}
          />
          <TextField
            label={form.total}
            aside={content.common.optional}
            type="number"
            min={1}
            placeholder={form.totalPlaceholder}
            value={total}
            onChange={(event) => setTotal(event.target.value)}
          />
        </Grid>
        <TextAreaField
          label={form.terms}
          aside={content.common.optional}
          rows={2}
          value={terms}
          onChange={(event) => setTerms(event.target.value)}
        />
        <span className="flex gap-1.5 text-[13px] text-muted">
          <Icon name="info" size={14} className="mt-0.5" />
          {form.note}
        </span>
      </div>
    </Modal>
  );
}
