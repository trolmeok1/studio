
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';

const BracketNode = ({ team, isWinner }: { team: string | null; isWinner?: boolean; }) => (
  <div
    className={`flex items-center justify-between w-40 h-10 px-3 border-y border-r rounded-r-md text-sm
      ${isWinner ? 'bg-primary/20 border-primary font-bold text-primary-foreground' : 'bg-muted/50'}
      ${!team ? 'border-dashed' : 'border-solid'}`}
  >
    <span className="truncate">{team || 'Por definir'}</span>
  </div>
);

const Matchup = ({ children, round, matchIndex }: { children: React.ReactNode, round: number, matchIndex: number }) => (
    <div className="relative flex flex-col justify-center my-4">
        {children}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center" style={{ right: '-2.5rem' }}>
            <div className="w-10 h-px bg-muted-foreground"></div>
            <div className="w-px h-20 bg-muted-foreground absolute -right-px"></div>
        </div>
    </div>
);

const Round = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="flex flex-col justify-around text-center">
    <h3 className="text-lg font-bold font-headline mb-8 tracking-wider uppercase">{title}</h3>
    <div className="flex flex-col justify-around h-full gap-8">
        {children}
    </div>
  </div>
);

const FinalMatch = ({ winner }: { winner: string | null }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h3 className="text-3xl font-bold font-headline mb-4 text-amber-400">FINAL</h3>
        <div className="p-4 border-2 border-amber-400 rounded-lg bg-card shadow-xl min-h-[12rem] flex flex-col justify-center items-center">
             <BracketNode team="Equipo A (Sim)" isWinner={true} />
             <div className="font-bold text-muted-foreground my-2">VS</div>
             <BracketNode team="Equipo B (Sim)" />
        </div>
         <div className="mt-4">
            <p className="text-sm text-muted-foreground">Campeón</p>
            <p className="text-2xl font-bold text-amber-400">🏆 {winner || 'Por definir'} 🏆</p>
        </div>
    </div>
);


const CopaBracket = () => {
    // This is a visual representation, logic for actual matchups would be more complex
    return (
        <div className="flex justify-center p-8 overflow-x-auto min-w-max">
            <div className="flex items-center space-x-16">
                <Round title="Octavos de Final">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Matchup key={`octavos-${i}`} round={1} matchIndex={i}>
                            <BracketNode team={`Equipo ${i * 2 + 1}`} isWinner={true} />
                            <div className="h-4"></div>
                            <BracketNode team={`Equipo ${i * 2 + 2}`} />
                        </Matchup>
                    ))}
                </Round>
                <Round title="Cuartos de Final">
                     {Array.from({ length: 4 }).map((_, i) => (
                        <Matchup key={`cuartos-${i}`} round={2} matchIndex={i}>
                            <BracketNode team={`Equipo ${i*2+1}`} isWinner={true} />
                            <div className="h-4"></div>
                            <BracketNode team="Por definir" />
                        </Matchup>
                    ))}
                </Round>
                <Round title="Semifinal">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Matchup key={`semi-${i}`} round={3} matchIndex={i}>
                           <BracketNode team="Por definir" isWinner={true} />
                           <div className="h-4"></div>
                           <BracketNode team="Por definir" />
                        </Matchup>
                    ))}
                </Round>
                <FinalMatch winner="Equipo A (Sim)" />
            </div>
        </div>
    );
};

const SegundaLeague = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    
    useEffect(() => {
        setTeams(getTeamsByCategory('Segunda'));
    }, []);

    const standings = useMemo(() => {
        return mockStandings
            .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    }, []);


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
                        {standings.map((s, index) => (
                            <TableRow key={s.teamId}>
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
                        <h4 className="font-bold font-headline text-lg">FINAL</h4>
                         <div className="mt-2 p-4 rounded-lg bg-muted/50 flex items-center gap-4">
                            <span>{standings[0]?.teamName || 'Primero'}</span>
                            <span className="font-bold text-primary">VS</span>
                             <span>{standings[1]?.teamName || 'Segundo'}</span>
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
              <CardDescription>Torneo de eliminación directa con 32 equipos.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
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
            <CardContent className="overflow-x-auto">
                <p className="text-muted-foreground">Bracket para la categoría Primera no disponible aún. Realiza el sorteo para empezar.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
