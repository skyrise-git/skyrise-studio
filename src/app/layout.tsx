import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { getMetadataBase } from '@/lib/site-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: 'SkyRise Studio | Global Software Development & Scalable Solutions',
  description: 'SkyRise Studio is a premier software development team providing scalable solutions in Next.js, Node, React, Python, Rust, Go, and Flutter. Serving clients globally across USA, Canada, Europe, South Africa, and Zimbabwe.',
  keywords: ['Software Development', 'Web Development', 'Mobile Apps', 'Next.js', 'React', 'Node.js', 'Rust', 'Go', 'Flutter', 'Scalable Solutions', 'Global Tech Team'],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Primary display + body stack */}
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        {/* Legacy fonts kept for admin/WaaS pages */}
        <link href="https://fonts.googleapis.com/css2?family=Teko:wght@400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
