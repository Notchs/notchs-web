/**
 * RFC 6238 time-based codes, made on the counter phone itself so it keeps
 * working offline. Matches the API's verifier (notchs-api scans/verifier.py):
 * HMAC-SHA1 over the 30-second slot number, 6 digits.
 */

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(secret: string): Uint8Array<ArrayBuffer> {
  const clean = secret.replace(/=+$/, "").toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;
  for (const char of clean) {
    const index = BASE32.indexOf(char);
    if (index === -1) throw new Error("Not a base32 secret");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

export const slotOf = (unixSeconds: number, intervalSeconds: number) =>
  Math.floor(unixSeconds / intervalSeconds);

export async function importSecret(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    base32Decode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
}

export async function codeAt(key: CryptoKey, slot: number, digits = 6) {
  const counter = new ArrayBuffer(8);
  const view = new DataView(counter);
  view.setUint32(0, Math.floor(slot / 2 ** 32));
  view.setUint32(4, slot >>> 0);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, counter));
  const offset = digest[digest.length - 1] & 0x0f;
  const number =
    ((digest[offset] & 0x7f) << 24) |
    (digest[offset + 1] << 16) |
    (digest[offset + 2] << 8) |
    digest[offset + 3];
  return String(number % 10 ** digits).padStart(digits, "0");
}
