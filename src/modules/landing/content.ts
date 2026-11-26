import type { Metadata } from "next";
import type { StaticImageData } from "next/image";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/shared/lib/metadata";

import { photoFiles, type PhotoFile } from "./photos";

/** In-page sections the header links to. */
export const sectionIds = {
  howItWorks: "how-it-works",
  map: "city-pulse",
  places: "explore",
  moments: "moments",
  rewards: "rewards",
  venues: "venues",
  faq: "faq",
} as const;

export const navLinks = [
  { label: "How it works", href: `#${sectionIds.howItWorks}` },
  { label: "Explore", href: `#${sectionIds.places}` },
  { label: "City Pulse", href: `#${sectionIds.map}` },
  { label: "For venues", href: `#${sectionIds.venues}` },
  { label: "FAQ", href: `#${sectionIds.faq}` },
] as const;

export const accessLabel = "Get your passport";
/** Header label on phones, where the full one crowds the logo. */
export const accessLabelShort = "Get started";

export type VenueKind =
  | "cafe"
  | "cricket"
  | "turf"
  | "pickleball"
  | "snooker"
  | "bowling"
  | "gym"
  | "court";

type Photo = { src: StaticImageData; alt: string };

type Venue = {
  kind: VenueKind;
  label: string;
  /** Example venue name used in the sample proof. */
  example: string;
  line: string;
  image: Photo;
};

const photo = (file: PhotoFile, alt: string): Photo => ({
  src: photoFiles[file],
  alt,
});

/*
 * Photos (assets/photos) are CC0 (public domain), with no brand signs or logos,
 * resized for the web. From Wikimedia Commons: turf.jpg, turf-futsal.jpg, pickleball.jpg,
 * pickleball-courts.jpg. All others: wordpress.org/photos.
 */
export const venues: readonly Venue[] = [
  {
    kind: "cafe",
    label: "Cafés",
    example: "Kahwa House",
    line: "Your usual table, finally on the record.",
    image: photo(
      "cafe.jpg",
      "A bright café with a long blue bench, small tables and leather chairs",
    ),
  },
  {
    kind: "cricket",
    label: "Box cricket",
    example: "Boundary Box",
    line: "Night matches with the gang, counted.",
    image: photo(
      "turf-cricket.jpg",
      "A floodlit box-cricket turf at dusk with stumps on the pitch",
    ),
  },
  {
    kind: "turf",
    label: "Turfs",
    example: "Riverside Turf",
    line: "Every Friday-night five-a-side, counted.",
    image: photo(
      "turf.jpg",
      "A floodlit football turf at night with players on the pitch",
    ),
  },
  {
    kind: "pickleball",
    label: "Pickleball",
    example: "Dink Club",
    line: "Sunday doubles, on the record.",
    image: photo(
      "pickleball.jpg",
      "An outdoor pickleball court with the net up at dusk",
    ),
  },
  {
    kind: "snooker",
    label: "Snooker",
    example: "Corner Pocket",
    line: "Frames you can actually prove.",
    image: photo(
      "snooker.jpg",
      "A rooftop snooker table with the reds racked at sunset",
    ),
  },
  {
    kind: "bowling",
    label: "Bowling",
    example: "Lane Nine",
    line: "Strike nights, notched.",
    image: photo(
      "bowling.jpg",
      "A row of polished bowling lanes under bright lights",
    ),
  },
  {
    kind: "gym",
    label: "Gyms",
    example: "Iron Room",
    line: "Show up. Get the Notch. Repeat.",
    image: photo(
      "gym.jpg",
      "A gym with weight machines and big windows over the city",
    ),
  },
  {
    kind: "court",
    label: "Courts",
    example: "Hoop Yard",
    line: "Basketball, tennis, badminton. All count.",
    image: photo(
      "court-basketball.jpg",
      "An empty indoor basketball court with a polished wooden floor",
    ),
  },
];

type HeroSlide = { kind: VenueKind; image: Photo };

