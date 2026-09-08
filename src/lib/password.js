// Pure password-generation and entropy logic — no React — so it can be
// smoke-tested directly with `node`.

export const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

// Characters that are easy to misread in most fonts.
const AMBIGUOUS = new Set(["0", "O", "1", "l", "I"]);

export function buildCharset({ upper, lower, digits, symbols, excludeAmbiguous }) {
  let chars = "";
  if (lower) chars += CHARSETS.lower;
  if (upper) chars += CHARSETS.upper;
  if (digits) chars += CHARSETS.digits;
  if (symbols) chars += CHARSETS.symbols;
  if (excludeAmbiguous) {
    chars = Array.from(chars)
      .filter((c) => !AMBIGUOUS.has(c))
      .join("");
  }
  // De-dupe in case of any overlap (there isn't any across these sets today,
  // but keeps the charset-size math correct if that ever changes).
  return Array.from(new Set(chars)).join("");
}

// bits of entropy = length * log2(charsetSize) — the real information-content
// formula, not a canned regex/pattern strength score.
export function calcEntropyBits(length, charsetSize) {
  if (!charsetSize || charsetSize <= 1 || !length) return 0;
  return length * Math.log2(charsetSize);
}

export function strengthLabel(bits) {
  if (bits < 40) return "Weak";
  if (bits < 60) return "Fair";
  if (bits < 80) return "Strong";
  return "Very strong";
}

function randomInt(max) {
  // Rejection sampling against a uniform 32-bit source avoids modulo bias.
  const cryptoObj = typeof globalThis !== "undefined" ? globalThis.crypto : undefined;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const range = Math.floor(0x100000000 / max) * max;
    const buf = new Uint32Array(1);
    let x;
    do {
      cryptoObj.getRandomValues(buf);
      x = buf[0];
    } while (x >= range);
    return x % max;
  }
  return Math.floor(Math.random() * max);
}

export function generatePassword(charset, length) {
  if (!charset || charset.length === 0 || length <= 0) return "";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += charset[randomInt(charset.length)];
  }
  return out;
}

export function generateBulk(charset, length, count) {
  const n = Math.max(1, Math.min(count || 1, 100));
  return Array.from({ length: n }, () => generatePassword(charset, length));
}
