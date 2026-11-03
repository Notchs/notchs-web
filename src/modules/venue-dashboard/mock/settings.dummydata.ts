import { siteConfig } from "@/config/site";

import type { SettingsResponse } from "../types";

export const settingsDummyData: SettingsResponse = {
  email: "owner@kahwahouse.example",
  supportEmail: siteConfig.contactEmail,
  supportHours: "Replies 10 AM – 8 PM IST",
  preferences: {
    counterOffline: true,
    weeklySummary: true,
    newRatings: true,
    notchCard: true,
    whatsapp: false,
  },
};
