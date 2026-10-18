
const whatsappNumber = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""
).replace(/\D/g, "");

export const isWhatsAppConfigured =
  /^\d{8,15}$/.test(whatsappNumber);

export const whatsappLoginUrl = isWhatsAppConfigured
  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("LOGIN")}`
  : "";