export const venueByKind = (kind: VenueKind) =>
  venues.find((venue) => venue.kind === kind) ?? venues[0];

const slide = (kind: VenueKind, file: PhotoFile, alt: string): HeroSlide => ({
  kind,
  image: photo(file, alt),
});

/** Photos the hero cycles through: each place first, then more of each. */
export const heroSlides: readonly HeroSlide[] = [
  ...venues.map(({ kind, image }) => ({ kind, image })),
  slide(
    "cafe",
    "cafe-warm.jpg",
    "A warmly lit café with wooden beams, lamps and wooden tables",
  ),
  slide(
    "pickleball",
    "pickleball-courts.jpg",
    "Rows of blue pickleball courts seen from above",
  ),
  slide(
    "turf",
    "turf-futsal.jpg",
    "A caged futsal pitch between trees and city towers",
  ),
  slide(
    "snooker",
    "snooker-indoor.jpg",
    "A green snooker table in a quiet indoor room",
  ),
  slide(
    "cafe",
    "cafe-latte.jpg",
    "A latte with leaf foam art on a wooden tray",
  ),
  slide(
    "gym",
    "gym-cardio.jpg",
    "Treadmills and cross trainers lined up in a gym",
  ),
  slide(
    "bowling",
    "bowling-balls.jpg",
    "Green, red and purple bowling balls lined up on a ball return",
  ),
  slide(
    "court",
    "court-tennis.jpg",
    "A blue tennis court scattered with tennis balls",
  ),
  slide(
    "cafe",
    "cafe-dessert.jpg",
    "Iced coffees and a brownie sundae on a café table",
  ),
  slide(
    "pickleball",
    "pickleball-balls.jpg",
    "Bright yellow pickleballs on a court",
  ),
  slide(
    "court",
    "court-outdoor.jpg",
    "An outdoor basketball court with a hoop against green shrubs",
  ),
  slide(
    "cafe",
    "cafe-modern.jpg",
    "A modern café with dark wooden tables and warm ceiling lights",
  ),
  slide(
    "cafe",
    "cafe-lights.jpg",
    "Woven bamboo pendant lights glowing over a café",
  ),
];

export const heroContent = {
  titleLines: ["Every real visit", "counts."],
  description:
    "A free passport for your city. Visit, scan on WhatsApp, get your monthly Notch Card. No app.",
  secondary: "See how it works",
  sampleNote: "Example",
} as const;

export const steps = [
  {
    label: ["Scan", "QR code"],
    body: "Point your camera at the QR on the counter phone. No app, no sign-up.",
  },
  {
    label: ["Send", "message"],
    body: "WhatsApp opens with your message already typed. Press send and you are checked in.",
  },
  {
    label: ["Get", "Notched"],
    body: "Your proof comes back in seconds and the visit is saved to your passport.",
  },
] as const;

export const howItWorksContent = {
  kicker: "How it works",
  titleLines: ["Your visit,", " Just a message away."],
  description:
    "Scan the QR at the venue and send a quick message on WhatsApp to get your Notch.",
  cta: accessLabel,
  pickPlace: "Try it at",
  tryIt: "Try it",
} as const;

/** Labels in the WhatsApp demo screen. */
export const chatContent = {
  status: "online",
  today: "Today",
  placeholder: "Message",
  replyButtons: ["My Notchs", "What's next"],
} as const;

/** Sample proof shown in the hero card and the WhatsApp demo. */
export const sampleProof = {
  code: "K7Q-29F",
  notch: "Notch #0145",
  time: "18:42",
  title: "Notched.",
  message: (venue: string) => `Notch me at ${venue} · ${sampleProof.code}`,
} as const;

export const placesContent = {
  kicker: "Explore by vibe",
  title: "Find your kind of place.",
  description:
    "Cafés, turfs, courts and game nights. The spots you already go to, where every visit you prove adds to your Notch count.",
} as const;

