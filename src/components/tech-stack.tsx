"use client";

import React, { useState } from 'react';
import DecryptText from '@/components/decrypt-text';
import { cn } from '@/lib/utils';

const technologies = [
  { name: "C Language", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg" },
  { name: "C++", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" },
  { name: "Python", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
  { name: "HTML5", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" },
  { name: "CSS3", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" },
  { name: "JavaScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" },
  { name: "React", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" },
  { name: "Next.js", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" },
  { name: "Tailwind", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Docker", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
  { name: "Firebase", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg" },
  { name: "PostgreSQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
  { name: "MySQL", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
  { name: "SQLite", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" },
  { name: "Git", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
  { name: "NPM", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" },
  { name: "VS Code", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" },
  { name: "Linux", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
  { name: "Ubuntu", src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-plain-wordmark.svg" },
];

export default function TechStack() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-code uppercase tracking-[0.4em] text-primary/80">System Capabilities</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-logo uppercase leading-none tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Our <span className="text-theme-2 italic">Arsenal</span>
          </h2>
          
          <p className="max-w-xl mx-auto text-muted-foreground font-body text-lg animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Engineered with precision testing and high-performance frameworks to build the future of digital experiences.
          </p>
        </div>

        {/* Tech Console */}
        <div className="relative w-full max-w-5xl">
          {/* Decorative Corner Accents */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-theme-2/30" />
          <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-theme-2/30" />
          <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-theme-2/30" />
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-theme-2/30" />

          {/* Grid Container */}
          <div className="relative p-8 rounded-xl border border-white/5 bg-secondary/5 backdrop-blur-sm overflow-hidden group">
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-theme-2/50 to-transparent animate-scan z-20" />
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 md:gap-6">
              {technologies.map((tech, index) => (
                <div
                  key={tech.name}
                  className="group/item relative flex flex-col items-center justify-center aspect-square rounded-lg border border-white/5 bg-white/5 hover:bg-theme-1/10 hover:border-theme-2/40 transition-all duration-500 cursor-help"
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both' 
                  }}
                >
                  {/* Item Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-20 transition-opacity duration-500 rounded-lg bg-theme-2 blur-xl" />
                  
                  <img
                    src={tech.src}
                    alt={tech.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain transition-all duration-500 group-hover/item:brightness-110 scale-90 group-hover/item:scale-110 z-10"
                  />
                  
                  {/* Index overlay */}
                  <span className="absolute top-1 left-1.5 text-[8px] font-code text-white/20 group-hover/item:text-theme-2/60 transition-colors">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Tech Name Display Area */}
            <div className="mt-12 h-12 flex items-center justify-center border-t border-white/10 pt-8">
              <div className="text-center">
                {hoveredTech ? (
                  <DecryptText 
                    key={hoveredTech}
                    text={hoveredTech} 
                    animateOnMount={true}
                    className="text-2xl md:text-3xl font-code uppercase tracking-widest text-theme-2" 
                  />
                ) : (
                  <span className="text-xs font-code uppercase tracking-[0.3em] text-white/30 animate-pulse">
                    Hover icons to identify
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Subtitle/Data footer */}
          <div className="mt-6 flex flex-wrap justify-between items-center px-4 opacity-50 font-code text-[10px] uppercase tracking-wider">
            <span>Terminal: Online</span>
            <span>Stack Version: 2.0.4</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Low Latency</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" /> Edge Ready</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(1000%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </section>
  );
}
