'use client';
import {useEffect,useState} from 'react';
import {ArrowUpRight,MoveRight} from 'lucide-react';
import {onValue,ref} from 'firebase/database';
import {db} from '@/lib/firebase';

const capabilities=[
  {num:'01',title:'Business websites & e-commerce',description:'High-quality business websites, online stores and customer experiences designed to make a powerful first impression and turn visitors into customers.',tags:['Business websites','Online stores','Website as a service']},
  {num:'02',title:'Custom platforms & software',description:'Purpose-built applications, client portals, marketplaces and integrations that streamline operations and support business growth.',tags:['Web platforms','Mobile applications','Integrations']},
  {num:'03',title:'Practical AI & automation',description:'Intelligent features, workflow automation and AI-powered tools integrated into the products and processes your teams already use.',tags:['AI-enabled experiences','Automation','Connected systems']},
];

export default function TechStack() {
  const [content,setContent]=useState({tag:'Our services',headline:'Engineering that helps',headlineHighlight:'you grow',description:'From the first idea to launch and long-term evolution, we combine excellent design with dependable software engineering.'});
  useEffect(()=>onValue(ref(db,'content/techStack'),snapshot=>{if(snapshot.exists())setContent(snapshot.val());}),[]);
  return <section id="services" className="scroll-mt-24 bg-[#F7F9FC] border-t border-border py-20 md:py-28">
    <div className="container">
      <div className="grid lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-32 self-start">
          <h2 className="text-[clamp(2.45rem,4vw,4.25rem)] leading-[1.12] font-bold tracking-[-.03em]">
            Everything you need to <span className="text-theme-2">build what&apos;s next.</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground mt-6 max-w-[530px]">
            Skyrise does more than create attractive websites. We design the technology your business runs on, with one team from strategy through delivery.
          </p>
          <p className="text-sm text-[#57718B] mt-5 max-w-md">{content.description}</p>
          <span className="sr-only">{content.tag}: {content.headline} {content.headlineHighlight}</span>
          <a href="/#contact" className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3.5 mt-8 font-semibold text-sm hover:bg-[#305B83] transition-colors">
            Discuss your requirements <ArrowUpRight size={17}/>
          </a>
        </div>
        <div className="divide-y divide-[#D6E0EA] border-t border-b border-[#D6E0EA]">
          {capabilities.map(item=><article key={item.num} className="group py-9 md:py-11">
            <div className="flex gap-5 md:gap-8">
              <span className="text-xs font-semibold tabular-nums text-[#5A85A9] pt-2">{item.num}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[1.55rem] md:text-[1.8rem] font-bold tracking-tight text-foreground leading-tight">{item.title}</h3>
                <p className="text-[#53697E] text-[15px] leading-relaxed mt-4 max-w-[590px]">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {item.tags.map(tag=><span key={tag} className="px-3 py-1.5 text-[11px] text-[#3F6281] bg-[#E9F0F7] rounded-full font-medium">{tag}</span>)}
                </div>
                <a href="/#contact" className="inline-flex gap-2 items-center mt-6 text-sm font-semibold text-primary group-hover:gap-3 transition-all">Explore this service <MoveRight size={17}/></a>
              </div>
              <ArrowUpRight size={22} className="text-[#6E95B7] shrink-0 mt-1 hidden sm:block"/>
            </div>
          </article>)}
        </div>
      </div>
      <div className="mt-16 md:mt-20 bg-[#193759] text-white rounded-[18px] px-7 md:px-12 py-9 md:py-11 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
        <div><h3 className="text-2xl md:text-[2rem] font-bold tracking-tight">Not sure what to build first?</h3>
          <p className="mt-2 text-[15px] text-[#D7E6F3] max-w-xl">Tell us the challenge. We&apos;ll help you find the right website, platform or custom development approach.</p>
        </div>
        <a href="/#contact" className="inline-flex items-center justify-center gap-2 bg-white text-[#18385C] font-bold text-sm rounded-full px-6 py-3.5 hover:bg-[#E7F3FF] transition-colors shrink-0">Let&apos;s find a solution <ArrowUpRight size={17}/></a>
      </div>
    </div>
  </section>;
}
