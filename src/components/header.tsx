import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 sm:p-6 bg-gradient-to-b from-background/80 to-transparent">
      <div className="container mx-auto">
        <Link href="/" className="group inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
          <h1 className="text-2xl font-bold font-headline tracking-widest text-primary-foreground transition-colors group-hover:text-primary">
            SKYRISE
          </h1>
        </Link>
      </div>
    </header>
  );
}
