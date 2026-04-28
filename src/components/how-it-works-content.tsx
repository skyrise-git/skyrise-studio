"use client";

import React, { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    num: "01",
    title: "Pick Your Plan",
    body: "Choose a package matched to your market and business stage — from first website to full e-commerce.",
  },
  {
    num: "02",
    title: "Subscribe or Own",
    body: "Stay on a low monthly subscription with maintenance included, or pay once for immediate full ownership.",
  },
  {
    num: "03",
    title: "We Handle the Rest",
    body: "Hosting, updates, and security are covered. Focus on running your business — we keep it online and performing.",
  },
] as const;

export type HowItWorksContentProps = {
  heroEyebrow: string;
  heroTitle: ReactNode;
  heroLead: ReactNode;
  backLink?: ReactNode;
};

export default function HowItWorksContent({
  heroEyebrow,
  heroTitle,
  heroLead,
  backLink,
}: HowItWorksContentProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      <main className="flex-grow z-10 pt-24 md:pt-28 scroll-mt-24">
        <section className="container mx-auto px-4 md:px-8 max-w-6xl border-b border-white/5 pb-12 md:pb-16">
          {backLink && <div className="mb-8">{backLink}</div>}
          <p className="font-code text-xs uppercase tracking-[0.18em] text-primary mb-5">{heroEyebrow}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-logo uppercase tracking-wide max-w-4xl mb-7 leading-[1.05]">
            {heroTitle}
          </h1>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl leading-relaxed font-light">{heroLead}</p>
        </section>

        <section className="container mx-auto px-4 md:px-8 max-w-6xl py-14 md:py-20 grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
          <p className="font-logo text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground pt-1">The Process</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {STEPS.map((step) => (
              <div key={step.num} className="border-t-2 border-foreground pt-4">
                <p className="font-logo text-[10px] font-bold tracking-[0.14em] text-muted-foreground mb-2">{step.num}</p>
                <h2 className="font-logo text-sm md:text-base font-bold uppercase tracking-wide mb-2">{step.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 md:px-8 max-w-6xl pb-20 md:pb-28">
          <div className="rounded-sm border border-white/10 bg-card/20 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-logo text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">Ready?</p>
              <p className="text-lg font-logo uppercase tracking-wide text-foreground">Compare plans for your region</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Pricing varies by market — open your locale to see subscription and ownership options.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 shrink-0 items-stretch sm:items-center">
              <div className="flex flex-wrap gap-2 font-code text-xs uppercase tracking-wider">
                <Button asChild size="sm" variant="secondary" className="font-code">
                  <Link href="/za">/za</Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="font-code">
                  <Link href="/zw">/zw</Link>
                </Button>
                <Button asChild size="sm" variant="secondary" className="font-code">
                  <Link href="/us">/us</Link>
                </Button>
              </div>
              <Button asChild variant="outline" className="font-code uppercase tracking-wider">
                <Link href="/#contact">Contact</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
