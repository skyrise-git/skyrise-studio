'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {signOut} from 'firebase/auth';
import {auth} from '@/lib/firebase';
import {LayoutDashboard,MessageSquare,FolderKanban,Banknote,FileText,Globe2,Cpu,PanelBottom,Home,LogOut} from 'lucide-react';
import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem} from '@/components/ui/sidebar';
const sections=[
 {label:'Workspace',links:[{title:'Inquiries',url:'/admin',icon:MessageSquare},{title:'Portfolio projects',url:'/admin/projects',icon:FolderKanban},{title:'Website pricing',url:'/admin/pricing',icon:Banknote}]},
 {label:'Page content',links:[{title:'Homepage hero',url:'/admin/content/hero',icon:FileText},{title:'Global section',url:'/admin/content/global',icon:Globe2},{title:'Services section',url:'/admin/content/tech-stack',icon:Cpu},{title:'Contact & footer',url:'/admin/content/footer',icon:PanelBottom}]},
];
export function AdminSidebar(){
 const pathname=usePathname(),router=useRouter();
 async function logout(){try{await signOut(auth);}catch(e){console.error(e);}localStorage.removeItem('admin_auth');router.push('/login');}
 return <Sidebar variant="inset" className="border-r border-border bg-[#F8FAFC]">
   <SidebarHeader className="p-6 border-b border-border"><Link href="/admin" className="flex items-center gap-3"><span className="w-10 h-10 bg-primary rounded-lg text-white grid place-items-center"><LayoutDashboard size={21}/></span><span><strong className="block font-bold text-lg tracking-tight">SKYRISE<span className="text-theme-2">.</span></strong><span className="text-xs text-muted-foreground">Admin workspace</span></span></Link></SidebarHeader>
   <SidebarContent className="px-2 pt-4">{sections.map(section=><SidebarGroup key={section.label}><SidebarGroupLabel className="font-semibold tracking-normal text-xs text-muted-foreground mb-2">{section.label}</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>
     {section.links.map(({title,url,icon:Icon})=><SidebarMenuItem key={url}><SidebarMenuButton asChild isActive={pathname===url} className="h-11 rounded-lg text-sm hover:bg-secondary data-[active=true]:bg-[#E7EEF7] data-[active=true]:text-primary"><Link href={url}><Icon className="h-4 w-4"/>{title}</Link></SidebarMenuButton></SidebarMenuItem>)}
   </SidebarMenu></SidebarGroupContent></SidebarGroup>)}</SidebarContent>
   <SidebarFooter className="border-t border-border p-4 space-y-1"><SidebarMenu>
     <SidebarMenuItem><SidebarMenuButton asChild><Link href="/"><Home size={18}/> View website</Link></SidebarMenuButton></SidebarMenuItem>
     <SidebarMenuItem><SidebarMenuButton onClick={logout}><LogOut size={18}/> Sign out</SidebarMenuButton></SidebarMenuItem>
   </SidebarMenu></SidebarFooter>
 </Sidebar>;
}