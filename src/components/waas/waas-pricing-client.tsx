"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type CountryCode,
  type WaasPackage,
  WAAS_REGIONS,
  WAAS_COMPARISON_ROWS,
} from "@/data/waas-pricing";

function badgeDisplayText(pkg: WaasPackage): string {
  if (pkg.badgeLabel) return pkg.badgeLabel;
  switch (pkg.badge) {
    case "sub":
      return "Subscription Only";
    case "hybrid":
      return "Hybrid";
    case "project":
      return "Project";
    default:
      return "Hybrid";
  }
}

function PackageBadge({
  pkg,
  accentHex,
}: {
  pkg: WaasPackage;
  accentHex: string;
}) {
  const label = badgeDisplayText(pkg);
  if (pkg.popular) {
    return (
      <span className="inline-block font-logo text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-sm mb-4 bg-white/[0.09] text-zinc-400">
        {label}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-block font-logo text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-sm mb-4",
        pkg.badge === "sub" && "bg-blue-500/15",
        pkg.badge === "hybrid" && "bg-orange-500/15 text-orange-300",
        pkg.badge === "project" && "bg-emerald-500/15 text-emerald-300",
        pkg.badge === "neutral" && "bg-white/10 text-muted-foreground",
      )}
      style={pkg.badge === "sub" ? { color: accentHex } : undefined}
    >
      {label}
    </span>
  );
}

type WaasPricingClientProps = {
  country: CountryCode;
};

