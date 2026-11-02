export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export const isEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

/** Digits of an Indian mobile number, without the +91 or a leading 0. */
export function mobileDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export const isMobile = (phone: string) =>
  /^[6-9]\d{9}$/.test(mobileDigits(phone));
