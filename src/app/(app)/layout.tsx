import type { PropsWithChildren } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AuthProvider } from '@/hooks/useAuth';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
      <div className="dark bg-background text-foreground" style={{ backgroundImage: "url('/soccer-field-bg.jpg')", backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
        <SidebarProvider>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset className="bg-background/80 backdrop-blur-sm">
              {children}
          </SidebarInset>
        </SidebarProvider>
      </div>
  );
}