export const collectContent = {
  kicker: "What you collect",
  title: "Status you earn, not buy.",
  description:
    "You already go out. Notchs turns every real visit into something you keep, show off and share.",
  example: "Example",
  items: [
    {
      kind: "count",
      title: "Notch count",
      body: "Every verified visit, counted month by month.",
      why: "Proof of where you actually go",
    },
    {
      kind: "rank",
      title: "City rank",
      body: "See where you stand in your city from your 3rd Notch.",
      why: "Become a known regular in your city",
      podium: [2, 1, 3],
    },
    {
      kind: "badges",
      title: "Badges",
      body: "First Notch, Café Hopper, Night Owl, Regular and more.",
      why: "Show the kind of person you are",
      badges: ["First Notch", "Night Owl", "Café Hopper"],
    },
    {
      kind: "card",
      title: "Notch Card",
      body: "Your month in one card, ready for your story.",
      why: "A month worth posting",
      month: "Your month",
    },
  ],
} as const;

export const saturdayContent = {
  kicker: "City Pulse",
  title: "What's happening around your city?",
  description:
    "One Saturday in Ahmedabad: tap a stop to fly there. Every pin is a place where a real visit becomes a Notch.",
  credit: "© OpenStreetMap contributors",
  cta: "Notch it here",
  mapAlt:
    "Map of Ahmedabad with Notchs stops in Thaltej, Navrangpura, Satellite, Prahladnagar and Bodakdev",
} as const;

/** Stops on the map. x and y are percentages across the map image. */
export const saturdayStops: readonly {
  time: string;
  kind: VenueKind;
  area: string;
  x: number;
  y: number;
}[] = [
  { time: "07:30", kind: "pickleball", area: "Thaltej", x: 40.11, y: 44 },
  { time: "10:30", kind: "cafe", area: "Navrangpura", x: 63.36, y: 51.73 },
  { time: "16:00", kind: "snooker", area: "Satellite", x: 47.12, y: 58.1 },
  { time: "19:00", kind: "cricket", area: "Prahladnagar", x: 40.38, y: 67 },
  { time: "22:00", kind: "bowling", area: "Bodakdev", x: 39.15, y: 49.69 },
];

/** Smaller dots for other places on the map, for a sense of the city. */
export const mapDots = [
  [48.75, 50.99],
  [52.3, 46.2],
  [56.8, 55.4],
  [44.6, 62.1],
  [60.1, 47.8],
  [36.9, 55.2],
  [66.4, 58.9],
  [70.8, 53.9],
  [54.2, 63.7],
  [42.8, 39.6],
  [58.6, 40.9],
  [49.9, 70.2],
  [34.2, 48.8],
  [62.7, 65.1],
] as const;

export const momentsContent = {
  kicker: "Real moments",
  title: "Go out. Notch it. Keep the memory.",
  description:
    "Your Notchs turn into stories worth posting. Tap the story to move through it.",
  next: "Next story",
  previous: "Previous story",
  stories: [
    {
      caption: "Scan at the counter",
      sticker: "Notched · Kahwa House",
      image: photo(
        "people-cafe-phone.jpg",
        "A hand holding a phone next to a coffee at a café table",
      ),
    },
    {
      caption: "Bring the gang",
      sticker: "Notched · Riverside Turf",
      image: photo(
        "people-friends.jpg",
        "Four friends laughing together outdoors",
      ),
    },
    {
      caption: "Post the moment",
      sticker: "Notch #0145",
      image: photo(
        "people-selfie-group.jpg",
        "Three friends taking a selfie together on a phone",
      ),
    },
    {
      caption: "Make a whole Saturday of it",
      sticker: "Notched · Lane Nine",
      image: photo(
        "people-hangout.jpg",
        "Friends hanging out and dancing in the evening sun",
      ),
    },
    {
      caption: "Share your Notch Card",
      sticker: "Your month · [N] Notchs",
      image: photo("people-selfie.jpg", "Two friends smiling for a selfie"),
    },
    {
      caption: "See who's ahead",
      sticker: "#[N] in your city",
      image: photo(
        "people-table-phones.jpg",
        "A group of friends at a table looking at their phones",
      ),
    },
  ],
} as const;

