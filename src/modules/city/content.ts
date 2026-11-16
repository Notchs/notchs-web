import { siteConfig } from "@/config/site";

import type { City } from "./types";

const area = (name: string) => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
});

/**
 * Every city the site knows about. Local until the API serves cities with a
 * status (see lib/api.ts). Only Ahmedabad is live. The others are places
 * people can ask for: they are not launch promises. Change a status only when
 * the team confirms it.
 */
export const cities: readonly City[] = [
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    slug: "ahmedabad",
    state: "Gujarat",
    country: "India",
    status: "active",
    neighbourhoods: [
      area("Navrangpura"),
      area("Vastrapur"),
      area("Prahlad Nagar"),
      area("CG Road"),
      area("Sindhu Bhavan Road"),
      area("Satellite"),
      area("Bodakdev"),
    ],
  },
  ...(
    [
      ["Mumbai", "Maharashtra"],
      ["Bengaluru", "Karnataka"],
      ["Pune", "Maharashtra"],
      ["Delhi NCR", "Delhi"],
      ["Hyderabad", "Telangana"],
      ["Surat", "Gujarat"],
      ["Jaipur", "Rajasthan"],
    ] as const
  ).map(([name, state]): City => ({
    id: area(name).slug,
    name,
    slug: area(name).slug,
    state,
    country: "India",
    status: "not-yet",
    neighbourhoods: [],
  })),
];

export const cityContent = {
  trigger: "Choose your city",
  search: "Search for a city",
  groups: {
    active: "Live now",
    "coming-soon": "Coming soon",
    "not-yet": "Not here yet",
  },
  live: "Live",
  noMatch: (query: string) => `${query} isn't on the list yet.`,
  askFor: (city: string) => `Ask for Notchs in ${city}`,
  notice: {
    "coming-soon": {
      title: (city: string) => `Notchs is coming to ${city}`,
      body: "We'll share the date once the first venues are ready.",
    },
    "not-yet": {
      title: (city: string) => `Notchs isn't in ${city} yet`,
      body: "We're starting in Ahmedabad. Tell us you want Notchs in your city, and we'll count you in.",
    },
  },
  empty: "Nothing to show for this city yet.",
} as const;

/** Email link that asks the team to bring Notchs to a city (no API for this yet). */
export const requestCityHref = (city: string) =>
  `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`Bring Notchs to ${city}`)}`;
