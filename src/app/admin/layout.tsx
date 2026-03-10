"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for our static auth flag
    const authStatus = localStorage.getItem('admin_auth');
    
    if (authStatus === 'true') {
      setIsAuthorized(true);
      setIsLoading(false);
    } else {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse bg-secondary/20 px-8 py-4 rounded-full border border-white/10 text-primary uppercase font-code tracking-widest text-sm shadow-xl">
          Verifying Admin Session...
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
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
