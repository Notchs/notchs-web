/** Date ranges the dashboard can show. */
export type DateRangeKey = "7d" | "30d";

/** ISO 8601 timestamp with its IST offset, as the API will send it. */
export type IsoDateTime = string;

/** Pseudonymous, per-venue guest ID. Never a name, number or photo. */
export type GuestId = string;

export type DateRangeOption = {
  key: DateRangeKey;
  label: string;
  comparisonLabel: string;
};

/** The venue and person shown in the sidebar menu. */
export type VenueSession = {
  venueName: string;
  venueInitial: string;
  area: string;
  city: string;
  memberName: string;
  memberRole: string;
  memberEmail: string;
  firstName: string;
};

export type NotificationKind = "card" | "rating";

export type VenueNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  whenLabel: string;
  read: boolean;
};

export type SessionResponse = {
  session: VenueSession;
  notifications: VenueNotification[];
  ranges: DateRangeOption[];
};
