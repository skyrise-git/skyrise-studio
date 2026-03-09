"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { ref, push, get, query, orderByChild, onValue } from 'firebase/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LogOut, Plus, MessageSquare } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  // States for Messages
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // States for Project Upload
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

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribeMessages: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoadingUser(false);
        setLoadingMessages(true);
        setErrorMsg(null);
        
        try {
          const messagesRef = query(ref(db, 'messages'), orderByChild('createdAt'));
          
          // Listen to real-time changes
          unsubscribeMessages = onValue(messagesRef, (snapshot) => {
            const fetched: any[] = [];
            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                fetched.push({ id: childSnapshot.key, ...childSnapshot.val() });
              });
            }
            // Reverse so newest is first
            setMessages(fetched.reverse());
            setLoadingMessages(false);
            setErrorMsg(null);
          }, (err: any) => {
            console.error("Error listening to messages:", err);
            setErrorMsg(err.message || "Failed to listen to messages");
            setLoadingMessages(false);
          });
        } catch (err: any) {
          console.error("Database error:", err);
          setErrorMsg(err.message || "Failed to query database");
          setLoadingMessages(false);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [router]);

  // Keep manual refresh just in case, though onValue makes it less necessary
  const fetchMessages = () => {
    setErrorMsg(null);
    setLoadingMessages(true);
    get(query(ref(db, 'messages'), orderByChild('createdAt')))
      .then(snapshot => {
        const fetched: any[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => { fetched.push({ id: child.key, ...child.val() }); });
        }
        setMessages(fetched.reverse());
        setLoadingMessages(false);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setErrorMsg(err.message || "Failed to fetch messages manually");
        setLoadingMessages(false);
      });
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Split comma separated fields into arrays
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
      alert('Project added successfully!');
      
      // Reset form
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
      alert('Error adding project. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectForm(prev => ({ ...prev, [field]: value }));
  };

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-foreground"><div className="animate-pulse">Loading...</div></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary/10 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-logo uppercase text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground font-code text-sm mt-1">Manage projects and client messages</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push('/')} className="border-white/10 text-muted-foreground hover:text-primary">
              <MessageSquare className="w-4 h-4 mr-2" /> View Site
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-white/10 text-muted-foreground hover:text-primary">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="bg-secondary/20 border border-white/5 mb-8">
            <TabsTrigger value="messages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="messages" className="space-y-6">
            <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-logo uppercase">Recent Inquiries</h2>
                <Button onClick={fetchMessages} variant="outline" size="sm" className="border-white/10" disabled={loadingMessages}>
                  {loadingMessages ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>

              {errorMsg && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md mb-6">
                  {errorMsg}
                </div>
              )}

              {messages.length === 0 && !loadingMessages && !errorMsg && (
                <div className="text-center py-12 text-muted-foreground">No messages found.</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.map(msg => (
                  <div key={msg.id} className="bg-background/80 border border-white/10 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{msg.name}</h3>
                        <a href={`mailto:${msg.email}`} className="text-theme-2 text-sm max-w-[200px] truncate">{msg.email}</a>
                      </div>
                      <div className="text-xs text-muted-foreground/50 text-right">
                        {msg.createdAt && new Date(msg.createdAt).toLocaleDateString()}
                        <br/>
                        {msg.createdAt && new Date(msg.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-white/5 text-sm whitespace-pre-wrap text-muted-foreground">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects">
            <div className="bg-secondary/5 rounded-2xl border border-white/5 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-logo uppercase mb-6">Create New Project</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Project Title</label>
                    <Input 
                      required 
                      value={projectForm.title} 
                      onChange={e => handleInputChange('title', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Short Description</label>
                    <Input 
                      required 
                      value={projectForm.description} 
                      onChange={e => handleInputChange('description', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-code text-muted-foreground">Long Description</label>
                    <Textarea 
                      required 
                      value={projectForm.longDescription} 
                      onChange={e => handleInputChange('longDescription', e.target.value)} 
                      className="bg-background/50 border-white/10 min-h-[100px]" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Image URL (e.g., https://...)</label>
                    <Input 
                      required 
                      value={projectForm.imageUrl} 
                      onChange={e => handleInputChange('imageUrl', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Image Hint (Alt Text)</label>
                    <Input 
                      required 
                      value={projectForm.imageHint} 
                      onChange={e => handleInputChange('imageHint', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Technologies (comma separated)</label>
                    <Input 
                      required 
                      placeholder="React, Next.js, Firebase"
                      value={projectForm.technologies} 
                      onChange={e => handleInputChange('technologies', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-code text-muted-foreground">Features (comma separated)</label>
                    <Input 
                      required 
                      placeholder="User Auth, Admin Panel, Analytics"
                      value={projectForm.features} 
                      onChange={e => handleInputChange('features', e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-code text-muted-foreground">Advantages (comma separated)</label>
                    <Textarea 
                      required 
                      placeholder="High Performance, Scalable, Secure"
                      value={projectForm.advantages} 
                      onChange={e => handleInputChange('advantages', e.target.value)} 
                      className="bg-background/50 border-white/10 min-h-[80px]" 
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="font-code uppercase tracking-wider px-8">
                    {isSubmitting ? 'Publishing...' : 'Publish to Marketing Page'}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
