

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

type FlyerType = 'standard-flyer-bg' | 'semifinal-flyer-bg' | 'final-flyer-bg' | 'card-background-image' | 'schedule-report-bg';

export default function AppearancePage() {
  const { toast } = useToast();
  
  const [leagueLogo, setLeagueLogo] = useState('https://placehold.co/200x200.png');
  const [cityLogo, setCityLogo] = useState('https://placehold.co/200x200.png');
  const [cardBackground, setCardBackground] = useState<string | null>(null);
  const [standardFlyerBg, setStandardFlyerBg] = useState<string | null>(null);
  const [semifinalFlyerBg, setSemifinalFlyerBg] = useState<string | null>(null);
  const [finalFlyerBg, setFinalFlyerBg] = useState<string | null>(null);
  const [scheduleReportBg, setScheduleReportBg] = useState<string | null>(null);
  
  const fileInputRefs = {
    'card-background-image': useRef<HTMLInputElement>(null),
    'standard-flyer-bg': useRef<HTMLInputElement>(null),
    'semifinal-flyer-bg': useRef<HTMLInputElement>(null),
    'final-flyer-bg': useRef<HTMLInputElement>(null),
    'schedule-report-bg': useRef<HTMLInputElement>(null),
  };

  const stateSetters = {
    'card-background-image': setCardBackground,
    'standard-flyer-bg': setStandardFlyerBg,
    'semifinal-flyer-bg': setSemifinalFlyerBg,
    'final-flyer-bg': setFinalFlyerBg,
    'schedule-report-bg': setScheduleReportBg,
  };

  useEffect(() => {
    // Load saved images from localStorage on mount
    setCardBackground(localStorage.getItem('card-background-image'));
    setStandardFlyerBg(localStorage.getItem('standard-flyer-bg'));
    setSemifinalFlyerBg(localStorage.getItem('semifinal-flyer-bg'));
    setFinalFlyerBg(localStorage.getItem('final-flyer-bg'));
    setScheduleReportBg(localStorage.getItem('schedule-report-bg'));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: FlyerType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        stateSetters[type](reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (cardBackground) localStorage.setItem('card-background-image', cardBackground);
    if (standardFlyerBg) localStorage.setItem('standard-flyer-bg', standardFlyerBg);
    if (semifinalFlyerBg) localStorage.setItem('semifinal-flyer-bg', semifinalFlyerBg);
    if (finalFlyerBg) localStorage.setItem('final-flyer-bg', finalFlyerBg);
    if (scheduleReportBg) localStorage.setItem('schedule-report-bg', scheduleReportBg);
    
    toast({
        title: "Apariencia Guardada",
        description: "Tus cambios han sido guardados exitosamente.",
    });
  };

  const ImageUploadCard = ({
    title,
    description,
    imageSrc,
    type,
    hint,
  }: {
    title: string;
    description: string;
    imageSrc: string | null;
    type: FlyerType;
    hint: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start p-6 border rounded-lg">
      <div className="space-y-2">
        <Label className="text-lg font-semibold">{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
        <input
          type="file"
          ref={fileInputRefs[type]}
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
          accept="image/png, image/jpeg"
        />
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" onClick={() => fileInputRefs[type].current?.click()}>
            <Upload className="h-5 w-5 mr-2" />
            Seleccionar Imagen
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={imageSrc || 'https://placehold.co/630x950.png'}
          alt={`Vista previa de ${title}`}
          width={126}
          height={190}
          className="rounded-md object-cover border bg-muted p-2"
          data-ai-hint={hint}
        />
      </div>
    </div>
  );

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
          
           <ImageUploadCard
              title="Fondo de Carnets"
              description="Sube una imagen de fondo personalizada para los carnets generados en PDF."
              imageSrc={cardBackground}
              type="card-background-image"
              hint="card background"
            />
            
            <ImageUploadCard
              title="Fondo para Reporte de Programación"
              description="Fondo para el reporte imprimible de los partidos semanales."
              imageSrc={scheduleReportBg}
              type="schedule-report-bg"
              hint="soccer field top view"
            />

            <ImageUploadCard
              title="Fondo para Flyer Estándar"
              description="Fondo para el diseño de partido 1 vs 1."
              imageSrc={standardFlyerBg}
              type="standard-flyer-bg"
              hint="flyer background"
            />

            <ImageUploadCard
              title="Fondo para Flyer de Semifinal"
              description="Fondo para el diseño de semifinales."
              imageSrc={semifinalFlyerBg}
              type="semifinal-flyer-bg"
              hint="flyer background action"
            />
            
            <ImageUploadCard
              title="Fondo para Flyer de Gran Final"
              description="Fondo para el diseño de la gran final."
              imageSrc={finalFlyerBg}
              type="final-flyer-bg"
              hint="flyer background epic"
            />


           <div className="flex justify-end">
                <Button onClick={handleSave}>Guardar Cambios</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
