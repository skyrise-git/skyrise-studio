'use client';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Check} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import {type CountryCode,WAAS_REGIONS} from '@/data/waas-pricing';
import {useWaasPricing} from '@/hooks/use-waas-pricing';
const regions:{code:CountryCode;title:string}[]=[{code:'us',title:'United States'},{code:'za',title:'South Africa'},{code:'zw',title:'Zimbabwe'}];
export default function PricingPreview(){
  const [country,setCountry]=useState<CountryCode>('us');
  const {packages}=useWaasPricing(country);
  return <section id="pricing" className="scroll-mt-24 py-24 md:py-28">
    <div className="container">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
        <div className="max-w-2xl"><p className="section-eyebrow mb-4">Website & platform packages</p>
          <h2 className="section-heading">Clear pricing for your next digital presence.</h2>
          <p className="section-lead mt-5">Professional websites and business platforms at competitive, transparent rates. Choose a monthly subscription or outright ownership where available.</p>
        </div>
        <div><label htmlFor="pricing-region" className="block text-sm font-medium mb-2">See pricing for</label>
          <select id="pricing-region" value={country} onChange={e=>setCountry(e.target.value as CountryCode)} className="border border-border rounded-xl bg-white px-4 py-3 min-w-[220px] text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {regions.map(r=><option value={r.code} key={r.code}>{r.title}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {packages.map((plan,i)=><article key={country+'-'+i} className={'surface-card flex flex-col p-7 transition-all hover:shadow-lg '+(plan.popular?'ring-2 ring-primary':'')}>
          <p className={'text-xs uppercase tracking-[.12em] font-semibold mb-3 '+(plan.popular?'text-theme-2':'text-muted-foreground')}>{plan.popular?'Most popular':'Website / platform'}</p>
          <h3 className="text-xl font-semibold">{plan.title}</h3><p className="mt-2 text-sm text-muted-foreground leading-relaxed min-h-[66px]">{plan.bestFor}</p>
          <div className="mt-6 pt-5 border-t border-border"><span className="text-3xl tracking-tight font-bold">{plan.monthly}</span><span className="text-muted-foreground text-xs ml-1">{plan.monthlyLabel||'/month'}</span>
            <p className="text-xs text-muted-foreground mt-2">{plan.setup}</p>{plan.ownOutright&&<p className="text-xs mt-2 font-medium text-primary">{plan.ownOutright}</p>}
          </div>
          <ul className="mt-7 flex-1 space-y-3">{plan.features.slice(0,4).map((f,j)=><li key={j} className="text-sm leading-relaxed flex items-start gap-2"><Check className="h-4 w-4 text-theme-2 mt-0.5 shrink-0"/>{f}</li>)}</ul>
          <Button asChild variant={plan.popular?'default':'outline'} className="w-full mt-8 rounded-full"><Link href={'/'+country}>View package details <ArrowUpRight size={16} className="ml-2"/></Link></Button>
        </article>)}
      </div>
      <div className="mt-6 p-6 md:p-8 rounded-2xl bg-[#F3F6FA] border border-border flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
        <div><p className="text-xl font-semibold">Need something more tailored?</p><p className="text-sm text-muted-foreground mt-2">Custom applications, integrations and complex platforms are scoped to your requirements, not sold as a fixed package.</p></div>
        <Button asChild variant="outline" className="rounded-full bg-white shrink-0"><Link href="/#contact">Discuss custom development <ArrowRight className="h-4 w-4 ml-2"/></Link></Button>
      </div>
      <p className="text-xs text-muted-foreground mt-5">Displayed rates are for {WAAS_REGIONS[country].name}. Package setup fees and ownership terms are shown on the full pricing page.</p>
    </div>
  </section>;
}