import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { openGraphBase } from "@/shared/lib/metadata";

export type LegalContent = {
  title: string;
  summary: readonly { label: string; text: string }[];
  sections: readonly { q: string; a: string }[];
  updated: string;
};

const UPDATED = "Last updated 2 Nov 2026";

function legalMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, title, description, url: path },
  };
}

export const privacyMetadata = legalMetadata(
  "Privacy notice",
  "What Notchs keeps, what we never do, what venues can see (totals, never phone numbers), and how to delete everything.",
  routes.privacy,
);

export const termsMetadata = legalMetadata(
  "Terms",
  "The rules for using Notchs: one Notch per place per day, fair use, and rankings that are never for sale.",
  routes.terms,
);

export const privacyContent: LegalContent = {
  title: "Privacy",
  summary: [
    {
      label: "What we keep",
      text: "Your name, WhatsApp number, area and the places you notched.",
    },
    {
      label: "What we never do",
      text: "Sell your data, or show your number to venues or anyone else.",
    },
    {
      label: "How to delete",
      text: "Send DELETE to Notchs on WhatsApp.",
    },
  ],
  sections: [
    {
      q: "What we collect",
      a: "Your WhatsApp number, which is your login. The name and area you give us. Each Notch: the place, the time and the code you sent. The messages you send to the Notchs number, and when you agreed to this notice.",
    },
    {
      q: "What we don't",
      a: "No password and no location tracking: a Notch comes from the code on the counter screen, not from your phone's location. We don't sell your data.",
    },
    {
      q: "What venues see",
      a: "Totals only: visits, new customers and busy hours. A venue never sees your phone number or your name. Other people see you only if you turn on a public profile, and then only your first name and last initial.",
    },
    {
      q: "How long we keep it",
      a: "Until you delete it. When you delete your account, your details and messages are removed, and your past visits stay only as anonymous counts, so a venue's totals stay correct.",
    },
    {
      q: "How to delete",
      a: `Send DELETE to Notchs on WhatsApp, then YES to confirm, or use Privacy & data in your passport. You can download your data there too. Questions: ${siteConfig.contactEmail}.`,
    },
  ],
  updated: `${siteConfig.contactEmail} · ${UPDATED}`,
};

export const termsContent: LegalContent = {
  title: "Terms",
  summary: [
    { label: "Who can join", text: "You must be 18 or older." },
    { label: "Fair use", text: "One Notch per place per day." },
    { label: "Rankings", text: "Rankings are not for sale." },
  ],
  sections: [
    {
      q: "Who can use Notchs",
      a: "Anyone aged 18 or older with a WhatsApp number. You agree to this when you confirm in WhatsApp before your first Notch.",
    },
    {
      q: "Fair use",
      a: "A Notch is a real visit: you scan the code at the counter yourself. One Notch per place per day. Sharing codes or faking visits can get those Notchs rejected and your account blocked.",
    },
    {
      q: "How rankings work",
      a: "Rankings come from verified visits only. Nobody can pay to appear in them or to move up.",
    },
    {
      q: "Venue rules",
      a: "A venue keeps its counter screen at its own counter and doesn't send codes to anyone. A venue that fakes visits can be paused or removed.",
    },
    {
      q: "Ending your account",
      a: "You can delete your account at any time: send DELETE to Notchs on WhatsApp, then YES. We can block accounts that break these rules.",
    },
  ],
  updated: UPDATED,
};
