"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

import {
  ArrowRightIcon,
  GiftIcon,
  MailIcon,
  MapPinIcon,
} from "@/shared/components/icons";
import { useTurnstile } from "@/shared/components/turnstile";
import { Button } from "@/shared/components/ui/button";
import { ApiError } from "@/shared/lib/api-client";
import { cn } from "@/shared/lib/cn";

import { flowContent } from "../content";
import {
  getApplicationDropdowns,
  sendApplicationCode,
  submitApplication,
  verifyApplicationCode,
  type DropdownOption,
} from "../lib/api";
import { errorMessage, fieldErrors } from "../lib/errors";
import {
  isEmail,
  isMobile,
  mobileDigits,
  normaliseEmail,
} from "../lib/validation";
import { CodeInput } from "./code-input";
import { Field } from "./field";
import { BackButton } from "./login-screens";
import { FormError, ScreenHeading } from "./venue-auth-shell";

const { apply: applyCopy, code: codeCopy, venue: venueCopy } = flowContent;

/** Seconds before "Send again" unlocks. */
const RESEND_WAIT = 30;

type ApplyEmailFormProps = {
  email: string;
  onEmailChange: (email: string) => void;
  onSent: () => void;
};

export function ApplyEmailForm({
  email,
  onEmailChange,
  onSent,
}: ApplyEmailFormProps) {
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const turnstile = useTurnstile();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const address = normaliseEmail(email);
    setFormError(undefined);
    if (!isEmail(address)) return setError(flowContent.emailInvalid);
    setError(undefined);
    if (!turnstile.token && !turnstile.disabled) {
      return setFormError(flowContent.checking);
    }

    setBusy(true);
    try {
      await sendApplicationCode(address, turnstile.token);
      onSent();
    } catch (err) {
      const field = fieldErrors(err).email;
      setError(field);
      if (!field) setFormError(errorMessage(err));
      turnstile.reset();
      setBusy(false);
    }
  }

  return (
    <>
      <ScreenHeading
        kicker={applyCopy.kicker}
        title={applyCopy.title}
        description={applyCopy.description}
      />
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field
          label={flowContent.emailLabel}
          icon={<MailIcon />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={flowContent.emailPlaceholder}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          error={error}
          hint={applyCopy.hint}
        />
        {turnstile.widget}
        <FormError message={formError} />
        <Button type="submit" disabled={busy}>
          {busy ? applyCopy.busy : applyCopy.cta}
          {!busy && <ArrowRightIcon className="size-4.5" />}
        </Button>
      </form>
    </>
  );
}

type CodeFormProps = {
  email: string;
  onBack: () => void;
  onVerified: (verificationToken: string) => void;
};

