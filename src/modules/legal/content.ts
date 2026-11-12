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

const UPDATED = "Last updated 12 Nov 2026";

/**
 * The business behind Notchs (Harsh, 10 Nov 2026): no registered company,
 * address or appointed grievance officer yet, so the notice names Notchs, its
 * city, and the team's contact email for every data request and complaint.
 * When a company is registered or an officer is named, add them here.
 */
export const legalDetails = {
  name: "Notchs",
  basedIn: "Ahmedabad, Gujarat, India",
  /** Courts for disputes. */
  jurisdiction: "Ahmedabad, Gujarat",
  /**
   * The person who handles complaints. India's IT Rules, 2021 expect the
   * Grievance Officer to be named: add the name here once the team picks one.
   */
  grievanceOfficer: "",
};

/** "our Grievance Officer" or "our Grievance Officer, <name>,". */
const officer = legalDetails.grievanceOfficer
  ? `our Grievance Officer, ${legalDetails.grievanceOfficer},`
  : "our Grievance Officer";

/** The same promise on both pages (IT Rules, 2021: 24 hours and 15 days). */
const complaintPromise =
  "We acknowledge every complaint within 24 hours and resolve it within 15 days.";

/** Every complaint and data request goes to the Grievance Officer's inbox. */
const contactEmail = siteConfig.grievanceEmail;

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
  "What Notchs keeps and why, what places see (totals, never your number), your rights under the DPDP Act, and how to delete your account.",
  routes.privacy,
);

export const termsMetadata = legalMetadata(
  "Terms",
  "The rules for using Notchs: 18+, one Notch per place per day, fair use, rewards, rules for places, and rankings that are never for sale.",
  routes.terms,
);

export const privacyContent: LegalContent = {
  title: "Privacy",
  summary: [
    {
      label: "What we keep",
      text: "Your WhatsApp number, the name and area you give us, and the places you notch.",
    },
    {
      label: "What we never do",
      text: "Sell your data, send you marketing, or show your number or name to venues.",
    },
    {
      label: "How to delete",
      text: "Profile → Delete my account, any time. It happens at once.",
    },
  ],
  sections: [
    {
      q: "Who we are",
      a: `${legalDetails.name} is based in ${legalDetails.basedIn}. Under India's Digital Personal Data Protection Act, 2023 (DPDP Act) we are the Data Fiduciary for your personal data. For any question, request or complaint about your data, write to ${officer} at ${contactEmail}. ${complaintPromise}`,
    },
    {
      q: "What we collect",
      a: "Your WhatsApp number, which is your login, and your WhatsApp profile name. The name, handle, area and Instagram username you choose to add. When you agreed to this notice, which version, and that you confirmed you are 18 or older. Each scan: the place, the time, the code you sent and whether it counted. What you tried at a place, if you tell us. Who invited you, if you add them. The messages you send to the Notchs number and our replies. Bill photos you send for a claim. Basic security records, such as the internet address a request came from, to stop abuse.",
    },
    {
      q: "Why we use it",
      a: "To log you in, count your Notchs, work out your points, ranks, rewards and Star Points, check claims, stop fake visits, answer you, and show each place its totals. We use your data only with your consent, which you give in WhatsApp before your first Notch, and only for these purposes. You can withdraw it at any time by deleting your account.",
    },
    {
      q: "What we don't do",
      a: "We don't sell or rent your data. We don't track your location: a Notch comes from the code on the counter screen. We don't send marketing messages; Notchs only replies to messages you send. We don't use advertising trackers on our website.",
    },
    {
      q: "What places and other people see",
      a: "A place sees totals: visits, new and returning guests and busy hours. Each guest there is a number, like Guest #10, with their visits to that place and usual time. A place never sees your phone number or your name. It sees your Instagram username only if you switch that on in Profile. On leaderboards you show as “A Notchs member” unless you choose to show your name; then other people see your name and handle.",
    },
    {
      q: "Bill photos",
      a: "If a counter phone isn't working, you can send a photo of your bill on WhatsApp so we can add the Notch. The photo stays with WhatsApp; we keep only a reference to it, and the Notchs team looks at it only to check your claim. WhatsApp deletes media after about 30 days.",
    },
    {
      q: "Who helps us run Notchs",
      a: "These companies process data for us, only to run the service: Meta (WhatsApp messages), Render (our servers), Neon (our database), a Redis hosting provider (fast ranks and login limits), Netlify (our website), Resend (emails to venues and our team) and Cloudflare Turnstile (stopping bots on forms). Some of them store data on servers outside India, which the DPDP Act allows.",
    },
    {
      q: "How long we keep it",
      a: "Until you delete your account. We never delete an account for being quiet: after 3 months without a Notch, your profile just shows a note. Bill photos are deleted by WhatsApp after about 30 days. Security records are kept only as long as they're needed to stop abuse.",
    },
    {
      q: "Deleting your account",
      a: `Go to Profile → Delete my account and type DELETE, or ask us at ${contactEmail}. It happens at once and can't be undone. Your number, name, Instagram, area, consent, logins, claims, invites, Star Points and messages with Notchs are deleted. The visits you made stay with each place as anonymous counts, with nothing that says who you are, so their totals stay correct. If you message Notchs again later, you start a new account.`,
    },
    {
      q: "Your rights",
      a: `Under the DPDP Act you can ask what data we have about you and how we use it, correct or update it (most of it you can change yourself in Profile), have it erased, withdraw your consent (deleting your account does this), nominate someone to act for you if you die or can't act yourself, and complain to us. Write to ${officer} at ${contactEmail}. ${complaintPromise} If you're not satisfied, you can complain to the Data Protection Board of India.`,
    },
    {
      q: "Children",
      a: "Notchs is only for people aged 18 or older. You confirm your age before your first Notch. We don't knowingly collect data from anyone under 18; if we learn that we have, we delete that account.",
    },
    {
      q: "Cookies",
      a: "We use only the cookies that keep you logged in. They can't be read by other websites, and we don't use cookies for advertising.",
    },
    {
      q: "Keeping your data safe",
      a: "Your data travels encrypted, login links work once and expire, and only the people who run Notchs can reach it, and only for the purposes above. If a breach ever affects you, we will tell you and the Data Protection Board as the law requires.",
    },
    {
      q: "Changes to this notice",
      a: "If we change what we collect or why, we update this page and ask for your consent again in WhatsApp where the law needs it.",
    },
  ],
  updated: `${contactEmail} · ${UPDATED}`,
};

