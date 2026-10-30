'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const links = [
  {label:'Our Work',href:'/#projects'}, {label:'Services',href:'/#services'},
  {label:'Pricing',href:'/#pricing'}, {label:'How It Works',href:'/how-it-works'},
];
export default function Header(){
  const [open,setOpen]=useState(false);
  return <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur-xl">
    <div className="container mx-auto flex h-20 items-center justify-between gap-6">
      <Link href="/" aria-label="Skyrise homepage" onClick={()=>setOpen(false)} className="text-2xl tracking-[-.07em] font-extrabold text-foreground">
        SKYRISE<span className="text-theme-2">.</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
        {links.map(l=><Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>)}
      </nav>
      <Button asChild className="hidden lg:inline-flex rounded-full px-6 h-11"><Link href="/#contact">Start a Project <ArrowUpRight className="ml-2 h-4 w-4"/></Link></Button>
      <button type="button" className="lg:hidden rounded-lg p-2 border border-border" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}>
        {open?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}
      </button>
    </div>
    {open&&<nav className="lg:hidden border-t border-border p-6 bg-white flex flex-col gap-5" aria-label="Mobile navigation">
      {links.map(l=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className="text-base font-medium">{l.label}</Link>)}
      <Link href="/#contact" onClick={()=>setOpen(false)} className="rounded-lg bg-primary text-primary-foreground py-3 px-5 text-center font-medium">Start a Project</Link>
    </nav>}
  </header>;
}