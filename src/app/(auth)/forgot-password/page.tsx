
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" required />
                </div>
                <Button type="submit" className="w-full">
                    Enviar Enlace de Recuperación
                </Button>
            </div>
            <div className="mt-6 text-center text-sm">
                <Link href="/login" className="inline-flex items-center text-muted-foreground hover:text-primary">
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Volver a Iniciar Sesión
                </Link>
            </div>
        </CardContent>
    </Card>
  );
}
