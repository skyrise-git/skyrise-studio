import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { getMetadataBase } from '@/lib/site-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'Skyrise | Professional Websites, Platforms & Custom Software',
  description: 'Skyrise builds high-quality business websites, digital platforms, e-commerce experiences, and custom software with transparent website and platform package pricing.',
  keywords: ['Website Development','Business Website Packages','Digital Platforms','Custom Software','Software Development','Ecommerce','Skyrise'],
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en" suppressHydrationWarning>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    </head>
    <body className="font-body antialiased">
      <ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>
        {children}<Toaster />
      </ThemeProvider>
    </body>
  </html>;
}