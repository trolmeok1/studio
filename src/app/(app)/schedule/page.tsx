
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const BracketNode = ({ team, isWinner }: { team: string | null; isWinner?: boolean }) => {
    return (
        <div
        className={cn(`flex items-center w-full h-8 px-2 border text-xs rounded-md`,
            isWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50',
            !team ? 'border-dashed' : 'border-solid'
        )}
        >
            <span className="truncate">{team || '...'}</span>
        </div>
    );
};

const Matchup = ({ teamA, teamB }: { teamA: string | null; teamB: string | null; }) => {
    const [isWinnerA, setIsWinnerA] = useState(true);

    useEffect(() => {
        setIsWinnerA(Math.random() > 0.5);
    }, []);

    return (
        <div className="flex flex-col justify-center gap-1 w-full relative">
             <div className="absolute -right-2 top-1/2 w-2 h-px bg-muted-foreground"></div>
             <div className="absolute -right-2 top-1/4 w-2 h-1/2 border-r border-b border-muted-foreground rounded-br-sm"></div>
            <BracketNode team={teamA} isWinner={isWinnerA} />
            <BracketNode team={teamB} isWinner={!isWinnerA} />
        </div>
    );
};

const Round = ({ title, matchups, children }: { title: string; matchups?: { teamA: string; teamB: string; }[], children?: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-around items-center w-48 gap-4">
            <h3 className="text-lg font-bold font-headline tracking-wider uppercase text-center">{title}</h3>
            <div className="flex flex-col w-full h-full justify-around gap-4">
                 {matchups && matchups.map((match, i) => (
                    <Matchup key={i} teamA={match.teamA} teamB={match.teamB} />
                ))}
                {children}
            </div>
        </div>
    )
}

const CopaBracket = () => {
    // Mock data for a 16-team bracket for brevity
    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: `Equipo ${i * 2 + 1}`, teamB: `Equipo ${i * 2 + 2}` }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: `Ganador O${i * 2 + 1}`, teamB: `Ganador O${i * 2 + 2}` }));
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: `Ganador C${i * 2 + 1}`, teamB: `Ganador C${i * 2 + 2}` }));
    const final = { teamA: 'Ganador S1', teamB: 'Ganador S2' };

    return (
        <div className="flex justify-center items-stretch gap-4 md:gap-8 p-4 bg-background/50 rounded-md overflow-x-auto">
            <Round title="Octavos" matchups={octavos} />
            <Round title="Cuartos" matchups={cuartos} />
            <Round title="Semifinal" matchups={semifinal} />
            <Round title="Final">
                 <Matchup teamA={final.teamA} teamB={final.teamB} />
                 <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Campeón</p>
                    <p className="text-xl font-bold text-amber-400">🏆 Ganador S1 🏆</p>
                </div>
            </Round>
        </div>
    );
};

const SegundaLeague = () => {
      const [teams, setTeams] = useState<Team[]>([]);

      useEffect(() => {
          setTeams(getTeamsByCategory('Segunda'));
      }, []);

      const standings = useMemo(() => {
          if (teams.length === 0) return [];
          const teamsWithLogos = [...mockStandings].map(s => {
              const teamData = teams.find(t => t.id === s.teamId);
              return {
                  ...s,
                  teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png'
              };
          });
          return teamsWithLogos
              .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
      }, [teams]);


      return (
          <Card>
              <CardHeader>
                  <CardTitle>Torneo Segunda - 12 Equipos</CardTitle>
                  <CardDescription>Partidos de ida y vuelta. Los dos primeros clasifican a la final.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead className="w-[50px]">#</TableHead>
                              <TableHead>Equipo</TableHead>
                              <TableHead className="text-center">PJ</TableHead>
                              <TableHead className="text-center">G</TableHead>
                              <TableHead className="text-center">E</TableHead>
                              <TableHead className="text-center">P</TableHead>
                              <TableHead className="text-center">GF</TableHead>
                              <TableHead className="text-center">GC</TableHead>
                              <TableHead className="text-center">GD</TableHead>
                              <TableHead className="text-center">PTS</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {standings.slice(0, 12).map((s, index) => (
                              <TableRow key={s.teamId} className={index < 2 ? 'bg-primary/10' : ''}>
                                  <TableCell className="font-bold">{index + 1}</TableCell>
                                  <TableCell>
                                      <div className="flex items-center gap-3">
                                          <Image src={s.teamLogoUrl} alt={s.teamName} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                          <span>{s.teamName}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell className="text-center">{s.played}</TableCell>
                                  <TableCell className="text-center">{s.wins}</TableCell>
                                  <TableCell className="text-center">{s.draws}</TableCell>
                                  <TableCell className="text-center">{s.losses}</TableCell>
                                  <TableCell className="text-center">{s.goalsFor}</TableCell>
                                  <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                                  <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                                  <TableCell className="text-center font-bold">{s.points}</TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                   <div className="mt-8 flex justify-around">
                      <div className="text-center">
                          <h4 className="font-bold font-headline text-lg text-primary">FINAL</h4>
                           <div className="mt-2 p-4 rounded-lg bg-muted/50 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                  <Image src={standings[0]?.teamLogoUrl || 'https://placehold.co/100x100.png'} alt={standings[0]?.teamName || 'Primero'} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                  <span>{standings[0]?.teamName || 'Primero'}</span>
                              </div>
                              <span className="font-bold text-primary">VS</span>
                               <div className="flex items-center gap-2">
                                  <Image src={standings[1]?.teamLogoUrl || 'https://placehold.co/100x100.png'} alt={standings[1]?.teamName || 'Segundo'} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                                  <span>{standings[1]?.teamName || 'Segundo'}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </CardContent>
          </Card>
      );
};


export default function SchedulePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
            Programación de Partidos
        </h2>
        <Card className="p-2 bg-card/50">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold mr-2">Admin:</span>
                 <Button variant="outline">
                    <Dices className="mr-2" />
                    Sorteo de Equipos
                </Button>
                <Button>
                    <RefreshCw className="mr-2" />
                    Actualizar Bracket
                </Button>
            </div>
        </Card>
      </div>

      <Tabs defaultValue="copa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
          <TabsTrigger value="segunda">Segunda</TabsTrigger>
          <TabsTrigger value="primera">Primera</TabsTrigger>
        </TabsList>
        <TabsContent value="copa">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Copa La Luz</CardTitle>
              <CardDescription>Torneo de eliminación directa con 16 equipos.</CardDescription>
            </CardHeader>
            <CardContent>
              <CopaBracket />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="segunda">
           <SegundaLeague />
        </TabsContent>
         <TabsContent value="primera">
           <Card>
            <CardHeader>
              <CardTitle>Bracket del Torneo - Primera</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Bracket para la categoría Primera no disponible aún. Realiza el sorteo para empezar.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
