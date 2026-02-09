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

export default function ProjectCard({ project, className, height = 'h-[400px]' }: ProjectCardProps) {
  return (
    <Link href="#" className={cn(
        "group relative block overflow-hidden rounded-lg border border-white/10 p-6 transition-all duration-300",
        "bg-secondary/5 backdrop-blur-sm hover:border-primary/30",
        height,
        className
      )}>
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/80 to-primary/50 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-60" aria-hidden="true" />
      
      {/* Background Image */}
      <Image
        src={project.imageUrl}
        alt={project.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 opacity-10 group-hover:opacity-20"
        data-ai-hint={project.imageHint}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full">
        <div className="bg-gradient-to-t from-background/80 via-background/50 to-transparent -m-6 p-6">
          <ArrowUpRight className="absolute top-4 right-4 h-6 w-6 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
          <h3 className="text-3xl font-semibold tracking-wide text-primary-foreground">{project.title}</h3>
          <p className="mt-2 text-muted-foreground font-body max-w-md text-balance">
            {project.description}
          </p>
          <span className="mt-4 inline-block font-code text-sm text-primary">
            View Dossier
          </span>
        </div>
      </div>
    </Link>
  );
}
