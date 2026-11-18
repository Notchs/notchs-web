import type { Metadata } from "next";

export const venueLoginMetadata: Metadata = {
  title: "Venue log in",
  robots: { index: false, follow: false },
  description:
    "Log in to your venue on Notchs, or apply to bring your venue to Notchs.",
};

export const setPasswordMetadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

/** The Ink brand panel, per mode. Facts only: no sample numbers. */
export const brandContent = {
  helpSubject: "Venue login help",
  login: {
    kicker: "Welcome back!",
    title: "Log in to your venue",
    description:
      "Access your dashboard, see who comes back and grow your venue.",
    preview: { label: "Total Visits", value: "12.5K", change: "+12%" },
  },
  apply: {
    kicker: "New venue",
    title: "Your venue deserves to be remembered.",
    description:
      "Apply once. The Notchs team checks every venue before it goes live.",
    preview: { label: "Regulars", value: "1.2K", change: "+18%" },
  },
} as const;

export type VenueAuthMode = "login" | "apply";

export const flowContent = {
  swap: {
    login: { question: "New to Notchs?", cta: "Apply for your venue" },
    apply: { question: "Already approved?", cta: "Log in" },
  },
  steps: ["Email", "Venue", "Done"],
  emailLabel: "Email",
  emailPlaceholder: "owner@kahwahouse.in",
  verifyHint: "Complete the check above to continue.",
  emailInvalid: "Enter a full email, like owner@kahwahouse.in.",
  login: {
    title: "Log in to your venue account",
    password: "Password",
    passwordMissing: "Enter your password.",
    forgot: "Forgot password?",
    cta: "Log in",
    busy: "Logging in…",
  },
  forgot: {
    back: "Back to log in",
    title: "Reset your password",
    description:
      "Enter your venue email. We'll send a link to set a new password.",
    cta: "Email me a link",
    busy: "Sending…",
    sentStamp: "Link sent",
    sentTitle: "Check your email",
    sentBody: (email: string) =>
      `If ${email} has a venue on Notchs, a reset link is on its way. Not there in a minute? Check spam.`,
    sentCta: "Back to log in",
  },
  apply: {
    kicker: "Step 1 of 3",
    title: "Apply for your venue",
    description:
      "Venues join Notchs by application. First, we email you a 6-digit code to check the address is yours.",
    hint: "Use the email the owner checks every day.",
    cta: "Email me a code",
    busy: "Sending…",
  },
  code: {
    back: "Change email",
    title: "Enter the code",
    sentTo: "Sent to",
    spam: "Not there in a minute? Check spam.",
    label: "6-digit code",
    help: "Type the 6 digits from the email.",
    cta: "Continue",
    busy: "Checking…",
    resendQuestion: "Didn't get it?",
    resend: "Send again",
    resendIn: "Send again in",
    resent: "New code sent.",
  },
  venue: {
    kicker: "Step 2 of 3",
    title: "About your venue",
    description: "Customers see this name in WhatsApp when they get Notched.",
    name: { label: "Venue name", placeholder: "Kahwa House" },
    nameMissing: "Add the name on your signboard.",
    type: "Type",
    typeMissing: "Pick the closest type.",
    city: "City",
    cityHint: "Ahmedabad only for now.",
    maps: {
      label: "Google Maps link",
      placeholder: "https://maps.app.goo.gl/…",
      hint: "Find your venue in Google Maps, tap Share, and paste the link here.",
    },
    mapsMissing: "Paste the Google Maps link for your venue.",
    landmark: {
      label: "Landmark (optional)",
      placeholder: "Opposite Law Garden",
    },
    owner: { label: "Your name", placeholder: "Arjun Shah" },
    ownerMissing: "Add your name.",
    phone: { label: "Phone", placeholder: "98765 43210" },
    phoneHint: "We call this number if we have questions.",
    phoneInvalid: "Enter a 10-digit mobile number.",
    offerTitle: "Your first 3 months are free",
    offerBody:
      "Then the subscription charges apply, and we tell you the amount first. The first 100 places of each kind get 25% off for life.",
    agreeTo: "I agree to the",
    agreeTerms: "Terms",
    agreeAnd: "and",
    agreePrivacy: "Privacy notice",
    agreeMissing: "Tick the box to continue.",
    cta: "Send application",
    busy: "Sending…",
    loadError: "Couldn't load the form options.",
    retry: "Try again",
    codeExpired:
      "Your email check has expired. Go back and get a new code to continue.",
  },
  done: {
    loginStamp: "Logged in",
    loginTitle: "Welcome back",
    loginBody: (who: string) => `You're logged in as ${who}.`,
    appliedStamp: "Application sent",
    appliedTitle: (venue: string) => `Thanks, ${venue}`,
    appliedBody: (email: string) =>
      `We'll check your venue and email ${email} a link to set your password. Then log in here.`,
    appliedRef: "Application",
    home: "Back to Notchs",
    logout: "Log out",
    loggingOut: "Logging out…",
  },
  setPassword: {
    kicker: "Venue log in",
    title: "Set your password",
    description:
      "Pick a password for your venue login. You'll use it with your email.",
    password: "New password",
    confirm: "Type it again",
    mismatch: "The two passwords don't match.",
    missing: "Enter a password.",
    cta: "Set password",
    busy: "Saving…",
    invalidTitle: "Link expired or already used",
    invalidBody:
      "Each link works once. Ask for a new one and use it within the time in the email.",
    invalidCta: "Email me a new link",
    backToLogin: "Back to log in",
  },
  path: {
    title: "How joining works",
    steps: [
      { title: "Apply", body: "Tell us about your venue." },
      { title: "We review it", body: "The Notchs team checks every venue." },
      {
        title: "Set your password",
        body: "Once you're approved, we email you a link.",
      },
      { title: "Log in", body: "Here, with your email and password." },
    ],
    done: "done",
    current: "current step",
    close: "Close",
  },
} as const;
