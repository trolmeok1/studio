
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function LoadingScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 9500); // Start fade out 500ms before removing

    const hideTimer = setTimeout(() => {
      setIsHidden(true);
    }, 10000); // Hide completely after 10s

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) {
    return null;
  }

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
