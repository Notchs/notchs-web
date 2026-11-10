export type DayHours = { opens: string; closes: string; closed: boolean };

/** Everything on the public venue page, edited on Content and Profile. */
export type VenueProfile = {
  name: string;
  category: string;
  tagline: string;
  description: string;
  menuUrl: string;
  websiteUrl: string;
  instagram: string;
  address: string;
  area: string;
  city: string;
  phone: string;
  amenities: string[];
  visibleOnDiscover: boolean;
  hasLogo: boolean;
  hasCover: boolean;
  galleryCount: number;
  hasVideo: boolean;
  /** Monday first. */
  hours: DayHours[];
};

export type PublicStats = {
  visitsLabel: string;
  ratingLabel: string;
  rankLabel: string;
  foundingBadge: string;
  coordinates: string;
};

export type VenueProfileResponse = {
  profile: VenueProfile;
  stats: PublicStats;
  categories: string[];
  amenityOptions: string[];
};
