
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
import { PlusCircle, Upload } from 'lucide-react';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function AddTeam() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [category, setCategory] = useState<Category | ''>('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
  
  const handleSave = () => {
    // In a real app, you would handle the form submission, e.g., send to an API.
    console.log({ teamName, category, logo: logoPreview });
    toast({
        title: 'Equipo Agregado',
        description: `El equipo "${teamName}" ha sido creado en la categoría ${category}.`,
    });
    setIsOpen(false);
    // Reset form
    setTeamName('');
    setCategory('');
    setLogoPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
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
            <Label>Logo del Equipo</Label>
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
          <Button onClick={handleSave} disabled={!teamName || !category}>Guardar Equipo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
