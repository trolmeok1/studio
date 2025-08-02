
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle authentication
        // For now, we'll just redirect to the dashboard
        router.push('/dashboard');
    }

  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-bold mt-4 font-headline">Bienvenido de Nuevo</CardTitle>
            <CardDescription>Inicia sesión para administrar tus torneos.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="admin@teamlink.hub" required defaultValue="admin@teamlink.hub" />
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
             <div className="mt-6 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                    Contacta al administrador
                </Link>
            </div>
        </CardContent>
    </Card>
  );
}
