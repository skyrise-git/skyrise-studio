"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setLoadingUser(false);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, [router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse bg-secondary/20 px-8 py-4 rounded-full border border-white/10 text-primary uppercase font-code tracking-widest text-sm shadow-xl">
          Verifying Access...
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 w-full bg-background relative flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 p-4 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center gap-4">
          <SidebarTrigger />
          <h2 className="text-xl font-logo uppercase text-primary tracking-wide">
            Skyrise Admin Panel
          </h2>
        </header>
        <div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
