import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type PreviewDevice = 'laptop' | 'phone' | 'tablet';
export type ShowcaseProject = ImagePlaceholder & {
  websiteUrl?: string;
  liveUrl?: string;
  projectUrl?: string;
  url?: string;
  link?: string;
  website?: string;
  previewDevice?: PreviewDevice;
  previewNote?: string;
};

export function preferredDevice(project: ShowcaseProject): PreviewDevice | undefined {
  if (project.previewDevice === 'laptop' || project.previewDevice === 'phone' || project.previewDevice === 'tablet') return project.previewDevice;
  const text = [project.title, project.imageHint, project.websiteUrl, ...(project.technologies ?? [])].join(' ').toLowerCase();
  // The currently published NESTS source is a phone screenshot, not a desktop screenshot.
  if (/nests|nestsafrica/.test(text)) return 'phone';
  if (/leasio|nova commerce/.test(text)) return 'laptop';
  if (/android|ios|react native|mobile app|flutter/.test(text)) return 'phone';
  return undefined;
}


/** Return a safe public destination, or null so an unlinked project opens its case study. */
export function normalizeProjectWebsiteUrl(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value || /\s/.test(value)) return null;
  const candidate = /^https?:\/\//i.test(value) ? value : /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?$/i.test(value) ? 'https://' + value : value;
  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.localhost')) return null;
    if (/^(?:127|10|192\.168)\./.test(host) || host === '0.0.0.0' || host === '::1') return null;
    return url.href;
  } catch { return null; }
}

/** Content stays editable in Firebase; only verified existing portfolio sites have a default. */
export function getProjectWebsiteUrl(project: ShowcaseProject): string | null {
  const sources = [project.websiteUrl, project.liveUrl, project.projectUrl, project.url, project.link, project.website];
  for (const source of sources) {
    const url = normalizeProjectWebsiteUrl(source);
    if (url) return url;
  }

  // Some older records used the entire project description as the website address.
  const description = project.description?.trim();
  if (description && /^(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s]*)?$/i.test(description)) {
    const url = normalizeProjectWebsiteUrl(/^(?:https?:\/\/)/i.test(description) ? description : 'https://' + description);
    if (url) return url;
  }
  const name = [project.title, project.id].join(' ').toLowerCase();
  if (/nests|nestsafrica/.test(name)) return 'https://www.nestsafrica.com/';
  if (/leasio/.test(name)) return 'https://www.leasio.co.za/';
  return null;
}
