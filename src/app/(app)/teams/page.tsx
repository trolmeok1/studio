

'use client';

import { useState } from 'react';
import { teams as initialTeams, type Team, type Category, type Person } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { PlusCircle, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialNewTeamState = {
    name: '',
    category: '' as Category | '',
    logoUrl: '',
    president: { name: '', phone: '' },
    vicePresident: { name: '', phone: '' },
    secretary: { name: '', phone: '' },
    treasurer: { name: '', phone: '' },
    vocal: { name: '', phone: '' },
    delegates: [
        { name: '', phone: '' },
        { name: '', phone: '' },
        { name: '', phone: '' },
    ]
};


export default function TeamsPage() {
  const { user } = useAuth();
  const canEdit = user.role === 'admin';

  const [teams, setTeams] = useState<Team[]>(initialTeams.filter(t => t.category !== 'Copa'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTeam, setNewTeam] = useState<{
    name: string;
    category: Category | '';
    logoUrl: string;
    president: Person;
    vicePresident: Person;
    secretary: Person;
    treasurer: Person;
    vocal: Person;
    delegates: Person[];
}>(initialNewTeamState);


  const handleAddTeam = () => {
    if (newTeam.name && newTeam.category) {
      const newTeamData: Team = {
        id: (teams.length + 1).toString(),
        name: newTeam.name,
        category: newTeam.category as Category,
        logoUrl: newTeam.logoUrl || 'https://placehold.co/100x100.png',
        president: newTeam.president,
        vicePresident: newTeam.vicePresident,
        secretary: newTeam.secretary,
        treasurer: newTeam.treasurer,
        vocal: newTeam.vocal,
        delegates: newTeam.delegates,
      };
      setTeams([...teams, newTeamData]);
      setNewTeam(initialNewTeamState);
      setIsDialogOpen(false);
    }
  };

  const handleDirectiveChange = (role: keyof typeof newTeam, field: 'name' | 'phone', value: string) => {
      if (role === 'delegates') return;
      const person = newTeam[role] as Person;
      setNewTeam({
          ...newTeam,
          [role]: { ...person, [field]: value }
      });
  };

  const handleDelegateChange = (index: number, field: 'name' | 'phone', value: string) => {
      const updatedDelegates = [...newTeam.delegates];
      updatedDelegates[index] = { ...updatedDelegates[index], [field]: value };
      setNewTeam({ ...newTeam, delegates: updatedDelegates });
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Equipos
              </span>
            </h2>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Equipo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Equipo</DialogTitle>
                 <DialogDescription>
                    Complete la información del club y su directiva.
                </DialogDescription>
              </DialogHeader>
               <ScrollArea className="h-[60vh] pr-6">
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Equipo</Label>
                        <Input id="name" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select onValueChange={(value) => setNewTeam({ ...newTeam, category: value as Category })} value={newTeam.category}>
                            <SelectTrigger>
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
                        <Label htmlFor="logoUrl">Logo del Equipo</Label>
                        <div className="flex items-center gap-2">
                            <Input id="logoUrl" type="file" className="flex-grow" />
                            <Button variant="ghost" size="icon"><Upload className="h-5 w-5"/></Button>
                        </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg border-t pt-4 mt-4">Directiva</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Presidente</Label>
                            <Input placeholder="Nombre" value={newTeam.president.name} onChange={(e) => handleDirectiveChange('president', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={newTeam.president.phone} onChange={(e) => handleDirectiveChange('president', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vicepresidente</Label>
                            <Input placeholder="Nombre" value={newTeam.vicePresident.name} onChange={(e) => handleDirectiveChange('vicePresident', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={newTeam.vicePresident.phone} onChange={(e) => handleDirectiveChange('vicePresident', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Secretario/a</Label>
                            <Input placeholder="Nombre" value={newTeam.secretary.name} onChange={(e) => handleDirectiveChange('secretary', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={newTeam.secretary.phone} onChange={(e) => handleDirectiveChange('secretary', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tesorero/a</Label>
                            <Input placeholder="Nombre" value={newTeam.treasurer.name} onChange={(e) => handleDirectiveChange('treasurer', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={newTeam.treasurer.phone} onChange={(e) => handleDirectiveChange('treasurer', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vocal Principal</Label>
                            <Input placeholder="Nombre" value={newTeam.vocal.name} onChange={(e) => handleDirectiveChange('vocal', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={newTeam.vocal.phone} onChange={(e) => handleDirectiveChange('vocal', 'phone', e.target.value)} />
                        </div>
                    </div>

                    <h4 className="font-semibold text-lg border-t pt-4 mt-4">Delegados</h4>
                    {newTeam.delegates.map((delegate, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Delegado {index + 1}</Label>
                                <Input placeholder="Nombre" value={delegate.name} onChange={(e) => handleDelegateChange(index, 'name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input placeholder="099..." value={delegate.phone} onChange={(e) => handleDelegateChange(index, 'phone', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
              </ScrollArea>
              <Button onClick={handleAddTeam} className="w-full mt-4">Guardar Equipo</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams.map((team) => (
          <Card key={team.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg hover:scale-[1.02]">
             <CardHeader className="p-4">
                <CardTitle className="text-xl font-headline truncate">{team.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">{team.category}</Badge>
             </CardHeader>
            <CardContent className="p-4 flex-grow flex items-center justify-center">
                 <Image
                    src={team.logoUrl}
                    alt={`Logo de ${team.name}`}
                    width={150}
                    height={150}
                    className="rounded-full object-cover aspect-square"
                    data-ai-hint="team logo"
                />
            </CardContent>
            <CardFooter className="p-4 bg-muted/50">
                 <Button asChild className="w-full">
                    <Link href={`/teams/${team.id}`}>Ver</Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
