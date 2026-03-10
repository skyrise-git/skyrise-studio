"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue, remove } from "firebase/database";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Pencil, 
  Trash2, 
  ExternalLink,
  PlusCircle,
  Search,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        }));
        // Sort by date newest first
        projectList.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setProjects(projectList);
      } else {
        setProjects([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await remove(ref(db, `projects/${projectToDelete}`));
      toast({
        title: "Project Deleted",
        description: "The project has been permanently removed from the database.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProjectToDelete(null);
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Manage Projects</h1>
            <p className="text-muted-foreground font-code text-sm">Update or remove existing showcase works</p>
          </div>
        </div>
        <Link href="/admin/projects/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-logo uppercase tracking-widest gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-10 bg-secondary/5 border-white/10 rounded-xl"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-secondary/5 border border-white/5 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white">No projects found</h3>
          <p className="text-muted-foreground text-sm mt-1">Try a different search or add a new project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="group bg-secondary/5 hover:bg-secondary/10 border border-white/5 hover:border-white/10 p-4 rounded-xl transition-all duration-300 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="relative w-full md:w-32 h-24 rounded-lg overflow-hidden border border-white/5 flex-shrink-0 bg-background/50">
                {project.imageUrl && (
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
              
              <div className="flex-grow space-y-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                   {project.technologies?.slice(0, 3).map((tech: string) => (
                     <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10 uppercase font-code">
                       {tech}
                     </span>
                   ))}
                   {project.technologies?.length > 3 && (
                     <span className="text-[10px] px-2 py-0.5 text-muted-foreground uppercase font-code">
                       +{project.technologies.length - 3} more
                     </span>
                   )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link href={`/admin/projects/edit/${project.id}`}>
                  <Button variant="outline" size="icon" className="border-white/10 hover:bg-blue-500/20 hover:text-blue-400 h-10 w-10">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-white/10 hover:bg-destructive/20 hover:text-destructive h-10 w-10"
                  onClick={() => setProjectToDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-xl border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-logo uppercase">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground mt-2">
              This action cannot be undone. This will permanently delete the project
              from the showcase and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="bg-secondary/20 border-white/5 hover:bg-secondary/30 transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold uppercase tracking-widest"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
