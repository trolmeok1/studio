
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category } from '@/lib/mock-data';
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
    }, [teamA, teamB]);

    return (
        <div className="flex flex-col justify-center gap-1 w-full relative">
             <div className="absolute -right-2 top-1/2 w-2 h-px bg-muted-foreground"></div>
             <div className="absolute -right-2 top-1/4 w-2 h-1/2 border-r border-b border-muted-foreground rounded-br-sm"></div>
            <BracketNode team={teamA} isWinner={isWinnerA} />
            <BracketNode team={teamB} isWinner={!isWinnerA} />
        </div>
    );
};

const Round = ({ title, matchups, children }: { title: string; matchups?: { teamA: {name: string}; teamB: {name: string}; }[], children?: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-around items-center w-48 gap-4">
            <h3 className="text-lg font-bold font-headline tracking-wider uppercase text-center">{title}</h3>
            <div className="flex flex-col w-full h-full justify-around gap-4">
                 {matchups && matchups.map((match, i) => (
                    <Matchup key={i} teamA={match.teamA.name} teamB={match.teamB.name} />
                ))}
                {children}
            </div>
        </div>
    )
}

const CopaBracket = () => {
    let teams = getTeamsByCategory('Copa');

    if (teams.length < 16) {
        teams = Array.from({ length: 16 }, (_, i) => ({
            id: `fake-${i + 1}`,
            name: `Equipo ${i + 1}`,
            logoUrl: 'https://placehold.co/100x100.png',
            category: 'Copa'
        }));
    }

    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: teams[i*2], teamB: teams[i*2+1] }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: teams[i*2], teamB: teams[i*2+1] })); // Dummy winners
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: teams[i*2], teamB: teams[i*2+1] })); // Dummy winners
    const final = { teamA: teams[0], teamB: teams[1] }; // Dummy winners

    return (
        <div className="flex justify-center items-stretch gap-4 md:gap-8 p-4 bg-background/50 rounded-md overflow-x-auto">
            <Round title="Octavos" matchups={octavos} />
            <Round title="Cuartos" matchups={cuartos} />
            <Round title="Semifinal" matchups={semifinal} />
            <Round title="Final">
                 <Matchup teamA={final.teamA.name} teamB={final.teamB.name} />
                 <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">Campeón</p>
                    <p className="text-xl font-bold text-amber-400">🏆 {final.teamA.name} 🏆</p>
                </div>
            </Round>
        </div>
    );
};

const MatchCard = ({ match, homeTeam, awayTeam }: { match: { home: string, away: string }, homeTeam?: Team, awayTeam?: Team }) => (
    <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md text-sm">
        <div className="flex items-center gap-2 font-semibold text-right w-2/5 justify-end">
            <span>{homeTeam?.name || match.home}</span>
            <Image src={homeTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={homeTeam?.name || 'Home'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
        </div>
        <span className="text-primary font-bold mx-2">VS</span>
        <div className="flex items-center gap-2 font-semibold text-left w-2/5">
            <Image src={awayTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={awayTeam?.name || 'Away'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            <span>{awayTeam?.name || match.away}</span>
        </div>
    </div>
);


const LeagueView = ({ category }: { category: Category }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [schedule, setSchedule] = useState<{ home: string, away: string }[][][]>([]);

    useEffect(() => {
        const categoryTeams = getTeamsByCategory(category);
        setTeams(categoryTeams);

        if (categoryTeams.length >= 2) { // Need at least 2 teams for a match
            let teamSlice = categoryTeams.map(t => t.id);

            // Ensure there's an even number of teams for scheduling
            if (teamSlice.length % 2 !== 0) {
                teamSlice.push("BYE");
            }
            
            const rounds = teamSlice.length - 1;
            const half = teamSlice.length / 2;
            const generatedSchedule: { home: string, away: string }[][] = [];

            const teamsForScheduling = teamSlice.map(id => ({ id }));
            
            for (let i = 0; i < rounds; i++) {
                const roundMatches: { home: string, away: string }[] = [];
                for (let j = 0; j < half; j++) {
                    const home = teamsForScheduling[j];
                    const away = teamsForScheduling[teamsForScheduling.length - 1 - j];
                    if(home.id !== "BYE" && away.id !== "BYE") {
                       roundMatches.push({ home: home.id, away: away.id });
                    }
                }
                generatedSchedule.push(roundMatches);

                // Rotate teams - keep the first one fixed
                const lastTeam = teamsForScheduling.pop();
                if(lastTeam) {
                  teamsForScheduling.splice(1, 0, lastTeam);
                }
            }
            
            // Generate second leg
            const secondLeg = generatedSchedule.map(round => 
                round.map(match => ({ home: match.away, away: match.home }))
            );

            setSchedule([generatedSchedule, secondLeg]);
        }
    }, [category]);

    const standings = useMemo(() => {
        if (teams.length === 0) return [];
        // Filter mock standings for the current category teams
        const categoryStandings = [...mockStandings].filter(s => teams.some(t => t.id === s.teamId));

        const teamsWithLogos = categoryStandings.map(s => {
            const teamData = teams.find(t => t.id === s.teamId);
            return {
                ...s,
                teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png'
            };
        });
        return teamsWithLogos
            .sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
    }, [teams]);


    const getTeam = (id: string) => teams.find(t => t.id === id);
    
    if(teams.length === 0) {
         return (
             <Card>
                <CardHeader>
                    <CardTitle>Torneo {category}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No hay equipos registrados en esta categoría.</p>
                </CardContent>
             </Card>
         )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Torneo {category}</CardTitle>
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
                
                {standings.length >= 2 && (
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
                )}

                {schedule.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-center mb-4 font-headline">PRIMERA VUELTA</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedule[0].map((round, roundIndex) => (
                                <Card key={`round-1-${roundIndex}`}>
                                    <CardHeader>
                                        <CardTitle className="text-center text-lg">Etapa {roundIndex + 1}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {round.map((match, matchIndex) => (
                                            <MatchCard key={matchIndex} match={match} homeTeam={getTeam(match.home)} awayTeam={getTeam(match.away)} />
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <h3 className="text-2xl font-bold text-center mt-12 mb-4 font-headline">SEGUNDA VUELTA</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedule[1].map((round, roundIndex) => (
                                <Card key={`round-2-${roundIndex}`}>
                                    <CardHeader>
                                        <CardTitle className="text-center text-lg">Etapa {roundIndex + schedule[0].length + 1}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {round.map((match, matchIndex) => (
                                             <MatchCard key={matchIndex} match={match} homeTeam={getTeam(match.home)} awayTeam={getTeam(match.away)} />
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

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
          <TabsTrigger value="maxima">Máxima</TabsTrigger>
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
           <LeagueView category="Segunda" />
        </TabsContent>
         <TabsContent value="primera">
           <LeagueView category="Primera" />
        </TabsContent>
        <TabsContent value="maxima">
           <LeagueView category="Máxima" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
