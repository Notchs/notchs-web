import type { Metadata } from "next";

/** Private pages: never indexed, never in the sitemap. */
const privatePage = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
});

export const passportMetadata = privatePage("Your passport");
export const notchsMetadata = privatePage("My Notchs");
export const leaderboardMetadata = privatePage("Leaderboard");
export const profileMetadata = privatePage("Profile");

export const shellContent = {
  nav: {
    label: "Passport",
    home: "Home",
    notchs: "My Notchs",
    leaderboard: "Leaderboard",
    profile: "Profile",
  },
  accountMenu: "Account menu",
  logOut: "Log out",
  loggingOut: "Logging out…",
  loading: "Loading your passport…",
  loadError: "We couldn’t load this.",
  retry: "Try again",
};

export const homeContent = {
  kicker: "Your passport",
  hello: (name: string | null) => (name ? `Hi, ${name}.` : "Hi there."),
  memberSince: (month: string) => `Member since ${month}`,
  foundingMember: (no: number) => `Founding member #${no}`,
  totals: {
    label: "Your totals and rank",
    notchs: "Notchs",
    places: "Places",
    points: "Points",
  },
  rank: (city: string) => `in ${city} this month`,
  unranked: "Get your first Notch this month to join the leaderboard.",
  seeLeaderboard: "Leaderboard",
  reward: {
    kicker: "This month’s reward",
    title: (rupees: number) => `Free food up to ₹${rupees}`,
    rule: (needed: number) => `Get notched at ${needed} new cafés this month.`,
    progressLabel: (done: number, needed: number) =>
      `${done} of ${needed} new cafés`,
    progress: (done: number, needed: number) => `${done} of ${needed} cafés`,
    toGo: (left: number) => `${left} to go`,
    unlocked: "Unlocked",
  },
  recent: {
    title: "Your Notchs",
    seeAll: "See all",
    empty: "No Notchs yet. Your first one shows up here.",
  },
  next: {
    title: "Get your next Notch",
    body: "Scan the QR at the counter of any Notchs place. WhatsApp opens with the message ready: just press Send.",
  },
};

export const visibilityContent = {
  title: "Show my name on the leaderboard",
  on: "On: others see your name and rank.",
  off: "Off: you keep your rank, but others see no name.",
  failed: "Couldn’t change that. Try again.",
};

export const notchsContent = {
  title: "My Notchs",
  summary: (notchs: number, places: number) =>
    `${notchs} ${notchs === 1 ? "Notch" : "Notchs"} at ${places} ${places === 1 ? "place" : "places"} · newest first`,
  empty:
    "No Notchs yet. Scan the QR at the counter of a Notchs place to get your first.",
  notch: "Notch",
  visitHere: "Visit here",
  points: "Points",
  more: "Show more",
  colours: "Each kind of place keeps its colour.",
};

export const claimsContent = {
  title: "Missed a Notch?",
  body: "If the counter phone wasn’t working, send us your bill instead. We check it and add the Notch. It works on the day of your visit only.",
  search: "Find the place",
  searchHint: "Type at least 2 letters of its name",
  noPlaces: "No live Notchs place has that name.",
  searchFailed: "Couldn’t search right now. Please try again.",
  start: (place: string) => `Claim a Notch at ${place}`,
  starting: "Starting…",
  change: "Pick another place",
  startFailed: "That didn’t work. Please try again.",
  step1: (message: string) => `1. Send “${message}” to Notchs on WhatsApp.`,
  step2:
    "2. Then send a clear photo of your bill. It should show the place’s name, the date and the total.",
  open: "Open WhatsApp",
  noLink:
    "WhatsApp isn’t connected here yet. Send the message to the Notchs number.",
  expires: (time: string) => `Send the photo before ${time} today.`,
  yours: "Your claims",
  status: {
    awaiting_photo: "Waiting for your bill photo",
    expired: "No photo came that day",
    in_review: "We’re checking your bill",
    approved: "Notch added",
    rejected: "Not accepted",
  } as const,
  notch: (no: string) => `Notch ${no}`,
};

