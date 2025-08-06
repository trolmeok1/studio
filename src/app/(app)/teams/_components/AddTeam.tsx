
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Upload, Loader2 } from 'lucide-react';
import type { Category, Team } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { addTeam } from '@/lib/mock-data';
import { useAuth } from '@/hooks/useAuth';

export function AddTeam({ onTeamAdded }: { onTeamAdded: (newTeam: Team) => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const canAddTeam = user.permissions.teams.edit;

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTeamName('');
    setCategory('');
    setLogoPreview(null);
  };
  
  const handleSave = async () => {
    if (!teamName || !category) {
        toast({
            title: 'Error de validación',
            description: 'Por favor, completa el nombre y la categoría del equipo.',
            variant: 'destructive',
        });
        return;
    }
    
    setIsLoading(true);

    try {
        const newTeamData = { name: teamName, category };
        // The logo is now a placeholder, not uploaded.
        const newTeam = await addTeam(newTeamData, null);
        
        toast({
            title: 'Equipo Agregado',
            description: `El equipo "${teamName}" ha sido creado en la categoría ${category}.`,
        });

        onTeamAdded(newTeam);
        resetForm();
        setIsOpen(false);
    } catch (error) {
        console.error("Error detallado al agregar equipo:", error);
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
        toast({
            title: 'Error al Guardar el Equipo',
            description: `No se pudo agregar el equipo. Causa: ${errorMessage}`,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
            resetForm();
        }
        setIsOpen(open);
    }}>
      <DialogTrigger asChild>
        <Button disabled={!canAddTeam}>
          <PlusCircle className="mr-2" />
          Agregar Equipo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
          <DialogDescription>
            Completa la información para registrar un nuevo equipo en la liga.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Equipo</Label>
            <Input
              id="name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ej: Leones del Norte"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select onValueChange={(value) => setCategory(value as Category)} value={category}>
                <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Máxima">Máxima</SelectItem>
                    <SelectItem value="Primera">Primera</SelectItem>
                    <SelectItem value="Segunda">Segunda</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Logo del Equipo (Opcional)</Label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                        <Image src={logoPreview} alt="Vista previa del logo" width={96} height={96} className="object-cover" />
                    ) : (
                        <Upload className="text-muted-foreground" />
                    )}
                </div>
                 <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Guardando...' : 'Guardar Equipo'}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
