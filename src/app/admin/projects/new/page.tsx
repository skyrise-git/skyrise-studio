"use client";

import { useState, useRef } from 'react';
import { db, storage } from '@/lib/firebase';
import { ref, push } from 'firebase/database';
import { ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusSquare, SendHorizontal, Upload, ImageIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AddProjectPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: '',
    advantages: '',
    features: '',
    imageUrl: '',
    imageHint: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Downscale/Compress image for Base64 storage (Prevents DB hangs)
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Quality 0.7 for good balance between size and detail
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          setProjectForm(prev => ({ ...prev, imageUrl: base64String }));
          
          console.log("Image compressed. Size reduction:", (base64String.length / (event.target?.result as string).length) * 100, "%");
          
          toast({
            title: "Image Processed",
            description: "Image optimized for database storage.",
          });
          setIsUploading(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Processing error:", error);
      toast({
        title: "Processing Failed",
        description: "Error optimizing image.",
        variant: "destructive",
      });
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Starting project submission...", projectForm.title);
    
    try {
      const isValidImageUrl = !projectForm.imageUrl || (
        projectForm.imageUrl.startsWith('/') || 
        projectForm.imageUrl.startsWith('http://') || 
        projectForm.imageUrl.startsWith('https://') ||
        projectForm.imageUrl.startsWith('data:image/')
      );

      if (!isValidImageUrl) {
        toast({
          title: "Invalid Image URL",
          description: "Image URL must start with /, http://, or https://",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const techArray = projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean);
      const advArray = projectForm.advantages.split(',').map(a => a.trim()).filter(Boolean);
      const featArray = projectForm.features.split(',').map(f => f.trim()).filter(Boolean);

      console.log("Payload data arrays prepared. Sending to Firebase...");

      const projectData = {
        title: projectForm.title,
        description: projectForm.description,
        longDescription: projectForm.longDescription,
        technologies: techArray,
        advantages: advArray,
        features: featArray,
        imageUrl: projectForm.imageUrl,
        imageHint: projectForm.imageHint,
        createdAt: new Date().toISOString(),
      };

      await push(ref(db, 'projects'), projectData);
      
      console.log("Firebase Push successful!");
      
      toast({
        title: "Project Added",
        description: "Your new work has been successfully published.",
      });
      
      setProjectForm({
        title: '',
        description: '',
        longDescription: '',
        technologies: '',
        advantages: '',
        features: '',
        imageUrl: '',
        imageHint: '',
      });
    } catch (err: any) {
      console.error("CRITICAL Error adding project:", err);
      toast({
        title: "Database Error",
        description: err.message || "Failed to publish. Check if image is too large.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
            <PlusSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Create New Project</h1>
            <p className="text-muted-foreground font-code text-sm">Publish new works to your portfolio</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl mt-8">
        <form onSubmit={handleProjectSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Project Title</label>
              <Input 
                required 
                placeholder="e.g. Modern E-commerce Platform"
                value={projectForm.title} 
                onChange={e => handleInputChange('title', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white" 
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Short Description</label>
              <Input 
                required 
                placeholder="Brief summary of the project"
                value={projectForm.description} 
                onChange={e => handleInputChange('description', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white" 
              />
            </div>
            
            <div className="space-y-3 lg:col-span-2">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Long Description (Optional)</label>
              <Textarea 
                placeholder="Detailed overview and background about the project's goals..."
                value={projectForm.longDescription} 
                onChange={e => handleInputChange('longDescription', e.target.value)} 
                className="bg-background/80 border-white/10 min-h-[120px] rounded-xl focus-visible:ring-primary/50 text-white p-4" 
              />
            </div>

            <div className="space-y-3 lg:col-span-2">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1 block mb-2">Project Image</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className={cn(
                    "relative group cursor-pointer border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] bg-secondary/10 hover:bg-secondary/20 backdrop-blur-sm overflow-hidden",
                    projectForm.imageUrl ? "border-primary/40" : "border-white/10 hover:border-primary/20"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  {projectForm.imageUrl ? (
                    <>
                      <img src={projectForm.imageUrl} alt="Upload Result" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-code uppercase tracking-widest text-sm">Replace Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                      <div className="p-5 bg-primary/10 rounded-2xl border border-primary/20 group-hover:scale-110 transition-transform">
                        {isUploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <ImageIcon className="w-8 h-8 text-primary" />}
                      </div>
                      <div className="space-y-1 text-center">
                        <p className="text-white font-logo uppercase tracking-widest">
                          {isUploading ? "Uploading File..." : "Click to Upload"}
                        </p>
                        <p className="text-muted-foreground font-code text-[11px] uppercase tracking-wider">PNG, JPG, WEBP (Max 5MB)</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-4">
                  {!projectForm.imageUrl?.startsWith('data:') ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-code tracking-[0.2em] text-muted-foreground uppercase ml-1">Cloud Image URL (Optional)</label>
                      <Input 
                        placeholder="https://example.com/image.jpg"
                        value={projectForm.imageUrl} 
                        onChange={e => handleInputChange('imageUrl', e.target.value)} 
                        className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-mono" 
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2 animate-in zoom-in-95">
                      <p className="text-[10px] font-code tracking-[0.2em] text-primary uppercase">Image Data Captured</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-code truncate max-w-[150px]">Base64 Image Data</span>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleInputChange('imageUrl', '')}
                          className="text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="text-[10px] font-code tracking-[0.2em] text-muted-foreground uppercase ml-1">Dossier Alt Text (Optional)</label>
                    <Input 
                      placeholder="Descriptive text for the image"
                      value={projectForm.imageHint} 
                      onChange={e => handleInputChange('imageHint', e.target.value)} 
                      className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1 block">Tech Stack</label>
              <Input 
                required 
                placeholder="React, Next.js, Firebase (Comma separated)"
                value={projectForm.technologies} 
                onChange={e => handleInputChange('technologies', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-mono" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1 block">Key Features</label>
              <Input 
                required 
                placeholder="User Auth, Admin Panel, Analytics (Comma separated)"
                value={projectForm.features} 
                onChange={e => handleInputChange('features', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white" 
              />
            </div>

            <div className="space-y-3 lg:col-span-2 mt-2">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Project Advantages (Optional)</label>
              <Textarea 
                placeholder="High Performance, Scalable, Secure (Comma separated points)"
                value={projectForm.advantages} 
                onChange={e => handleInputChange('advantages', e.target.value)} 
                className="bg-background/80 border-white/10 min-h-[100px] rounded-xl focus-visible:ring-primary/50 text-white p-4" 
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="font-logo font-bold uppercase tracking-widest px-10 h-14 rounded-xl text-base group overflow-hidden relative shadow-xl hover:shadow-primary/20"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSubmitting ? (
                  <>Publishing Project...</>
                ) : (
                  <>
                    Publish Project
                    <SendHorizontal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
