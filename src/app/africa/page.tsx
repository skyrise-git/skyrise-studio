import type { Metadata } from 'next';
import AfricaPricingClient from '@/components/waas/africa-pricing-client';

export const metadata: Metadata = {
  title: 'Website & Platform Packages Across Africa | Skyrise',
  description: 'Explore website and platform packages for African businesses. Select your country to see regional plans, pricing, subscription and ownership options.',
  robots: {index: true, follow: true},
  alternates: {canonical: '/africa'},
};

type Props = {searchParams: Promise<{country?: string}>};

export default async function AfricaPricingPage({searchParams}:Props){
  const {country} = await searchParams;
  return <AfricaPricingClient initialCountry={country||''}/>;
}
