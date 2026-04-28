"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Layout } from 'lucide-react';

export default function HeroContentPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [data, setData] = useState({
    title: 'SKYRISE',
    subtitle: 'We are a premier Software Dev Team providing scalable software solutions...',
    btn1Text: 'Explore Dossiers',
    btn1Url: '/#projects',
    btn2Text: 'Initiate Contact',
    btn2Url: '/#contact',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'content/hero'));
        if (snapshot.exists()) {
          setData(snapshot.val());
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await set(ref(db, 'content/hero'), data);
      toast({
        title: "Hero Updated",
        description: "Your changes have been deployed to the live site.",
      });
    } catch (err: any) {
      console.error("Error saving content:", err);
      toast({
        title: "Update Failed",
        description: "There was an error saving your changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading content...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 bg-secondary/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
        <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
          <Layout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-logo uppercase">Hero Section Edit</h1>
          <p className="text-muted-foreground font-code text-sm">Update the main landing area</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Main Title</label>
            <Input required value={data.title} onChange={e => handleChange('title', e.target.value)} className="bg-background/80 border-white/10 text-white" />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Subtitle</label>
            <Textarea required value={data.subtitle} onChange={e => handleChange('subtitle', e.target.value)} className="bg-background/80 border-white/10 min-h-[100px] text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
               <label className="text-sm font-code tracking-wide text-white uppercase">Button 1 Text</label>
               <Input required value={data.btn1Text} onChange={e => handleChange('btn1Text', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
               <label className="text-sm font-code tracking-wide text-white uppercase">Button 1 URL</label>
               <Input required value={data.btn1Url} onChange={e => handleChange('btn1Url', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
               <label className="text-sm font-code tracking-wide text-white uppercase">Button 2 Text</label>
               <Input required value={data.btn2Text} onChange={e => handleChange('btn2Text', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
               <label className="text-sm font-code tracking-wide text-white uppercase">Button 2 URL</label>
               <Input required value={data.btn2Url} onChange={e => handleChange('btn2Url', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <Button type="submit" disabled={isSaving} className="font-logo font-bold uppercase tracking-widest px-8">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
