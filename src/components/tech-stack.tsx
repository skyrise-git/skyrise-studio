'use client';
import {useEffect,useState} from 'react';
import {Bot,Cpu,Smartphone,ArrowUpRight} from 'lucide-react';
import {onValue,ref} from 'firebase/database';
import {db} from '@/lib/firebase';
const capabilities=[
  {icon:Cpu,title:'Custom software & integrations',body:'Secure applications, backend services and integrated platforms built around the way your business works.'},
  {icon:Smartphone,title:'Web & mobile experiences',body:'Customer-facing applications designed for accessibility, clarity, speed and a consistent user experience.'},
  {icon:Bot,title:'AI & workflow automation',body:'Practical intelligent experiences and automation that simplify processes and free your people to focus on customers.'},
];
export default function TechStack(){
  const [content,setContent]=useState({tag:'Our services',headline:'Engineering that helps',headlineHighlight:'you grow',description:'From the first idea to launch and long-term evolution, we combine excellent design with dependable software engineering.'});
  useEffect(()=>onValue(ref(db,'content/techStack'),snapshot=>{if(snapshot.exists())setContent(snapshot.val());}),[]);
  return <section id="services" className="scroll-mt-24 bg-white py-24 md:py-28">
    <div className="container">
      <div className="max-w-3xl mb-12">
        <p className="section-eyebrow mb-4">{content.tag}</p>
        <h2 className="section-heading">{content.headline} <span className="text-theme-2">{content.headlineHighlight}</span></h2>
        <p className="section-lead mt-5">{content.description}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {capabilities.map(({icon:Icon,title,body})=><article key={title} className="surface-card p-8">
          <div className="w-12 h-12 rounded-xl bg-[#EDF3FA] flex items-center justify-center text-theme-2 mb-8"><Icon size={24} strokeWidth={1.6}/></div>
          <h3 className="text-xl font-semibold mb-4">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          <a href="/#contact" className="inline-flex gap-2 items-center text-sm font-semibold text-primary mt-6">Talk to us <ArrowUpRight size={16}/></a>
        </article>)}
      </div>
    </div>
  </section>;
}