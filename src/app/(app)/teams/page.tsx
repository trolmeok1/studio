
'use client';

import { useState } from 'react';
import { teams as initialTeams, type Team, type Category } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', category: '' as Category | '' });

  const handleAddTeam = () => {
    if (newTeam.name && newTeam.category) {
      const newTeamData: Team = {
        id: (teams.length + 1).toString(),
        name: newTeam.name,
        category: newTeam.category as Category,
        logoUrl: 'https://placehold.co/100x100.png',
      };
      setTeams([...teams, newTeamData]);
      setNewTeam({ name: '', category: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Equipos
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Equipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <Select
                  onValueChange={(value) => setNewTeam({ ...newTeam, category: value as Category })}
                  value={newTeam.category}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Máxima">Máxima</SelectItem>
                    <SelectItem value="Primera">Primera</SelectItem>
                    <SelectItem value="Copa">Copa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddTeam}>Guardar Equipo</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg hover:scale-[1.02]">
             <CardHeader className="flex-row items-center justify-between p-4">
                <CardTitle className="text-xl font-headline">{team.name}</CardTitle>
                <div className="text-sm text-muted-foreground">{team.category}</div>
             </CardHeader>
            <CardContent className="p-4 flex-grow flex items-center justify-center">
                 <Image
                    src={team.logoUrl}
                    alt={`Logo de ${team.name}`}
                    width={150}
                    height={150}
                    className="rounded-full object-cover"
                    data-ai-hint="team logo"
                />
            </CardContent>
            <div className="p-4 bg-muted/50">
                 <Button asChild className="w-full">
                    <Link href={`/teams/${team.id}`}>Administrar</Link>
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
