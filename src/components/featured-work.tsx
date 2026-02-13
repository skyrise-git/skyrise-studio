import ProjectCard from './project-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useState } from 'react';
import ProjectDialog from './project-dialog';

export default function FeaturedWork() {
  const projects = PlaceHolderImages;
  const [selectedProject, setSelectedProject] = useState<ImagePlaceholder | null>(null);
  const [open, setOpen] = useState(false);

  const handleProjectClick = (project: ImagePlaceholder) => {
    setSelectedProject(project);
    setOpen(true);
  };

  return (
    <section className="container mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-7xl font-logo uppercase">Featured <span className="text-theme-2 italic">Solutions</span></h2>
        <p className="text-muted-foreground font-code mt-2">Delivering scalable web and mobile applications for our global partners.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {projects[0] && (
          <div className="md:col-span-7">
            <ProjectCard 
              project={projects[0]} 
              height="h-[400px]" 
              onClick={() => handleProjectClick(projects[0])}
            />
          </div>
        )}
        {projects[1] && (
          <div className="md:col-span-5">
            <ProjectCard 
              project={projects[1]} 
              height="h-[400px]" 
              onClick={() => handleProjectClick(projects[1])}
            />
          </div>
        )}
        {projects[2] && (
          <div className="md:col-span-5">
            <ProjectCard 
              project={projects[2]} 
              height="h-[400px]" 
              onClick={() => handleProjectClick(projects[2])}
            />
          </div>
        )}
        {projects[3] && (
          <div className="md:col-span-7">
            <ProjectCard 
              project={projects[3]} 
              height="h-[400px]" 
              onClick={() => handleProjectClick(projects[3])}
            />
          </div>
        )}
      </div>

      <ProjectDialog 
        project={selectedProject} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </section>
  );
}
