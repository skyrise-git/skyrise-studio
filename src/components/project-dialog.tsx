import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImagePlaceholder } from "@/lib/placeholder-images";
import { CheckCircle2, Layers, Cpu, Zap } from "lucide-react";
import Image from "next/image";

interface ProjectDialogProps {
  project: ImagePlaceholder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-white/10">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-6 left-6 md:left-10">
              <Badge variant="secondary" className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 backdrop-blur-md">
                {project.imageHint || "Project Showcase"}
              </Badge>
              <DialogTitle className="text-3xl md:text-5xl font-logo uppercase tracking-tighter text-white drop-shadow-lg">
                {project.title}
              </DialogTitle>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                <Layers className="w-5 h-5" />
                <h3>Overview</h3>
              </div>
              <DialogDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {project.longDescription || project.description}
              </DialogDescription>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <h4>Technology Stack</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="outline" 
                      className="text-sm py-1 px-3 border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h4>Key Advantages</h4>
                </div>
                <ul className="space-y-2">
                  {project.advantages?.map((adv, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {project.features && project.features.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <h4 className="text-lg font-semibold text-white">Core Features</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center p-3 rounded-lg bg-secondary/10 border border-white/5 hover:border-primary/20 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
