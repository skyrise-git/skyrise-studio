"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Bot, Cpu, Smartphone } from "lucide-react";

/** Stock photo (Unsplash): human–robot collaboration / engineering workspace */
const ROBOT_IMAGE_SRC = "/images/engineering-robot.jpg";

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

function RoboticsPhoto({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative w-full max-w-md mx-auto md:mx-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-lg shadow-black/20",
        className
      )}
    >
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={ROBOT_IMAGE_SRC}
          alt="Robotic equipment and engineering workspace"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 28rem"
          priority={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-center font-code text-[9px] uppercase tracking-[0.25em] text-white/45">
        <span className="block">Systems · Interfaces · Intelligence</span>
        <span className="mt-1 block normal-case tracking-normal text-white/30">Stock photo · Unsplash</span>
      </figcaption>
    </figure>
  );
}

export default function TechStack() {
  const [content, setContent] = useState({
    tag: "Engineering scope",
    headline: "Software,",
    headlineHighlight: "ships & models",
    description:
      "We build serious products: distributed backends, mobile clients, and AI that fits your workflow.",
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
            <span className="text-theme-2">{content.headlineHighlight}</span>
          </h2>

          <p className="max-w-2xl mx-auto md:mx-0 text-muted-foreground font-body text-lg leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-center">
          <RoboticsPhoto />

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
