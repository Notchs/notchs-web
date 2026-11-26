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
export const claimMetadata = privatePage("Claim a Notch");

export const shellContent = {
  nav: {
    label: "Passport",
    home: "Home",
    notchs: "My Notchs",
    leaderboard: "Leaderboard",
    profile: "Profile",
  },
  accountMenu: "Account menu",
  notifications: {
    label: "Notifications",
    empty: "You’re all caught up.",
    emptyBody: "News about your Notchs and rewards will show up here.",
  },
  logOut: "Log out",
  loggingOut: "Logging out…",
  loading: "Loading your passport…",
  loadError: "We couldn’t load this.",
  retry: "Try again",
  /** Shown only in mock mode (lib/config.ts). */
  mockData: "Example data",
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
  views: {
    label: "Show my Notchs",
    all: "All",
    places: "By place",
    locations: "By location",
  },
  /** Places and locations have nothing until the first Notch. */
  noPlaces: "No places yet. Scan a Notchs QR at a counter to start.",
  kind: (label: string, places: string, visits: string) =>
    `${label} · ${places} · ${visits}`,
  visits: (n: number) => (n === 1 ? "1 visit" : `${n} visits`),
  places: (n: number) => (n === 1 ? "1 place" : `${n} places`),
  notchs: (n: number) => (n === 1 ? "1 Notch" : `${n} Notchs`),
  firstLast: (first: string, last: string) =>
    first === last ? `on ${first}` : `first ${first} · last ${last}`,
  city: (name: string, notchs: string, places: string) =>
    `${name} · ${notchs} · ${places}`,
  otherAreas: "Other areas",
};

export const claimsContent = {
  add: "Add Notch",
  back: "My Notchs",
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
  // A claim always ends at midnight in India, which reads oddly as "00:00".
  expires: "Send the photo today, before midnight.",
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
    "Only real Notchs count. Equal points share a rank. After 15 days without a Notch, rank points drop 10% a week until your next Notch brings them all back; your points never change. People who keep their name hidden show as “A Notchs member”.",
  dropsOn: (day: string) =>
    `Get a Notch before ${day} to keep all your rank points.`,
  decaying: (percent: number, day: string | null) =>
    `${percent === 0 ? "Your points don’t count for rank right now" : `Only ${percent}% of your points count for rank right now`}. Your next Notch brings them all back${day ? `; it drops again on ${day}` : ""}.`,
  pointsLabel: "points",
  kicker: "Leaderboard",
  standingLabel: "Your rank",
  standingPeriod: (period: "month" | "all", city: string) =>
    `${period === "month" ? "This month" : "All time"} in ${city}`,
  belowTop: (seenAs: string) => `Below the top 50 for now. ${seenAs}`,
  nobodyYet: "Nobody has a Notch this month yet.",
  toNext: (points: number, rank: number) => `${points} points to #${rank}`,
  nextPoints: (points: number) => `${points} pts`,
  seeMe: "See me in the list",
  podium: "Top 3",
  podiumPoints: (points: number) => `${points} points`,
  youShort: "You",
  nameHidden: "Name hidden",
  columns: { rank: "Rank", name: "Name", points: "Points" },
  firstOfMonth: "The first Notch of the month puts you at #1.",
  goProfile: "Go to Profile",
  count: (total: string, city: string, period: "month" | "all") =>
    `${total} ${total === "1" ? "person" : "people"} ranked in ${city} ${period === "month" ? "this month" : "of all time"} · top 50 shown`,
  howTitle: "How ranking works",
};

export const inactivityContent = {
  title: "We’ve missed you",
  body: (date: string) =>
    `Your last Notch was on ${date}, over 3 months ago. Your account, Notchs and points are safe: Notchs never deletes an account for being quiet. Your rank points drop while you’re away, and your next Notch brings them back.`,
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
  kicker: "Your profile",
  noName: "Your profile",
  location: (city: string | null, area: string | null) =>
    [area, city].filter(Boolean).join(", "),
  memberSince: (month: string) => `Member since ${month}`,
  foundingMember: (no: number) => `Founding member #${no}`,
  edit: {
    title: "Edit profile",
    theme: "Theme",
    themes: { light: "Light", dark: "Dark" },
    nothingChanged: "Nothing to save yet.",
  },
  name: "Name",
  area: (city: string | null) => (city ? `Area in ${city}` : "Area"),
  chooseArea: "Choose your area",
  instagramTitle: "Instagram",
  instagram: "Instagram (optional)",
  instagramPlaceholder: "@yourname",
  instagramNone: "No Instagram added. Add it in Edit profile.",
  showInstagram: "Show my Instagram to venues",
  showInstagramNote:
    "Off by default. Places never see your name or number, only this if you turn it on.",
  showInstagramFailed: "Couldn’t change that. Try again.",
  save: "Save",
  saving: "Saving…",
  saved: "Saved.",
  saveFailed: "Couldn’t save. Try again.",
  photo: {
    alt: "Your profile picture",
    add: "Add photo",
    change: "Change photo",
    remove: "Remove photo",
    removeQuestion: "Remove your photo?",
    removeYes: "Remove",
    cancel: "Cancel",
    previewAlt: "Your new photo, as it will show",
    use: "Use this photo",
    uploading: "Uploading…",
    removing: "Removing…",
    hint: "JPG, PNG or WebP, up to 5 MB. It shows as a circle.",
    wrongType: "Choose a JPG, PNG or WebP picture.",
    tooBig: "That picture is over 5 MB. Choose a smaller one.",
    failed: "Couldn’t save your photo. Try again.",
  },
  phoneLabel: "WhatsApp number",
  phoneNote:
    "The number you log in with. Only you see it here; venues never do.",
  phoneTitle: "Change your WhatsApp number",
  phoneBody:
    "Move your Notchs, rank and passport to your new number. You’ll get a message to send from it.",
  phoneStart: "Change number",
  phoneStarting: "Getting a code…",
  phoneSend:
    "Open WhatsApp on your new number and send this message within 10 minutes:",
  phoneCopy: "Copy message",
  phoneCopied: "Copied.",
  phoneCopyFailed: "Couldn’t copy. Type the message instead.",
  phoneOpen: "Open WhatsApp",
  phoneTimeLeft: (time: string) => `Time left: ${time}`,
  phoneExpired: "This code has expired. Get a new one.",
  phoneAgain: "Get a new code",
  phoneAfter:
    "After you send it, your login moves to the new number. Then refresh this page.",
  phoneRefresh: "Refresh",
  phoneNoLink: "Notchs’ WhatsApp number isn’t set up yet. Try again later.",
  phoneFailed: "Couldn’t get a code. Try again.",
  birthday: {
    title: "Birthday",
    none: "You haven’t added your birthday.",
    add: "Add your birthday",
    label: "Date of birth",
    range: (range: string) => `Age group ${range}`,
    adult: (date: string) => `18+ confirmed on ${date}`,
    edit: "Edit",
    remove: "Remove",
    removeQuestion: "Remove your birthday?",
    removeYes: "Remove",
    save: "Save birthday",
    saving: "Saving…",
    cancel: "Cancel",
    failed: "Couldn’t save your birthday. Try again.",
  },
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
