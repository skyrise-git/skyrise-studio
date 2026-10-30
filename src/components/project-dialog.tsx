import Image from 'next/image';
import {CheckCircle2} from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import type {ImagePlaceholder} from '@/lib/placeholder-images';
export default function ProjectDialog({project,open,onOpenChange}:{project:ImagePlaceholder|null;open:boolean;onOpenChange:(open:boolean)=>void}){
  if(!project)return null;
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-border p-0 rounded-2xl">
      <div className="relative h-60 md:h-80 bg-secondary"><Image src={project.imageUrl} alt={project.title+' screenshot'} fill unoptimized className="object-cover" sizes="90vw"/></div>
      <div className="p-7 md:p-10">
        <DialogHeader>
          <p className="section-eyebrow mb-3">Project overview</p>
          <DialogTitle className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{project.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-4 leading-relaxed">{project.longDescription||project.description}</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-border">
          {project.technologies?.length?<div><h3 className="font-semibold text-lg mb-4">Technology</h3><div className="flex flex-wrap gap-2">{project.technologies.map(t=><span key={t} className="border border-border bg-secondary rounded-full px-3 py-2 text-xs">{t}</span>)}</div></div>:null}
          {project.advantages?.length?<div><h3 className="font-semibold text-lg mb-4">Key advantages</h3><ul className="space-y-3">{project.advantages.map((a,i)=><li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="text-theme-2 h-4 w-4 mt-0.5 shrink-0"/>{a}</li>)}</ul></div>:null}
        </div>
        {project.features?.length?<div className="mt-8 pt-7 border-t border-border"><h3 className="font-semibold text-lg mb-4">Features delivered</h3><ul className="grid md:grid-cols-2 gap-3">{project.features.map((f,i)=><li key={i} className="rounded-xl border border-border bg-[#F8FAFC] p-4 text-sm">{f}</li>)}</ul></div>:null}
      </div>
    </DialogContent>
  </Dialog>;
}