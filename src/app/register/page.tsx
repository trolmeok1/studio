'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Trophy } from "lucide-react";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-bold mt-4 font-headline">Crear una Cuenta</CardTitle>
            <CardDescription>El registro está deshabilitado. Por favor, contacta al administrador para obtener acceso.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu Nombre Completo" disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" disabled />
                </div>
                <Button type="submit" className="w-full" disabled>
                    Registrar
                </Button>
            </div>
            <div className="mt-6 text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                    Inicia Sesión
                </Link>
            </div>
        </CardContent>
    </Card>
  );
}
