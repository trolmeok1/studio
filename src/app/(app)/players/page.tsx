

'use client';

import { useState, useMemo } from 'react';
import { players as allPlayers, teams as allTeams, type Category } from '@/lib/mock-data';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const categories: Category[] = ['Máxima', 'Primera', 'Segunda'];

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return { players: allPlayers, teams: allTeams };
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filteredPlayers = allPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(lowercasedTerm) ||
        player.team.toLowerCase().includes(lowercasedTerm)
    );
    const teamIds = [...new Set(filteredPlayers.map(p => p.teamId))];
    const filteredTeams = allTeams.filter(t => teamIds.includes(t.id));

    return { players: filteredPlayers, teams: filteredTeams };
  }, [searchTerm]);

  const getPlayersByTeam = (teamId: string) => {
    return filteredData.players.filter(p => p.teamId === teamId);
  }

  const getTeamsByCategory = (category: Category) => {
      return filteredData.teams.filter(t => t.category === category);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
          <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Lista de Jugadores
              </span>
            </h2>
          </div>
      </div>
       <div className="w-full max-w-sm mx-auto">
         <Input 
            placeholder="Buscar por jugador o equipo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

       <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
            {categories.map(cat => (
                 <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
            ))}
        </TabsList>
        {categories.map(category => (
            <TabsContent key={category} value={category}>
                <Accordion type="multiple" defaultValue={getTeamsByCategory(category).map(t => t.id)}>
                    {getTeamsByCategory(category).map(team => {
                        const teamPlayers = getPlayersByTeam(team.id);
                        if (teamPlayers.length === 0 && searchTerm) return null;
                        return (
                             <AccordionItem value={team.id} key={team.id}>
                                <AccordionTrigger>
                                    <div className="flex items-center gap-3">
                                        <Image src={team.logoUrl} alt={team.name} width={40} height={40} className="rounded-full" data-ai-hint="team logo" />
                                        <span className="text-lg font-semibold">{team.name}</span>
                                        <Badge variant="outline">{teamPlayers.length} jugadores</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2 p-4">
                                        {teamPlayers.length > 0 ? teamPlayers.map((player) => (
                                          <Link key={player.id} href={`/players/${player.id}`} className="block">
                                              <Card className="flex items-center p-3 transition-all hover:bg-muted/50 cursor-pointer">
                                                  <Image
                                                      src={player.photoUrl}
                                                      alt={player.name}
                                                      width={40}
                                                      height={40}
                                                      className="rounded-full object-cover aspect-square"
                                                      data-ai-hint="player portrait"
                                                  />
                                                  <div className="ml-4 flex-grow">
                                                      <p className="font-semibold">{player.name}</p>
                                                      <Badge variant={player.status === 'activo' ? 'default' : 'secondary'} className={cn(player.status === 'activo' ? 'bg-green-600' : 'bg-yellow-600')}>
                                                        {player.status === 'activo' ? 'Aprobado' : 'Inactivo'}
                                                      </Badge>
                                                  </div>
                                                  <div className="bg-primary text-primary-foreground h-12 w-16 flex items-center justify-center rounded-md">
                                                      <span className="text-2xl font-bold">{player.jerseyNumber}</span>
                                                  </div>
                                              </Card>
                                          </Link>
                                        )) : (
                                            <p className="col-span-full text-center text-muted-foreground">No hay jugadores en este equipo.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                {getTeamsByCategory(category).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>No se encontraron equipos en esta categoría{searchTerm ? ' para la búsqueda actual' : ''}.</p>
                    </div>
                )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
