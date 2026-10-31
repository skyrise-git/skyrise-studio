import type { ImagePlaceholder } from '@/lib/placeholder-images';

export type PreviewDevice = 'laptop' | 'phone' | 'tablet';
export type ShowcaseProject = ImagePlaceholder & {
  websiteUrl?: string;
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
