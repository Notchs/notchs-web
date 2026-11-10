import { content } from "../content";
import type { VenueProfile } from "../types";

const { errors, completeness: labels } = content.venuePage;

export const VENUE_PAGE_LIMITS = {
  tagline: 60,
  description: 280,
  gallery: 9,
  minGalleryForComplete: 6,
  minDescriptionForComplete: 80,
} as const;

export type ProfileField =
  | "name"
  | "tagline"
  | "description"
  | "menuUrl"
  | "websiteUrl"
  | "instagram"
  | "phone"
  | "address";

const isHttpUrl = (value: string) => /^https?:\/\/\S+\.\S+/.test(value);

export function profileErrors(profile: VenueProfile) {
  const found: Partial<Record<ProfileField, string>> = {};
  if (!profile.name.trim()) found.name = errors.name;
  if (profile.tagline.length > VENUE_PAGE_LIMITS.tagline)
    found.tagline = errors.tagline;
  if (profile.description.length > VENUE_PAGE_LIMITS.description)
    found.description = errors.description;
  if (profile.menuUrl && !isHttpUrl(profile.menuUrl))
    found.menuUrl = errors.url;
  if (profile.websiteUrl && !isHttpUrl(profile.websiteUrl))
    found.websiteUrl = errors.url;
  if (profile.instagram && !/^[a-z0-9._]{1,30}$/i.test(profile.instagram))
    found.instagram = errors.instagram;
  // Optional; the place's own number as it likes to write it (a landline is fine).
  if (profile.phone.trim() && !/^[0-9+() -]{6,20}$/.test(profile.phone.trim()))
    found.phone = errors.phone;
  if (!profile.address.trim()) found.address = errors.address;
  return found;
}

export function profileCompleteness(profile: VenueProfile) {
  const items = [
    { label: labels.logo, done: profile.hasLogo },
    { label: labels.cover, done: profile.hasCover },
    {
      label: labels.photos,
      done: profile.galleryCount >= VENUE_PAGE_LIMITS.minGalleryForComplete,
    },
    { label: labels.tagline, done: Boolean(profile.tagline) },
    {
      label: labels.description,
      done:
        profile.description.length >=
        VENUE_PAGE_LIMITS.minDescriptionForComplete,
    },
    { label: labels.menu, done: Boolean(profile.menuUrl) },
    { label: labels.instagram, done: Boolean(profile.instagram) },
    { label: labels.amenities, done: profile.amenities.length > 0 },
    { label: labels.hours, done: profile.hours.some((day) => !day.closed) },
    { label: labels.video, done: profile.hasVideo },
  ];
  const done = items.filter((item) => item.done).length;
  return {
    missing: items.filter((item) => !item.done).map((item) => item.label),
    percent: Math.round((done / items.length) * 100),
  };
}
