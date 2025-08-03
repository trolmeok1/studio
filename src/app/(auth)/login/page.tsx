
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
    const router = useRouter();
    const { loginAs } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle real authentication (e.g. call an API)
        // For this demo, we'll assume the credentials are correct for an admin
        loginAs('admin');
        router.push('/dashboard');
    }

    const handleGuestLogin = () => {
        loginAs('guest');
        router.push('/dashboard');
    }

  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-3xl font-bold mt-4 font-headline">
                Control Liga
            </CardTitle>
            <CardDescription>Inicio de sesión para administradores</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="admin@ligacontrol.com" required defaultValue="admin@ligacontrol.com" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <Input id="password" type="password" required defaultValue="password" />
                </div>
                <Button type="submit" className="w-full">
                    Ingresar
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
