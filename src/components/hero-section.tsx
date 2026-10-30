'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, CheckCircle2, ChevronRight, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { onValue, ref } from 'firebase/database';

const HeroArchitecture = dynamic(() => import('@/components/hero-architecture'), { ssr: false });

type HeroContent = { title: string; subtitle: string; btn1Text: string; btn1Url: string; btn2Text: string; btn2Url: string };
const defaults: HeroContent = {
  title: 'Websites that impress. Platforms that perform.',
  subtitle: 'We design, develop and support business websites, e-commerce experiences and custom software that help ambitious businesses stand out and grow.',
  btn1Text: 'See what we have built', btn1Url: '/#projects',
  btn2Text: 'Explore website pricing', btn2Url: '/#pricing',
};

const paths = [
  { title: 'Websites that win customers', copy: 'Professional, fast and memorable.', href: '/#pricing' },
  { title: 'E-commerce & business platforms', copy: 'Sell, connect and operate seamlessly.', href: '/#projects' },
  { title: 'Custom software & AI', copy: 'Built around your unique workflows.', href: '/#services' },
];

export default function HeroSection() {
  const [content, setContent] = useState(defaults);
  useEffect(() => onValue(ref(db, 'content/hero'), snapshot => {
    if (!snapshot.exists()) return;
    const old = snapshot.val() as Partial<HeroContent>;
    // Preserve deliberately edited CMS content; gently normalize legacy copy from the old theme.
    const outdatedTitle = !old.title || old.title.trim().toUpperCase() === 'SKYRISE' || old.title === 'Websites that earn trust. Digital products that move businesses forward.';
    const outdatedSubtitle = !old.subtitle || old.subtitle.includes('premier Software Dev Team');
    setContent({
      title: outdatedTitle ? defaults.title : old.title!,
      subtitle: outdatedSubtitle ? defaults.subtitle : old.subtitle!,
      btn1Text: !old.btn1Text || ['Explore Dossiers', 'Explore our work'].includes(old.btn1Text) ? defaults.btn1Text : old.btn1Text,
      btn1Url: old.btn1Url || defaults.btn1Url,
      btn2Text: !old.btn2Text || ['Initiate Contact', 'View website pricing'].includes(old.btn2Text) ? defaults.btn2Text : old.btn2Text,
      btn2Url: old.btn2Text === 'Initiate Contact' ? defaults.btn2Url : (old.btn2Url || defaults.btn2Url),
    });
  }), []);

  return (
    <section className="hero-stage relative overflow-hidden bg-[#F8FAFC] border-b border-border">
      <div className="hero-stage-wash absolute pointer-events-none inset-0" aria-hidden="true" />
      <div className="container relative grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,.94fr)] gap-10 xl:gap-14 items-center pt-16 pb-20 md:pt-24 md:pb-28 lg:min-h-[745px]">
        <div className="relative z-20 max-w-[725px]">
          <div className="inline-flex items-center gap-3 mb-7 text-sm font-semibold text-primary">
            <span className="h-[2px] w-9 bg-theme-2" aria-hidden="true" />
            Your technology partner, from concept to launch
          </div>

          <h1 className="text-[clamp(2.8rem,5vw,5.15rem)] leading-[1.045] tracking-[-.034em] font-bold text-foreground text-balance">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl leading-[1.65] max-w-[610px] mt-7 text-[#4C6076]">
            {content.subtitle}
          </p>
          <p className="mt-5 text-[15px] leading-relaxed text-[#52677B] max-w-xl">
            Whether you need your first online presence or an entirely new digital product, we turn ideas into experiences your customers will want to use.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-9">
            <Button asChild className="h-[52px] rounded-full px-7 shadow-[0_14px_30px_rgba(29,53,87,.17)] hover:-translate-y-0.5 transition-transform">
              <Link href={content.btn1Url}>{content.btn1Text}<ArrowUpRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" className="h-[52px] rounded-full px-7 bg-white hover:bg-[#F0F5FA]">
              <Link href={content.btn2Url}>{content.btn2Text}<ChevronRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>

          <div className="flex items-start sm:items-center flex-wrap gap-x-5 gap-y-3 mt-9 text-sm text-[#536980]">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#3974AA]"/> Clear website packages</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#3974AA]"/> End-to-end development</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[#3974AA]"/> Long-term support</span>
          </div>
        </div>

        <div className="relative z-10 min-h-[460px] sm:min-h-[550px] lg:min-h-[580px] w-full">
          <HeroArchitecture />
          <div className="hero-feature-panel relative z-10 w-full max-w-[440px] mx-auto lg:ml-auto lg:mr-0 mt-8 lg:mt-11 bg-white rounded-[20px] shadow-[0_27px_75px_rgba(19,47,80,.17)] ring-1 ring-[#D7E1ED] overflow-hidden">
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border/70">
              <p className="text-xs font-bold tracking-[.14em] text-[#356B9E] uppercase">Built around your business</p>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-2 h-2 bg-[#67A7CC] rounded-full" /> Your next move</span>
            </div>
            <div className="px-7 pt-6 pb-5">
              <h2 className="text-[1.65rem] leading-[1.18] tracking-tight font-bold text-foreground max-w-[335px]">
                One partner. Whatever you&apos;re building.
              </h2>
              <p className="text-sm mt-3 text-muted-foreground leading-relaxed">
                Start with what you need today. Grow into what comes next.
              </p>
              <div className="divide-y divide-[#E2EAF2] mt-6">
                {paths.map((item, i) => (
                  <Link key={item.title} href={item.href} className="group flex gap-3 items-center py-3.5 hover:pl-1 transition-[padding]">
                    <span className="text-xs font-bold text-[#769BB9] tabular-nums">0{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-foreground">{item.title}</span>
                      <span className="block text-xs text-muted-foreground mt-1">{item.copy}</span>
                    </span>
                    <MoveUpRight size={17} className="text-[#537D9C] group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/#contact" className="flex items-center justify-between bg-[#19385B] text-white px-7 py-4 text-sm font-semibold hover:bg-[#2A5279] transition-colors">
              Tell us about your project <ArrowUpRight size={18}/>
            </Link>
          </div>
          <span className="absolute bottom-0 right-4 hidden lg:flex items-center gap-2 text-xs text-[#71879A]">
            <ArrowDown size={14}/> Explore more below
          </span>
        </div>
      </div>
    </section>
  );
}
