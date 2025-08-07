

'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
  SidebarMenuSkeleton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Users,
  LayoutDashboard,
  Trophy,
  Shield,
  LogOut,
  Settings,
  CalendarDays,
  FilePen,
  CreditCard,
  Flag,
  Swords,
  UserCog,
  Landmark,
  FileClock,
  ClipboardList,
  UserCheck,
  BarChart2,
  ImageIcon,
  Database,
  Sun,
  Moon,
  Home,
  LogIn,
  Users2,
  ListOrdered,
  ScrollText,
  Menu,
  AlertOctagon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import React from 'react';


export function AppSidebar() {
  const pathname = usePathname();
  const { user, isCopaPublic, isAuthLoading, logout } = useAuth();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };
  
  if (isAuthLoading) {
    return (
        <>
            <SidebarHeader>
                 <div className="flex items-center gap-2">
                    <Trophy className="text-primary size-8" />
                    <h1 className="text-xl font-bold font-headline">LIGA LA LUZ</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <div className="flex flex-col gap-2 p-2">
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                </div>
                 <SidebarSeparator />
                <div className="flex flex-col gap-2 p-2">
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                    <SidebarMenuSkeleton showIcon />
                </div>
            </SidebarContent>
        </>
    );
  }

  const { permissions } = user;
  const hasAdminPermissions = user.role === 'admin' || user.role === 'secretary';

  const mainNavItems = [
    permissions.dashboard.view && { href: '/dashboard', icon: LayoutDashboard, label: 'Inicio', tooltip: 'Inicio' },
    permissions.teams.view && { href: '/teams', icon: Shield, label: 'Equipos', tooltip: 'Equipos' },
    (permissions.copa.view && (isCopaPublic || hasAdminPermissions)) && { href: '/copa', icon: Trophy, label: 'Copa', tooltip: 'Copa' }
  ].filter(Boolean);
  
  const tournamentNavItems = [
      permissions.players.view && { href: '/players', icon: Users, label: 'Jugadores', tooltip: 'Jugadores' },
      permissions.schedule.view && { href: '/schedule', icon: CalendarDays, label: 'Programación', tooltip: 'Programación' },
      permissions.partido.view && { href: '/partido', icon: ClipboardList, label: 'Resultados', tooltip: 'Resultados' },
      { href: '/requests/requalification', icon: UserCheck, label: 'Solicitudes', tooltip: 'Crear Solicitudes' },
      permissions.reports.view && { href: '/reports', icon: BarChart2, label: 'Reportes', tooltip: 'Reportes' },
  ].filter(Boolean);

  const adminNavItems = [
      permissions.aiCards.view && { href: '/ai-cards', icon: CreditCard, label: 'Carnets AI', tooltip: 'Carnets AI' },
      permissions.committees.view && { href: '/committees', icon: FilePen, label: 'Vocalías', tooltip: 'Vocalías' },
      permissions.treasury.view && { href: '/treasury', icon: Landmark, label: 'Tesorería', tooltip: 'Tesorería' },
      permissions.requests.view && { href: '/requests/management', icon: UserCheck, label: 'Gestión de Jugadores', tooltip: 'Gestión de Calificación' },
  ].filter(Boolean);

  const settingsNavItems = [
      permissions.roles.view && { href: '/roles', icon: UserCog, label: 'Roles', tooltip: 'Roles' },
      permissions.logs.view && { href: '/logs', icon: FileClock, label: 'Logs', tooltip: 'Logs' },
      user.role === 'admin' && { href: '/settings/sanctions', icon: AlertOctagon, label: 'Sanciones', tooltip: 'Sanciones' },
      user.role === 'admin' && { href: '/settings/appearance', icon: ImageIcon, label: 'Apariencia', tooltip: 'Apariencia' },
      user.role === 'admin' && { href: '/settings/data', icon: Database, label: 'Gestión de Datos', tooltip: 'Gestión de Datos' },
  ].filter(Boolean);


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-primary size-8" />
          <h1 className="text-xl font-bold font-headline">LIGA LA LUZ</h1>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {mainNavItems.map(item => item && (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.tooltip}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {tournamentNavItems.length > 0 && (
            <>
                <SidebarSeparator />
                <SidebarGroup>
                   <SidebarGroupLabel>Torneo</SidebarGroupLabel>
                   <SidebarMenu>
                     {tournamentNavItems.map(item => item && (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.tooltip}>
                              <Link href={item.href}>
                                  <item.icon />
                                  <span>{item.label}</span>
                              </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                   </SidebarMenu>
                </SidebarGroup>
            </>
        )}
        
        {hasAdminPermissions && adminNavItems.length > 0 && (
            <>
                <SidebarSeparator />
                <SidebarGroup>
                   <SidebarGroupLabel>Admin</SidebarGroupLabel>
                   <SidebarMenu>
                     {adminNavItems.map(item => item && (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.tooltip}>
                              <Link href={item.href}>
                                  <item.icon />
                                  <span>{item.label}</span>
                              </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                   </SidebarMenu>
                </SidebarGroup>
            </>
        )}
                 
        {hasAdminPermissions && settingsNavItems.length > 0 && (
            <>
                <SidebarSeparator />
                <SidebarGroup>
                   <SidebarGroupLabel>Configuración</SidebarGroupLabel>
                    <SidebarMenu>
                       {settingsNavItems.map(item => item && (
                          <SidebarMenuItem key={item.href}>
                              <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={item.tooltip}>
                                  <Link href={item.href}>
                                      <item.icon />
                                      <span>{item.label}</span>
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col items-stretch gap-3 rounded-md p-2">
            {user.role === 'guest' ? (
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2" />
                        Acceso Administrativo
                    </Link>
                </Button>
            ) : (
                 <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                       {user.avatarUrl && (
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrl} data-ai-hint="user avatar" alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        )}
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                     <div className="flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                         <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0">
                            <LogOut />
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </SidebarFooter>
    </>
  );
}


export function BottomNavbar() {
    const pathname = usePathname();
    const { user, isCopaPublic, isAuthLoading } = useAuth();
    const { setOpenMobile } = useSidebar();
    
    if (isAuthLoading) {
        return (
             <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
                <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="inline-flex flex-col items-center justify-center px-5">
                            <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                            <div className="w-10 h-2 mt-1 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const { permissions } = user;
    const hasAdminPermissions = user.role === 'admin' || user.role === 'secretary';

    const isActive = (path: string) => {
      return pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
    };

    const canViewCopa = permissions.copa.view && (isCopaPublic || hasAdminPermissions);

    let navItems = [
      { href: '/dashboard', icon: Home, label: 'Inicio', permission: permissions.dashboard.view },
      { href: '/teams', icon: Shield, label: 'Equipos', permission: permissions.teams.view },
      { href: '/schedule', icon: CalendarDays, label: 'Calendario', permission: permissions.schedule.view },
      { href: '/partido', icon: ClipboardList, label: 'Resultados', permission: permissions.partido.view },
    ];
    
    const filteredNavItems = navItems.filter(item => item.permission).slice(0, 4);


    return (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
                {filteredNavItems.map(item => (
                    <Link key={item.href} href={item.href} className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group">
                         <item.icon className={cn("w-5 h-5 mb-1 text-muted-foreground group-hover:text-primary", isActive(item.href) && "text-primary")} />
                        <span className={cn("text-xs text-muted-foreground group-hover:text-primary", isActive(item.href) && "text-primary")}>
                            {item.label}
                        </span>
                    </Link>
                ))}
                 <button onClick={() => setOpenMobile(true)} className="inline-flex flex-col items-center justify-center px-5 hover:bg-muted group">
                     <Menu className="w-5 h-5 mb-1 text-muted-foreground group-hover:text-primary" />
                     <span className="text-xs text-muted-foreground group-hover:text-primary">Menú</span>
                 </button>
            </div>
        </div>
    );
}
