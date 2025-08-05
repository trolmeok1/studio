'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);

    if (success) {
      router.push('/dashboard');
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo.',
      });
    } else {
      toast({
        title: 'Error de inicio de sesión',
        description: 'El correo electrónico o la contraseña son incorrectos.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  const handleGuestLogin = () => {
    router.push('/dashboard');
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Trophy className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="text-2xl mt-4">Bienvenido a TeamLink</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al panel de control.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@ligacontrol.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>
           <Button type="button" variant="outline" className="w-full" onClick={handleGuestLogin} disabled={isLoading}>
            Ingresar como invitado
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
