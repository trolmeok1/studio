import type { PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="dark bg-background text-foreground" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/football.png')", backgroundAttachment: 'fixed' }}>
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
}
