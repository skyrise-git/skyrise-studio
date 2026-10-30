'use client';
import Image from 'next/image';
import {ArrowUpRight,ExternalLink} from 'lucide-react';
import type {ImagePlaceholder} from '@/lib/placeholder-images';
import {cn} from '@/lib/utils';

type Props = { project: ImagePlaceholder; className?: string; height?: string; onClick?: () => void };
export default function ProjectCard({ project,className,onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={'View full case study and screenshots for ' + project.title}
      className={cn(
        'group block w-full h-full text-left overflow-hidden bg-white rounded-2xl border border-[#D7E0EA]',
        'shadow-[0_14px_38px_rgba(16,42,74,.065)] transition-[transform,box-shadow,border-color] duration-300',
        'hover:-translate-y-1 hover:border-[#93BAD8] hover:shadow-[0_24px_54px_rgba(16,42,74,.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#B6D5EF]',
        className,
      )}
    >
      <div className="bg-[#EAF0F6] p-4 md:p-5">
        <div className="overflow-hidden rounded-[12px] bg-white ring-1 ring-[#C8D4E0] shadow-[0_12px_28px_rgba(21,48,79,.10)]">
          <div className="flex items-center gap-1.5 h-9 px-4 bg-[#F9FBFD] border-b border-[#DCE5ED]" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-[#B9C9D8]" />
            <span className="w-2 h-2 rounded-full bg-[#B9C9D8]" />
            <span className="w-2 h-2 rounded-full bg-[#B9C9D8]" />
            <span className="ml-auto w-1/3 h-2.5 rounded-full bg-[#E5EDF4]" />
          </div>
          <div className="relative h-[255px] sm:h-[300px] lg:h-[340px] bg-white flex items-center justify-center overflow-hidden">
            <Image
              src={project.imageUrl}
              alt={'Full website or platform preview: ' + project.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 660px"
              unoptimized
              className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.015]"
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 px-1 text-[11px] text-[#698198]">
          <span>Project preview · Original proportions</span>
          <span className="inline-flex items-center gap-1.5 text-primary font-semibold"><ExternalLink className="h-3.5 w-3.5"/> View details</span>
        </div>
      </div>
      <div className="px-6 md:px-7 py-6">
        <div className="flex justify-between items-start gap-4">
          <div><h3 className="text-xl md:text-2xl leading-snug font-bold tracking-tight text-foreground">{project.title}</h3>
            <p className="mt-3 text-sm leading-[1.65] text-muted-foreground line-clamp-3">{project.description}</p>
          </div>
          <span className="shrink-0 grid place-items-center w-10 h-10 bg-[#EFF5FA] text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-colors"><ArrowUpRight size={19}/></span>
        </div>
        <span className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">
          Explore this project <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
        </span>
      </div>
    </button>
  );
}
