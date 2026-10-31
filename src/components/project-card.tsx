'use client';

import { ArrowUpRight, ExternalLink, MonitorPlay } from 'lucide-react';
import type { ShowcaseProject } from '@/lib/project-showcase';
import { getProjectWebsiteUrl, preferredDevice } from '@/lib/project-showcase';
import ProjectDevicePreview from '@/components/project-device-preview';

type Props = { project: ShowcaseProject; onClick?: () => void };

export default function ProjectCard({ project, onClick }: Props) {
  const compact = preferredDevice(project) === 'phone';
  const liveUrl = getProjectWebsiteUrl(project);
  const cardClass = 'group shrink-0 h-[390px] text-left rounded-2xl bg-white border border-[#D8E2EC] overflow-hidden shadow-[0_12px_32px_rgba(18,43,76,.06)] transition-[box-shadow,transform,border-color] duration-300 hover:shadow-[0_20px_38px_rgba(18,43,76,.13)] hover:border-[#94B4CF] focus-within:ring-2 focus-within:ring-[#ACCEE9] ' + (compact ? 'w-[246px]' : 'w-[365px]');
  const actionClass = 'inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-3 hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

  return <article className={cardClass}>
    <div className="relative h-[260px] bg-[#F0F4F8] border-b border-[#E0E8F0]">
      {onClick
        ? <button type="button" onClick={onClick}
            className="relative w-full h-full px-2 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary"
            aria-label={'See preview and details for ' + project.title}>
            <ProjectDevicePreview project={project}/>
            <span aria-hidden="true" className="absolute right-4 top-4 flex items-center justify-center h-8 w-8 rounded-full bg-white/90 text-primary shadow-sm border border-[#DAE5EF]">
              <MonitorPlay size={15}/>
            </span>
          </button>
        : <div className="relative w-full h-full px-2 flex items-center justify-center"><ProjectDevicePreview project={project}/></div>}
      {project.previewNote && <span className="pointer-events-none absolute bottom-3 left-3 rounded-full text-[10px] px-2.5 py-1 bg-white/95 text-[#5B7085] border border-[#DEE7F0]">{project.previewNote}</span>}
    </div>
    <div className="px-5 pt-4 pb-5">
      <h3 className="text-[16px] font-bold tracking-tight text-[#192A3D] line-clamp-1">{project.title}</h3>
      <p className="text-xs text-muted-foreground mt-1.5 leading-[1.5] line-clamp-2">{project.description}</p>
      {liveUrl
        ? <a href={liveUrl} target="_blank" rel="noopener noreferrer"
            className={actionClass} aria-label={'Explore ' + project.title + ' live website (opens in new tab)'}>
            Explore project <ExternalLink size={15} aria-hidden="true"/>
          </a>
        : onClick
          ? <button type="button" onClick={onClick} className={actionClass} aria-label={'View case study for ' + project.title}>
              View case study <ArrowUpRight size={15} aria-hidden="true"/>
            </button>
          : <span className="text-xs text-muted-foreground mt-3 inline-block">Case study available</span>}
    </div>
  </article>;
}
