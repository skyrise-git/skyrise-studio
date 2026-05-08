const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALNUM[Math.floor(Math.random() * ALNUM.length)];
  }
  return out;
}

/** e.g. SKY-K7N2-P8Q4 — easy to dictate, avoids 0/O and 1/I */
export function generateClientAccessCode(): string {
  return `SKY-${randomSegment(4)}-${randomSegment(4)}`;
}

export function normalizeClientCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
