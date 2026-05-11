"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { getWhatsAppHref } from "@/lib/contact";

const MARQUEE_ITEMS = [
  "Next.js", "TypeScript", "Supabase", "Vercel", "React", "Tailwind",
  "MuleSoft", "Salesforce", "AI Agents", "MCP", "Genkit", "Stripe",
  "OAuth", "Postgres", "Custom APIs",
];

const TRUST_ITEMS = ["Marketplaces", "Property Tech", "Fintech", "AI & Automation"];

// Doubled for seamless CSS marquee loop
const MARQUEE_DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function HeroSection() {
  const glowRef = useRef<HTMLDivElement>(null);

  /* Cursor-follow radial glow (pointer devices only) */
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || !window.matchMedia("(hover: hover)").matches) return;

    let visible = false;
    let raf: number | null = null;
    let cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          glow.style.left = cx + "px";
          glow.style.top  = cy + "px";
          raf = null;
        });
      }
      if (!visible) {
        glow.style.opacity = "1";
        visible = true;
      }
    };

    const onLeave = () => {
      glow.style.opacity = "0";
      visible = false;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const waHref = getWhatsAppHref();

  return (
    <>
      {/* Cursor glow — hidden on touch via CSS */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed z-[2] hidden [.can-hover_&]:block"
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(230,57,70,0.11) 0%, rgba(230,57,70,0.04) 30%, transparent 60%)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.5s ease",
          mixBlendMode: "lighten",
          willChange: "left, top",
        }}
      />

      <section
        className="relative z-[2] flex flex-col min-h-screen pt-[60px] px-6 md:px-14"
        aria-label="Hero"
      >
        {/* ── Hero copy ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center max-w-[980px] py-14">

          {/* Eyebrow */}
          <div
            className="hero-animate flex items-center gap-3 mb-7 font-body text-[12px] uppercase text-muted-foreground"
            style={{ letterSpacing: "0.16em", animationDelay: "100ms" }}
          >
            <span
              aria-hidden
              className="inline-block w-7 h-px bg-primary shrink-0"
            />
            Engineering studio · Boston
          </div>

          {/* Small wordmark */}
          <div
            className="hero-animate font-display text-[36px] leading-none text-primary mb-7"
            style={{ animationDelay: "250ms" }}
          >
            SKYRISE
          </div>

          {/* Headline */}
          <h1
            className="hero-animate font-display text-foreground mb-8"
            style={{
              fontSize: "clamp(48px, 6.4vw, 92px)",
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
              maxWidth: "14ch",
              animationDelay: "400ms",
            }}
          >
            Custom software and AI workflows,{" "}
            <em style={{ fontStyle: "italic", color: "hsl(var(--primary))" }}>
              shipped to production
            </em>
            .
          </h1>

          {/* Subhead */}
          <p
            className="hero-animate font-body text-muted-foreground mb-11"
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              maxWidth: 560,
              animationDelay: "550ms",
            }}
          >
            A senior engineering studio building marketplaces, AI workflows, and
            custom platforms — from first prototype to production.
          </p>

          {/* CTAs */}
          <div
            className="hero-animate flex flex-wrap items-center gap-7"
            style={{ animationDelay: "700ms" }}
          >
            {/* Primary */}
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2.5 bg-primary px-[26px] py-4 font-body text-[14px] text-white transition-colors hover:bg-primary-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-none"
              style={{ letterSpacing: "0.01em" }}
            >
              Get In Touch
              <span
                className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </Link>

            {/* Secondary */}
            <Link
              href="/#work"
              className="inline-block font-body text-[14px] text-foreground border-b border-[#3A3A37] pb-0.5 transition-colors duration-200 hover:text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore Projects
            </Link>

            {/* WhatsApp */}
            {waHref && (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send a message on WhatsApp"
                className="inline-block font-body text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Send Message
              </a>
            )}
          </div>
        </div>

        {/* ── Trust strip ───────────────────────────────────────────── */}
        <div
          className="hero-animate flex flex-wrap items-center gap-8 pt-7 border-t border-white/[0.08]"
          style={{ animationDelay: "850ms" }}
          aria-label="Industries served"
        >
          <span
            className="font-body text-[11px] uppercase text-muted-foreground whitespace-nowrap"
            style={{ letterSpacing: "0.16em" }}
          >
            Industries
          </span>
          <ul className="flex flex-wrap items-center gap-7 list-none m-0 p-0">
            {TRUST_ITEMS.map((item, i) => (
              <React.Fragment key={item}>
                <li
                  className="font-display text-[18px] text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-default"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {item}
                </li>
                {i < TRUST_ITEMS.length - 1 && (
                  <li aria-hidden className="text-[#3A3A37] text-[12px]">/</li>
                )}
              </React.Fragment>
            ))}
          </ul>

          {/* Status */}
          <div
            className="ml-auto flex items-center gap-2 whitespace-nowrap"
            aria-label="Availability: booking Q3 2026"
          >
            <span
              className="inline-block w-[7px] h-[7px] rounded-full bg-primary animate-dot-pulse"
              aria-hidden
            />
            <span
              className="font-body text-[11px] uppercase text-muted-foreground"
              style={{ letterSpacing: "0.14em" }}
            >
              Booking Q3 2026
            </span>
          </div>
        </div>

        {/* ── Capabilities marquee ──────────────────────────────────── */}
        <div
          className="hero-animate marquee-container overflow-hidden py-4 border-t border-white/[0.08] mt-0"
          style={{ animationDelay: "1000ms" }}
          aria-hidden
        >
          <div
            className="marquee-track inline-flex gap-9 animate-marquee whitespace-nowrap"
            style={{ paddingLeft: 36 }}
          >
            {MARQUEE_DOUBLED.map((item, i) => (
              <React.Fragment key={i}>
                <span
                  className="font-display text-[17px] text-[#3A3A37] hover:text-foreground transition-colors duration-300 cursor-default"
                  style={{ letterSpacing: "0.01em" }}
                >
                  {item}
                </span>
                <span className="text-primary/50 text-[17px] self-center">/</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
