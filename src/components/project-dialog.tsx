import Image from 'next/image';
import {ArrowUpRight,CheckCircle2} from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import type {ShowcaseProject} from '@/lib/project-showcase';

export default function ProjectDialog({project,open,onOpenChange}:{project:ShowcaseProject|null;open:boolean;onOpenChange:(open:boolean)=>void}) {
  if (!project) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[95vw] max-w-[1000px] sm:max-w-[1000px] max-h-[92vh] overflow-y-auto bg-white border-border p-0 rounded-2xl">
      <div className="bg-[#EAF0F6] p-5 md:p-8">
        <div className="rounded-xl shadow-[0_16px_32px_rgba(21,48,79,.1)] overflow-hidden bg-white border border-[#CED9E5]">
          <div className="h-10 flex items-center gap-2 border-b border-border bg-white px-4" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5D2E0]"/>
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5D2E0]"/>
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5D2E0]"/>
            <span className="ml-auto h-2.5 w-1/3 rounded-full bg-[#ECF2F7]"/>
          </div>
          <div className="flex items-center justify-center bg-white">
            <Image
              src={project.imageUrl}
              alt={'Complete project screenshot for ' + project.title}
              width={1400}
              height={900}
              unoptimized
              sizes="(max-width: 1000px) 95vw, 900px"
              className="block w-full h-auto max-h-[72vh] object-contain"
            />
          </div>
        </div>
        <p className="mt-4 text-xs text-[#607A92] text-center">{project.previewNote || 'Full project image, shown without cropping'}</p>
      </div>
      <div className="p-7 md:p-10">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl font-bold tracking-tight">{project.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-[1.7] pt-3">{project.longDescription||project.description}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-9 pt-8 mt-8 border-t border-border">
          {project.technologies?.length>0&&<div><h3 className="font-bold text-lg mb-4">Built with</h3><div className="flex flex-wrap gap-2">{project.technologies.map(tech=><span key={tech} className="border border-[#DAE4ED] bg-[#F3F7FB] text-[#36526D] rounded-full px-3 py-2 text-xs font-medium">{tech}</span>)}</div></div>}
          {project.advantages?.length>0&&<div><h3 className="font-bold text-lg mb-4">What makes it valuable</h3><ul className="space-y-3">{project.advantages.map((adv,i)=><li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"><CheckCircle2 size={17} className="text-theme-2 shrink-0 mt-0.5"/>{adv}</li>)}</ul></div>}
        </div>
        {project.features?.length>0&&<div className="pt-8 mt-8 border-t border-border"><h3 className="font-bold text-lg mb-4">Features delivered</h3><ul className="grid md:grid-cols-2 gap-3">{project.features.map((feature,i)=><li key={i} className="bg-[#F5F8FB] rounded-xl p-4 text-sm text-[#3E5469]">{feature}</li>)}</ul></div>}
        <div className="mt-9 flex flex-wrap gap-3 items-center">
          <a href="/#contact" onClick={()=>onOpenChange(false)} className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3.5 text-sm font-semibold hover:bg-[#305B83] transition-colors">Discuss a similar project <ArrowUpRight size={17}/></a>
          {project.websiteUrl?.startsWith('https://') && <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border text-primary text-sm font-semibold hover:bg-[#F3F7FB] transition-colors">Visit live website <ArrowUpRight size={17}/></a>}
        </div>
      </div>
    </DialogContent>
  </Dialog>;
}
