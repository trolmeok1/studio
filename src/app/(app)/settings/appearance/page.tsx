
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export default function AppearancePage() {
  // In a real app, these would come from a global state or API
  const leagueLogo = 'https://placehold.co/200x200.png';
  const cityLogo = 'https://placehold.co/200x200.png';

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Ajustes de Apariencia
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Logos</CardTitle>
          <CardDescription>
            Personaliza los logos que aparecen en los reportes, carnets y documentos oficiales de la liga.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border rounded-lg">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Logo Principal de la Liga</Label>
              <p className="text-sm text-muted-foreground">
                Este logo aparecerá en la mayoría de los encabezados de los documentos, como Hojas de Vocalía, Reportes Financieros y Nóminas.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Input id="leagueLogo" type="file" className="flex-grow" />
                <Button variant="outline" size="icon"><Upload className="h-5 w-5"/></Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src={leagueLogo}
                alt="Logo de la Liga"
                width={150}
                height={150}
                className="rounded-md object-contain border bg-muted p-2"
                data-ai-hint="league logo"
              />
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border rounded-lg">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Logo Secundario (Ciudad/Organización)</Label>
               <p className="text-sm text-muted-foreground">
                Este logo se puede usar en documentos que requieren una afiliación o logo de la ciudad, como los carnets de jugador.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Input id="cityLogo" type="file" className="flex-grow" />
                <Button variant="outline" size="icon"><Upload className="h-5 w-5"/></Button>
              </div>
            </div>
             <div className="flex justify-center">
               <Image
                src={cityLogo}
                alt="Logo de la Ciudad"
                width={150}
                height={150}
                className="rounded-md object-contain border bg-muted p-2"
                data-ai-hint="city logo"
              />
            </div>
          </div>

           <div className="flex justify-end">
                <Button>Guardar Cambios</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