export const termsContent: LegalContent = {
  title: "Terms",
  summary: [
    { label: "Who can join", text: "You must be 18 or older." },
    {
      label: "Fair use",
      text: "One Notch per place per day, and one per kind of place per day.",
    },
    { label: "Rankings", text: "Rankings are not for sale." },
  ],
  sections: [
    {
      q: "About these terms",
      a: `Notchs is based in ${legalDetails.basedIn}. By using Notchs, as a customer or as a place, you agree to these terms and to our Privacy notice. If you don't agree, please don't use Notchs.`,
    },
    {
      q: "Who can use Notchs",
      a: "Anyone aged 18 or older with a WhatsApp number. One account per number. You agree to these terms when you confirm in WhatsApp before your first Notch.",
    },
    {
      q: "How a Notch works",
      a: "A Notch is a real visit: at the counter you scan the code on the place's counter phone and send it to Notchs on WhatsApp. You get at most one Notch per place per day, and one per kind of place per day (for example, one café a day). Each Notch earns points. If a counter phone isn't working, you can claim the Notch the same day with a photo of your bill; we check it and our decision is final.",
    },
    {
      q: "Points, ranks and rewards",
      a: "Ranks come from verified Notchs only. Your points never go down, but the points that count for rank drop after 15 days without a Notch, and your next Notch brings them back. Rewards, such as free food for notching 5 new cafés in a month, and Star Points for inviting friends, work as described in your passport. Points, Star Points and rewards have no cash value and can't be sold or transferred. We may change or end a reward, telling you in the passport first.",
    },
    {
      q: "Fair use",
      a: "Don't share or forward counter codes, notch for someone else, use fake numbers, or try to trick the system. If we find fake Notchs we can remove them, along with their points, and block the account. The name, handle and Instagram username you add must be your own and must not be offensive, misleading or against the law; we can change or remove one that is.",
    },
    {
      q: "Rankings are not for sale",
      a: "Nobody, customer or place, can pay to appear in rankings or to move up.",
    },
    {
      q: "For places",
      a: "A place registers itself and the Notchs team approves it. One login runs the place. The counter phone stays at its own counter, and nobody sends its codes to anyone. A place sees totals and anonymous guest numbers, never customers' phone numbers or names. The first 3 months are free; after that the subscription charges apply, and we tell you the amount before anything is charged. The first 100 places of each kind to join (the first 200 turfs, box grounds and gyms) get 25% off their subscription for life. A place that fakes visits or breaks these terms can be paused or removed.",
    },
    {
      q: "Our service",
      a: "We work to keep Notchs running, but it may sometimes be unavailable or change. We provide it as it is, and we aren't responsible for a place's food, service or offers. As far as the law allows, we aren't liable for indirect losses.",
    },
    {
      q: "Ending your account",
      a: "You can delete your account at any time from Profile → Delete my account. We can block accounts that break these terms.",
    },
    {
      q: "The law",
      a: `These terms are governed by the laws of India. Disputes go to the courts of ${legalDetails.jurisdiction}. If we change these terms we update this page; using Notchs after that means you accept them.`,
    },
    {
      q: "Complaints and contact",
      a: `Questions or complaints about Notchs, these terms or anything on it: write to ${officer} at ${contactEmail}. ${complaintPromise}`,
    },
  ],
  updated: UPDATED,
};
