'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ref,set} from 'firebase/database';
import {db} from '@/lib/firebase';
import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Save,ArrowUpRight,AlertCircle} from 'lucide-react';
import {type CountryCode,type WaasPackage,WAAS_REGIONS} from '@/data/waas-pricing';
import {pricingPath,useWaasPricing} from '@/hooks/use-waas-pricing';

const countries:{code:CountryCode;name:string}[]=[
  {code:'us',name:'United States'},{code:'za',name:'South Africa'},{code:'zw',name:'Zimbabwe'}
];
function clonePlans(plans:WaasPackage[]):WaasPackage[]{
  return plans.map(p=>({...p,features:[...p.features]}));
}
function RegionEditor({country,setDirty}:{country:CountryCode;setDirty:(dirty:boolean)=>void}){
 const {packages,loaded,error}=useWaasPricing(country);
 const [draft,setDraft]=useState<WaasPackage[]>(()=>clonePlans(WAAS_REGIONS[country].packages));
 const [baseline,setBaseline]=useState<WaasPackage[]>(()=>clonePlans(WAAS_REGIONS[country].packages));
 const [saving,setSaving]=useState(false);
 const [lastSaved,setLastSaved]=useState(false);
 const {toast}=useToast();
 useEffect(()=>{
   if(!loaded)return;
   const next=clonePlans(packages);
   setDraft(next);
   setBaseline(clonePlans(next));
   setLastSaved(false);
 },[loaded,packages]);
 const dirty=useMemo(()=>JSON.stringify(draft)!==JSON.stringify(baseline),[draft,baseline]);
 useEffect(()=>{setDirty(dirty);return ()=>setDirty(false);},[dirty,setDirty]);
 useEffect(()=>{
   if(!dirty)return;
   const warn=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};
   window.addEventListener('beforeunload',warn);
   return ()=>window.removeEventListener('beforeunload',warn);
 },[dirty]);
 function edit(index:number,field:keyof WaasPackage,value:string|boolean|string[]){
   setLastSaved(false);
   setDraft(prev=>prev.map((plan,i)=>i===index?{...plan,[field]:value}:plan));
 }
 async function saveAll(){
   const clean=draft.map(plan=>({...plan,
     title:plan.title.trim(),monthly:plan.monthly.trim(),setup:plan.setup.trim(),
     features:plan.features.map(f=>f.trim()).filter(Boolean)
   }));
   if(clean.some(p=>!p.title||!p.monthly||p.features.length===0)){
     toast({title:'Pricing incomplete',description:'Every package needs a title, monthly price and at least one feature.',variant:'destructive'});
     return;
   }
   setSaving(true);
   try {
     await set(ref(db,pricingPath(country)),{packages:clean,updatedAt:Date.now()});
     setDraft(clonePlans(clean));setBaseline(clonePlans(clean));setLastSaved(true);
     toast({title:'Pricing saved',description:WAAS_REGIONS[country].name+' package pricing has been updated.'});
   }catch(err){
     toast({title:'Could not save pricing',description:err instanceof Error?err.message:'Check Firebase write permissions.',variant:'destructive'});
   }finally{setSaving(false);}
 }
 return <>
   {error&&<p role="alert" className="flex items-start gap-2 p-4 text-sm rounded-xl border border-amber-200 bg-amber-50 text-amber-900"><AlertCircle className="h-4 w-4 mt-0.5 shrink-0"/>{error}. Published defaults are shown; saving requires authorized Firebase write access.</p>}
   {!loaded?<p className="text-muted-foreground py-10">Loading current prices...</p>:
     <div className="space-y-6">
       {draft.map((plan,index)=><section key={country+'-'+index} className="surface-card p-6 md:p-8 space-y-5">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
           <div><p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Package {index+1}</p><h2 className="text-xl font-semibold mt-2">{plan.title||'Package '+(index+1)}</h2></div>
           <Link target="_blank" rel="noopener noreferrer" href={'/'+country} className="text-sm font-semibold text-primary inline-flex items-center gap-2">View public pricing <ArrowUpRight size={16}/></Link>
         </div>
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="space-y-2"><Label htmlFor={'name-'+country+'-'+index}>Package name</Label><Input id={'name-'+country+'-'+index} value={plan.title} onChange={e=>edit(index,'title',e.target.value)} required/></div>
           <div className="space-y-2"><Label htmlFor={'price-'+country+'-'+index}>Monthly price (include currency)</Label><Input id={'price-'+country+'-'+index} value={plan.monthly} onChange={e=>edit(index,'monthly',e.target.value)} required placeholder="$149"/></div>
           <div className="space-y-2"><Label htmlFor={'frequency-'+country+'-'+index}>Billing label</Label><Input id={'frequency-'+country+'-'+index} value={plan.monthlyLabel||'/month'} onChange={e=>edit(index,'monthlyLabel',e.target.value)}/></div>
           <div className="space-y-2"><Label htmlFor={'setup-'+country+'-'+index}>Setup fee</Label><Input id={'setup-'+country+'-'+index} value={plan.setup} onChange={e=>edit(index,'setup',e.target.value)}/></div>
         </div>
         <div className="grid md:grid-cols-2 gap-4">
           <div className="space-y-2"><Label htmlFor={'ownership-'+country+'-'+index}>Outright purchase option (optional)</Label><Input id={'ownership-'+country+'-'+index} value={plan.ownOutright||''} onChange={e=>edit(index,'ownOutright',e.target.value)} placeholder="Leave empty when unavailable"/></div>
           <div className="space-y-2"><Label htmlFor={'savings-'+country+'-'+index}>Savings comparison (optional)</Label><Input id={'savings-'+country+'-'+index} value={plan.savings||''} onChange={e=>edit(index,'savings',e.target.value)}/></div>
         </div>
         <div className="space-y-2"><Label htmlFor={'best-'+country+'-'+index}>Who this package is for</Label><Textarea id={'best-'+country+'-'+index} value={plan.bestFor} onChange={e=>edit(index,'bestFor',e.target.value)} rows={2}/></div>
         <div className="space-y-2"><Label htmlFor={'features-'+country+'-'+index}>Included features (one per line)</Label><Textarea id={'features-'+country+'-'+index} value={plan.features.join('\n')} onChange={e=>edit(index,'features',e.target.value.split('\n'))} rows={6}/></div>
         <div className="space-y-2"><Label htmlFor={'upgrade-'+country+'-'+index}>Upgrade note</Label><Input id={'upgrade-'+country+'-'+index} value={plan.upgradeNote} onChange={e=>edit(index,'upgradeNote',e.target.value)}/></div>
         <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={!!plan.popular} onChange={e=>edit(index,'popular',e.target.checked)} className="h-4 w-4 accent-[#1D3557]"/>Highlight as most popular</label>
       </section>)}
       <p className="text-sm text-muted-foreground">When changing subscription or purchase rates, review the savings comparison text too; it is editable wording rather than an automatic calculation.</p>
       <div className="flex flex-wrap justify-between items-center gap-4"><p aria-live="polite" className="text-sm text-muted-foreground">{dirty?'You have unsaved changes.':lastSaved?'All changes saved.':'All changes up to date.'}</p>
         <Button disabled={saving||!dirty} onClick={saveAll} className="rounded-full"><Save className="h-4 w-4 mr-2"/>{saving?'Saving...':'Save regional pricing'}</Button>
       </div>
     </div>}
 </>;
}
export default function AdminPricingPage(){
 const [country,setCountry]=useState<CountryCode>('us');
 const [dirty,setDirty]=useState(false);
 const selectRegion=(next:CountryCode)=>{
   if(next===country)return;
   if(dirty&&!window.confirm('Discard unsaved pricing changes for this region?'))return;
   setDirty(false);setCountry(next);
 };
 return <div className="space-y-8">
   <div><p className="section-eyebrow mb-3">Content management</p>
     <h1 className="text-3xl font-semibold tracking-tight">Website & platform pricing</h1>
     <p className="mt-3 text-sm text-muted-foreground max-w-2xl">Edit package rates, setup fees, ownership options and features by region. Saved prices appear on the homepage and regional pricing pages.</p>
   </div>
   <div role="group" aria-label="Pricing region" className="flex flex-wrap gap-2">{countries.map(c=><button type="button" key={c.code} onClick={()=>selectRegion(c.code)} className={'px-5 py-2.5 rounded-full border text-sm font-medium '+(country===c.code?'bg-primary border-primary text-white':'bg-white border-border hover:bg-secondary')} aria-pressed={country===c.code}>{c.name}</button>)}</div>
   <RegionEditor key={country} country={country} setDirty={setDirty}/>
 </div>;
}