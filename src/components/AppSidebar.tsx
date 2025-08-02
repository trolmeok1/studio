'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Users,
  LayoutDashboard,
  Trophy,
  Shield,
  Sun,
  Moon,
  LogOut,
  Settings,
  Sparkles,
  CalendarDays,
  ClipboardSignature,
  FileText,
  UserCog,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';

const useTheme = () => {
  const isServer = typeof window === 'undefined';
  const _setTheme = (theme: 'light' | 'dark') => {
    if (!isServer) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  };
  return { setTheme: _setTheme };
};

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-primary size-8" />
          <h1 className="text-xl font-bold font-headline">TeamLink Hub</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard')}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/players')}
              tooltip="Players"
            >
              <Link href="/players">
                <Users />
                <span>Players</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
        <SidebarGroup>
           <SidebarGroupLabel>Admin</SidebarGroupLabel>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/ai-cards')} tooltip="Carnets AI">
                    <Link href="#">
                        <Sparkles />
                        <span>Carnets AI</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/schedule')} tooltip="Programación">
                    <Link href="#">
                        <CalendarDays />
                        <span>Programación</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/committees')} tooltip="Vocalías">
                    <Link href="#">
                        <ClipboardSignature />
                        <span>Vocalías</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip="Reportes">
                    <Link href="#">
                        <FileText />
                        <span>Reportes</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/roles')} tooltip="Roles">
                    <Link href="#">
                        <UserCog />
                        <span>Roles</span>
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md p-2 bg-muted/50">
           <Avatar className="h-10 w-10">
              <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="user avatar" alt="Admin User" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Admin User</span>
              <span className="text-xs text-muted-foreground">admin@teamlink.hub</span>
            </div>
        </div>
      </SidebarFooter>
    </>
  );
}
