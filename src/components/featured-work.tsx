'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { onValue, ref } from 'firebase/database';
import { db } from '@/lib/firebase';
import type { ShowcaseProject } from '@/lib/project-showcase';
import ProjectCard from '@/components/project-card';
import ProjectDialog from '@/components/project-dialog';

const LEASIO: ShowcaseProject = {
  id: 'curated-leasio-website',
  title: 'Leasio Property Management',
  description: 'Property operations, leases, payments, maintenance and tenant experiences in one platform.',
  longDescription: 'Leasio is a property management platform bringing together properties, tenants, rent, leases, maintenance and reporting.',
  technologies: [],
  advantages: ['Unified property operations', 'Tenant and owner experiences', 'Maintenance workflows'],
  features: ['Property and lease management', 'Rent and payments', 'Maintenance tracking', 'Tenant portal'],
  imageUrl: '/projects/leasio-preview.svg',
  imageHint: 'Illustrative website preview',
  websiteUrl: 'https://www.leasio.co.za/',
  previewDevice: 'laptop',
  previewNote: 'Illustrative interface',
  createdAt: '2026-10-30T12:00:00Z',
};

function isLeasio(project: ShowcaseProject) {
  return /leasio/i.test([project.title, project.websiteUrl || '', project.id].join(' '));
}
function enrich(project: ShowcaseProject): ShowcaseProject {
  // Keep user-managed project records and any optional device setting intact.
  // NESTS currently has a portrait/mobile screenshot, even though it is a responsive website.
  if (/nests|nestsafrica/i.test([project.title,project.websiteUrl||''].join(' ')))
    return { ...project, previewDevice: project.previewDevice || 'phone' };
  if (/nova commerce/i.test(project.title))
    return { ...project, previewDevice: project.previewDevice || 'laptop' };
  return project;
}
function withLeasio(projects: ShowcaseProject[]) {
  const present = projects.some(isLeasio);
  const combined = present ? projects : [LEASIO, ...projects];
  return combined.map(enrich);
}

