export type NotificationPreferences = {
  counterOffline: boolean;
  weeklySummary: boolean;
  newRatings: boolean;
  notchCard: boolean;
  whatsapp: boolean;
};

export type SettingsResponse = {
  email: string;
  /** Empty hides the row. */
  supportEmail: string;
  supportHours: string;
  /** Null while notification settings aren't connected. */
  preferences: NotificationPreferences | null;
};
