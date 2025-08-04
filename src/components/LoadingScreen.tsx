'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function LoadingScreen() {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-500 animate-hide-loader'
      )}
    >
      <div className="animate-zoom-in-slow text-center">
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
