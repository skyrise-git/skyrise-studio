import type { Metadata } from "next";
import Link from "next/link";
import HowItWorksContent from "@/components/how-it-works-content";

const SITE_NAME = "SkyRise Studio";

export const metadata: Metadata = {
  title: `How Website as a Service Works | ${SITE_NAME}`,
  description:
    "Pick a plan, subscribe or own outright, and we handle hosting, updates, and security — focus on your business while we keep your site online.",
};

export default function HowItWorksPage() {
  return (
    <HowItWorksContent
      heroEyebrow="Skyrise Dev — Website as a Service"
      heroTitle={
        <>
          How WaaS{" "}
          <span className="text-theme-2">works</span>
        </>
      }
      heroLead={
        <>
          Traditional web projects demand large upfront investment before you&apos;ve earned a rand or dollar back. Skyrise flips that:{" "}
          <strong className="text-foreground font-medium">start low monthly, scale as you grow,</strong> and own your site when you&apos;re ready.
        </>
      }
      backLink={
        <Link
          href="/"
          className="font-code text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to home
        </Link>
      }
    />
  );
}
