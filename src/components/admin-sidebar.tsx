"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, PlusSquare, LogOut, Home } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminMenu = [
  { title: "Dashboard / Messages", url: "/admin", icon: MessageSquare },
  { title: "Add Project", url: "/admin/projects/new", icon: PlusSquare },
];

const contentMenu = [
  { title: "Hero Section", url: "/admin/content/hero" },
  { title: "Global Presence", url: "/admin/content/global" },
  { title: "Tech Stack & Skills", url: "/admin/content/tech-stack" },
  { title: "Footer", url: "/admin/content/footer" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <Sidebar variant="inset" className="border-r border-white/5 bg-secondary/10 backdrop-blur-md">
      <SidebarHeader className="p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-logo font-bold text-background text-xl">S</div>
          <span className="font-logo font-bold uppercase text-lg text-primary">Skyrise</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-code text-xs uppercase tracking-wider mt-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-5"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-code text-xs uppercase tracking-wider mt-4">
            Marketing Page Editing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-3"
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 opacity-70" />
                      <span className="font-medium text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 py-5"
            >
              <Link href="/" className="flex items-center gap-3">
                <Home className="w-5 h-5" />
                <span>View Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              className="hover:bg-destructive/20 hover:text-destructive text-destructive/80 transition-colors duration-200 py-5"
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
