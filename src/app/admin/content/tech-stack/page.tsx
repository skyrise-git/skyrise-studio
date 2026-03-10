"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Save, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultTechnologies = [
  { name: "C Language", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
  { name: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
  { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "SQLite", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" },
  { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "NPM", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" },
  { name: "VS Code", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
  { name: "Linux", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
  { name: "Ubuntu", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain-wordmark.svg" },
];

export default function EditTechStackPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [technologies, setTechnologies] = useState<{name: string, src: string}[]>(defaultTechnologies);

  useEffect(() => {
    const fetchTechData = async () => {
      try {
        const snapshot = await get(ref(db, 'marketing/techStack'));
        if (snapshot.exists()) {
          setTechnologies(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching tech stack:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTechData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await set(ref(db, 'marketing/techStack'), technologies);
      toast({
        title: 'Success',
        description: 'Tech stack updated successfully!',
      });
    } catch (err) {
      console.error("Error updating tech stack:", err);
      toast({
        title: 'Error',
        description: 'Failed to update tech stack. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTechChange = (index: number, field: 'name' | 'src', value: string) => {
    const newTech = [...technologies];
    newTech[index][field] = value;
    setTechnologies(newTech);
  };

  const addTech = () => {
    setTechnologies([...technologies, { name: 'New Tech', src: '' }]);
  };

  const removeTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/20">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-logo uppercase">Edit Tech Stack</h1>
            <p className="text-muted-foreground font-code text-sm">Manage skills & technologies</p>
          </div>
        </div>
      </div>

      <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 md:p-8 backdrop-blur-sm shadow-xl mt-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            {technologies.map((tech, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 items-center bg-background/50 p-4 rounded-xl border border-white/10">
                <div className="w-12 h-12 flex-shrink-0 bg-secondary/20 rounded-lg flex items-center justify-center border border-white/5 overflow-hidden p-2">
                  {tech.src ? <img src={tech.src} alt="tech" className="w-full h-full object-contain" /> : <Code className="w-6 h-6 text-muted-foreground" />}
                </div>
                <div className="flex-1 space-y-2 w-full">
                  <label className="text-xs font-code uppercase text-muted-foreground">Technology Name</label>
                  <Input 
                    value={tech.name} 
                    onChange={e => handleTechChange(i, 'name', e.target.value)} 
                    className="bg-background border-white/10" 
                  />
                </div>
                <div className="flex-[2] space-y-2 w-full">
                  <label className="text-xs font-code uppercase text-muted-foreground">Icon Data Line (URL / SVG)</label>
                  <Input 
                    value={tech.src} 
                    onChange={e => handleTechChange(i, 'src', e.target.value)} 
                    className="bg-background border-white/10 font-mono text-sm" 
                  />
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="mt-6 sm:mt-0 flex-shrink-0"
                  onClick={() => removeTech(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={addTech} 
            className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white h-14 rounded-xl font-code uppercase tracking-wider"
          >
            <Plus className="w-5 h-5 mr-3" /> Add Technology
          </Button>

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
                    Save Tech Stack
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
