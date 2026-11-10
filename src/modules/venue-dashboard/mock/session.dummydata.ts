import type { SessionResponse } from "../types";
import { dateRanges, MOCK_VENUE_NAME } from "./shared.dummydata";

export const sessionDummyData: SessionResponse = {
  session: {
    venueName: MOCK_VENUE_NAME,
    venueInitial: "K",
    area: "Navrangpura",
    city: "Ahmedabad",
    memberName: "Riya Shah",
    memberRole: "Owner",
    memberEmail: "owner@kahwahouse.example",
    firstName: "Riya",
  },
  notifications: [
    {
      id: "n1",
      kind: "card",
      title: "October Notch Card is ready",
      whenLabel: "1 Nov · 09:00",
      read: false,
    },
    {
      id: "n2",
      kind: "rating",
      title: "3 new ratings this week",
      whenLabel: "Yesterday",
      read: false,
    },
  ],
  ranges: dateRanges,
};
