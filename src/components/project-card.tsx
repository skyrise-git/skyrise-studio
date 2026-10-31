'use client';

import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ShowcaseProject } from '@/lib/project-showcase';
import { preferredDevice } from '@/lib/project-showcase';
import ProjectDevicePreview from '@/components/project-device-preview';

type Props = { project: ShowcaseProject; onClick?: () => void };

export default function ProjectCard({project,onClick}:Props) {
  const preferred = preferredDevice(project);
  const compact = preferred === 'phone';
  return <button
    type="button"
    onClick={onClick}
    tabIndex={onClick ? 0 : -1}
    disabled={!onClick}
    aria-label={'Open the '+project.title+' project details'}
    className={'group shrink-0 h-[390px] text-left rounded-2xl bg-white border border-[#D8E2EC] overflow-hidden shadow-[0_12px_32px_rgba(18,43,76,.06)] transition-[box-shadow,transform,border-color] duration-300 hover:shadow-[0_20px_38px_rgba(18,43,76,.13)] hover:border-[#94B4CF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ACCEE9] '+(compact?'w-[246px]':'w-[365px]')}
  >
    <div className="relative h-[260px] bg-[#F0F4F8] px-2 border-b border-[#E0E8F0]">
      <ProjectDevicePreview project={project} />
      <span className="absolute right-4 top-4 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-primary shadow-sm border border-[#DAE5EF]">
        <ExternalLink size={15}/>
      </span>
      {project.previewNote && <span className="absolute bottom-3 left-3 rounded-full text-[10px] px-2.5 py-1 bg-white/95 text-[#5B7085] border border-[#DEE7F0]">{project.previewNote}</span>}
    </div>
    <div className="px-5 pt-4 pb-5">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold tracking-tight text-[#192A3D] line-clamp-1">{project.title}</h3>
          <p className="text-xs text-muted-foreground mt-1.5 leading-[1.5] line-clamp-2">{project.description}</p>
        </div>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-3">Explore project <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></span>
    </div>
  </button>;
}
