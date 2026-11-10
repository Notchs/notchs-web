export type NotificationPreferences = {
  counterOffline: boolean;
  weeklySummary: boolean;
  newRatings: boolean;
  notchCard: boolean;
  whatsapp: boolean;
};

export type SettingsResponse = {
  email: string;
  supportEmail: string;
  supportHours: string;
  preferences: NotificationPreferences;
};
