
'use client';

import { useState, useMemo } from 'react';
import type { Player, Team } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="overflow-hidden text-center group">
    <Link href={`/players/${player.id}`}>
        <div className="relative">
            <Image 
                src={player.photoUrl} 
                alt={player.name} 
                width={200} 
                height={250} 
                className="w-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-300" 
                data-ai-hint="player portrait" 
            />
            <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold shadow-lg">
                {player.jerseyNumber}
            </div>
             <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold truncate">{player.name}</h3>
                <p className="text-xs text-slate-300">{player.team}</p>
            </div>
        </div>
    </Link>
  </Card>
);

export function PlayerSearch({ allPlayers, allTeams }: { allPlayers: Player[]; allTeams: Team[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');

  const filteredPlayers = useMemo(() => {
    return allPlayers
      .filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(player =>
        selectedTeam === 'all' ? true : player.teamId === selectedTeam
      )
      .filter(player =>
        selectedPosition === 'all' ? true : player.position === selectedPosition
      );
  }, [searchTerm, selectedTeam, selectedPosition, allPlayers]);

  const positions = useMemo(() => [...new Set(allPlayers.map(p => p.position))], [allPlayers]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Buscar jugador por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <div className="grid grid-cols-2 md:flex gap-4">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {allTeams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por posición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las posiciones</SelectItem>
                 {positions.map(position => (
                    <SelectItem key={position} value={position}>
                        {position}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

       {filteredPlayers.length === 0 && (
            <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No se encontraron jugadores con los filtros seleccionados.</p>
            </div>
        )}
    </div>
  );
}
