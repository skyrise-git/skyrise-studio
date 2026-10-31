'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { PreviewDevice, ShowcaseProject } from '@/lib/project-showcase';
import { preferredDevice } from '@/lib/project-showcase';

function ScreenImage({ project, onDimensions }: { project: ShowcaseProject; onDimensions: (width: number, height: number) => void }) {
  return <Image
    src={project.imageUrl}
    alt={project.title + ' product interface'}
    fill
    unoptimized
    sizes="(max-width: 768px) 360px, 420px"
    className="object-contain object-top"
    onLoad={event => {
      const image = event.currentTarget;
      if (image.naturalWidth && image.naturalHeight) onDimensions(image.naturalWidth, image.naturalHeight);
    }}
  />;
}

/**
 * Matches device shell to real screenshot dimensions, rather than putting a
 * vertical mobile screenshot into a horizontal laptop mockup.
 * An optional previewDevice field on the existing project record overrides detection.
 */
export default function ProjectDevicePreview({
  project, large = false,
}: {
  project: ShowcaseProject;
  large?: boolean;
}) {
  const explicit = preferredDevice(project);
  const [detected, setDetected] = useState<PreviewDevice | undefined>();
  useEffect(() => setDetected(undefined), [project.imageUrl, project.id]);
  const device = explicit ?? detected ?? 'laptop';

  function detect(width: number, height: number) {
    if (explicit) return;
    const ratio = width / height;
    const next: PreviewDevice = ratio < 0.79 ? 'phone' : ratio < 1.22 ? 'tablet' : 'laptop';
    setDetected(previous => previous === next ? previous : next);
  }

  if (device === 'phone') {
    return <div className={'w-full flex justify-center items-center '+(large ? 'min-h-[440px]' : 'h-[244px]')}>
      <div className={'relative shrink-0 bg-[#172335] border-[5px] border-[#172335] rounded-[30px] shadow-[0_12px_22px_rgba(24,43,70,.22)] '+(large ? 'h-[420px] w-[206px]' : 'h-[224px] w-[114px]')}>
        <div className="absolute inset-[4px] rounded-[22px] overflow-hidden bg-white">
          <ScreenImage project={project} onDimensions={detect} />
          <span aria-hidden="true" className="absolute z-10 left-1/2 top-0 -translate-x-1/2 h-[10px] w-[42%] bg-[#172335] rounded-b-xl" />
        </div>
      </div>
    </div>;
  }

  if (device === 'tablet') {
    return <div className={'w-full flex justify-center items-center '+(large ? 'min-h-[440px]' : 'h-[244px]')}>
      <div className={'relative bg-[#1C293C] rounded-[18px] shadow-[0_14px_25px_rgba(24,43,70,.19)] '+(large ? 'w-[430px] h-[320px] p-[11px]' : 'w-[276px] h-[210px] p-[8px]')}>
        <div className="relative w-full h-full overflow-hidden rounded-[9px] bg-white">
          <ScreenImage project={project} onDimensions={detect} />
        </div>
        <span aria-hidden="true" className="absolute left-1/2 bottom-[3px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#627086]" />
      </div>
    </div>;
  }

  return <div className={'w-full flex flex-col justify-center items-center '+(large ? 'min-h-[440px]' : 'h-[244px]')}>
    <div className={'bg-[#26364D] rounded-t-[12px] p-[7px] shadow-[0_12px_24px_rgba(24,43,70,.14)] '+(large ? 'w-[590px] max-w-full' : 'w-[314px] max-w-full')}>
      <div className={'relative overflow-hidden rounded-[5px] bg-white '+(large ? 'aspect-[16/10]' : 'aspect-[16/10]')}>
        <ScreenImage project={project} onDimensions={detect} />
      </div>
    </div>
    <div aria-hidden="true" className={'h-[9px] bg-gradient-to-b from-[#CBD5E0] to-[#EDF2F7] rounded-b-[42%] shadow-[0_5px_9px_rgba(24,43,70,.13)] '+(large ? 'w-[650px] max-w-full' : 'w-[346px] max-w-full')}>
      <div className="bg-[#AABACB]/65 h-[2px] w-[24%] rounded-b-lg mx-auto" />
    </div>
  </div>;
}
