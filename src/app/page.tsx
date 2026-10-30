'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Globe2,ShieldCheck,Sparkles} from 'lucide-react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import FeaturedWork from '@/components/featured-work';
import TechStack from '@/components/tech-stack';
import PricingPreview from '@/components/pricing-preview';
import Footer from '@/components/footer';
import { db } from '@/lib/firebase';
import {onValue,ref} from 'firebase/database';
const values=[
  {icon:ShieldCheck,title:'A partner you can rely on',text:'Thoughtful engineering, clear scope, and support after launch.'},
  {icon:Sparkles,title:'Designed around your goals',text:'Customer-focused experiences, not one-size-fits-all templates.'},
  {icon:Globe2,title:'Built to grow with you',text:'From an essential business site to a fully integrated digital platform.'},
];
export default function Home(){
  const [global,setGlobal]=useState({headline:'Wherever business happens,',headlineHighlight:'we can build for it.',description:'We collaborate with customers across North America, Africa and beyond.'});
  useEffect(()=>onValue(ref(db,'content/global'),snapshot=>{if(snapshot.exists())setGlobal(snapshot.val());}),[]);
  return <div className="min-h-screen bg-background text-foreground">
    <Header/><main><HeroSection/><FeaturedWork/>
      <section className="border-y border-border bg-[#F8FAFC] py-16 md:py-20">
        <div className="container grid md:grid-cols-3 gap-5">
          {values.map(({icon:Icon,title,text})=><article key={title} className="p-6 bg-white border border-border rounded-xl">
            <Icon className="h-6 w-6 text-theme-2 mb-5" strokeWidth={1.7}/><h3 className="text-lg font-semibold mb-2">{title}</h3><p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
          </article>)}
        </div>
      </section>
      <PricingPreview/><TechStack/>
      <section id="global" className="scroll-mt-24 py-20 border-t border-border bg-[#F8FAFC]">
        <div className="container flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div><p className="section-eyebrow mb-4">Global perspective</p><h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">{global.headline} <span className="text-theme-2">{global.headlineHighlight}</span></h2><p className="section-lead mt-4 max-w-2xl">{global.description}</p></div>
          <Link href="/#contact" className="inline-flex items-center font-semibold text-primary gap-2 shrink-0">Work with us <ArrowUpRight size={18}/></Link>
        </div>
      </section>
    </main><Footer/>
  </div>;
}