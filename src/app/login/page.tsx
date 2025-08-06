
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Trophy, User, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
    const router = useRouter();
    const { login, logout } = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('admin@ligacontrol.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const success = await login(email, password);

        if (success) {
            toast({ title: 'Inicio de Sesión Exitoso', description: 'Bienvenido de nuevo.' });
            router.push('/dashboard');
        } else {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
        }
        setIsLoading(false);
    }

    const handleGuestLogin = async () => {
        await logout(); 
        router.push('/dashboard');
    }

  return (
    <Card className="w-full max-w-md mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 -z-10"></div>
        <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold mt-4 font-headline">
                Control Liga
            </CardTitle>
            <CardDescription>Inicio de sesion para administradores</CardDescription>
        </CardHeader>
        <CardContent>
             {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="admin@ligacontrol.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink-0 text-xs text-muted-foreground">O</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mb-4">
                Si no tienes cuenta, ingresa como invitado para visualizar el torneo.
            </p>
            
            <Button variant="outline" className="w-full" onClick={handleGuestLogin}>
                <User className="mr-2" />
                Ingresar como Invitado
            </Button>
             
             <div className="mt-6 text-center text-sm text-muted-foreground">
                Aplicación oficial de la Liga barrial
            </div>
        </CardContent>
    </Card>
  );
}
