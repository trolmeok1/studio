
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Download, Upload, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { teams, players, upcomingMatches, requalificationRequests, expenses } from '@/lib/mock-data';

type DataType = 'teams' | 'players' | 'finances' | 'requests' | 'all';

const dataSources: Record<string, any> = {
    teams,
    players,
    upcomingMatches,
    requalificationRequests,
    expenses
};

const ResetDialog = ({
  step,
  dataType,
  onStepChange,
  onConfirm,
}: {
  step: number;
  dataType: DataType | null;
  onStepChange: (step: number) => void;
  onConfirm: () => void;
}) => {
  if (step === 0 || !dataType) return null;

  const content = [
    {
      title: `¿Estás seguro de reiniciar los datos de "${dataType}"?`,
      description: "Esta acción es irreversible y borrará permanentemente todos los registros seleccionados. No podrás recuperarlos.",
      confirmText: 'Sí, entiendo, continuar'
    },
    {
      title: "Confirmación Adicional",
      description: "Estás a un paso de borrar los datos. Esta es la segunda de tres advertencias. ¿Realmente quieres proceder?",
      confirmText: 'Sí, estoy completamente seguro'
    },
    {
      title: "ÚLTIMA ADVERTENCIA",
      description: "Al hacer clic en \"BORRAR DEFINITIVAMENTE\", los datos se eliminarán para siempre. Esta es tu última oportunidad para cancelar.",
      confirmText: 'BORRAR DEFINITIVAMENTE'
    }
  ];

  const currentContent = content[step - 1];

  return (
    <AlertDialog open={step > 0} onOpenChange={(open) => !open && onStepChange(0)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{currentContent.title}</AlertDialogTitle>
          <AlertDialogDescription>{currentContent.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onStepChange(0)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(step === 3 && buttonVariants({ variant: "destructive" }))}
            onClick={() => (step < 3 ? onStepChange(step + 1) : onConfirm())}
          >
            {currentContent.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export default function DataManagementPage() {
    const { toast } = useToast();
    const [dialogStep, setDialogStep] = useState(0);
    const [dataTypeToReset, setDataTypeToReset] = useState<DataType | null>(null);

    const openResetDialog = (type: DataType) => {
        setDataTypeToReset(type);
        setDialogStep(1);
    };

    const handleReset = () => {
        if (!dataTypeToReset) return;

        // In a real app, this would be an API call. Here, we just log it.
        console.log(`Resetting data for: ${dataTypeToReset}`);

        toast({
            title: "Datos Reiniciados",
            description: `Se han borrado los datos de "${dataTypeToReset}".`,
            variant: "default",
        });

        setDialogStep(0);
        setDataTypeToReset(null);
        
        // You might want to actually clear the data in a real app, e.g.
        // if (dataTypeToReset === 'teams' || dataTypeToReset === 'all') { teams.length = 0; }
        // etc.
    };

    const handleDownloadBackup = () => {
        try {
            const backupData = JSON.stringify(dataSources, null, 2);
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ligacontrol_backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast({
                title: 'Backup Descargado',
                description: 'Se ha iniciado la descarga del archivo de respaldo.',
            });
        } catch (error) {
            toast({
                title: 'Error en el Backup',
                description: 'No se pudo generar el archivo de respaldo.',
                variant: 'destructive',
            });
        }
    };
    
    const handleUploadBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    if (typeof content === 'string') {
                        // In a real app, you would parse and validate this data
                        // and then send it to your backend to update the state.
                        JSON.parse(content);
                        toast({
                            title: 'Backup Cargado',
                            description: 'El archivo de respaldo ha sido cargado exitosamente. Los datos se restaurarán.',
                        });
                    }
                } catch (error) {
                     toast({
                        title: 'Error de Archivo',
                        description: 'El archivo de respaldo no es un JSON válido.',
                        variant: 'destructive',
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Gestión de Datos</h2>

            <Card className="border-destructive">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="bg-destructive/10 text-destructive p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle>Zona de Peligro: Reinicio de Datos</CardTitle>
                            <CardDescription>
                                Estas acciones son irreversibles. Borrarán permanentemente los datos de la aplicación.
                                Úsalas con extrema precaución, por ejemplo, al final de una temporada para empezar de cero.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="destructive" onClick={() => openResetDialog('teams')}>Reiniciar Equipos</Button>
                    <Button variant="destructive" onClick={() => openResetDialog('players')}>Reiniciar Jugadores</Button>
                    <Button variant="destructive" onClick={() => openResetDialog('finances')}>Reiniciar Finanzas</Button>
                    <Button variant="destructive" onClick={() => openResetDialog('requests')}>Reiniciar Solicitudes</Button>
                    <Button variant="destructive" className="md:col-span-2 lg:col-span-3" onClick={() => openResetDialog('all')}>
                        <Trash2 className="mr-2" />
                        REINICIAR TODA LA APLICACIÓN
                    </Button>
                </CardContent>
            </Card>
            
            <Card>
                 <CardHeader>
                     <CardTitle>Backup y Restauración</CardTitle>
                    <CardDescription>
                       Guarda una copia de seguridad de todos los datos del sistema o restaura la aplicación desde un archivo de backup.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <Button onClick={handleDownloadBackup} className="flex-1">
                        <Download className="mr-2" />
                        Descargar Backup del Sistema
                    </Button>
                     <Button asChild variant="outline" className="flex-1">
                        <label htmlFor="backup-upload" className="cursor-pointer">
                            <Upload className="mr-2" />
                            Subir y Restaurar Backup
                            <input type="file" id="backup-upload" className="hidden" accept=".json" onChange={handleUploadBackup} />
                        </label>
                    </Button>
                </CardContent>
            </Card>

            <ResetDialog
              step={dialogStep}
              dataType={dataTypeToReset}
              onStepChange={setDialogStep}
              onConfirm={handleReset}
            />
        </div>
    );
}
