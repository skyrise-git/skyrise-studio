'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {onValue,ref} from 'firebase/database';
import {db} from '@/lib/firebase';
import type {ImagePlaceholder} from '@/lib/placeholder-images';
import ProjectCard from '@/components/project-card';
import ProjectDialog from '@/components/project-dialog';
export default function FeaturedWork(){
  const [projects,setProjects]=useState<ImagePlaceholder[]>([]);
  const [selected,setSelected]=useState<ImagePlaceholder|null>(null);
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [copy,setCopy]=useState({headline:'Selected',headlineHighlight:'work',description:'A closer look at the websites, platforms and software products we have built.'});
  useEffect(()=>{
    const unsubProjects=onValue(ref(db,'projects'),snapshot=>{
      if(snapshot.exists()){
        const next:ImagePlaceholder[]=[];
        snapshot.forEach(child=>{const data=child.val();next.push({id:child.key,...data,imageUrl:data.imageUrl||'/projects/nexus-erp.png'} as ImagePlaceholder);});
        next.sort((a,b)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime());
        setProjects(next);
      }else setProjects([]);
      setLoading(false);
    },()=>setLoading(false));
    const unsubCopy=onValue(ref(db,'content/projects'),snapshot=>{if(snapshot.exists())setCopy(snapshot.val());});
    return ()=>{unsubProjects();unsubCopy();};
  },[]);
  return <section id="projects" className="scroll-mt-24 py-24 md:py-28 bg-white">
    <div className="container">
      <div className="max-w-3xl mb-12"><p className="section-eyebrow mb-4">Our work, our proof</p><h2 className="section-heading">{copy.headline} <span className="text-theme-2">{copy.headlineHighlight}</span></h2><p className="section-lead mt-5">{copy.description}</p></div>
      {loading&&<div className="grid sm:grid-cols-2 gap-7">{[1,2].map(n=><div key={n} className="aspect-[4/3] animate-pulse bg-secondary rounded-2xl"/>)}</div>}
      {!loading&&projects.length===0&&<div className="rounded-2xl bg-[#F8FAFC] border border-border py-16 px-8 text-center"><h3 className="text-xl font-semibold">Our latest projects are being prepared.</h3><p className="text-muted-foreground mt-3 max-w-xl mx-auto">Ask us about relevant work and examples for your industry.</p><a href="/#contact" className="mt-6 inline-flex items-center font-semibold gap-2 text-primary">Discuss your idea <ArrowUpRight size={16}/></a></div>}
      {projects.length>0&&<div className="grid sm:grid-cols-2 gap-6 lg:gap-8">{projects.map((p,i)=><ProjectCard key={p.id||i} project={p} onClick={()=>{setSelected(p);setOpen(true);}}/>)}</div>}
      <ProjectDialog project={selected} open={open} onOpenChange={setOpen}/>
    </div>
  </section>;
}