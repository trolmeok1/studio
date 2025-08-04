
import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div 
        className="min-h-screen flex items-center justify-center p-4 bg-background"
    >
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full">
            {children}
        </div>
    </div>
  );
}
