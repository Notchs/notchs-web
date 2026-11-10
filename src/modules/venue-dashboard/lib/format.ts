const TIME_ZONE = "Asia/Kolkata";
const DAY_MS = 86_400_000;

export const formatNumber = (value: number) => value.toLocaleString("en-IN");

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export const percentChange = (current: number, previous: number) =>
  previous ? Math.round(((current - previous) / previous) * 100) : 0;

/** "—" for an empty or unreadable time (e.g. a counter that never checked in). */
export const formatTime = (iso: string) =>
  !iso || Number.isNaN(Date.parse(iso))
    ? "—"
    : new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TIME_ZONE,
      });

export const formatTimeSeconds = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { timeZone: TIME_ZONE });

export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: TIME_ZONE,
  });

const istDayStart = (iso: string) => {
  const day = new Date(iso).toLocaleDateString("en-CA", {
    timeZone: TIME_ZONE,
  });
  return Date.parse(`${day}T00:00:00+05:30`);
};

export const daysBetween = (fromIso: string, toIso: string) =>
  Math.round((istDayStart(toIso) - istDayStart(fromIso)) / DAY_MS);

/** "Today 15:20" on the day itself, otherwise "Fri 30 Oct". */
export function formatRecentDay(iso: string, asOf: string) {
  if (daysBetween(iso, asOf) === 0) return `Today ${formatTime(iso)}`;
  return new Date(iso)
    .toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: TIME_ZONE,
    })
    .replace(",", "");
}

/** "1 Oct – 31 Dec" for two ISO dates. */
export function formatWindow(start: string | null, end: string | null) {
  if (!start || !end) return null;
  const label = (date: string) =>
    new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: TIME_ZONE,
    });
  return `${label(start)} – ${label(end)}`;
}
