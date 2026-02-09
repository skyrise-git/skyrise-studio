import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-white/5">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="font-headline text-lg tracking-widest text-primary-foreground">
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
    </footer>
  );
}
