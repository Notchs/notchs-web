const LOCALE = "en-IN";

/** "Nov 2026" */
export const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString(LOCALE, { month: "short", year: "numeric" });

/** "8 Nov" */
export const dayMonth = (iso: string) =>
  new Date(iso).toLocaleDateString(LOCALE, { day: "numeric", month: "short" });

/** "8 Nov 2026" */
export const fullDate = (iso: string) =>
  new Date(iso).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** 1 → "1st", 2 → "2nd", 11 → "11th" */
export function ordinal(n: number) {
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] ?? "th");
  return `${n}${suffix}`;
}

/** 1 → "#0001" */
export const notchNumber = (n: number) => `#${String(n).padStart(4, "0")}`;

/** "Abhishek Sharma" → "Abhishek" */
export const firstName = (name: string | null) =>
  name?.trim().split(/\s+/)[0] || null;

/** "Abhishek Sharma" → "AS" */
export function initials(name: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "N"
  );
}

const NICHE_LABELS: Record<string, string> = {
  cafe: "Café",
  restaurant: "Restaurant",
  bar: "Bar",
  hotel: "Hotel",
  turf_gym: "Turf or gym",
  other: "Other",
};

/** The backend's niche key as a label, e.g. "turf_gym" → "Turf or gym". */
export const nicheLabel = (niche: string) =>
  NICHE_LABELS[niche] ??
  niche.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** A place's colour from the API, used only if it is a plain hex colour. */
export const safeColour = (colour: string) =>
  /^#[0-9a-f]{6}$/i.test(colour) ? colour : "#5c5c66";
