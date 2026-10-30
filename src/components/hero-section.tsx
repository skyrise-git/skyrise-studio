'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { ArrowRight,ArrowUpRight,CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { onValue,ref } from 'firebase/database';

type HeroContent={title:string;subtitle:string;btn1Text:string;btn1Url:string;btn2Text:string;btn2Url:string};
const defaults:HeroContent={
  title:'Websites that earn trust. Digital products that move businesses forward.',
  subtitle:'From high-performing business websites to powerful digital platforms and bespoke applications, we design and build technology that helps you grow.',
  btn1Text:'Explore our work',btn1Url:'/#projects',btn2Text:'View website pricing',btn2Url:'/#pricing'
};
export default function HeroSection(){
  const [content,setContent]=useState(defaults);
  useEffect(()=>onValue(ref(db,'content/hero'),snapshot=>{
    if(!snapshot.exists())return;
    const old=snapshot.val() as Partial<HeroContent>;
    setContent({
      title:old.title&&old.title!=='SKYRISE'?old.title:defaults.title,
      subtitle:old.subtitle?.includes('premier Software Dev Team')?defaults.subtitle:(old.subtitle||defaults.subtitle),
      btn1Text:old.btn1Text==='Explore Dossiers'?defaults.btn1Text:(old.btn1Text||defaults.btn1Text),
      btn1Url:old.btn1Url||defaults.btn1Url,
      btn2Text:old.btn2Text==='Initiate Contact'?defaults.btn2Text:(old.btn2Text||defaults.btn2Text),
      btn2Url:old.btn2Text==='Initiate Contact'?defaults.btn2Url:(old.btn2Url||defaults.btn2Url),
    });
  }),[]);
  return <section className="relative overflow-hidden border-b border-border/70 bg-gradient-to-b from-white to-[#F8FAFC]">
    <div className="container mx-auto grid min-h-[640px] gap-10 lg:grid-cols-[1.25fr_.75fr] items-center py-24 md:py-28 lg:py-32">
      <div className="max-w-3xl">
        <div className="section-eyebrow mb-7 flex items-center gap-3"><span className="h-px w-8 bg-theme-2"/>Website & software development</div>
        <h1 className="font-semibold tracking-[-.055em] text-5xl leading-[1.08] sm:text-6xl lg:text-[4.6rem] text-foreground text-balance">{content.title}</h1>
        <p className="section-lead mt-7 max-w-2xl">{content.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <Button asChild size="lg" className="rounded-full h-12 px-7"><Link href={content.btn1Url}>{content.btn1Text}<ArrowUpRight className="ml-2 h-4 w-4"/></Link></Button>
          <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-7 bg-white"><Link href={content.btn2Url}>{content.btn2Text}<ArrowRight className="ml-2 h-4 w-4"/></Link></Button>
        </div>
        <p className="mt-9 text-xs text-muted-foreground font-medium">Transparent packages · Custom engineering · Ongoing support</p>
      </div>
      <div className="relative hidden lg:block pl-8">
        <div className="surface-card p-8 shadow-[0_30px_90px_rgba(15,41,75,.09)] rotate-2 hover:rotate-0 transition-transform duration-700">
          <div className="flex items-center justify-between border-b border-border pb-6">
            <span className="text-xs font-semibold text-theme-2 uppercase tracking-[.12em]">Built around your business</span>
            <span className="text-sm text-muted-foreground">01 / 03</span>
          </div>
          <h2 className="text-3xl leading-snug tracking-tight font-semibold mt-8 mb-10">From your first website to your next big idea.</h2>
          <div className="space-y-4">
            {['Professional websites','E-commerce & platforms','Custom software solutions'].map(s=>
              <div key={s} className="flex items-center gap-4 rounded-xl border border-border bg-slate-50 px-5 py-4 text-sm font-medium"><CheckCircle2 className="w-5 h-5 text-theme-2 shrink-0"/>{s}</div>
            )}
          </div>
          <Link href="/#projects" className="flex justify-between items-center mt-8 pt-6 border-t border-border font-semibold text-sm text-primary">See what we have built<ArrowUpRight className="w-5 h-5"/></Link>
        </div>
        <div className="absolute -z-10 -top-12 right-0 h-48 w-48 rounded-full bg-blue-50 blur-2xl"/>
      </div>
    </div>
  </section>;
}