'use client';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Check,Globe2} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {Button} from '@/components/ui/button';
import {type CountryCode,WAAS_REGIONS,WAAS_COMPARISON_ROWS} from '@/data/waas-pricing';
import {useWaasPricing} from '@/hooks/use-waas-pricing';
const countries:{code:CountryCode;label:string}[]=[{code:'us',label:'United States'},{code:'za',label:'South Africa'},{code:'zw',label:'Zimbabwe'}];
export default function WaasPricingClient({country}:{country:CountryCode}){
 const region=WAAS_REGIONS[country];
 const {packages}=useWaasPricing(country);
 return <div className="min-h-screen bg-white"><Header/><main>
   <section className="bg-[#F8FAFC] border-b border-border py-20 md:py-24"><div className="container max-w-6xl">
     <p className="section-eyebrow mb-5">Website & platform pricing</p>
     <h1 className="section-heading max-w-4xl">Professional websites. Powerful platforms. <span className="text-theme-2">Transparent pricing.</span></h1>
     <p className="section-lead max-w-2xl mt-6">Compare website and platform packages for your business. Choose a monthly subscription or outright ownership where available. Custom software is quoted separately.</p>
     <div className="flex flex-wrap items-center gap-3 mt-8"><Globe2 className="text-theme-2" size={18}/><span className="text-sm font-medium">Your region</span>
       {countries.map(r=><Link href={'/'+r.code} key={r.code} className={'px-4 py-2 rounded-full text-sm border '+(country===r.code?'bg-primary text-white border-primary':'bg-white border-border hover:bg-secondary')}>{r.label}</Link>)}
     </div>
   </div></section>
   <section className="container max-w-6xl py-16 md:py-20">
     <p className="section-eyebrow mb-3">{region.name} packages</p>
     <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Choose the right foundation.</h2>
     <p className="text-muted-foreground mt-4 mb-9 max-w-2xl leading-relaxed">{region.description}</p>
     <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
       {packages.map((plan,i)=><article key={country+'-'+i} className={'surface-card p-7 flex flex-col '+(plan.popular?'ring-2 ring-primary':'')}>
         <p className="section-eyebrow mb-3">{plan.popular?'Most popular':'Website / platform'}</p>
         <h3 className="text-xl font-semibold">{plan.title}</h3>
         <p className="text-sm text-muted-foreground mt-3 leading-relaxed min-h-[80px]">{plan.bestFor}</p>
         <div className="border-t border-border mt-5 pt-5"><span className="text-3xl font-bold tracking-tight">{plan.monthly}</span><span className="text-xs text-muted-foreground ml-1">{plan.monthlyLabel||'/month'}</span>
           <p className="text-sm text-muted-foreground mt-2">{plan.setup}</p>
           {plan.ownOutright&&<p className="text-sm font-medium text-primary bg-secondary rounded-lg p-3 mt-3">{plan.ownOutright}</p>}
           {plan.savings&&<p className="text-xs text-muted-foreground mt-2">{plan.savings}</p>}
         </div>
         <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mt-7 mb-3">Included features</p>
         <ul className="space-y-3 flex-1">{plan.features.map((f,j)=><li key={j} className="flex gap-2 text-sm leading-relaxed"><Check className="h-4 w-4 text-theme-2 shrink-0 mt-1"/>{f}</li>)}</ul>
         <p className="text-xs text-muted-foreground mt-6 pt-5 border-t border-border leading-relaxed">{plan.upgradeNote}</p>
         <Button asChild variant={plan.popular?'default':'outline'} className="w-full rounded-full mt-6"><Link href="/#contact">Enquire about {plan.title}<ArrowUpRight size={16} className="ml-2"/></Link></Button>
       </article>)}
     </div>
     <div className="mt-8 rounded-2xl bg-[#F3F6FA] border border-border p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">
       <div><p className="section-eyebrow mb-3">Custom software development</p><h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{region.custom.titleLine1} {region.custom.titleEmphasis}</h3>
         <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">{region.custom.description}</p>
         <div className="flex flex-wrap gap-2 mt-5">{region.custom.pills.slice(0,5).map(s=><span key={s} className="px-3 py-2 rounded-full border border-border bg-white text-xs">{s}</span>)}</div>
       </div>
       <Button asChild className="rounded-full shrink-0"><Link href="/#contact">Request a custom quote <ArrowRight size={16} className="ml-2"/></Link></Button>
     </div>
   </section>
   <section className="bg-[#F8FAFC] py-16 md:py-20 border-y border-border"><div className="container max-w-6xl">
     <h2 className="text-3xl font-semibold tracking-tight">Subscription versus ownership</h2>
     <p className="text-muted-foreground mt-3 mb-8">The differences at a glance.</p>
     <div className="border border-border rounded-xl overflow-x-auto bg-white">
       <table className="w-full min-w-[700px] text-sm text-left"><thead><tr className="bg-secondary"><th className="p-4">Consideration</th><th className="p-4">Subscription</th><th className="p-4">Outright ownership</th><th className="p-4">Custom</th></tr></thead>
         <tbody>{WAAS_COMPARISON_ROWS.map(row=><tr key={row.label} className="border-t border-border"><th className="p-4 font-medium">{row.label}</th><td className="p-4 text-muted-foreground">{row.sub}</td><td className="p-4 text-muted-foreground">{row.own}</td><td className="p-4 text-muted-foreground">{row.custom}</td></tr>)}</tbody>
       </table>
     </div>
     <Link href="/how-it-works" className="inline-flex items-center gap-2 text-primary font-semibold mt-8">See how it works <ArrowUpRight size={16}/></Link>
   </div></section>
 </main><Footer/></div>;
}