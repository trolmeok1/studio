
'use client';

import { useState, useMemo } from 'react';
import { players as allPlayers, teams as allTeams, type Category } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const categories: Category[] = ['Máxima', 'Primera', 'Segunda', 'Copa'];

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
          <h2 className="text-3xl font-bold tracking-tight font-headline">
            Lista de Jugadores
          </h2>
          <div className="w-full max-w-sm">
             <Input 
                placeholder="Buscar por jugador o equipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

       <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
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
                                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
                                        {teamPlayers.length > 0 ? teamPlayers.map((player) => (
                                          <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg hover:scale-[1.02]">
                                            <CardHeader className="p-0">
                                              <Link href={`/players/${player.id}`}>
                                                <Image
                                                  src={player.photoUrl}
                                                  alt={`Foto de ${player.name}`}
                                                  width={400}
                                                  height={400}
                                                  className="w-full h-auto aspect-square object-cover"
                                                  data-ai-hint="player portrait"
                                                />
                                              </Link>
                                            </CardHeader>
                                            <CardContent className="p-4 flex-grow">
                                              <h3 className="text-xl font-bold font-headline mt-2">{player.name}</h3>
                                              <p className="text-muted-foreground">{player.position}</p>
                                            </CardContent>
                                            <CardFooter className="p-4 pt-0">
                                              <Button asChild className="w-full">
                                                <Link href={`/players/${player.id}`}>Ver Perfil</Link>
                                              </Button>
                                            </CardFooter>
                                          </Card>
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
