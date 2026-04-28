"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Bot, Cpu, Smartphone } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Cpu,
    title: "Custom software",
    body: "Backend systems, integrations, and product logic — not just marketing pages. We design for scale, security, and long-term maintainability.",
  },
  {
    icon: Smartphone,
    title: "Mobile applications",
    body: "iOS, Android, and cross-platform apps with the same engineering rigor as our web stack — offline-first when your users need it.",
  },
  {
    icon: Bot,
    title: "AI & automation",
    body: "LLM features, internal copilots, and workflow automation embedded into your product — where models add real value, not hype.",
  },
] as const;

function RoboticsIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square max-w-md mx-auto md:mx-0 rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-950/80 to-zinc-900/40 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(127,0,13,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(127,0,13,0.35) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <svg
        viewBox="0 0 400 400"
        className="relative w-full h-full text-primary p-8 md:p-10"
        aria-hidden
      >
        <defs>
          <linearGradient id="cap-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(127 0 13)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(224 224 224)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* Abstract chassis */}
        <path
          d="M120 280 L120 140 Q120 100 160 100 L240 100 Q280 100 280 140 L280 280"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-90"
        />
        <rect x="155" y="115" width="90" height="70" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70" />
        <circle cx="200" cy="148" r="14" fill="none" stroke="url(#cap-glow)" strokeWidth="2" className="animate-pulse" />
        {/* Arms */}
        <path d="M120 175 L85 195 L70 250" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
        <path d="M280 175 L315 195 L330 250" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
        {/* Joint nodes */}
        {[
          [120, 175],
          [280, 175],
          [160, 260],
          [240, 260],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="currentColor" className="opacity-80" />
        ))}
        {/* Base */}
        <ellipse cx="200" cy="295" rx="95" ry="22" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
        <path d="M130 280 L170 315 L230 315 L270 280" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50" />
        {/* Circuit accents */}
        <path d="M60 90 H340 M90 60 V120 M310 60 V120" stroke="currentColor" strokeWidth="0.75" className="opacity-25" />
        <circle cx="90" cy="90" r="3" fill="currentColor" className="opacity-40" />
        <circle cx="310" cy="90" r="3" fill="currentColor" className="opacity-40" />
      </svg>
      <p className="absolute bottom-4 left-4 right-4 text-center font-code text-[9px] uppercase tracking-[0.35em] text-white/35">
        Systems · Interfaces · Intelligence
      </p>
    </div>
  );
}

export default function TechStack() {
  const [content, setContent] = useState({
    tag: "Engineering scope",
    headline: "Software,",
    headlineHighlight: "ships & models",
    description:
      "We build serious products: distributed backends, mobile clients, and AI that fits your workflow — not a logo grid of libraries.",
  });

  useEffect(() => {
    const unsub = onValue(ref(db, "content/techStack"), (snapshot) => {
      if (snapshot.exists()) {
        setContent(snapshot.val());
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-14 md:mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[10px] font-code uppercase tracking-[0.4em] text-primary/80">{content.tag}</span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-logo uppercase leading-[0.95] tracking-tighter mb-5">
            {content.headline}{" "}
            <span className="text-theme-2 italic">{content.headlineHighlight}</span>
          </h2>

          <p className="max-w-2xl mx-auto md:mx-0 text-muted-foreground font-body text-lg leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-center">
          <RoboticsIllustration />

          <ul className="flex flex-col gap-6">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="group rounded-xl border border-white/10 bg-secondary/5 backdrop-blur-sm p-6 md:p-7 transition-colors hover:border-primary/25 hover:bg-secondary/10"
              >
                <div className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-lg border border-white/10 bg-white/[0.04] flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-logo text-lg md:text-xl uppercase tracking-wide mb-2">{title}</h3>
                    <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
