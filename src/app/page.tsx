'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
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
      <section className="border-y border-border bg-[#F6F9FC] py-12 md:py-16">
        <div className="container grid lg:grid-cols-[.92fr_1.08fr] gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug max-w-md">A development partner, not just a delivery team.</h2>
            <p className="text-[#597087] text-[15px] mt-4 max-w-md leading-relaxed">We bring clarity, creativity and technical expertise to each stage of your digital journey.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {approach.map(a=><div key={a.title} className="border-t-2 border-[#8CAFD0] pt-4">
              <CheckCircle2 className="text-[#437DAA] mb-4" size={22}/>
              <h3 className="font-bold text-base leading-snug">{a.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground mt-2">{a.body}</p>
            </div>)}
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
