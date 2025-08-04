
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

/*
export const metadata: Metadata = {
  title: 'Liga Control',
  description: 'Gestiona tus equipos, jugadores y torneos con facilidad.',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);

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
        {loading && <LoadingScreen />}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
              {children}
              <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
