"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import DecryptText from './decrypt-text';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
  ];

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="font-code text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary-foreground"
    >
      <DecryptText text={label} />
    </Link>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-sm border-b border-white/5' : 'bg-gradient-to-b from-background/80 to-transparent',
        'p-4 sm:p-6'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
          <h1 className="text-2xl font-bold font-logo tracking-widest text-primary transition-colors group-hover:text-theme-4">
            SKYRISE
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => <NavLink key={link.href} {...link} />)}
        </nav>

        <div className="hidden md:flex">
          <Button asChild variant="outline" className="font-code uppercase tracking-wider">
            <Link href="#contact">Contact</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/90 backdrop-blur-lg border-l-white/10 w-[250px] sm:w-[300px]">
              <div className="flex flex-col h-full p-6 pt-16">
                 <Link href="/" onClick={() => setOpen(false)} className="group mb-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                    <h1 className="text-3xl font-bold font-logo tracking-widest text-primary">
                        SKYRISE
                    </h1>
                </Link>
                <nav className="flex flex-col items-start gap-8 mb-12">
                   {navLinks.map(link => <NavLink key={link.href} {...link} />)}
                </nav>
                <Button asChild variant="outline" className="font-code uppercase tracking-wider mt-auto">
                    <Link href="#contact" onClick={() => setOpen(false)}>Contact</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
