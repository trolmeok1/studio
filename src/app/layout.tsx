
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/ThemeProvider';
import { usePathname } from 'next/navigation';
import { AppSidebar, BottomNavbar } from '@/components/AppSidebar';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import React from 'react';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>Liga Control</title>
        <meta name="description" content="Gestiona tus equipos, jugadores y torneos con facilidad." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {isAuthPage ? (
              <div 
                  className="min-h-screen flex items-center justify-center p-4 bg-background"
              >
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm"></div>
                  <div className="relative z-10 w-full">
                      {children}
                  </div>
              </div>
            ) : (
              <div className="bg-background text-foreground">
                <SidebarProvider>
                  <Sidebar>
                      <AppSidebar />
                  </Sidebar>
                  <SidebarInset className="bg-background/95 backdrop-blur-sm flex flex-col">
                      <main className="flex-1 overflow-auto pb-20 md:pb-0">
                          {children}
                      </main>
                      <BottomNavbar />
                  </SidebarInset>
                </SidebarProvider>
              </div>
            )}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
