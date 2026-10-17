import type { CSSProperties, ReactNode } from "react";

import { NotchGlyph } from "@/shared/components/brand/notch-glyph";
import { ArrowLeftIcon, MoreIcon, SendIcon } from "@/shared/components/icons";
import { cn } from "@/shared/lib/cn";

import { chatContent, sampleProof } from "../content";
import { whatsapp } from "../lib/whatsapp-theme";

type WhatsAppChatProps = {
  /** 1 = message typed in the input bar, 2 = sent and Notched. */
  stage: number;
  venue: string;
  /** Classes for the "Notched" message layer, so it fades like the others. */
  repliesClassName: string;
};

/** The small corner tail WhatsApp draws on the first bubble of a message. */
function BubbleTail({
  side,
  color,
}: {
  side: "left" | "right";
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 8 13"
      aria-hidden="true"
      style={{ color }}
      className={cn(
        "absolute top-0 h-[13px] w-2",
        side === "right" ? "-right-2" : "-left-2 -scale-x-100",
      )}
    >
      <path d="M0 0h8L1.5 9.5A2 2 0 0 1 0 8.8z" fill="currentColor" />
    </svg>
  );
}

/** Time and, on sent messages, WhatsApp's blue "read" double tick. */
function MessageMeta({ sent }: { sent?: boolean }) {
  return (
    <span
      className="float-right mt-1.5 ml-2 inline-flex items-center gap-0.5 text-[.6875rem]"
      style={{ color: whatsapp.meta }}
    >
      {sampleProof.time}
      {sent && (
        <svg
          viewBox="0 0 18 12"
          className="h-3 w-4.5"
          style={{ color: whatsapp.tick }}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          aria-hidden="true"
        >
          <path d="M1 6.5l3 3 6.5-7.5M7.5 9.5l1 0 6.5-7.5" />
        </svg>
      )}
    </span>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "left" | "right";
  children: ReactNode;
}) {
  const color = side === "right" ? whatsapp.bubbleOut : whatsapp.bubbleIn;
  const style: CSSProperties = {
    background: color,
    boxShadow: whatsapp.bubbleShadow,
  };
  return (
    <div
      style={style}
      className={cn(
        "relative rounded-lg px-2.5 pt-1.5 pb-1 text-sm leading-snug",
        side === "right" ? "rounded-tr-none" : "rounded-tl-none",
      )}
    >
      <BubbleTail side={side} color={color} />
      {children}
    </div>
  );
}

/** A light-mode WhatsApp chat with the Notchs bot. */
export function WhatsAppChat({
  stage,
  venue,
  repliesClassName,
}: WhatsAppChatProps) {
  const message = sampleProof.message(venue);

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: whatsapp.chat, color: whatsapp.text }}
    >
      <div
        className="flex items-center gap-2.5 border-b px-3 pt-5 pb-2.5"
        style={{ background: whatsapp.bar, borderColor: whatsapp.divider }}
      >
        <ArrowLeftIcon className="size-5 flex-none" />
        <span className="grid size-9 flex-none place-items-center rounded-full bg-ink text-volt">
          <NotchGlyph className="size-4.5" />
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[.9375rem] font-semibold">Notchs</span>
          <span className="block text-xs" style={{ color: whatsapp.meta }}>
            {chatContent.status}
          </span>
        </span>
        <MoreIcon className="size-5 flex-none" />
      </div>

      <div className="relative flex-1">
        <span
          className="absolute top-3 left-1/2 -translate-x-1/2 rounded-md px-2.5 py-1 text-[.6875rem]"
          style={{
            background: whatsapp.bar,
            color: whatsapp.meta,
            boxShadow: whatsapp.bubbleShadow,
          }}
        >
          {chatContent.today}
        </span>

        <div
          className={cn(repliesClassName, "flex flex-col gap-1.5 px-2.5 pt-12")}
        >
          <div className="mr-2 ml-auto max-w-[80%]">
            <Bubble side="right">
              {message}
              <MessageMeta sent />
            </Bubble>
          </div>
          <div className="mt-1 mr-auto ml-2 w-[80%]">
            <Bubble side="left">
              <strong className="font-semibold">{sampleProof.title}</strong>{" "}
              {venue} · {sampleProof.notch}
              <MessageMeta />
            </Bubble>
            <div className="mt-0.5 grid grid-cols-2 gap-0.5">
              {chatContent.replyButtons.map((label) => (
                <span
                  key={label}
                  className="rounded-lg py-2 text-center text-[.8125rem] font-medium"
                  style={{
                    background: whatsapp.bubbleIn,
                    color: whatsapp.link,
                    boxShadow: whatsapp.bubbleShadow,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input bar: the typed message waits for you to press send. */}
      <div className="flex items-end gap-1.5 px-1.5 pb-2">
        <p
          className="min-h-10 flex-1 rounded-3xl px-4 py-2.5 text-sm leading-snug"
          style={{
            background: whatsapp.bar,
            color: stage === 1 ? whatsapp.text : whatsapp.meta,
          }}
        >
          {stage === 1 ? message : chatContent.placeholder}
        </p>
        <span
          className={cn(
            "grid size-10 flex-none place-items-center rounded-full text-white",
            stage === 1 && "animate-blink",
          )}
          style={{ background: whatsapp.accent }}
        >
          <SendIcon className="size-4.5" />
          <span className="sr-only">Send</span>
        </span>
      </div>
    </div>
  );
}
