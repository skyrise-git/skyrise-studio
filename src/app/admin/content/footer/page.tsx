"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, PanelBottom } from 'lucide-react';

export default function FooterContentPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    contactHeading: 'Get In Touch',
    contactText: "Have a project in mind or just want to say hello? We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.",
    col1Header: 'Global Delivery',
    col1Text: 'USA • Canada • Europe • South Africa • Zimbabwe',
    col2Header: 'Core Services',
    col2Text: 'Custom Software • Mobile Apps • Web Design • Cloud Solutions',
    companyName: 'SKYRISE',
    copyright: 'SkyRise Softwares. All Rights Reserved.',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'content/footer'));
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
      await set(ref(db, 'content/footer'), data);
      alert('Footer section content saved successfully!');
    } catch (err) {
      console.error("Error saving content:", err);
      alert('Error saving content. Check console.');
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
          <PanelBottom className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-logo uppercase">Footer Edit</h1>
          <p className="text-muted-foreground font-code text-sm">Update the contact text, info columns, and copyright</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl space-y-6">
        <div className="grid grid-cols-1 gap-6">
          
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Contact Heading</label>
            <Input required value={data.contactHeading} onChange={e => handleChange('contactHeading', e.target.value)} className="bg-background/80 border-white/10 text-white" />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-code tracking-wide text-white uppercase">Contact Text</label>
            <Textarea required value={data.contactText} onChange={e => handleChange('contactText', e.target.value)} className="bg-background/80 border-white/10 min-h-[80px] text-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Column 1 Header</label>
              <Input required value={data.col1Header} onChange={e => handleChange('col1Header', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Column 1 Text</label>
              <Input required value={data.col1Text} onChange={e => handleChange('col1Text', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Column 2 Header</label>
              <Input required value={data.col2Header} onChange={e => handleChange('col2Header', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Column 2 Text</label>
              <Input required value={data.col2Text} onChange={e => handleChange('col2Text', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Company Name</label>
              <Input required value={data.companyName} onChange={e => handleChange('companyName', e.target.value)} className="bg-background/80 border-white/10 text-white" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-code tracking-wide text-white uppercase">Copyright Text</label>
              <Input required value={data.copyright} onChange={e => handleChange('copyright', e.target.value)} className="bg-background/80 border-white/10 text-white" />
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
