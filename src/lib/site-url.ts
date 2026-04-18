/**
 * Canonical site origin for metadata (Open Graph, canonical URLs, JSON-LD).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://skyrise.dev).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.replace(/^https?:\/\//, "");
  if (vercel) {
    return `https://${vercel}`;
  }
  return "http://localhost:9005";
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}
