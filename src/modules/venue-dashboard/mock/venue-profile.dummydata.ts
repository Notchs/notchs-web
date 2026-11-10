import type { VenueProfileResponse } from "../types";
import { MOCK_VENUE_NAME } from "./shared.dummydata";

export const venueProfileDummyData: VenueProfileResponse = {
  profile: {
    name: MOCK_VENUE_NAME,
    category: "Cafe",
    tagline: "Filter coffee and late-night chai.",
    description:
      "A small cafe off Law Garden doing South Indian filter coffee, cutting chai and bun maska till late. Big tables, good Wi-Fi, quiet before 6.",
    menuUrl: "https://kahwahouse.example/menu",
    websiteUrl: "",
    instagram: "kahwahouse",
    address: "12, Sahjanand Complex, near Law Garden",
    area: "Navrangpura",
    city: "Ahmedabad",
    phone: "98250 00000",
    amenities: ["Wi-Fi", "Late night", "Outdoor"],
    visibleOnDiscover: true,
    hasLogo: true,
    hasCover: false,
    galleryCount: 5,
    hasVideo: false,
    hours: Array.from({ length: 7 }, (_, day) => ({
      opens: "09:00",
      closes: day >= 4 ? "23:30" : "23:00",
      closed: false,
    })),
  },
  stats: {
    visitsLabel: "312",
    ratingLabel: "4.6",
    rankLabel: "#4",
    foundingBadge: "Founding #7",
    coordinates: "23.0258° N, 72.5603° E",
  },
  categories: [
    "Cafe",
    "Restaurant",
    "Bar",
    "Hotel",
    "Turf / Box ground / Gym",
    "Theatre",
    "Other",
  ],
  areaOptions: ["Navrangpura", "Bodakdev", "Satellite", "Prahlad Nagar"],
  categoryEditable: true,
  amenityOptions: [
    "Wi-Fi",
    "Late night",
    "Outdoor",
    "Pet-friendly",
    "Live music",
    "Power sockets",
    "Parking",
    "Wheelchair access",
  ],
};
