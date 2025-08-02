
import type { PropsWithChildren } from 'react';

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div 
        className="min-h-screen flex items-center justify-center p-4 bg-background"
        style={{ 
            backgroundImage: "url('/soccer-field-bg.jpg')", 
            backgroundSize: 'cover', 
            backgroundAttachment: 'fixed', 
            backgroundPosition: 'center' 
        }}
    >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="relative z-10 w-full">
            {children}
        </div>
    </div>
  );
}
