"use client";

import { useId, useState, type FormEvent } from "react";

import { profileContent } from "../content";
import { errorMessage, updateMe, type Age } from "../lib/api";
import { fullDate, todayInIndia } from "../lib/format";
import { useMe } from "./me-context";
import { ConfirmRow, fieldClass, PillButton, Section } from "./ui";

const copy = profileContent.birthday;

/**
 * Date of birth and age group. The API's consent words always sit next to the
 * date field, word for word: it stores exactly those words when it's saved.
 */
export function BirthdayCard() {
  const { me } = useMe();
  // An API without the age section yet (before its passport update) shows nothing.
  return me.age ? <Birthday age={me.age} /> : null;
}

function Birthday({ age }: { age: Age }) {
  const { setMe } = useMe();
  const fieldId = useId();
  const consentId = useId();
  const [editing, setEditing] = useState(false);
  const [asking, setAsking] = useState(false);
  const [value, setValue] = useState(age.birth_date ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(birthDate: string | null) {
    setBusy(true);
    setError(null);
    try {
      setMe(await updateMe({ birth_date: birthDate }));
      setEditing(false);
      setAsking(false);
    } catch (caught) {
      setError(errorMessage(caught, copy.failed));
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (value) save(value);
  }

  function open() {
    setValue(age.birth_date ?? "");
    setError(null);
    setEditing(true);
  }

  return (
    <Section title={copy.title}>
      {age.adult_confirmed_at && (
        <p className="text-sm text-muted">
          {copy.adult(fullDate(age.adult_confirmed_at))}
        </p>
      )}

      {editing ? (
        <form onSubmit={submit} className="flex flex-col gap-3">
          <label
            htmlFor={fieldId}
            className="text-[.8125rem] font-semibold text-muted"
          >
            {copy.label}
          </label>
          <input
            id={fieldId}
            type="date"
            required
            min="1900-01-01"
            max={todayInIndia()}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby={consentId}
            className={`${fieldClass} self-start`}
          />
          <p
            id={consentId}
            className="text-[.8125rem] leading-normal whitespace-pre-line text-muted"
          >
            {age.consent_text}
          </p>
          <div className="flex flex-wrap gap-2">
            <PillButton type="submit" variant="solid" disabled={busy || !value}>
              {busy ? copy.saving : copy.save}
            </PillButton>
            <PillButton onClick={() => setEditing(false)} disabled={busy}>
              {copy.cancel}
            </PillButton>
          </div>
        </form>
      ) : age.birth_date ? (
        <>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-xl font-extrabold">
              {fullDate(age.birth_date)}
            </span>
            {age.age_range && (
              <span className="text-sm text-muted">
                {copy.range(age.age_range)}
              </span>
            )}
          </p>
          {asking ? (
            <ConfirmRow
              question={copy.removeQuestion}
              confirm={copy.removeYes}
              cancel={copy.cancel}
              busy={busy}
              onConfirm={() => save(null)}
              onCancel={() => setAsking(false)}
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              <PillButton onClick={open}>{copy.edit}</PillButton>
              <PillButton variant="quiet" onClick={() => setAsking(true)}>
                {copy.remove}
              </PillButton>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-[.9375rem] text-muted">{copy.none}</p>
          <PillButton onClick={open} className="self-start">
            {copy.add}
          </PillButton>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm font-semibold">
          {error}
        </p>
      )}
    </Section>
  );
}
