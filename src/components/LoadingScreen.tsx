
'use client';

import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
    }, 9500); // Start fade out 500ms before removing

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
        "fixed inset-0 bg-black z-[200] flex items-center justify-center transition-opacity duration-500",
        isFadingOut ? 'opacity-0' : 'opacity-100'
      )}>
      <div className="text-center animate-zoom-in-slow">
        <Image
            src="https://placehold.co/200x200.png"
            alt="Logo de la Liga"
            width={150}
            height={150}
            className="mx-auto rounded-full"
            data-ai-hint="league logo"
            priority
        />
      </div>
    </div>
  );
}
