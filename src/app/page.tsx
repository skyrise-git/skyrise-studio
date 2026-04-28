"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import TechStack from '@/components/tech-stack';
import FeaturedWork from '@/components/featured-work';
import Footer from '@/components/footer';
import WorldMap from "@/components/ui/world-map";
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [globalContent, setGlobalContent] = useState({
    headline: 'Global',
    headlineHighlight: 'Presence',
    description: 'From the USA and Canada to Europe, Africa, and Asia, we deliver high-performance engineering solutions worldwide.'
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fetch Global Content
    const unsubGlobal = onValue(ref(db, 'content/global'), (snapshot) => {
      if (snapshot.exists()) {
        setGlobalContent(snapshot.val());
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubGlobal();
    };
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
          <section id="projects" className="scroll-mt-28">
            <FeaturedWork />
          </section>

          <section id="skills" className="scroll-mt-28">
            <TechStack />
          </section>

          <section id="global" className="scroll-mt-28 container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-logo uppercase">{globalContent.headline} <span className="text-theme-2 italic">{globalContent.headlineHighlight}</span></h2>
              <p className="text-muted-foreground font-body mt-2 max-w-2xl mx-auto">
                {globalContent.description}
              </p>
            </div>
            <div className="relative w-full max-w-5xl mx-auto rounded-3xl border border-white/5 bg-secondary/5 backdrop-blur-sm p-4 md:p-8">
              <WorldMap
                lineColor="#ffffff"
                dots={[
                  { start: { lat: 34.0522, lng: -118.2437 }, end: { lat: 40.7128, lng: -74.006 } },
                  { start: { lat: 40.7128, lng: -74.006 }, end: { lat: 43.6532, lng: -79.3832 } },
                  { start: { lat: 43.6532, lng: -79.3832 }, end: { lat: 51.5074, lng: -0.1278 } },
                  { start: { lat: 51.5074, lng: -0.1278 }, end: { lat: 48.8566, lng: 2.3522 } },
                  { start: { lat: 48.8566, lng: 2.3522 }, end: { lat: -26.2041, lng: 28.0473 } },
                  { start: { lat: -26.2041, lng: 28.0473 }, end: { lat: -17.8216, lng: 31.0492 } },
                  { start: { lat: -17.8216, lng: 31.0492 }, end: { lat: 28.6139, lng: 77.209 } },
                ]}
              />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
