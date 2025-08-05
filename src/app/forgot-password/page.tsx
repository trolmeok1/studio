'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ChevronLeft, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
        <CardHeader className="text-center">
             <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-bold mt-4">Restablecer Contraseña</CardTitle>
            <CardDescription>Para restablecer tu contraseña, por favor, contacta directamente al administrador o al presidente de la liga. Ellos verificarán tu identidad y te proporcionarán una nueva contraseña de forma segura.</CardDescription>
        </CardHeader>
        <CardContent>
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
