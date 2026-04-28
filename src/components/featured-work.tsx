"use client";

import ProjectCard from './project-card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';
import ProjectDialog from './project-dialog';
import { ref, get, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function FeaturedWork() {
  const [projects, setProjects] = useState<ImagePlaceholder[]>([]);
  const [selectedProject, setSelectedProject] = useState<ImagePlaceholder | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionContent, setSectionContent] = useState({
    headline: 'Featured',
    headlineHighlight: 'Solutions',
    description: 'Delivering scalable web and mobile applications for our global partners.'
  });

  useEffect(() => {
    // Fetch Projects with real-time listener
    const projectsRef = ref(db, 'projects');
    const unsubProjects = onValue(projectsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const fetchedProjects: ImagePlaceholder[] = [];
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            // Greatly relax validation to allow Base64 and optional images
            fetchedProjects.push({ 
              id: childSnapshot.key, 
              ...data,
              // Fallback for missing images
              imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1572177662444-1f736cbd65b8?q=80&w=1000&auto=format&fit=crop"
            } as ImagePlaceholder);
          });

          // Sort by createdAt descending (newest first)
          fetchedProjects.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          
          setProjects(fetchedProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Error processing projects:", error);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error fetching projects listener:", error);
      setIsLoading(false);
    });

    // Fetch Section Content
    const unsubContent = onValue(ref(db, 'content/projects'), (snapshot) => {
      if (snapshot.exists()) {
        setSectionContent(snapshot.val());
      }
    });

    return () => {
      unsubProjects();
      unsubContent();
    };
  }, []);

  const handleProjectClick = (project: ImagePlaceholder) => {
    setSelectedProject(project);
    setOpen(true);
  };

  if (!isLoading && projects.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
      <div className="text-center mb-16 px-4">
        <h2 className="text-5xl md:text-7xl font-logo uppercase">
          {sectionContent.headline} <span className="text-theme-2">{sectionContent.headlineHighlight}</span>
        </h2>
        <p className="text-muted-foreground font-code mt-4 max-w-2xl mx-auto">
          {sectionContent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-4">
        {projects.map((project, index) => {
          const isWide = index % 4 === 0 || index % 4 === 3;
          
          return (
            <div 
              key={project.id || index} 
              className={isWide ? "md:col-span-7" : "md:col-span-5"}
            >
              <ProjectCard 
                project={project} 
                height="h-[400px] md:h-[500px]" 
                onClick={() => handleProjectClick(project)}
              />
            </div>
          );
        })}
      </div>

      <ProjectDialog 
        project={selectedProject} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </section>
  );
}
