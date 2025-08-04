

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AppearancePage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [leagueLogo, setLeagueLogo] = useState('https://placehold.co/200x200.png');
  const [cityLogo, setCityLogo] = useState('https://placehold.co/200x200.png');
  const [cardBackground, setCardBackground] = useState<string | null>(null);

  useEffect(() => {
    // Load saved images from localStorage on mount
    const savedBg = localStorage.getItem('card-background-image');
    if (savedBg) {
      setCardBackground(savedBg);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (cardBackground) {
        localStorage.setItem('card-background-image', cardBackground);
    }
    toast({
        title: "Apariencia Guardada",
        description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="text-center w-full">
        <h2 className="text-4xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
            Ajustes de Apariencia
          </span>
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Logos y Fondos</CardTitle>
          <CardDescription>
            Personaliza los logos y fondos que aparecen en los reportes, carnets y documentos oficiales de la liga.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border rounded-lg">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Logo Principal de la Liga</Label>
              <p className="text-sm text-muted-foreground">
                Este logo aparecerá en la mayoría de los encabezados de los documentos.
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
                Logo opcional para documentos que requieren una afiliación o logo de la ciudad.
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
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border rounded-lg">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Fondo de Carnets</Label>
               <p className="text-sm text-muted-foreground">
                Sube una imagen de fondo personalizada para los carnets generados en PDF.
              </p>
               <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg"
                />
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-5 w-5 mr-2"/>
                    Seleccionar Imagen
                </Button>
              </div>
            </div>
             <div className="flex justify-center">
               <Image
                src={cardBackground || 'https://placehold.co/630x950.png'}
                alt="Vista previa del fondo del carnet"
                width={126}
                height={190}
                className="rounded-md object-cover border bg-muted p-2"
                data-ai-hint="card background"
              />
            </div>
          </div>

           <div className="flex justify-end">
                <Button onClick={handleSave}>Guardar Cambios</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
