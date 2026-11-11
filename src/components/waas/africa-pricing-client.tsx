'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Globe2} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WaasPricingClient from '@/components/waas/waas-pricing-client';
import type {CountryCode} from '@/data/waas-pricing';

const AFRICAN_COUNTRIES=[
  {code:'dz',name:'Algeria'},
  {code:'ao',name:'Angola'},
  {code:'bj',name:'Benin'},
  {code:'bw',name:'Botswana'},
  {code:'bf',name:'Burkina Faso'},
  {code:'bi',name:'Burundi'},
  {code:'cv',name:'Cabo Verde'},
  {code:'cm',name:'Cameroon'},
  {code:'cf',name:'Central African Republic'},
  {code:'td',name:'Chad'},
  {code:'km',name:'Comoros'},
  {code:'cd',name:'Congo (DRC)'},
  {code:'cg',name:'Congo (Republic)'},
  {code:'ci',name:"Côte d'Ivoire"},
  {code:'dj',name:'Djibouti'},
  {code:'eg',name:'Egypt'},
  {code:'gq',name:'Equatorial Guinea'},
  {code:'er',name:'Eritrea'},
  {code:'sz',name:'Eswatini'},
  {code:'et',name:'Ethiopia'},
  {code:'ga',name:'Gabon'},
  {code:'gm',name:'Gambia'},
  {code:'gh',name:'Ghana'},
  {code:'gn',name:'Guinea'},
  {code:'gw',name:'Guinea-Bissau'},
  {code:'ke',name:'Kenya'},
  {code:'ls',name:'Lesotho'},
  {code:'lr',name:'Liberia'},
  {code:'ly',name:'Libya'},
  {code:'mg',name:'Madagascar'},
  {code:'mw',name:'Malawi'},
  {code:'ml',name:'Mali'},
  {code:'mr',name:'Mauritania'},
  {code:'mu',name:'Mauritius'},
  {code:'ma',name:'Morocco'},
  {code:'mz',name:'Mozambique'},
  {code:'na',name:'Namibia'},
  {code:'ne',name:'Niger'},
  {code:'ng',name:'Nigeria'},
  {code:'rw',name:'Rwanda'},
  {code:'st',name:'São Tomé and Príncipe'},
  {code:'sn',name:'Senegal'},
  {code:'sc',name:'Seychelles'},
  {code:'sl',name:'Sierra Leone'},
  {code:'so',name:'Somalia'},
  {code:'za',name:'South Africa'},
  {code:'ss',name:'South Sudan'},
  {code:'sd',name:'Sudan'},
  {code:'tz',name:'Tanzania'},
  {code:'tg',name:'Togo'},
  {code:'tn',name:'Tunisia'},
  {code:'ug',name:'Uganda'},
  {code:'zm',name:'Zambia'},
  {code:'zw',name:'Zimbabwe'},
] as const;

type Props={initialCountry:string};
type CountrySelectorProps={value:string;onChange:(country:string)=>void};

function CountrySelector({value,onChange}:CountrySelectorProps){
 return <div className="mt-8 max-w-md">
   <label htmlFor="africa-pricing-country" className="flex items-center gap-2 text-sm font-semibold mb-3">
     <Globe2 className="h-5 w-5 text-theme-2"/> Where is your business based?
   </label>
   <select
     id="africa-pricing-country"
     value={value}
     onChange={event=>onChange(event.target.value)}
     className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
   >
     <option value="">Select your country</option>
     {AFRICAN_COUNTRIES.map(country=><option key={country.code} value={country.code}>{country.name}</option>)}
   </select>
   <p className="text-xs text-muted-foreground mt-3 leading-relaxed">South Africa has a dedicated rate card. Other African countries use our Zimbabwe regional pricing structure, with country-specific integrations confirmed during scoping.</p>
 </div>;
}

export default function AfricaPricingClient({initialCountry}:Props){
 const router=useRouter();
 const validInitial=AFRICAN_COUNTRIES.some(country=>country.code===initialCountry)?initialCountry:'';
 const [selected,setSelected]=useState<string>(validInitial);
 const selectedCountry=AFRICAN_COUNTRIES.find(country=>country.code===selected);
 function updateCountry(code:string){
   setSelected(code);
   router.replace(code?'/africa?country='+encodeURIComponent(code):'/africa',{scroll:false});
 }
 const selector=<CountrySelector value={selected} onChange={updateCountry}/>;
 if(!selectedCountry){
   return <div className="min-h-screen bg-white text-foreground">
     <Header/>
     <main>
       <section className="bg-[#F8FAFC] border-b border-border py-20 md:py-24">
         <div className="container max-w-6xl">
           <p className="section-eyebrow mb-5">Pricing for African businesses</p>
           <h1 className="section-heading max-w-4xl">Digital solutions built <span className="text-theme-2">for your market.</span></h1>
           <p className="section-lead max-w-2xl mt-6">From professional websites to business platforms, explore packages suited to your location. Select a country to see pricing, setup fees and ownership options.</p>
           {selector}
         </div>
       </section>
       <section className="container max-w-6xl py-16 md:py-20">
         <h2 className="text-2xl font-semibold tracking-tight">Choose your country to view packages.</h2>
         <p className="mt-3 text-muted-foreground max-w-2xl">We will show the relevant regional rates and the services included in each package.</p>
       </section>
     </main>
     <Footer/>
   </div>;
 }
 const pricingCountry:CountryCode=selectedCountry.code==='za'?'za':'zw';
 return <WaasPricingClient country={pricingCountry} marketName={selectedCountry.name} regionSelector={selector}/>;
}
