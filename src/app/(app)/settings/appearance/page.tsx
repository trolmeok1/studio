

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


type AssetType = 'league-logo' | 'city-logo' | 'card-background-image' | 'standard-flyer-bg' | 'semifinal-flyer-bg' | 'final-flyer-bg' | 'schedule-report-bg';

export default function AppearancePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [assetPreviews, setAssetPreviews] = useState<Record<AssetType, string | null>>({
    'league-logo': null,
    'city-logo': null,
    'card-background-image': null,
    'standard-flyer-bg': null,
    'semifinal-flyer-bg': null,
    'final-flyer-bg': null,
    'schedule-report-bg': null,
  });

  const fileInputRefs: Record<AssetType, React.RefObject<HTMLInputElement>> = {
    'league-logo': useRef<HTMLInputElement>(null),
    'city-logo': useRef<HTMLInputElement>(null),
    'card-background-image': useRef<HTMLInputElement>(null),
    'standard-flyer-bg': useRef<HTMLInputElement>(null),
    'semifinal-flyer-bg': useRef<HTMLInputElement>(null),
    'final-flyer-bg': useRef<HTMLInputElement>(null),
    'schedule-report-bg': useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    // Load saved images from localStorage on mount
    Object.keys(assetPreviews).forEach(key => {
        const storedValue = localStorage.getItem(key as AssetType);
        if (storedValue) {
            setAssetPreviews(prev => ({...prev, [key]: storedValue}));
        }
    })
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: AssetType) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssetPreviews(prev => ({...prev, [type]: reader.result as string}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (type: AssetType) => {
    setAssetPreviews(prev => ({ ...prev, [type]: null }));
    localStorage.removeItem(type);
    if (fileInputRefs[type].current) {
        fileInputRefs[type].current!.value = "";
    }
    toast({ title: 'Imagen Local Eliminada', description: 'La imagen ha sido eliminada. Guarda los cambios para que sea permanente.' });
  };


  const handleSave = async () => {
    setIsLoading(true);
    toast({ title: "Guardando cambios...", description: "Tus cambios se guardarán localmente." });

    Object.entries(assetPreviews).forEach(([key, value]) => {
        if (value) {
            localStorage.setItem(key, value);
        } else {
            localStorage.removeItem(key);
        }
    });

    // Simulate network delay for user feedback
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    toast({
        title: "Apariencia Guardada Localmente",
        description: "Tus cambios han sido guardados en este navegador.",
    });
  };

  const ImageUploadCard = ({
    title,
    description,
    type,
    hint,
    aspectRatio = 'aspect-[2/3]',
  }: {
    title: string;
    description: string;
    type: AssetType;
    hint: string;
    aspectRatio?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 border rounded-lg">
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
           {assetPreviews[type] && (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esto eliminará la imagen actual de la vista previa. El cambio se aplicará cuando guardes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(type)}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
           )}
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={assetPreviews[type] || 'https://placehold.co/400x400.png'}
          alt={`Vista previa de ${title}`}
          width={150}
          height={150}
          className={`rounded-md object-contain border bg-muted p-2 ${aspectRatio}`}
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
            Personaliza los logos y fondos que aparecen en los reportes, carnets y documentos oficiales de la liga. Los cambios se guardan localmente en tu navegador.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
           <ImageUploadCard
              title="Logo Principal de la Liga"
              description="Este logo aparecerá en la mayoría de los encabezados de los documentos."
              type="league-logo"
              hint="league logo"
              aspectRatio="aspect-square"
            />
            
           <ImageUploadCard
              title="Logo Secundario (Ciudad/Organización)"
              description="Logo opcional para documentos que requieren una afiliación o logo de la ciudad."
              type="city-logo"
              hint="city logo"
              aspectRatio="aspect-square"
            />
          
           <ImageUploadCard
              title="Fondo de Carnets"
              description="Sube una imagen de fondo personalizada para los carnets generados en PDF."
              type="card-background-image"
              hint="card background"
            />
            
            <ImageUploadCard
              title="Fondo para Reporte de Programación"
              description="Fondo para el reporte imprimible de los partidos semanales."
              type="schedule-report-bg"
              hint="soccer field top view"
            />

            <ImageUploadCard
              title="Fondo para Flyer Estándar"
              description="Fondo para el diseño de partido 1 vs 1."
              type="standard-flyer-bg"
              hint="flyer background"
            />

            <ImageUploadCard
              title="Fondo para Flyer de Semifinal"
              description="Fondo para el diseño de semifinales."
              type="semifinal-flyer-bg"
              hint="flyer background action"
            />
            
            <ImageUploadCard
              title="Fondo para Flyer de Gran Final"
              description="Fondo para el diseño de la gran final."
              type="final-flyer-bg"
              hint="flyer background epic"
            />


           <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading || user.role === 'guest'}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
