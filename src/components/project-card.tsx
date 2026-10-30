import Image from 'next/image';
import {ArrowUpRight} from 'lucide-react';
import type {ImagePlaceholder} from '@/lib/placeholder-images';
import {cn} from '@/lib/utils';
type Props={project:ImagePlaceholder;className?:string;height?:string;onClick?:()=>void};
export default function ProjectCard({project,className,onClick}:Props){
  return <button type="button" onClick={onClick} disabled={!onClick} className={cn('group block w-full h-full text-left overflow-hidden bg-white rounded-2xl border border-border shadow-[0_12px_36px_rgba(17,36,58,.04)] hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(17,36,58,.10)] transition-all disabled:cursor-default',className)}>
    <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#EDF1F6]">
      <Image src={project.imageUrl} alt={project.title+' project preview'} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"/>
      <div className="absolute right-5 top-5 flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-primary shadow-md"><ArrowUpRight className="h-5 w-5"/></div>
    </div>
    <div className="p-6 md:p-7">
      <p className="text-xs uppercase tracking-[.13em] text-theme-2 font-semibold mb-3">Selected project</p>
      <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">{project.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mt-3 line-clamp-3">{project.description}</p>
      <span className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-primary">View case study <ArrowUpRight className="h-4 w-4"/></span>
    </div>
  </button>;
}