import { Github, Twitter, Linkedin, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import DecryptText from './decrypt-text';

export default function Footer() {
  return (
    <footer id="contact" className="w-full pt-24 pb-8 border-t border-white/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-5xl md:text-7xl mb-4 font-logo"><DecryptText text="Get In Touch" /></h2>
            <p className="text-muted-foreground font-body max-w-md">
              Have a project in mind or just want to say hello? We'd love to hear from you.
              Fill out the form and we'll get back to you as soon as possible.
            </p>
          </div>
          <form className="space-y-6">
            <Input type="text" placeholder="Name" className="bg-secondary/10 border-white/10" />
            <Input type="email" placeholder="Email" className="bg-secondary/10 border-white/10" />
            <Textarea placeholder="Your Message" className="bg-secondary/10 border-white/10 min-h-[120px]" />
            <Button type="submit" className="w-full font-code uppercase tracking-wider">
              Send Message <Send />
            </Button>
          </form>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="font-logo text-lg tracking-widest text-primary">
            SKYRISE
          </div>
          <p className="text-sm text-muted-foreground font-code">
            &copy; {new Date().getFullYear()} SkyRise Softwares. All Rights Reserved.
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
