'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {onValue,ref} from 'firebase/database';
import {db} from '@/lib/firebase';
import type {ImagePlaceholder} from '@/lib/placeholder-images';
import ProjectCard from '@/components/project-card';
import ProjectDialog from '@/components/project-dialog';

export default function FeaturedWork() {
  const [projects,setProjects]=useState<ImagePlaceholder[]>([]);
  const [selected,setSelected]=useState<ImagePlaceholder|null>(null);
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const [copy,setCopy]=useState({headline:'Selected',headlineHighlight:'work',description:'A closer look at the websites, platforms and software products we have built.'});
  useEffect(()=>{
    const unsubProjects=onValue(ref(db,'projects'),snapshot=>{
      if(snapshot.exists()){
        const next:ImagePlaceholder[]=[];
        snapshot.forEach(child=>{
          const data=child.val();
          next.push({id:child.key,...data,imageUrl:data.imageUrl||'/projects/nexus-erp.png'} as ImagePlaceholder);
        });
        next.sort((a,b)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime());
        setProjects(next);
      }else setProjects([]);
      setLoading(false);
    },()=>setLoading(false));
    const unsubCopy=onValue(ref(db,'content/projects'),snapshot=>{if(snapshot.exists())setCopy(snapshot.val());});
    return ()=>{unsubProjects();unsubCopy();};
  },[]);

  return <section id="projects" className="scroll-mt-24 py-20 md:py-28 bg-white">
    <div className="container">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 md:mb-14">
        <div className="max-w-[780px]">
          <h2 className="text-[clamp(2.5rem,4.5vw,4.6rem)] font-bold tracking-[-.035em] leading-[1.09]">
            Real work. <span className="text-theme-2">Real products.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-[610px]">
            Explore some of the websites and digital platforms we&apos;ve developed. Open each project to see its features and the work behind it.
          </p>
          <span className="sr-only">{copy.headline} {copy.headlineHighlight}. {copy.description}</span>
        </div>
        <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-bold text-primary shrink-0 group">
          Have a project in mind? Let&apos;s talk <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
        </a>
      </div>
      {loading&&<div className="grid md:grid-cols-2 gap-8">{[1,2].map(n=><div key={n} className="h-[540px] animate-pulse bg-secondary rounded-2xl"/>)}</div>}
      {!loading&&projects.length===0&&<div className="rounded-2xl bg-[#F8FAFC] py-16 px-8 text-center border border-border">
        <h3 className="text-xl font-bold">Our case studies are being prepared.</h3>
        <p className="text-muted-foreground mt-3">Tell us what you&apos;re planning and we&apos;ll discuss relevant work.</p>
        <a href="/#contact" className="inline-flex items-center gap-2 mt-6 font-semibold text-primary">Start a conversation <ArrowUpRight size={16}/></a>
      </div>}
      {projects.length>0&&<div className="grid md:grid-cols-2 gap-7 lg:gap-9">{projects.map((p,i)=><ProjectCard key={p.id||i} project={p} onClick={()=>{setSelected(p);setOpen(true);}}/>)}</div>}
      <ProjectDialog project={selected} open={open} onOpenChange={setOpen}/>
      {projects.length>0&&<div className="mt-10 flex items-center justify-between flex-wrap gap-5 border-t border-[#E0E7EF] pt-7">
        <p className="text-sm text-[#657C91]">Every great product begins with a clear problem to solve.</p>
        <a href="/#contact" className="inline-flex items-center gap-2 font-bold text-sm text-primary">Build something with Skyrise <ArrowUpRight size={18}/></a>
      </div>}
    </div>
  </section>;
}
