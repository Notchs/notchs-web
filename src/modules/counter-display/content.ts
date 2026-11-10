import type { Metadata } from "next";

/** The counter phone's pages: private, never in search. */
export const displayMetadata: Metadata = {
  title: "Counter screen",
  robots: { index: false, follow: false },
};

export const displayContent = {
  pair: {
    pairing: "Pairing this phone…",
    noToken: "This link is missing its code.",
    failedTitle: "This pairing link didn't work.",
    failedBody:
      "Links work once and expire after 10 minutes. On the venue dashboard, open Counter and make a new one.",
    retry: "Try again",
  },
  screen: {
    loading: "Starting the counter screen…",
    scan: "Scan to get notched",
    newCode: (seconds: number) => `New code in ${seconds} s`,
    qrLabel: "QR code: scan it to send your Notchs check-in on WhatsApp",
    offline: "Offline: codes still work, scans count when guests send them.",
    notPairedTitle: "This phone isn't paired.",
    notPairedBody:
      "On the venue dashboard, open Counter, tap Pair a phone and open the link on this phone.",
    noScanTitle: "The scan link isn't set up yet.",
    noScanBody:
      "Notchs hasn't connected its WhatsApp number yet. Codes still rotate below.",
    errorTitle: "Couldn't start the counter screen.",
    errorBody: "Check the internet connection, then try again.",
    retry: "Try again",
    keepOn: "Keep this screen on and the phone charging.",
  },
};
