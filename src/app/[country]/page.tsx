import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WaasPricingClient from "@/components/waas/waas-pricing-client";
import {
  WAAS_COUNTRIES,
  WAAS_REGIONS,
  WAAS_REGION_SEO,
  type CountryCode,
} from "@/data/waas-pricing";
import { getSiteUrl } from "@/lib/site-url";

type Props = {
  params: Promise<{ country: string }>;
};

const SITE_NAME = "SkyRise Studio";

function isCountryCode(value: string): value is CountryCode {
  return (WAAS_COUNTRIES as readonly string[]).includes(value);
}

function buildHreflangAlternates(): Record<string, string> {
  const base = getSiteUrl();
  const languages: Record<string, string> = {};
  for (const code of WAAS_COUNTRIES) {
    const seo = WAAS_REGION_SEO[code];
    languages[seo.hreflang] = `${base}/${code}`;
  }
  languages["x-default"] = `${base}/us`;
  return languages;
}

const HREFLANG_ALTERNATES = buildHreflangAlternates();

export async function generateStaticParams() {
  return WAAS_COUNTRIES.map((country) => ({ country }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country: raw } = await params;
  if (!isCountryCode(raw)) {
    return {
      title: `Website as a Service Pricing | ${SITE_NAME}`,
      description:
        "Explore SkyRise Website as a Service plans: regional pricing, subscription vs ownership, and managed infrastructure.",
      robots: { index: false, follow: false },
    };
  }

  const region = WAAS_REGIONS[raw];
  const seo = WAAS_REGION_SEO[raw];
  const base = getSiteUrl();
  const path = `/${raw}`;
  const canonicalUrl = `${base}${path}`;
  const title = `WaaS Pricing — ${region.name} | ${SITE_NAME}`;

  return {
    title,
    description: seo.metaDescription,
    keywords: [...seo.keywords, "Website as a Service", "WaaS", "SkyRise WaaS"],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: HREFLANG_ALTERNATES,
    },
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      alternateLocale: WAAS_COUNTRIES.filter((c) => c !== raw).map((c) => WAAS_REGION_SEO[c].ogLocale),
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description: seo.metaDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.metaDescription,
    },
    category: "business",
  };
}

function buildWebPageJsonLd(country: CountryCode): string {
  const region = WAAS_REGIONS[country];
  const seo = WAAS_REGION_SEO[country];
  const base = getSiteUrl();
  const url = `${base}/${country}`;
  const title = `WaaS Pricing — ${region.name} | ${SITE_NAME}`;

  const data = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description: seo.metaDescription,
    inLanguage: seo.hreflang,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: SITE_NAME,
      url: base,
    },
    mainEntity: {
      "@type": "Service",
      name: `SkyRise Website as a Service — ${region.name}`,
      description: region.description,
      serviceType: "Website design, hosting, and ongoing maintenance",
      url,
      areaServed: {
        "@type": "Country",
        name: region.name,
      },
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: base,
      },
    },
  };

  return JSON.stringify(data);
}

export default async function WaasPricingByCountryPage({ params }: Props) {
  const { country: raw } = await params;
  if (!isCountryCode(raw)) {
    notFound();
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: buildWebPageJsonLd(raw) }} />
      <WaasPricingClient country={raw} />
    </>
  );
}
