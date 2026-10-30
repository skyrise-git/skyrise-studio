'use client';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {ArrowUpRight,CheckCircle2} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {Button} from '@/components/ui/button';
const steps=[
  {number:'01',title:'Choose a website or platform package',description:'Compare transparent packages for your region, including monthly pricing and setup fees.'},
  {number:'02',title:'Subscribe or purchase outright',description:'Select subscription or ownership terms where available. Custom software is scoped separately.'},
  {number:'03',title:'We design, build and support',description:'We work with you through delivery and provide the managed services associated with your selected package.'},
];
export type HowItWorksContentProps={heroEyebrow:string;heroTitle:ReactNode;heroLead:ReactNode;backLink?:ReactNode};
export default function HowItWorksContent({heroEyebrow,heroTitle,heroLead,backLink}:HowItWorksContentProps){
  return <div className="min-h-screen bg-white"><Header/><main>
    <section className="bg-[#F8FAFC] border-b border-border py-20 md:py-24"><div className="container max-w-6xl">
      {backLink&&<div className="mb-8">{backLink}</div>}
      <p className="section-eyebrow mb-5">{heroEyebrow}</p>
      <h1 className="section-heading max-w-4xl">{heroTitle}</h1>
      <p className="section-lead max-w-2xl mt-6">{heroLead}</p>
    </div></section>
    <section className="container max-w-6xl py-20 md:py-24"><p className="section-eyebrow mb-4">Our process</p><h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-10">A clear path from idea to launch.</h2>
      <div className="grid md:grid-cols-3 gap-6">{steps.map(s=><article key={s.number} className="surface-card p-8">
        <p className="text-theme-2 text-xs font-semibold tracking-widest">{s.number}</p><h3 className="text-xl font-semibold mt-6 mb-4">{s.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p><CheckCircle2 className="text-theme-2 mt-8" size={22}/>
      </article>)}</div>
    </section>
    <section className="bg-[#F8FAFC] border-y border-border py-16"><div className="container max-w-6xl flex flex-col md:flex-row md:justify-between md:items-center gap-6">
      <div><h2 className="text-2xl font-semibold">Explore website and platform pricing</h2><p className="text-muted-foreground mt-2">Select your region to view all available packages.</p></div>
      <div className="flex flex-wrap gap-3">
        <Button asChild variant="outline" className="rounded-full bg-white"><Link href="/us">United States</Link></Button>
        <Button asChild variant="outline" className="rounded-full bg-white"><Link href="/za">South Africa</Link></Button>
        <Button asChild variant="outline" className="rounded-full bg-white"><Link href="/zw">Zimbabwe</Link></Button>
        <Button asChild className="rounded-full"><Link href="/#contact">Contact us <ArrowUpRight size={16} className="ml-2"/></Link></Button>
      </div>
    </div></section>
  </main><Footer/></div>;
}