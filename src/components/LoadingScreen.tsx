
'use client';

import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500); // Start fade out 500ms before removing

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-background z-[200] flex items-center justify-center transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-pulse">
        <div className="mx-auto h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Trophy className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary font-headline">
          Control Liga
        </h1>
        <p className="text-muted-foreground mt-2">Cargando aplicación...</p>
      </div>
    </div>
  );
}
