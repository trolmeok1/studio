
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BracketNode = ({ team, isWinner }: { team: string | null; isWinner?: boolean }) => {
    return (
        <div
        className={`flex items-center justify-between w-48 h-10 px-3 border rounded-md text-sm
            ${isWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50'}
            ${!team ? 'border-dashed' : 'border-solid'}`}
        >
        <span className="truncate">{team || 'Por definir'}</span>
        </div>
    );
};
  
const Matchup = ({ teamA, teamB, isWinnerA }: { teamA: string | null; teamB: string | null; isWinnerA: boolean }) => {
    return (
        <div className="inline-flex flex-col items-center gap-2">
            <BracketNode team={teamA} isWinner={isWinnerA} />
            <span className="text-xs font-bold text-muted-foreground">VS</span>
            <BracketNode team={teamB} isWinner={!isWinnerA} />
        </div>
    );
};
  
const RoundSection = ({ title, matchups }: { title: string; matchups: { teamA: string; teamB: string; }[] }) => {
    return (
        <AccordionItem value={title}>
            <AccordionTrigger className="text-xl font-bold font-headline tracking-wider uppercase">{title}</AccordionTrigger>
            <AccordionContent>
                <div className="p-4 bg-background/50 rounded-md overflow-x-auto">
                    <div className="flex flex-nowrap gap-8 pb-4">
                        {matchups.map((match, i) => (
                            <Matchup key={i} teamA={match.teamA} teamB={match.teamB} isWinnerA={Math.random() > 0.5} />
                        ))}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
};

const CopaBracket = () => {
    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: `Equipo ${i * 2 + 1}`, teamB: `Equipo ${i * 2 + 2}` }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: `Ganador Octavos ${i * 2 + 1}`, teamB: `Ganador Octavos ${i * 2 + 2}` }));
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: `Ganador Cuartos ${i * 2 + 1}`, teamB: `Ganador Cuartos ${i * 2 + 2}` }));
    const final = [{ teamA: 'Ganador Semifinal 1', teamB: 'Ganador Semifinal 2' }];

    return (
        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="Octavos de Final">
            <RoundSection title="Octavos de Final" matchups={octavos} />
            <RoundSection title="Cuartos de Final" matchups={cuartos} />
            <RoundSection title="Semifinal" matchups={semifinal} />
            <AccordionItem value="Final">
                 <AccordionTrigger className="text-xl font-bold font-headline tracking-wider uppercase text-amber-400">Final</AccordionTrigger>
                 <AccordionContent>
                     <div className="p-4 bg-background/50 rounded-md flex justify-center">
                         <div className="flex flex-col items-center">
                            <Matchup teamA={final[0].teamA} teamB={final[0].teamB} isWinnerA={true} />
                            <div className="mt-8 text-center">
                                <p className="text-lg text-muted-foreground">Campeón</p>
                                <p className="text-3xl font-bold text-amber-400">🏆 {final[0].teamA} 🏆</p>
                            </div>
                         </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
  
const SegundaLeague = () => {
      const [teams, setTeams] = useState<Team[]>([]);
      
      useEffect(() => {
          setTeams(getTeamsByCategory('Segunda'));
      }, []);
  
      const standings = useMemo(() => {
          if (teams.length === 0) return [];
          // Use a copy of mockStandings to avoid mutating the original data
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
              <CardDescription>Torneo de eliminación directa con 32 equipos. Haz clic en cada ronda para expandir.</CardDescription>
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

    