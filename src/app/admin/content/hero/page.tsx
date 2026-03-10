"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Type, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditHeroPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    heading: 'SKYRISE',
    description: 'We are a premier Software Dev Team providing scalable software solutions. Leveraging Next.js, Node, React, Python, Rust, Go, and Flutter to build high-performance web, mobile, and desktop applications with robust backend APIs.',
    button1Text: 'Explore Dossiers',
    button1Link: '#projects',
    button2Text: 'Initiate Contact',
    button2Link: '#contact',
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snapshot = await get(ref(db, 'marketing/hero'));
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching hero data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await set(ref(db, 'marketing/hero'), formData);
      toast({
        title: 'Success',
        description: 'Hero section updated successfully!',
      });
    } catch (err) {
      console.error("Error updating hero:", err);
      toast({
        title: 'Error',
        description: 'Failed to update hero section. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
            <Type className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Edit Hero Section</h1>
            <p className="text-muted-foreground font-code text-sm">Update the main landing area</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Main Heading</label>
              <Input 
                required 
                value={formData.heading} 
                onChange={e => handleInputChange('heading', e.target.value)} 
                className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-logo text-xl tracking-widest" 
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Description</label>
              <Textarea 
                required 
                value={formData.description} 
                onChange={e => handleInputChange('description', e.target.value)} 
                className="bg-background/80 border-white/10 min-h-[120px] rounded-xl focus-visible:ring-primary/50 text-white p-4 font-body leading-relaxed" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Primary Button Text</label>
                <Input 
                  required 
                  value={formData.button1Text} 
                  onChange={e => handleInputChange('button1Text', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-code uppercase" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Primary Button Link</label>
                <Input 
                  required 
                  value={formData.button1Link} 
                  onChange={e => handleInputChange('button1Link', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-mono" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Secondary Button Text</label>
                <Input 
                  required 
                  value={formData.button2Text} 
                  onChange={e => handleInputChange('button2Text', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-code uppercase" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Secondary Button Link</label>
                <Input 
                  required 
                  value={formData.button2Link} 
                  onChange={e => handleInputChange('button2Link', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-mono" 
                />
              </div>
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
                  <>Saving Changes...</>
                ) : (
                  <>
                    Save Hero Content
                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
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
