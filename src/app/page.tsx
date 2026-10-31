'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight,CheckCircle2} from 'lucide-react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FeaturedWork from '@/components/featured-work';
import TechStack from '@/components/tech-stack';
import PricingPreview from '@/components/pricing-preview';
import Footer from '@/components/footer';
import {db} from '@/lib/firebase';
import {onValue,ref} from 'firebase/database';

const approach = [
  {title:'Understand your business',body:'We start with the outcomes you need, not just the features on a list.'},
  {title:'Build with care',body:'Beautiful experiences, solid engineering and decisions made for real users.'},
  {title:'Grow beyond launch',body:'A digital foundation designed to evolve with your business.'},
];
export default function Home(){
  const [global,setGlobal]=useState({headline:'Wherever business happens,',headlineHighlight:'we can build for it.',description:'We collaborate with customers across North America, Africa and beyond.'});
  useEffect(()=>onValue(ref(db,'content/global'),snapshot=>{if(snapshot.exists())setGlobal(snapshot.val());}),[]);
  return <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main>
      <HeroSection />
      <FeaturedWork />
      <section className="border-y border-border bg-[#F6F9FC] py-16 md:py-20">
        <div className="container grid lg:grid-cols-[.88fr_1.12fr] gap-9 lg:gap-14 items-center">
          <figure className="relative overflow-hidden rounded-2xl h-[265px] sm:h-[330px] lg:h-[390px]">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1100&q=82"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
              alt="Professionals collaborating around a laptop in a bright workspace"
              loading="lazy"
            />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold text-[#354F68] shadow-[0_5px_18px_rgba(17,37,59,.14)]">
              From ideas to experiences
            </figcaption>
          </figure>
          <div>
            <h2 className="text-2xl md:text-[2.25rem] font-bold tracking-tight leading-[1.2] max-w-xl">A development partner, not just a delivery team.</h2>
            <p className="text-[#597087] text-[15px] mt-4 max-w-xl leading-relaxed">We bring clarity, creativity and technical expertise to each stage of your digital journey.</p>
            <div className="mt-7 space-y-5">
              {approach.map(a=><div key={a.title} className="flex items-start gap-3 border-t border-[#D6E2EF] pt-4">
                <CheckCircle2 className="text-[#437DAA] mt-0.5 shrink-0" size={20}/>
                <div><h3 className="font-bold text-[15px] leading-snug">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground mt-1">{a.body}</p>
                </div>
              </div>)}
            </div>
            <Link href="/#contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4">
              Discuss your idea <ArrowUpRight size={17}/>
            </Link>
          </div>
        </div>
      </section>
      <PricingPreview />
      <TechStack />
      <section id="global" className="scroll-mt-24 py-20 md:py-24 border-t border-border bg-white">
        <div className="container flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug">
              {global.headline} <span className="text-theme-2">{global.headlineHighlight}</span>
            </h2>
            <p className="text-[16px] leading-relaxed text-muted-foreground mt-4">{global.description}</p>
          </div>
          <Link href="/#contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm bg-primary text-white rounded-full px-6 py-3.5 shrink-0 hover:bg-[#315E86] transition-colors">
            Let&apos;s work together <ArrowUpRight size={17}/>
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
