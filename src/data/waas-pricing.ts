export type CountryCode = 'za' | 'zw' | 'us';

export type PackageBadge = 'sub' | 'hybrid' | 'project' | 'neutral';

export type WaasPackage = {
  badge: PackageBadge;
  badgeLabel?: string;
  title: string;
  bestFor: string;
  monthly: string;
  monthlyLabel?: string;
  setup: string;
  ownOutright?: string;
  savings?: string;
  features: string[];
  upgradeNote: string;
  popular?: boolean;
};

export type CustomTier = {
  label: string;
  titleLine1: string;
  titleEmphasis: string;
  description: string;
  pills: string[];
};

export type RegionPricing = {
  code: CountryCode;
  name: string;
  accentHex: string;
  description: string;
  packages: WaasPackage[];
  custom: CustomTier;
};

export const WAAS_COUNTRIES: CountryCode[] = ['za', 'zw', 'us'];

export const WAAS_REGIONS: Record<CountryCode, RegionPricing> = {
  za: {
    code: 'za',
    name: 'South Africa',
    accentHex: '#1a6ee8',
    description:
      "Four tiers built around South Africa's diverse business landscape — plus a fully bespoke option for complex needs.",
    packages: [
      {
        badge: 'sub',
        title: 'Starter',
        bestFor: 'For freelancers, personal brands, and new ventures launching online for the first time.',
        monthly: 'R350',
        setup: '+ R950 once-off setup fee',
        features: [
          '3-page professional website',
          'Mobile-first — looks sharp on any phone',
          'WhatsApp button for instant enquiries',
          'Managed hosting with SSL security',
          "Basic analytics so you see who's visiting",
        ],
        upgradeNote: '⬆ Growing fast? Upgrade to Growth anytime — setup fee credited.',
      },
      {
        badge: 'hybrid',
        title: 'Growth',
        bestFor: 'For small businesses building a credible, lead-generating web presence.',
        monthly: 'R850',
        setup: '+ R1,800 setup fee',
        ownOutright: 'Own outright: R10,500',
        savings: '💰 Save ~R11,700 vs. 24 months of subscription',
        features: [
          'Up to 8 pages — room for every service',
          'Business email (you@yourbusiness.co.za)',
          'Contact & lead capture forms',
          'Google-indexed SEO — get found locally',
          'Monthly uptime & performance report',
        ],
        upgradeNote: '⬆ Need active SEO or more pages? Move to Business Pro anytime.',
      },
      {
        badge: 'neutral',
        badgeLabel: 'Hybrid',
        title: 'Business Pro',
        bestFor: 'For established businesses that want their website actively driving revenue and leads.',
        monthly: 'R1,500',
        setup: '+ R2,500 setup fee',
        ownOutright: 'Own outright: R18,000 (incl. 1-yr maintenance)',
        savings: '💰 Save ~R20,500 vs. 24 months of subscription',
        features: [
          'Up to 15 pages — full brand experience',
          'Monthly SEO — climb Google rankings',
          'Lead forms with CRM-ready email routing',
          'Security monitoring & firewall',
          'Monthly performance & leads report',
          '1 free content update per month',
        ],
        upgradeNote: '⬆ Ready to sell products online? Upgrade to E-Commerce anytime.',
        popular: true,
      },
      {
        badge: 'hybrid',
        title: 'Platform',
        bestFor:
          'For businesses that need their website to actively take payments, automate workflows, and connect to their tools.',
        monthly: 'R2,500',
        setup: '+ R5,000 setup fee',
        ownOutright: 'Own outright: R32,000',
        savings: '💰 Save ~R33,000 vs. 24 months of subscription',
        features: [
          'Online payments — PayFast, Peach Payments, SnapScan',
          'Booking & appointment scheduling system',
          'Client quote, order & intake forms',
          'Third-party integrations — Xero, Mailchimp, WhatsApp Business API',
          'Member login area or gated content',
          'Monthly transaction & conversion report',
          'Priority support — 4hr response',
        ],
        upgradeNote: '⬆ Need multi-brand, ERP, or custom flows? See Custom below.',
      },
    ],
    custom: {
      label: 'Custom Tier',
      titleLine1: 'Need something',
      titleEmphasis: 'built from scratch?',
      description:
        'For enterprises, franchise groups, NGOs, and businesses with requirements that go beyond standard packages. We scope, design, and build a solution priced entirely around your needs — with a dedicated delivery team and an SLA-backed agreement from day one.',
      pills: [
        'Custom architecture',
        'Multi-brand / franchise',
        'ERP & CRM integration',
        'Staff & client portals',
        'Custom payment flows',
        'Dedicated account manager',
        'SLA-backed uptime (99.9%)',
        'Priority 1hr support',
      ],
    },
  },
  zw: {
    code: 'zw',
    name: 'Zimbabwe',
    accentHex: '#2a9e5f',
    description:
      "Mobile-first, data-light builds designed for Zimbabwe's connectivity realities and fast-growing digital economy.",
    packages: [
      {
        badge: 'sub',
        title: 'Starter',
        bestFor: 'For solopreneurs and side hustles needing a credible first impression online.',
        monthly: '$30',
        setup: '+ $75 once-off setup fee',
        features: [
          '3-page website — Home, Services & Contact',
          'Ultra-fast mobile loading — even on 3G',
          'WhatsApp & EcoCash contact buttons',
          'Managed hosting with SSL',
          'Google My Business profile setup',
        ],
        upgradeNote: '⬆ Need more pages or a business email? Move to Business anytime.',
      },
      {
        badge: 'hybrid',
        title: 'Business',
        bestFor: 'For established local businesses that need a proper online presence.',
        monthly: '$65',
        setup: '+ $199 setup fee',
        ownOutright: 'Own outright: $850',
        savings: '💰 Save ~$910 vs. 24 months of subscription',
        features: [
          'Up to 8 pages',
          'Business email (you@yourbusiness.co.zw)',
          'Contact & enquiry forms',
          'Local SEO — show up when customers search for you',
          'Data-light pages optimised for low-bandwidth users',
        ],
        upgradeNote: '⬆ Need bookings or a blog? Upgrade to Growth Pro.',
      },
      {
        badge: 'neutral',
        badgeLabel: 'Hybrid',
        title: 'Growth Pro',
        bestFor: 'For businesses actively acquiring clients and building brand authority online.',
        monthly: '$120',
        setup: '+ $400 setup fee',
        ownOutright: 'Own outright: $1,800',
        savings: '💰 Save ~$1,480 vs. 24 months of subscription',
        features: [
          'Up to 15 pages',
          'Appointment & booking system built in',
          'Blog / news section — build your authority',
          '2 content updates per month',
          'SEO tracking & keyword ranking reports',
          'Priority support — 8hr response',
        ],
        upgradeNote: '⬆ Need portals or staff systems? See Enterprise or Custom.',
        popular: true,
      },
      {
        badge: 'hybrid',
        title: 'Platform',
        bestFor:
          'For businesses that need their website to take payments, connect tools, and run real transactions online.',
        monthly: '$200',
        setup: '+ $750 setup fee',
        ownOutright: 'Own outright: $3,500+',
        savings: '💰 Save ~$2,050 vs. 24 months of subscription',
        features: [
          'Online payments — Paynow, EcoCash, Innbucks, bank transfer',
          'Booking & scheduling system',
          'Invoice & quote generation tools',
          'WhatsApp Business API integration',
          'Third-party tool connections — accounting, CRM, email',
          'Client login area or gated content',
          'Priority support — 2hr response',
        ],
        upgradeNote: '⬆ Need multi-branch portals or custom infrastructure? See Custom below.',
      },
    ],
    custom: {
      label: 'Custom Tier',
      titleLine1: 'A platform built',
      titleEmphasis: 'exactly for your business.',
      description:
        'For corporates, banks, telecoms, NGOs, and government-adjacent organisations operating in Zimbabwe. We build bespoke digital platforms with local payment rails, offline capability, and multi-branch architecture — scoped and priced to your specific needs.',
      pills: [
        'Custom platform architecture',
        'Multi-branch / multi-location',
        'Offline-capable builds',
        'Local payment rails (Paynow, Innbucks, EcoCash)',
        'Staff & client portal systems',
        'Dedicated account manager',
        'SLA-backed support — 1hr response',
      ],
    },
  },
  us: {
    code: 'us',
    name: 'United States',
    accentHex: '#c0392b',
    description:
      'Premium positioning built on speed, compliance, and measurable ROI — from local businesses to enterprise scale.',
    packages: [
      {
        badge: 'sub',
        title: 'Launch',
        bestFor: 'For local businesses, consultants, and service providers getting a professional presence online.',
        monthly: '$149',
        setup: '+ $299 setup fee',
        features: [
          '5-page professional website',
          'Google My Business setup — show up in local searches',
          'Daily cloud backups with one-click restore',
          'SSL + managed hosting',
          'ADA-ready, mobile-first design',
        ],
        upgradeNote: '⬆ Need SEO or lead generation? Move to Growth anytime.',
      },
      {
        badge: 'hybrid',
        title: 'Growth',
        bestFor: 'For growing businesses that need their site to actively generate leads and organic traffic.',
        monthly: '$349',
        setup: '+ $950 setup fee',
        ownOutright: 'Own outright: $5,500',
        savings: '💰 Save ~$3,826 vs. 24 months of subscription',
        features: [
          'Up to 15 pages — a complete business showcase',
          'Monthly SEO — move up in Google rankings',
          'Conversion-optimised landing pages',
          'ADA Title III compliance built in',
          'Monthly traffic & leads dashboard',
        ],
        upgradeNote: '⬆ Need payments, bookings, or integrations? Upgrade to Platform anytime.',
      },
      {
        badge: 'neutral',
        badgeLabel: 'Hybrid',
        title: 'Platform',
        bestFor:
          'For businesses that need their website to take payments, automate workflows, and connect to the tools they run on.',
        monthly: '$549',
        setup: '+ $1,500 setup fee',
        ownOutright: 'Own outright: $8,500',
        savings: '💰 Save ~$6,176 vs. 24 months of subscription',
        features: [
          'Online payments — Stripe, PayPal, Square',
          'Booking & scheduling system',
          'Membership & gated content access',
          'Third-party integrations — Zapier, HubSpot, Mailchimp',
          'Automated email flows & notifications',
          'Product or service catalogue (with or without checkout)',
          'Monthly revenue & ROI report',
          'Priority support — 4hr response',
        ],
        upgradeNote: '⬆ Need CRM, custom dev, or full enterprise architecture? See Enterprise or Custom.',
        popular: true,
      },
      {
        badge: 'hybrid',
        title: 'Enterprise',
        bestFor: 'For scaling companies that need a custom platform and a dedicated team behind it.',
        monthly: '$999',
        setup: '+ $2,500 setup fee',
        ownOutright: 'Own outright: $18,000+',
        savings: '💰 Save ~$8,476 vs. 24 months of subscription',
        features: [
          'Fully custom design & development',
          'HubSpot or Salesforce CRM integration',
          'Multi-location or multi-brand architecture',
          'Advanced A/B testing & personalisation',
          'Dedicated account manager',
          'SLA-backed uptime guarantee (99.9%)',
        ],
        upgradeNote: '⬆ Agency or reseller? See Custom below.',
      },
    ],
    custom: {
      label: 'Custom Tier',
      titleLine1: 'Enterprise-grade builds',
      titleEmphasis: 'scoped to your roadmap.',
      description:
        'For enterprise companies, agencies, and white-label resellers who need a fully bespoke engagement. We handle discovery, architecture, compliance, development, and ongoing managed services — with contracts and SLAs tailored to your legal and operational requirements.',
      pills: [
        'Full custom architecture',
        'White-label reseller programme',
        'HIPAA / SOC 2 readiness',
        'Salesforce / HubSpot / SAP integration',
        'Multi-brand platform builds',
        'Dedicated engineering team',
        'Custom SLA & contract',
        '24/7 priority support',
      ],
    },
  },
};

export const WAAS_COMPARISON_ROWS: { label: string; sub: string; own: string; custom: string }[] = [
  {
    label: 'Upfront Cost',
    sub: 'Setup fee only — lowest barrier',
    own: 'Full project cost at the start',
    custom: 'Scoped and quoted per project',
  },
  {
    label: 'Maintenance',
    sub: 'Included for the life of subscription',
    own: 'Free for 1 year — then billed separately',
    custom: 'Defined in your SLA agreement',
  },
  {
    label: 'Ownership',
    sub: 'Leased — transfer to ownership after 24 months',
    own: 'Yours immediately, no strings',
    custom: 'Full ownership on project completion',
  },
  {
    label: 'Long-Term Cost',
    sub: 'Higher over 3+ years — zero surprise bills',
    own: 'Lower over time — real digital asset',
    custom: 'Negotiated with volume & term discounts',
  },
  {
    label: 'Best For',
    sub: 'Cash-flow conscious businesses and startups',
    own: 'Established companies investing upfront',
    custom: 'Enterprise, franchise & agency accounts',
  },
];
