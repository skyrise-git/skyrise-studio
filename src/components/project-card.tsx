import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type ProjectCardProps = {
  project: ImagePlaceholder;
  className?: string;
  height?: string;
};

export default function ProjectCard({ project, className, height = 'h-[400px]', onClick }: ProjectCardProps & { onClick?: () => void }) {
  const Component = onClick ? 'div' : Link;
  const props = onClick ? { onClick, role: 'button', tabIndex: 0 } : { href: '#' };

  return (
    // @ts-ignore
    <Component {...props} className={cn(
        "group relative block overflow-hidden rounded-xl border border-white/5 p-8 transition-all duration-500 cursor-pointer",
        "bg-[#050505] shadow-2xl hover:border-primary/40",
        height,
        className
      )}>
      {/* Background Image Enhancement */}
      <div className="absolute inset-0 bg-black/60 z-10 transition-colors duration-500 group-hover:bg-black/40" />
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-30 group-hover:opacity-60"
        data-ai-hint={project.imageHint}
      />
      
      {/* Main Content Bottom Aligned */}
      <div className="relative z-20 flex flex-col justify-end items-start h-full max-w-2xl px-4 md:px-0">
        <ArrowUpRight className="absolute top-0 right-0 h-8 w-8 text-white/30 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
        
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-logo tracking-widest text-primary uppercase leading-tight mb-4 transition-all duration-500 group-hover:scale-[1.02] origin-left">
          {project.title}
        </h3>
        
        <p className="text-lg md:text-xl text-white/60 font-body max-w-md text-balance mb-6 transition-colors duration-500 group-hover:text-white/80">
          {project.description}
        </p>
        
        <div className="flex items-center gap-2 group/btn">
          <span className="font-logo text-sm md:text-base text-primary/80 uppercase tracking-widest border-b border-primary/30 pb-1 transition-all duration-300 group-hover/btn:text-primary group-hover/btn:border-primary">
            View Dossier
          </span>
        </div>
      </div>

      {/* Interactive Border/Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Component>
  );
}
