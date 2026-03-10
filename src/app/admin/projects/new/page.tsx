"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, push } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusSquare, SendHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AddProjectPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const techArray = projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean);
      const advArray = projectForm.advantages.split(',').map(a => a.trim()).filter(Boolean);
      const featArray = projectForm.features.split(',').map(f => f.trim()).filter(Boolean);

      await push(ref(db, 'projects'), {
        title: projectForm.title,
        description: projectForm.description,
        longDescription: projectForm.longDescription,
        technologies: techArray,
        advantages: advArray,
        features: featArray,
        imageUrl: projectForm.imageUrl,
        imageHint: projectForm.imageHint,
        createdAt: new Date().toISOString(),
      });
      toast({
        title: 'Success',
        description: 'Project added successfully!',
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
    } catch (err) {
      console.error("Error adding project:", err);
      toast({
        title: 'Error',
        description: 'Failed to add project. Please try again.',
        variant: 'destructive',
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
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Long Description</label>
              <Textarea 
                required 
                placeholder="Detailed overview and background about the project's goals..."
                value={projectForm.longDescription} 
                onChange={e => handleInputChange('longDescription', e.target.value)} 
                className="bg-background/80 border-white/10 min-h-[120px] rounded-xl focus-visible:ring-primary/50 text-white p-4" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Image URL</label>
              <Input 
                required 
                placeholder="https://example.com/image.jpg"
                value={projectForm.imageUrl} 
                onChange={e => handleInputChange('imageUrl', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-mono" 
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Image Alt/Hint</label>
              <Input 
                required 
                placeholder="Descriptive text for the image"
                value={projectForm.imageHint} 
                onChange={e => handleInputChange('imageHint', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white" 
              />
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
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Project Advantages</label>
              <Textarea 
                required 
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