export function CodeForm({ email, onBack, onVerified }: CodeFormProps) {
  const id = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [busy, setBusy] = useState(false);
  const turnstile = useTurnstile();
  const [resendAt, setResendAt] = useState(
    () => Date.now() + RESEND_WAIT * 1000,
  );
  const [now, setNow] = useState(() => Date.now());
  const address = normaliseEmail(email);
  const secondsLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  async function verify(event: FormEvent) {
    event.preventDefault();
    if (code.length < 6) return;
    setBusy(true);
    setError(undefined);
    try {
      const response = await verifyApplicationCode(address, code);
      const token = response.data?.verification_token;
      if (!token) throw new Error("No verification token");
      onVerified(token);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  async function resend() {
    setNotice(undefined);
    if (!turnstile.token && !turnstile.disabled) {
      return setError(flowContent.checking);
    }
    setError(undefined);
    setCode("");
    setResendAt(Date.now() + RESEND_WAIT * 1000);
    setNow(Date.now());
    try {
      await sendApplicationCode(address, turnstile.token);
      setNotice(codeCopy.resent);
    } catch (err) {
      setError(errorMessage(err));
    }
    turnstile.reset();
  }

  const message = error ?? (busy ? codeCopy.busy : (notice ?? codeCopy.help));

  return (
    <>
      <ScreenHeading
        back={<BackButton label={codeCopy.back} onClick={onBack} />}
        title={codeCopy.title}
        description={
          <>
            {codeCopy.sentTo}{" "}
            <b className="font-semibold [overflow-wrap:anywhere] text-foreground">
              {address}
            </b>
            . {codeCopy.spam}
          </>
        }
      />
      <form onSubmit={verify} className="flex flex-col gap-7">
        <div className="flex flex-col gap-3">
          <label htmlFor={id} className="font-semibold">
            {codeCopy.label}
          </label>
          <CodeInput
            id={id}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError(undefined);
            }}
            invalid={Boolean(error)}
            describedBy={`${id}-message`}
          />
          <p
            id={`${id}-message`}
            role={error ? "alert" : "status"}
            className={cn(
              "leading-normal",
              error ? "text-unnotched" : "text-muted",
            )}
          >
            {message}
          </p>
        </div>
        <Button type="submit" disabled={code.length < 6 || busy}>
          {busy ? codeCopy.busy : codeCopy.cta}
        </Button>
      </form>
      {turnstile.widget}
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <span className="text-muted">{codeCopy.resendQuestion}</span>
        {secondsLeft > 0 ? (
          <span className="flex h-12 items-center font-mono text-sm text-muted uppercase">
            {codeCopy.resendIn} 0:{String(secondsLeft).padStart(2, "0")}
          </span>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="h-12 cursor-pointer font-semibold underline underline-offset-[3px]"
          >
            {codeCopy.resend}
          </button>
        )}
      </div>
    </>
  );
}

type Dropdowns = { cities: DropdownOption[]; categories: DropdownOption[] };

type VenueFormProps = {
  verificationToken: string;
  onBack: () => void;
  onApplied: (venueName: string, reference: string | undefined) => void;
};

