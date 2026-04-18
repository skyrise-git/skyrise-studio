import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaasPricingClient from "@/components/waas/waas-pricing-client";
import { WAAS_COUNTRIES, WAAS_REGIONS, type CountryCode } from "@/data/waas-pricing";

type Props = {
  params: Promise<{ country: string }>;
};

function isCountryCode(value: string): value is CountryCode {
  return (WAAS_COUNTRIES as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  return WAAS_COUNTRIES.map((country) => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: raw } = await params;
  if (!isCountryCode(raw)) {
    return {
      title: "Website as a Service Pricing | SkyRise Studio",
      description: "Website as a Service pricing by region.",
    };
  }
  const region = WAAS_REGIONS[raw];
  return {
    title: `WaaS Pricing — ${region.name} | SkyRise Studio`,
    description: `${region.description} Subscription and ownership options for SkyRise WaaS in ${region.name}.`,
    openGraph: {
      title: `WaaS Pricing — ${region.name} | SkyRise Studio`,
      description: region.description,
    },
  };
}

export default async function WaasPricingByCountryPage({ params }: Props) {
  const { country: raw } = await params;
  if (!isCountryCode(raw)) {
    notFound();
  }
  return <WaasPricingClient country={raw} />;
}
