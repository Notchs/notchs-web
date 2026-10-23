import type { Metadata } from "next";

export const venueLoginMetadata: Metadata = {
  title: "Venue log in",
  robots: { index: false, follow: false },
  description:
    "Log in to your venue on Notchs, or sign up your venue for the Ahmedabad pilot.",
};

export const setPasswordMetadata: Metadata = {
  title: "Set your password",
  robots: { index: false, follow: false },
};

export const showcaseContent = {
  badge: "For venues",
  title: "Know who comes back.",
  description:
    "Every visit to your venue, verified at the counter. No staff work, no till connection.",
  sample: {
    label: "Kahwa House · This week",
    total: 86,
    detail: "customers · 31 new",
    /** Bar heights in percent, Monday to Sunday; Saturday is highlighted. */
    bars: [38, 52, 46, 61, 74, 100, 88],
    highlight: 5,
    caption: "Sample dashboard · Ahmedabad pilot · Nov–Dec 2026",
  },
} as const;

export const flowContent = {
  forVenues: "For venues",
  swap: {
    login: { question: "New to Notchs?", cta: "Sign up your venue" },
    signup: { question: "Already have a venue?", cta: "Log in" },
  },
  steps: ["Email", "Venue", "Done"],
  emailLabel: "Email",
  emailPlaceholder: "owner@kahwahouse.in",
  checking: "Running a quick security check. Try again in a second.",
  emailInvalid: "Enter a full email, like owner@kahwahouse.in.",
  login: {
    kicker: "Venue log in",
    title: "Log in to your venue",
    description: "Use the email and password from your Notchs welcome email.",
    password: "Password",
    passwordMissing: "Enter your password.",
    forgot: "Forgot password?",
    cta: "Log in",
    busy: "Logging in…",
    staffNote:
      "Staff at the counter don't need to log in. The counter phone stays paired.",
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
    title: "Sign up your venue",
    description: "We email you a 6-digit code to check the address is yours.",
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
    cityHint: "Ahmedabad only during the pilot.",
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
    offerTitle: "Founding Venue: 2 months free",
    offerBody: "Then ₹1,499 a month + GST. Cancel any time.",
    agree: "I agree to the Terms and Privacy policy",
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
    passwordStamp: "Password set",
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
  footer: {
    copyright: "© 2026 Notchs · Ahmedabad",
    help: "Help",
  },
} as const;