export function VenueForm({
  verificationToken,
  onBack,
  onApplied,
}: VenueFormProps) {
  const [options, setOptions] = useState<Dropdowns | "loading" | "error">(
    "loading",
  );
  const [venueName, setVenueName] = useState("");
  const [category, setCategory] = useState("");
  const [cityId, setCityId] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [landmark, setLandmark] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string>();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [busy, setBusy] = useState(false);
  const agreeId = useId();

  /** Fetches the city and type lists; state is only set once they arrive. */
  function fetchOptions() {
    getApplicationDropdowns().then(
      (response) => {
        const cities = response.data?.cities ?? [];
        setOptions({
          cities,
          categories: response.data?.venue_categories ?? [],
        });
        if (cities[0]) setCityId((current) => current || cities[0].value);
      },
      () => setOptions("error"),
    );
  }

  function load() {
    setOptions("loading");
    fetchOptions();
  }

  useEffect(fetchOptions, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!venueName.trim()) next.venue_name = venueCopy.nameMissing;
    if (!category) next.category = venueCopy.typeMissing;
    if (!mapsUrl.trim()) next.google_maps_url = venueCopy.mapsMissing;
    if (!contactName.trim()) next.contact_name = venueCopy.ownerMissing;
    if (!isMobile(phone)) next.phone = venueCopy.phoneInvalid;
    if (!agree) next.agree = venueCopy.agreeMissing;
    setErrors(next);
    setFormError(undefined);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const response = await submitApplication({
        verification_token: verificationToken,
        venue_name: venueName.trim(),
        category,
        city_id: cityId,
        google_maps_url: mapsUrl.trim(),
        contact_name: contactName.trim(),
        phone: `+91${mobileDigits(phone)}`,
        landmark: landmark.trim() || null,
      });
      const data = response.data;
      onApplied(venueName.trim(), data?.code ?? data?.ref);
    } catch (err) {
      const fields = fieldErrors(err);
      const expired =
        "verification_token" in fields ||
        (err instanceof ApiError && err.code.includes("token"));
      setTokenExpired(expired);
      setErrors(fields);
      setFormError(expired ? venueCopy.codeExpired : errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <>
      <ScreenHeading
        kicker={venueCopy.kicker}
        title={venueCopy.title}
        description={venueCopy.description}
      />
      {options === "error" ? (
        <div className="flex flex-col gap-4">
          <FormError message={venueCopy.loadError} />
          <Button onClick={load}>{venueCopy.retry}</Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Field
            label={venueCopy.name.label}
            placeholder={venueCopy.name.placeholder}
            autoComplete="organization"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            error={errors.venue_name}
          />

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 font-semibold">{venueCopy.type}</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {options === "loading"
                ? Array.from({ length: 6 }, (_, i) => (
                    <span
                      key={i}
                      className="h-12 animate-pulse rounded-[10px] bg-block"
                    />
                  ))
                : options.categories.map((option) => (
                    <label
                      key={option.value}
                      className="flex h-12 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-card px-3 text-center text-[.9375rem] font-semibold transition-colors duration-150 has-checked:border-foreground has-checked:bg-foreground has-checked:text-background has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-foreground"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={option.value}
                        checked={category === option.value}
                        onChange={() => setCategory(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
            </div>
            {errors.category && (
              <p role="alert" className="text-[.9375rem] text-unnotched">
                {errors.category}
              </p>
            )}
          </fieldset>

          <CitySelect
            cities={typeof options === "object" ? options.cities : []}
            value={cityId}
            onChange={setCityId}
            error={errors.city_id}
          />

          <Field
            label={venueCopy.maps.label}
            icon={<MapPinIcon />}
            type="url"
            inputMode="url"
            placeholder={venueCopy.maps.placeholder}
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            error={errors.google_maps_url}
            hint={venueCopy.maps.hint}
          />
          <Field
            label={venueCopy.landmark.label}
            placeholder={venueCopy.landmark.placeholder}
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            error={errors.landmark}
          />
          <Field
            label={venueCopy.owner.label}
            placeholder={venueCopy.owner.placeholder}
            autoComplete="name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            error={errors.contact_name}
          />
          <Field
            label={venueCopy.phone.label}
            prefix="+91"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={venueCopy.phone.placeholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            hint={venueCopy.phoneHint}
          />

          <div className="flex items-start gap-3.5 rounded-[14px] border border-line bg-card p-4">
            <span className="flex size-10 flex-none items-center justify-center rounded-[7px] bg-ink text-paper">
              <GiftIcon className="size-5" />
            </span>
            <div className="flex flex-col gap-1 leading-normal">
              <b className="font-semibold">{venueCopy.offerTitle}</b>
              <span className="text-muted">{venueCopy.offerBody}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor={agreeId}
              className="flex min-h-12 cursor-pointer items-center gap-3"
            >
              <input
                id={agreeId}
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                aria-invalid={errors.agree ? true : undefined}
                className="size-5 flex-none cursor-pointer accent-foreground"
              />
              {venueCopy.agree}
            </label>
            {errors.agree && (
              <p role="alert" className="text-[.9375rem] text-unnotched">
                {errors.agree}
              </p>
            )}
          </div>

          <FormError message={formError} />
          {tokenExpired && (
            <BackButton label={codeCopy.back} onClick={onBack} />
          )}
          <Button type="submit" disabled={busy || options === "loading"}>
            {busy ? venueCopy.busy : venueCopy.cta}
          </Button>
        </form>
      )}
    </>
  );
}

type CitySelectProps = {
  cities: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

function CitySelect({ cities, value, onChange, error }: CitySelectProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold">
        {venueCopy.city}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={cities.length < 2}
        aria-describedby={`${id}-message`}
        className={cn(
          "h-13 w-full appearance-none rounded-[10px] border bg-card px-4 text-base text-foreground focus:border-foreground focus:outline-none disabled:opacity-100",
          error ? "border-unnotched" : "border-line",
        )}
      >
        {cities.map((city) => (
          <option key={city.value} value={city.value}>
            {city.label}
          </option>
        ))}
      </select>
      <p
        id={`${id}-message`}
        role={error ? "alert" : undefined}
        className={cn(
          "text-[.9375rem]",
          error ? "text-unnotched" : "text-muted",
        )}
      >
        {error ?? venueCopy.cityHint}
      </p>
    </div>
  );
}
