"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Cpu } from 'lucide-react';

export default function TechStackContentPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [data, setData] = useState({
    tag: 'Engineering scope',
    headline: 'Software,',
    headlineHighlight: 'ships & models',
    description:
      'We build serious products: distributed backends, mobile clients, and AI that fits your workflow — not a logo grid of libraries.',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'content/techStack'));
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
      await set(ref(db, 'content/techStack'), data);
      toast({
        title: "Section updated",
        description: "Engineering capabilities copy has been saved.",
      });
    } catch (err: any) {
      console.error("Error saving content:", err);
      toast({
        title: "Update Failed",
        description: "Failed to update engineering section.",
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
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-logo uppercase">Engineering section</h1>
          <p className="text-muted-foreground font-code text-sm">Copy for software, mobile & AI capabilities (home page)</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Small Tag Text</label>
            <Input required value={data.tag} onChange={e => handleChange('tag', e.target.value)} className="bg-background/80 border-white/10 text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Headline Normal Text</label>
              <Input required value={data.headline} onChange={e => handleChange('headline', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Headline Highlight (Italic)</label>
              <Input required value={data.headlineHighlight} onChange={e => handleChange('headlineHighlight', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Description</label>
            <Textarea required value={data.description} onChange={e => handleChange('description', e.target.value)} className="bg-background/80 border-white/10 min-h-[100px] text-white" />
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
