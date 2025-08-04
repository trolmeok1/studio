
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

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();
  const { setTheme, theme } = useTheme();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    // In a real app, you'd clear the session here
    router.push('/login');
  };

  const { permissions } = user;

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Trophy className="text-primary size-8" />
          <h1 className="text-xl font-bold font-headline">Liga Control</h1>
          <div className="ml-auto md:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-grow">
        <SidebarMenu>
          {permissions.dashboard.view && <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard')}
              tooltip="Inicio"
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Inicio</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>}
           {permissions.players.view && <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive('/players')} tooltip="Jugadores">
                  <Link href="/players">
                      <Users />
                      <span>Jugadores</span>
                  </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>}
           {permissions.schedule.view && <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/schedule')} tooltip="Programación">
                <Link href="/schedule">
                    <CalendarDays />
                    <span>Programación</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>}
           {permissions.partido.view && <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/partido')} tooltip="Resultados">
                <Link href="/partido">
                    <ClipboardList />
                    <span>Resultados</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>}
          {permissions.copa.view && <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/copa')} tooltip="Copa">
                <Link href="/copa">
                    <Trophy />
                    <span>Copa</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>}
        </SidebarMenu>
        
        <SidebarSeparator />

        <SidebarGroup>
           <SidebarGroupLabel>Admin</SidebarGroupLabel>
           <SidebarMenu>
              {permissions.aiCards.view && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/ai-cards')} tooltip="Carnets AI">
                      <Link href="/ai-cards">
                          <CreditCard />
                          <span>Carnets AI</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
               {permissions.committees.view && (
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/committees')} tooltip="Vocalías">
                      <Link href="/committees">
                          <FilePen />
                          <span>Vocalías</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               )}
                {permissions.treasury.view && (
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/treasury')} tooltip="Tesorería">
                      <Link href="/treasury">
                          <Landmark />
                          <span>Tesorería</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               )}
                {permissions.requests.view && (
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/requests')} tooltip="Solicitudes">
                      <Link href="/requests/requalification">
                          <UserCheck />
                          <span>Solicitudes</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               )}
                 {permissions.reports.view && (
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip="Reportes">
                      <Link href="/reports">
                          <BarChart2 />
                          <span>Reportes</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               )}
           </SidebarMenu>
        </SidebarGroup>
         
        <SidebarSeparator />

        <SidebarGroup>
           <SidebarGroupLabel>Configuración</SidebarGroupLabel>
            <SidebarMenu>
               {permissions.teams.view && <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/teams')} tooltip="Equipos">
                      <Link href="/teams">
                          <Shield />
                          <span>Equipos</span>
                      </Link>
                  </SidebarMenuButton>
              </SidebarMenuItem>}
                {permissions.roles.view && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/roles')} tooltip="Roles">
                          <Link href="/roles">
                              <UserCog />
                              <span>Roles</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                 {permissions.logs.view && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/logs')} tooltip="Logs">
                          <Link href="/logs">
                              <FileClock />
                              <span>Logs</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                 {user.role === 'admin' && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings/appearance')} tooltip="Apariencia">
                          <Link href="/settings/appearance">
                              <ImageIcon />
                              <span>Apariencia</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                 {user.role === 'admin' && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/settings/data')} tooltip="Gestión de Datos">
                          <Link href="/settings/data">
                              <Database />
                              <span>Gestión de Datos</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
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
                        <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} data-ai-hint="user avatar" alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
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
    const { user } = useAuth();
    const { permissions } = user;

    const isActive = (path: string) => {
      return pathname === path || (path !== '/dashboard' && pathname.startsWith(path));
    };

    let navItems = [
      { href: '/dashboard', icon: Home, label: 'Inicio', permission: permissions.dashboard.view },
      { href: '/players', icon: Users, label: 'Jugadores', permission: permissions.players.view },
      { href: '/schedule', icon: CalendarDays, label: 'Calendario', permission: permissions.schedule.view },
      { href: '/partido', icon: ClipboardList, label: 'Resultados', permission: permissions.partido.view },
      
    ];

    if (user.role === 'guest') {
        navItems.push({ href: '/login', icon: LogIn, label: 'Ingresar', permission: true });
    } else {
        navItems.push({ href: '/copa', icon: Trophy, label: 'Copa', permission: permissions.copa.view });
    }
    
    const filteredNavItems = navItems.filter(item => item.permission);


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
            </div>
        </div>
    );
}
