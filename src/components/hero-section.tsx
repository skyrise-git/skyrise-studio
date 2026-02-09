"use client";

import { ArrowDown } from "lucide-react";

type HeroSectionProps = {
  scrollY: number;
};

export default function HeroSection({ scrollY }: HeroSectionProps) {
  return (
    <section className="relative h-[120vh] min-h-[700px] w-full flex items-center justify-center text-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        {/* 3D Tower */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ perspective: '1000px' }}>
          <div className="w-48 h-[150vh] relative" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(20deg) rotateY(0deg)' }}>
            <div className="absolute inset-0 border-x border-primary/50" />
            <div className="absolute inset-0 border-x border-primary/50" style={{ transform: 'rotateY(45deg)' }} />
            <div className="absolute inset-0 border-x border-primary/50" style={{ transform: 'rotateY(90deg)' }} />
            <div className="absolute inset-0 border-x border-primary/50" style={{ transform: 'rotateY(135deg)' }} />

            {/* Horizontal lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                style={{ top: `${i * 5}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div 
        className="relative z-10 flex flex-col items-center animate-in fade-in duration-1000"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      >
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-widest">
          SKYRISE
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance font-body tracking-wide">
          Constructing the digital frontier. We are the architects of high-performance software, building robust, scalable, and elegant solutions that touch the sky.
        </p>
      </div>

      <div className="absolute bottom-10 z-20 flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
        <span className="font-code text-xs">SCROLL</span>
        <ArrowDown className="h-4 w-4" />
      </div>
    </section>
  );
}