export const notchRowContent = {
  meta: (niche: string, no: string, visit: string, date: string) =>
    `${niche} · Notch ${no} · ${visit} visit · ${date}`,
};

export const leaderboardContent = {
  periods: { label: "Period", month: "This month", all: "All time" },
  you: (name: string | null) => (name ? `You · ${name}` : "You"),
  seenAs: (name: string | null, shown: boolean) =>
    `Others see: ${shown && name ? name : "A Notchs member"}`,
  unranked: "Not ranked yet. Get a Notch to join.",
  hidden: "A Notchs member",
  empty: "Nobody is ranked here yet.",
  noCity: "Add your area in Profile to join your city’s leaderboard.",
  rules:
    "Only real Notchs count. Equal points share a rank. People who keep their name hidden show as “A Notchs member”.",
  pointsLabel: "points",
};

export const deleteContent = {
  open: "Delete my account",
  title: "Delete your Notchs account?",
  points: [
    "Your number, name, Instagram, invites, Star Points and messages with Notchs are deleted. This can’t be undone.",
    "The visits you made stay with the places, with nothing that says who you are, so their totals don’t change.",
    "If you message Notchs again later, you start a new account from zero.",
  ],
  typeLabel: (word: string) => `Type ${word} to confirm`,
  confirm: "Delete my account",
  deleting: "Deleting…",
  cancel: "Keep my account",
  failed: "That didn’t work. Please try again.",
};

export const profileContent = {
  title: "Profile",
  name: "Name",
  area: (city: string | null) => (city ? `Area in ${city}` : "Area"),
  chooseArea: "Choose your area",
  instagram: "Instagram (optional)",
  instagramPlaceholder: "@yourname",
  showInstagram: "Show my Instagram to places I visit",
  showInstagramNote:
    "Off by default. Places never see your name or number, only this if you turn it on.",
  phoneNote: "WhatsApp number: the one you log in with. Never shown to venues.",
  save: "Save",
  saving: "Saving…",
  saved: "Saved.",
  saveFailed: "Couldn’t save. Try again.",
  phoneTitle: "Changed your WhatsApp number?",
  phoneBody:
    "Move your Notchs, rank and passport to your new number. You’ll get a code to send from it.",
  phoneStart: "Change number",
  phoneStarting: "Getting a code…",
  phoneSend: (message: string) =>
    `From your new number, send “${message}” to Notchs on WhatsApp.`,
  phoneOpen: "Open WhatsApp",
  phoneExpires: (time: string) =>
    `The code works once, until ${time}. Notchs replies on the new number when it’s done.`,
  phoneNoLink: "Notchs’ WhatsApp number isn’t set up yet. Try again later.",
  phoneTooMany: "Too many codes. Please try again in 15 minutes.",
  phoneFailed: "Couldn’t get a code. Try again.",
  inviteTitle: "Invite friends",
  inviteBody:
    "Get 50 Star Points for each friend who joins with your code and gets their first Notch at a Notchs place.",
  inviteCode: "Your invite code",
  inviteCopy: "Copy invite link",
  inviteCopied: "Link copied.",
  inviteCopyFailed: "Couldn’t copy. Your code is above.",
  inviteShare: "Share",
  starPoints: (points: number) => `${points} Star Points`,
  invited: (invited: number, rewarded: number) =>
    `${invited} invited · ${rewarded} got their first Notch`,
  invitedBy: (handle: string) => `You joined with ${handle}’s code.`,
  inviterLabel: "Who invited you? Their invite code",
  inviterSave: "Add",
  inviterSaved:
    "Thanks! They get their Star Points when you get your first Notch.",
  inviterFailed: "Couldn’t add that code. Check it and try again.",
};
