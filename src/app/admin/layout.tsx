'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {SidebarProvider,SidebarTrigger} from '@/components/ui/sidebar';
import {AdminSidebar} from '@/components/admin-sidebar';
import {Toaster} from '@/components/ui/toaster';
/** Existing session behavior retained; use Firebase Auth with admin-only database rules before production. */
export default function AdminLayout({children}:{children:React.ReactNode}){
 const router=useRouter(),[authorized,setAuthorized]=useState(false);
 useEffect(()=>{if(localStorage.getItem('admin_auth')==='true')setAuthorized(true);else router.replace('/login');},[router]);
 if(!authorized)return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Checking admin access...</div>;
 return <div className="admin-shell"><SidebarProvider><AdminSidebar/>
   <main className="flex-1 min-w-0 min-h-screen bg-white">
     <header className="h-20 sticky top-0 z-10 border-b border-border bg-white/95 backdrop-blur-lg flex items-center gap-4 px-6 md:px-8"><SidebarTrigger/><div><p className="text-sm font-semibold text-foreground">Skyrise administration</p><p className="text-xs text-muted-foreground">Manage your website content and pricing</p></div></header>
     <div className="mx-auto max-w-7xl w-full p-5 md:p-10">{children}</div><Toaster/>
   </main></SidebarProvider></div>;
}