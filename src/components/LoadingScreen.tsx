
'use client';

import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 9500); // Start fade out 500ms before removing

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 bg-background z-[200] flex items-center justify-center transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-pulse">
        <Image
            src="https://placehold.co/200x200.png"
            alt="Logo de la Liga"
            width={128}
            height={128}
            className="mx-auto mb-4 rounded-full"
            data-ai-hint="league logo"
        />
        <h1 className="text-4xl font-bold text-primary font-headline">
          Control Liga
        </h1>
        <p className="text-muted-foreground mt-2">Cargando aplicación...</p>
      </div>
    </div>
  );
}
