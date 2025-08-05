
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Trophy, User, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
    const router = useRouter();
    const { login, loginAs } = useAuth();
    const [email, setEmail] = useState('admin@ligacontrol.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const success = await login(email, password);

        setIsLoading(false);

        if (success) {
            router.push('/dashboard');
        } else {
            setError('Credenciales incorrectas. Por favor, verifica tu email y contraseña.');
        }
    }

    const handleGuestLogin = () => {
        loginAs('guest');
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
            <CardDescription>Inicio de sesión para administradores</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                 {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error de Autenticación</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@ligacontrol.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
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
