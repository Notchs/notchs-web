import type { CSSProperties } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ArrowRightIcon } from "@/shared/components/icons";

import { howItWorksContent } from "../content";
import { LiveQr } from "./live-qr";
import { Phone } from "./phone";
import { SectionHeading } from "./section-heading";

const { chat, card } = howItWorksContent;

/** WhatsApp's own light colours, so the chat looks like what people will see. */
const whatsapp = {
  bar: "#ffffff",
  chat: "#efeae2",
  bubbleOut: "#d9fdd3",
  text: "#111b21",
} as const;

function ChatScreen() {
  return (
    <div
      className="flex h-full flex-col text-sm leading-snug"
      style={{ background: whatsapp.chat, color: whatsapp.text }}
    >
      <div
        className="flex items-center gap-2.5 px-3 pt-5 pb-2.5 font-semibold"
        style={{ background: whatsapp.bar }}
      >
        <span className="grid size-8 place-items-center rounded-full bg-ink text-volt">
          <NotchGlyph className="size-4" />
        </span>
        {chat.name}
      </div>
      <div className="flex flex-col gap-2 p-3 pt-6">
        <p
          className="ml-auto max-w-[85%] rounded-lg rounded-tr-none px-2.5 py-1.5"
          style={{ background: whatsapp.bubbleOut }}
        >
          {chat.message}
        </p>
        <p
          className="venues-reply mr-auto max-w-[85%] rounded-lg rounded-tl-none px-2.5 py-1.5"
          style={{ background: whatsapp.bar }}
        >
          <strong className="block font-display font-extrabold">
            {chat.reply}
          </strong>
          {chat.replyBody}
        </p>
      </div>
    </div>
  );
}

/** Notch Cards are always Ink. */
function CardScreen() {
  return (
    <div className="flex h-full flex-col justify-center gap-1 bg-ink p-5 pt-8 text-paper notch">
      <p className="text-[.6875rem] font-semibold tracking-[.14em] text-stone-light uppercase">
        {card.owner}
      </p>
      <p className="font-display text-6xl font-extrabold text-volt">
        {card.count}
      </p>
      <p className="text-xs text-stone-light">{card.countLabel}</p>
      <p className="mt-4 font-display text-base leading-tight font-extrabold">
        {card.line}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5 text-xs font-semibold">
        <li className="venues-badge rounded-full border border-volt px-2.5 py-1.5">
          👑 {card.regular}
        </li>
        <li className="rounded-full border border-paper/25 px-2.5 py-1.5">
          {card.badge}
        </li>
      </ul>
    </div>
  );
}

const screens = [LiveQr, ChatScreen, CardScreen];

/**
 * The three steps as three phones, which take turns rising. Phones swipe
 * sideways on small screens so the section stays short.
 */
export function HowItWorks() {
  return (
    <>
      <SectionHeading
        kicker={howItWorksContent.kicker}
        title={howItWorksContent.title}
        description={howItWorksContent.description}
        className="mb-12 reveal"
      />
      <ol
        tabIndex={0}
        aria-label={howItWorksContent.title}
        className="-mx-gutter flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-gutter pt-3 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 lg:gap-20"
      >
        {howItWorksContent.steps.map((step, index) => {
          const Screen = screens[index];
          const order = { "--i": index } as CSSProperties;
          return (
            <li
              key={step.title}
              className="relative w-[72%] flex-none snap-start sm:w-[42%] md:w-auto"
            >
              <div className="venues-step" style={order}>
                <Phone label={step.screenLabel}>
                  <Screen />
                </Phone>
              </div>
              {index < howItWorksContent.steps.length - 1 && (
                <ArrowRightIcon
                  aria-hidden="true"
                  style={order}
                  className="venues-arrow absolute top-1/3 -right-14 hidden size-8 lg:block"
                />
              )}
              <h3 className="mt-6 text-center font-display text-xl font-extrabold tracking-[-.02em]">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-[28ch] text-center text-base leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          );
        })}
      </ol>
    </>
  );
}
