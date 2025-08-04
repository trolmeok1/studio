import type { PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
      <div className="bg-background text-foreground">
        <SidebarProvider>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset className="bg-background/95 backdrop-blur-sm flex flex-col">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                  <SidebarTrigger />
              </header>
              <main className="flex-1 overflow-auto">
                {children}
              </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
  );
}