export default function FeaturedWork() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([LEASIO]);
  const [selected, setSelected] = useState<ShowcaseProject|null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [copy, setCopy] = useState({
    headline: 'Selected', headlineHighlight: 'work',
    description: 'A closer look at the websites, platforms and software products we have built.',
  });
  const viewport = useRef<HTMLDivElement>(null);
  const firstSet = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  pausedRef.current = paused;
  hoveredRef.current = hovered;

  useEffect(() => {
    const unsubProjects = onValue(ref(db, 'projects'), snapshot => {
      if (snapshot.exists()) {
        const next: ShowcaseProject[] = [];
        snapshot.forEach(child => {
          const data = child.val();
          next.push({
            id: child.key, ...data,
            imageUrl: data.imageUrl || '/projects/nexus-erp.png',
          } as ShowcaseProject);
        });
        next.sort((a,b) => new Date(b.createdAt || 0).getTime()-new Date(a.createdAt || 0).getTime());
        setProjects(withLeasio(next));
      } else setProjects([LEASIO]);
      setLoading(false);
    }, () => { setProjects([LEASIO]); setLoading(false); });
    const unsubContent = onValue(ref(db,'content/projects'),snapshot => { if(snapshot.exists())setCopy(snapshot.val()); });
    return () => { unsubProjects(); unsubContent(); };
  }, []);

  // A seamless single-row belt: two identical groups; reset scroll position at
  // the precise start of group two. No continuous state renders or setInterval.
  useEffect(() => {
    const host = viewport.current;
    const group = firstSet.current;
    if (!host || !group || !projects.length) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change',updateMotion);
    let inView = true, raf = 0, previous = 0;
    const frame = (now: number) => {
      raf = 0;
      const elapsed = previous ? Math.min(now-previous,64) : 0;
      previous = now;
      if (inView && !document.hidden && !media.matches) {
        if (!pausedRef.current && !hoveredRef.current) {
          const segment = group.offsetWidth;
          if (segment) {
            host.scrollLeft += elapsed * 0.028;
            if (host.scrollLeft >= segment) host.scrollLeft -= segment;
          }
        }
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; previous = 0; };
    const start = () => { if (!raf && inView && !document.hidden && !media.matches) raf = requestAnimationFrame(frame); };
    const visibility = () => document.hidden ? stop() : start();
    const observer = new IntersectionObserver(entries => {
      inView = !!entries[0]?.isIntersecting;
      if(inView)start(); else stop();
    },{threshold:0.01});
    observer.observe(host);
    document.addEventListener('visibilitychange',visibility);
    const motionChanged = () => { updateMotion(); media.matches ? stop() : start(); };
    media.addEventListener('change',motionChanged);
    start();
    return () => {
      stop(); observer.disconnect();
      document.removeEventListener('visibilitychange',visibility);
      media.removeEventListener('change',updateMotion);
      media.removeEventListener('change',motionChanged);
    };
  }, [projects]);

  const shift = useCallback((direction: -1 | 1) => {
    const host=viewport.current, width=firstSet.current?.offsetWidth||0;
    if(!host)return;
    setPaused(true);
    if(direction===-1 && host.scrollLeft<400 && width)host.scrollLeft+=width;
    host.scrollBy({left:direction*390,behavior:reducedMotion?'auto':'smooth'});
  },[reducedMotion]);
  const normalize = () => {
    const host=viewport.current, width=firstSet.current?.offsetWidth||0;
    if(host && width && host.scrollLeft>=width)host.scrollLeft-=width;
  };

  return <section id="projects" className="scroll-mt-24 bg-white py-20 md:py-24" aria-label="Selected projects">
    <div className="container mb-9">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-[clamp(2.3rem,4.2vw,4.25rem)] font-bold tracking-[-.035em] leading-[1.09]">
            Real work. <span className="text-theme-2">Real products.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-[600px]">
            Websites, digital platforms and mobile experiences—presented the way customers actually use them. Browse our work and explore the details.
          </p>
          <span className="sr-only">{copy.headline} {copy.headlineHighlight}. {copy.description}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={()=>shift(-1)} aria-label="Previous projects" className="w-10 h-10 grid place-items-center rounded-full border border-border text-primary hover:bg-[#EAF1F7] focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft size={19}/></button>
          <button type="button" onClick={()=>shift(1)} aria-label="Next projects" className="w-10 h-10 grid place-items-center rounded-full border border-border text-primary hover:bg-[#EAF1F7] focus-visible:ring-2 focus-visible:ring-primary"><ArrowRight size={19}/></button>
          <button type="button" onClick={()=>setPaused(!paused)} aria-label={paused?'Resume moving projects':'Pause moving projects'} aria-pressed={paused} className="h-10 px-4 flex items-center gap-2 rounded-full bg-[#EAF1F7] text-primary text-xs font-semibold hover:bg-[#DDEAF5] focus-visible:ring-2 focus-visible:ring-primary">
            {paused?<Play size={15}/>:<Pause size={15}/>} {paused?'Play':'Pause'}
          </button>
        </div>
      </div>
    </div>

    {loading && <div className="container"><div className="flex gap-5 overflow-hidden">{[1,2,3].map(i=><div key={i} className="w-[335px] shrink-0 h-[390px] bg-[#F1F5F9] rounded-2xl animate-pulse"/>)}</div></div>}
    {!loading && <div
      ref={viewport}
      onScroll={normalize}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onFocusCapture={()=>setHovered(true)}
      onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node))setHovered(false);}}
      onTouchStart={()=>setPaused(true)}
      onWheel={event=>{if(Math.abs(event.deltaX)>Math.abs(event.deltaY))setPaused(true);}}
      className="w-full overflow-x-auto overscroll-x-contain pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-within:scroll-auto"
      role="region"
      aria-label="Scrollable selection of Skyrise projects"
      tabIndex={0}
    >
      <div className="flex w-max">
        <div ref={firstSet} className="flex items-stretch gap-5 pl-5 shrink-0">
          {projects.map((project,index)=><ProjectCard key={project.id||index} project={project} onClick={()=>{setPaused(true);setSelected(project);setOpen(true);}}/>)}
        </div>
        <div className="flex items-stretch gap-5 pl-6 pr-5 shrink-0" aria-label="More project previews">
          {projects.map((project,index)=><ProjectCard key={'clone-'+(project.id||index)} project={project} onClick={()=>{setPaused(true);setSelected(project);setOpen(true);}}/>)}
        </div>
      </div>
    </div>}

    <div className="container mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p className="text-xs md:text-sm text-muted-foreground">Scroll or use the arrows to explore. Movement pauses when you interact.</p>
      <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-bold text-primary">Let&apos;s build something together <ArrowUpRight size={18}/></a>
    </div>
    <ProjectDialog project={selected} open={open} onOpenChange={setOpen}/>
  </section>;
}
