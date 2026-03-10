"use client";

import { Github, Twitter, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import DecryptText from './decrypt-text';
import { useState, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [content, setContent] = useState({
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
    const unsub = onValue(ref(db, 'content/footer'), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.val());
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setLoading(true);
    setErrorMsg(null);

    try {
      await push(ref(db, 'messages'), {
        name,
        email,
        message,
        createdAt: new Date().toISOString()
      });

      // Show success
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setErrorMsg(error.message || 'Failed to send message. Check Database Rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="contact" className="w-full pt-24 pb-8 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl mb-4 font-logo"><DecryptText text={content.contactHeading} /></h2>
            <p className="text-muted-foreground font-body max-w-md">
              {content.contactText}
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input 
              type="text" 
              placeholder="Name" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/10 border-white/10" 
            />
            <Input 
              type="email" 
              placeholder="Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/10 border-white/10" 
            />
            <Textarea 
              placeholder="Your Message" 
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-secondary/10 border-white/10 min-h-[120px]" 
            />
            {errorMsg && (
              <div className="text-red-500 text-sm mt-2">{errorMsg}</div>
            )}
            <Button type="submit" disabled={loading} className="w-full font-code uppercase tracking-wider">
              {loading ? 'Sending...' : success ? 'Message Sent!' : (
                <>Send Message <Send className="ml-2" /></>
              )}
            </Button>
          </form>
        </div>
        
        <div className="mb-12 border-t border-white/5 pt-8 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground/60 font-code uppercase tracking-wider">
              <div>
                <span className="text-primary/60 block mb-2">{content.col1Header}</span>
                {content.col1Text}
              </div>
              <div className="md:text-right">
                 <span className="text-primary/60 block mb-2">{content.col2Header}</span>
                 {content.col2Text}
              </div>
            </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="font-logo text-lg tracking-widest text-primary">
            {content.companyName}
          </div>
          <p className="text-sm text-muted-foreground font-code">
            &copy; {new Date().getFullYear()} {content.copyright}
          </p>
          <div className="flex gap-4">
            <Link href="#" aria-label="Github" className="text-muted-foreground hover:text-primary transition-colors"><Github size={20} /></Link>
            <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={20} /></Link>
            <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={20} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