export default function WaasPricingClient({ country }: WaasPricingClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const region = WAAS_REGIONS[country];

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
      <main className="flex-grow z-10 pt-24 md:pt-28">
        {/* Hero */}
        <section className="container mx-auto px-4 md:px-8 max-w-6xl border-b border-white/5 pb-16 md:pb-20">
          <p className="font-code text-xs uppercase tracking-[0.18em] text-primary mb-5">
            Skyrise Dev — Website as a Service
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-logo uppercase tracking-wide max-w-4xl mb-7 leading-[1.05]">
            Your website,
            <br />
            <span className="text-theme-2 italic">without the risk.</span>
          </h1>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-xl leading-relaxed font-light">
            Traditional web projects demand large upfront investments — before you&apos;ve earned a single rand or
            dollar. Skyrise flips that model.{" "}
            <strong className="text-foreground font-medium">
              Start with a low monthly fee, scale as you grow,
            </strong>{" "}
            and own your site outright whenever you&apos;re ready.
          </p>
          <p className="mt-8">
            <Button asChild variant="outline" className="font-code uppercase tracking-wider">
              <Link href="/how-it-works">How WaaS works</Link>
            </Button>
          </p>
        </section>

        {/* Region content */}
        <div className="pb-6">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl pt-10 md:pt-11">
            <p className="font-code text-xs uppercase tracking-[0.18em] text-primary mb-3">Plans &amp; pricing</p>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{region.description}</p>
          </div>

          <div className="container mx-auto px-4 md:px-8 max-w-6xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-8">
            {region.packages.map((pkg) => (
              <article
                key={pkg.title}
                className={cn(
                  "relative rounded-sm border p-6 md:p-7 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
                  pkg.popular
                    ? "bg-zinc-950 border-zinc-800 text-zinc-100"
                    : "bg-card/30 border-white/10 backdrop-blur-sm",
                )}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 font-logo text-[10px] font-bold uppercase tracking-[0.12em] bg-primary text-primary-foreground px-3.5 py-1 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}
                <PackageBadge pkg={pkg} accentHex={region.accentHex} />
                <h3 className="font-logo text-lg font-bold uppercase tracking-wide mb-1">{pkg.title}</h3>
                <p
                  className={cn(
                    "text-[13px] italic min-h-[2.5rem] mb-4 leading-snug",
                    pkg.popular ? "text-zinc-400" : "text-muted-foreground",
                  )}
                >
                  {pkg.bestFor}
                </p>
                <div className={cn("h-px mb-4", pkg.popular ? "bg-white/10" : "bg-white/10")} />
                <div className="mb-1">
                  <span className="font-logo text-2xl font-bold tracking-tight">{pkg.monthly}</span>
                  <span className={cn("text-xs ml-0.5", pkg.popular ? "text-zinc-500" : "text-muted-foreground")}>
                    {pkg.monthlyLabel ?? "/month"}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs",
                    pkg.popular ? "text-zinc-500" : "text-muted-foreground",
                    !pkg.ownOutright && !pkg.savings ? "mb-4" : "mb-3",
                  )}
                >
                  {pkg.setup}
                </p>
                {pkg.ownOutright && (
                  <span
                    className={cn(
                      "block text-xs font-medium border rounded-sm px-2.5 py-1.5",
                      pkg.savings ? "mb-1.5" : "mb-4",
                      pkg.popular
                        ? "border-white/10 bg-white/[0.06] text-zinc-200"
                        : "border-white/10 bg-background/50 text-foreground",
                    )}
                  >
                    {pkg.ownOutright}
                  </span>
                )}
                {pkg.savings && (
                  <span
                    className={cn(
                      "block text-[11.5px] font-semibold border rounded-sm px-2.5 py-1.5 mb-4",
                      pkg.popular
                        ? "border-transparent bg-orange-500/20 text-orange-200"
                        : "border-orange-500/20 bg-orange-500/10 text-orange-300",
                    )}
                  >
                    {pkg.savings}
                  </span>
                )}
                <p
                  className={cn(
                    "font-logo text-[9.5px] font-bold uppercase tracking-[0.14em] mb-2",
                    pkg.popular ? "text-zinc-500" : "text-muted-foreground",
                  )}
                >
                  What you get
                </p>
                <ul className="flex flex-col gap-1.5 flex-1">
                  {pkg.features.map((f) => (
                    <li
                      key={f}
                      className={cn(
                        "text-[13px] pl-4 relative leading-snug",
                        pkg.popular ? "text-zinc-300" : "text-foreground/90",
                      )}
                    >
                      <span className="absolute left-0 text-muted-foreground text-[11px] top-0.5">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p
                  className={cn(
                    "mt-5 pt-3.5 text-[11.5px] border-t leading-relaxed",
                    pkg.popular ? "text-zinc-500 border-white/10" : "text-muted-foreground border-white/10",
                  )}
                >
                  {pkg.upgradeNote}
                </p>
              </article>
            ))}
          </div>

          {/* Custom tier */}
          <div className="container mx-auto px-4 md:px-8 max-w-6xl mt-6 mb-16 md:mb-20">
            <div className="relative bg-zinc-950 rounded-sm border border-white/10 overflow-hidden grid lg:grid-cols-[1fr_auto] gap-10 items-center p-8 md:p-11 lg:p-12">
              <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute top-0 -right-6 w-36 h-36 rounded-full border border-white/[0.04] pointer-events-none" />
              <div>
                <p className="font-logo text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 mb-3">
                  {region.custom.label}
                </p>
                <h3 className="font-logo text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide text-zinc-100 mb-4 leading-tight">
                  {region.custom.titleLine1}
                  <br />
                  <span className="text-theme-2 italic">{region.custom.titleEmphasis}</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mb-5">{region.custom.description}</p>
                <div className="flex flex-wrap gap-2">
                  {region.custom.pills.map((pill) => (
                    <span
                      key={pill}
                      className="font-logo text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-sm bg-white/[0.07] text-zinc-300 border border-white/10"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-[180px] lg:items-stretch">
                <p className="font-logo text-xs font-bold uppercase tracking-[0.06em] text-center text-zinc-500">
                  Pricing on request
                </p>
                <Button asChild className="font-code uppercase tracking-wider">
                  <Link href="/#contact">Book a Discovery Call</Link>
                </Button>
                <Button asChild variant="outline" className="font-code uppercase tracking-wider border-white/15 text-zinc-300 hover:bg-white/5">
                  <Link href="/#contact">Download Capabilities Deck</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <section className="bg-zinc-950 text-zinc-100 border-y border-white/5 py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
            <div className="grid md:grid-cols-[220px_1fr] gap-8 md:gap-16 mb-10 md:mb-12">
              <p className="font-logo text-xs font-bold uppercase tracking-[0.18em] text-zinc-500 pt-1">
                Subscription vs. Ownership
              </p>
              <h2 className="text-3xl md:text-4xl font-logo uppercase tracking-wide leading-tight">
                Not sure which
                <br />
                model fits? <span className="text-theme-2 italic">Here&apos;s the breakdown.</span>
              </h2>
            </div>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 pr-4" />
                    <th className="pb-4 px-3 text-center font-logo text-[11px] uppercase tracking-wide text-zinc-500">
                      <span className="inline-block rounded-full px-3.5 py-1 bg-blue-500/20 text-blue-200">
                        Subscription (WaaS)
                      </span>
                    </th>
                    <th className="pb-4 px-3 text-center font-logo text-[11px] uppercase tracking-wide text-zinc-500">
                      <span className="inline-block rounded-full px-3.5 py-1 bg-orange-500/20 text-orange-200">
                        Flat Fee (Ownership)
                      </span>
                    </th>
                    <th className="pb-4 pl-3 text-center font-logo text-[11px] uppercase tracking-wide text-zinc-500">
                      <span className="inline-block rounded-full px-3.5 py-1 bg-white/10 text-zinc-300">Custom</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {WAAS_COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-white/[0.06]">
                      <td className="py-4 pr-4 text-xs text-zinc-500 font-medium w-[180px]">{row.label}</td>
                      <td className="py-4 px-3 text-center text-sm text-zinc-100">{row.sub}</td>
                      <td className="py-4 px-3 text-center text-sm text-zinc-100">{row.own}</td>
                      <td className="py-4 pl-3 text-center text-sm text-zinc-100">{row.custom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footnote */}
        <section className="container mx-auto px-4 md:px-8 max-w-6xl py-14 md:py-16 border-t border-white/5 grid md:grid-cols-[220px_1fr] gap-10 md:gap-16">
          <p className="font-logo text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground pt-1">
            Infrastructure
          </p>
          <div>
            <h3 className="font-logo text-lg md:text-xl font-bold uppercase tracking-wide mb-3">
              Your costs stay predictable. Always.
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-7">
              Every package runs on managed infrastructure with{" "}
              <strong className="text-foreground font-medium">
                proactive security monitoring, automatic updates, and daily backups
              </strong>{" "}
              — no surprise maintenance bills, ever. For clients scaling across multiple sites, we leverage long-term
              hosting partnerships to keep per-site costs fixed as your portfolio grows.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/#contact" className="font-code uppercase tracking-wider">
                  Get a Custom Quote
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/#contact" className="font-code uppercase tracking-wider">
                  Download SLA Template
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
