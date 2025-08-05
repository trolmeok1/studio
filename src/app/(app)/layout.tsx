
'use client';

import { AppSidebar, BottomNavbar } from '@/components/AppSidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar>
                <AppSidebar />
            </Sidebar>
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <SidebarInset>
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </SidebarInset>
                <BottomNavbar />
            </div>
        </SidebarProvider>
    );
}