export const venuesContent = {
  kicker: "For venues",
  title: "Know who comes back.",
  description:
    "A spare phone at your counter shows the code. You see first-timers and regulars, and reward the ones who keep coming back, without ever seeing a phone number.",
  points: [
    "First-timers and regulars, every week",
    "A Notch Card that rewards your regulars",
    "Totals only. Never phone numbers",
    "Free for your first months",
  ],
  cta: "Apply for your venue",
  image: photo(
    "cafe-lights.jpg",
    "Woven bamboo pendant lights glowing over a café",
  ),
} as const;

export const faqContent = {
  kicker: "FAQ",
  title: "Good questions.",
  items: [
    {
      q: "Do I need to download an app?",
      a: "No. You scan the QR with your phone camera and send one WhatsApp message. Your passport opens in the browser.",
    },
    {
      q: "Is it free?",
      a: "Yes. Notchs is free for you, forever. Venues pay a monthly fee.",
    },
    {
      q: "Who can see my Notchs?",
      a: "Your profile is private by default. You choose what to share. Venues only see totals, never your phone number.",
    },
    {
      q: "Why can't I just Notch from home?",
      a: "The code on the counter phone changes every 30 seconds. You have to be there to scan it.",
    },
    {
      q: "Which cities is Notchs in?",
      a: "Ahmedabad, for now, at places with a Notchs counter phone. We're adding cities one at a time.",
    },
    {
      q: "Can I ask for Notchs in my city?",
      a: `Yes. Pick your city from the list at the top of the page and tap "Ask for Notchs", or email ${siteConfig.contactEmail}.`,
    },
    {
      q: "How can a venue join?",
      a: "Apply from the venue page. The Notchs team checks every venue, then emails a link to set your password. Your first months are free.",
    },
  ],
} as const;

export const closingContent = {
  title: "Your city is getting ranked.",
  description: "Don't stay unnotched.",
} as const;

export const accessDialogContent = {
  title: "Scan to Notch",
  description:
    "This is what you'll see at every Notchs counter. Scan, send, done.",
  note: "Example code. The real one is on the counter phone at each place.",
  close: "Close",
  start: "Get your passport",
} as const;

const title = `${siteConfig.name} · Ahmedabad's real-life leaderboard`;
/** Search-result text (120–155 characters); the visible hero copy stays as it is. */
const description =
  "Scan the QR at the counter, send one WhatsApp message, get Notched. Ahmedabad's real-life leaderboard, ranked by the places you actually go.";

export const landingMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: routes.home },
  openGraph: { ...openGraphBase, url: routes.home, title, description },
};

export const footerContent = {
  signOff: "Built for every city",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: `#${sectionIds.howItWorks}` },
        { label: "Rewards", href: `#${sectionIds.rewards}` },
        { label: "Explore", href: `#${sectionIds.places}` },
        { label: "City Pulse", href: `#${sectionIds.map}` },
      ],
    },
    {
      title: "Community",
      links: [{ label: "Real moments", href: `#${sectionIds.moments}` }],
    },
    {
      title: "Business",
      links: [
        { label: "For venues", href: `#${sectionIds.venues}` },
        { label: "Venue log in", href: routes.venueLogin },
        {
          label: "Apply for your venue",
          href: `${routes.venueLogin}?view=apply`,
        },
      ],
    },
    {
      title: "Cities",
      links: [
        { label: "Ahmedabad", href: `?city=ahmedabad#${sectionIds.map}` },
        { label: "Ask for your city", href: `#${sectionIds.map}` },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: `#${sectionIds.faq}` },
        { label: "Help", href: `mailto:${siteConfig.supportEmail}` },
        { label: "Contact", href: `mailto:${siteConfig.contactEmail}` },
      ],
    },
  ],
} as const;
