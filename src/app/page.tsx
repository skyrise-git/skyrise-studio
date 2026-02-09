"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import TechStack from '@/components/tech-stack';
import FeaturedWork from '@/components/featured-work';
import Footer from '@/components/footer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground isolate">
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1]">
        <div 
          className="absolute top-[20vh] -left-[20vw] w-[80vw] h-[80vw] bg-primary/10 rounded-full mix-blend-screen"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div 
          className="absolute bottom-[-40vh] -right-[20vw] w-[70vw] h-[70vw] bg-secondary/10 rounded-full mix-blend-screen"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      <Header />
      <main className="flex-grow z-10">
        <HeroSection scrollY={scrollY} />
        <div className="space-y-48 md:space-y-64 py-24 md:py-32 overflow-hidden">
          <TechStack />
          <FeaturedWork />
        </div>
        <Footer />
      </main>
    </div>
  );
}
