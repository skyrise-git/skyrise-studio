"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/#work',        label: 'Work'    },
  { href: '/#services',    label: 'Services' },
  { href: '/how-it-works', label: 'Process'  },
] as const;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-6 md:px-14 transition-all duration-300',
          isScrolled
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent',
        )}
      >
        <div className="flex items-center justify-between h-[60px] max-w-[1400px] mx-auto">
          {/* Serif wordmark */}
          <Link
            href="/"
            className="font-display text-[22px] leading-none text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            style={{ letterSpacing: '0.02em' }}
          >
            Skyrise
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-body text-[14px] text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <Link
              href="/#contact"
              className={cn(
                'font-body text-[13px] text-foreground px-4 py-[9px]',
                'border border-white/[0.14] rounded-[2px] transition-colors duration-200',
                'hover:border-primary hover:text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              Book a call
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden text-foreground p-2 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#050505]/97 backdrop-blur-lg flex flex-col pt-[76px] px-6 pb-10"
          aria-modal="true"
          role="dialog"
        >
          <nav className="flex flex-col gap-8 pt-8" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-3xl text-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Link
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className={cn(
                'inline-block font-body text-[14px] text-foreground px-5 py-3',
                'border border-white/[0.14] rounded-[2px] hover:border-primary hover:text-primary transition-colors',
              )}
            >
              Book a call
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
