"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, PlusSquare, LogOut, Home, Type, Code, Globe, LayoutTemplate } from "lucide-react";
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
  { title: "Hero Section", url: "/admin/content/hero", icon: Type },
  { title: "Tech Stack", url: "/admin/content/tech-stack", icon: Code },
  { title: "Global Presence", url: "/admin/content/global", icon: Globe },
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
      <SidebarHeader className="p-6 border-b border-white/5">
        <Link href="/" className="group inline-block focus:outline-none rounded-sm">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-primary group-hover:text-theme-4 transition-colors" />
            <h1 className="text-xl font-bold font-logo tracking-widest text-primary transition-colors group-hover:text-theme-4">
              SKYRISE
            </h1>
          </div>
        </Link>
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
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentMenu.map((item) => (
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
