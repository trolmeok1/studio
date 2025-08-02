
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
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loginAs } = useAuth();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isAdmin = user.role === 'admin';
  const isSecretary = user.role === 'secretary';

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
              tooltip="Jugadores"
            >
              <Link href="/players">
                <Users />
                <span>Jugadores</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/schedule')} tooltip="Programación">
                <Link href="/schedule">
                    <CalendarDays />
                    <span>Programación</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive('/partido')} tooltip="Partido">
                <Link href="/partido">
                    <Swords />
                    <span>Partido</span>
                </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {(isAdmin || isSecretary) && <SidebarSeparator />}

        <SidebarGroup>
           {(isAdmin || isSecretary) && <SidebarGroupLabel>Admin</SidebarGroupLabel>}
           <SidebarMenu>
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/ai-cards')} tooltip="Carnets AI">
                      <Link href="/ai-cards">
                          <CreditCard />
                          <span>Carnets AI</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
               {(isAdmin || isSecretary) && (
                 <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/committees')} tooltip="Vocalías">
                      <Link href="/committees">
                          <FilePen />
                          <span>Vocalías</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
               )}
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={isActive('/reports')} tooltip="Reportes">
                      <Link href="#">
                          <Flag />
                          <span>Reportes</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
           </SidebarMenu>
        </SidebarGroup>
         
        {isAdmin && <SidebarSeparator />}

        <SidebarGroup>
           {isAdmin && <SidebarGroupLabel>Configuración</SidebarGroupLabel>}
            <SidebarMenu>
                {isAdmin && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/teams')} tooltip="Equipos">
                          <Link href="/teams">
                              <Shield />
                              <span>Equipos</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isAdmin && (
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={isActive('/roles')} tooltip="Roles">
                          <Link href="/roles">
                              <UserCog />
                              <span>Roles</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md p-2 bg-muted/50">
           <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} data-ai-hint="user avatar" alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        </div>
         {/* Temporary role switcher for demo */}
        <div className='flex gap-1 mt-2'>
            <Button variant={user.role === 'admin' ? 'secondary' : 'ghost'} size='sm' className='flex-1' onClick={() => loginAs('admin')}>Admin</Button>
            <Button variant={user.role === 'secretary' ? 'secondary' : 'ghost'} size='sm' className='flex-1' onClick={() => loginAs('secretary')}>Secretario</Button>
            <Button variant={user.role === 'guest' ? 'secondary' : 'ghost'} size='sm' className='flex-1' onClick={() => loginAs('guest')}>Invitado</Button>
        </div>
      </SidebarFooter>
    </>
  );
}
