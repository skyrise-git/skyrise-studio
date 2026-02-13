import ProjectCard from './project-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FeaturedWork() {
  const projects = PlaceHolderImages;

  return (
    <section className="container mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-logo">The Vault</h2>
        <p className="text-muted-foreground font-code mt-2">A selection of our featured dossiers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {projects[0] && (
          <div className="md:col-span-7">
            <ProjectCard project={projects[0]} height="h-[400px]" />
          </div>
        )}
        {projects[1] && (
          <div className="md:col-span-5">
            <ProjectCard project={projects[1]} height="h-[400px]" />
          </div>
        )}
        {projects[2] && (
          <div className="md:col-span-5">
            <ProjectCard project={projects[2]} height="h-[400px]" />
          </div>
        )}
        {projects[3] && (
          <div className="md:col-span-7">
            <ProjectCard project={projects[3]} height="h-[400px]" />
          </div>
        )}
      </div>
    </section>
  );
}
