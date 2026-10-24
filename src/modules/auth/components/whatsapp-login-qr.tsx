import { QRCodeSVG } from "qrcode.react";

import { GhostMark } from "@/shared/components/brand/status-marks";

import { qrHint, qrTitle } from "../content";
import { whatsappLoginUrl } from "../lib/whatsapp";

/**
 * QR of the same wa.me link as the button, for logging in from a desktop.
 * Always Ink on Paper so phone cameras read it in either theme; the Volt "N"
 * sits on its own Ink tile, never on Paper. Shown on phones too, for scanning
 * from another device.
 */
export function WhatsAppLoginQr() {
  if (!whatsappLoginUrl) return <GhostMark />;

  return (
    <figure className="animate-fade-in rounded-2xl bg-paper p-5 text-ink [animation-delay:300ms]">
      <QRCodeSVG
        value={whatsappLoginUrl}
        title={qrTitle}
        size={256}
        level="H"
        marginSize={4}
        bgColor="#f5f3ec"
        fgColor="#0f0f14"
        imageSettings={{
          src: "/brand/notchs-icon.svg",
          height: 52,
          width: 52,
          excavate: true,
        }}
        className="h-auto w-full"
      />
      <figcaption className="mt-3 text-center text-sm leading-snug text-pretty">
        <strong className="block font-semibold">{qrTitle}</strong>
        {qrHint}
      </figcaption>
    </figure>
  );
}
