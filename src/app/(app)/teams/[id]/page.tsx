
'use client';

import { useState, useEffect } from 'react';
import { getTeamById, getPlayersByTeamId, type Player, type Team, type PlayerPosition } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';

  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlayer, setNewPlayer] = useState<{ name: string; position: PlayerPosition | '' }>({ name: '', position: '' });

  useEffect(() => {
    const fetchedTeam = getTeamById(teamId);
    if (fetchedTeam) {
      setTeam(fetchedTeam);
      setPlayers(getPlayersByTeamId(teamId));
    }
  }, [teamId]);

  if (!team) {
    // This could be a loading state in a real app
    return <div>Cargando...</div>;
  }

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.position) {
      const newPlayerData: Player = {
        id: `p${Date.now()}`,
        name: newPlayer.name,
        position: newPlayer.position as PlayerPosition,
        team: team.name,
        teamId: team.id,
        category: team.category,
        photoUrl: 'https://placehold.co/400x400.png',
        stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
      };
      setPlayers([...players, newPlayerData]);
      setNewPlayer({ name: '', position: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-6">
        <Image
          src={team.logoUrl}
          alt={`Logo de ${team.name}`}
          width={100}
          height={100}
          className="rounded-full border-4 border-primary"
          data-ai-hint="team logo"
        />
        <div>
          <h2 className="text-4xl font-bold tracking-tight font-headline">{team.name}</h2>
          <Badge className="mt-2 text-lg">{team.category}</Badge>
        </div>
        <div className="ml-auto">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Agregar Jugador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Jugador a {team.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombres
                  </Label>
                  <Input
                    id="name"
                    value={newPlayer.name}
                    onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Nombres y apellidos completos"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="position" className="text-right">
                    Posición
                  </Label>
                   <Select
                    onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value as PlayerPosition })}
                    value={newPlayer.position}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona una posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Portero">Portero</SelectItem>
                      <SelectItem value="Defensa">Defensa</SelectItem>
                      <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                      <SelectItem value="Delantero">Delantero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddPlayer}>Guardar Jugador</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Plantilla de Jugadores ({players.length})</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.map((player) => (
              <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                    <Image
                      src={player.photoUrl}
                      alt={`Foto de ${player.name}`}
                      width={400}
                      height={400}
                      className="w-full h-auto aspect-square object-cover"
                      data-ai-hint="player portrait"
                    />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-xl font-bold font-headline mt-2">{player.name}</h3>
                   <p className="text-sm text-muted-foreground">{player.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
