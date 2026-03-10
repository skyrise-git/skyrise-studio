"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function EditGlobalPresencePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    heading: 'Global Presence',
    highlight: 'Presence',
    description: 'From the USA and Canada to Europe, Africa, and Asia, we deliver high-performance engineering solutions worldwide.',
  });

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const snapshot = await get(ref(db, 'marketing/global'));
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching global data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await set(ref(db, 'marketing/global'), formData);
      toast({
        title: 'Success',
        description: 'Global section updated successfully!',
      });
    } catch (err) {
      console.error("Error updating global section:", err);
      toast({
        title: 'Error',
        description: 'Failed to update global section. Please try again.',
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
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Edit Global Presence</h1>
            <p className="text-muted-foreground font-code text-sm">Update map heading text</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Main Title</label>
                <Input 
                  required 
                  value={formData.heading} 
                  onChange={e => handleInputChange('heading', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-white font-logo text-xl tracking-widest" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-code tracking-wide text-white uppercase ml-1">Highlighted Word</label>
                <Input 
                  required 
                  value={formData.highlight} 
                  onChange={e => handleInputChange('highlight', e.target.value)} 
                  className="bg-background/80 border-white/10 h-12 rounded-xl focus-visible:ring-primary/50 text-theme-2 italic font-logo text-xl tracking-widest" 
                />
              </div>
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
                    Save Global Details
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
