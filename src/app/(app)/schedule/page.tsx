

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category } from '@/lib/mock-data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dices, RefreshCw, CalendarPlus, History, ClipboardList, Shield, Trophy, UserCheck, Filter, AlertTriangle, PartyPopper } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { GeneratedMatch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, setHours, setMinutes, getDay, startOfDay, parse } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';


const BracketNode = ({ team, isWinner }: { team: Team | null; isWinner?: boolean }) => {
    return (
        <div
            className={cn(`flex items-center gap-2 w-full h-8 px-2 border text-xs rounded-md`,
                isWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50',
                !team ? 'border-dashed' : 'border-solid'
            )}
        >
            {team?.logoUrl && <Image src={team.logoUrl} alt={team.name} width={16} height={16} className="rounded-full" />}
            <span className="truncate">{team?.name || '...'}</span>
        </div>
    );
};

const Matchup = ({ teamA, teamB }: { teamA: Team | null; teamB: Team | null; }) => {
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

const Round = ({ title, matchups, children }: { title: string; matchups?: { teamA: Team | null; teamB: Team | null; }[], children?: React.ReactNode }) => {
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

const CopaBracket = ({ teams }: { teams: Team[] }) => {
    if (teams.length === 0) {
       return (
         <div className="text-center py-10 text-muted-foreground">
            <p>Aún no has configurado la copa.</p>
            <p>Usa el botón "Configurar Copa" para seleccionar los equipos participantes.</p>
        </div>
       )
    }

    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: teams[i*2] || null, teamB: teams[i*2+1] || null }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: octavos[i*2].teamA, teamB: octavos[i*2+1].teamA })); // Dummy winners
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: cuartos[i*2].teamA, teamB: cuartos[i*2+1].teamA })); // Dummy winners
    const final = { teamA: semifinal[0].teamA, teamB: semifinal[1].teamA }; // Dummy winners
    
    const winner = final.teamA;

    return (
        <div className="flex justify-center items-stretch gap-4 md:gap-8 p-4 bg-background/50 rounded-md overflow-x-auto">
            <Round title="Octavos" matchups={octavos} />
            <Round title="Cuartos" matchups={cuartos} />
            <Round title="Semifinal" matchups={semifinal} />
            <Round title="Final">
                 <Matchup teamA={final.teamA} teamB={final.teamB} />
                 {winner && (
                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">Campeón</p>
                         <div className="flex flex-col items-center gap-2 mt-2">
                             <Image src={winner.logoUrl} alt={winner.name} width={40} height={40} className="rounded-full" />
                            <p className="text-xl font-bold text-amber-400">🏆 {winner.name} 🏆</p>
                        </div>
                    </div>
                )}
            </Round>
        </div>
    );
};

const GeneralMatchCard = ({ match, showCategory = false }: { match: GeneratedMatch, showCategory?: boolean }) => {
    const allTeams: Team[] = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda'),
        ...getTeamsByCategory('Copa')
    ], []);
    const homeTeam = allTeams.find(t => t.id === match.home);
    const awayTeam = allTeams.find(t => t.id === match.away);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
    return (
        <Link href={`/partido`} className="block group">
            <Card className="overflow-hidden transition-all group-hover:shadow-lg">
                <div className="relative grid grid-cols-2">
                    {/* Team A Panel */}
                    <div className="bg-blue-900/80 text-white p-4 flex flex-col items-center justify-center gap-2 text-center h-48">
                         <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || 'Home'} width={60} height={60} className="rounded-full" data-ai-hint="team logo" />
                         <span className="font-bold text-sm leading-tight">{homeTeam?.name || match.home}</span>
                         {match.homeDressingRoom && <Badge variant="secondary" className="mt-1">Camerino {match.homeDressingRoom}</Badge>}
                    </div>
                     {/* Team B Panel */}
                    <div className="bg-gray-700/80 text-white p-4 flex flex-col items-center justify-center gap-2 text-center h-48">
                         <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || 'Away'} width={60} height={60} className="rounded-full" data-ai-hint="team logo" />
                        <span className="font-bold text-sm leading-tight">{awayTeam?.name || 'Away'}</span>
                        {match.awayDressingRoom && <Badge variant="secondary" className="mt-1">Camerino {match.awayDressingRoom}</Badge>}
                    </div>

                    {/* Center Info */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 bg-background/90 rounded-full border-4 border-background shadow-lg text-primary font-bold">
                            VS
                        </div>
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full flex justify-between px-2">
                             {showCategory && <Badge variant="secondary" className="text-xs">{match.category}{match.group && ` - ${match.group}`}</Badge>}
                             <Badge variant="secondary" className="text-xs">{match.leg}</Badge>
                        </div>
                         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-1">
                            <Badge className="bg-black/50 text-white backdrop-blur-sm">
                                {isClient && match.time ? `${match.time}` : 'Por definir'}
                                {match.field && ` / Cancha ${match.field}`}
                            </Badge>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

const CategoryMatchCard = ({ match }: { match: GeneratedMatch }) => {
    const allTeams: Team[] = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda')
    ], []);
    const homeTeam = allTeams.find(t => t.id === match.home);
    const awayTeam = allTeams.find(t => t.id === match.away);

    return (
        <Link href={`/partido`} className="block group">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer p-0">
                <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-2/5 justify-end">
                        <span className="font-bold text-sm text-right truncate">{homeTeam?.name || match.home}</span>
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || 'Home'} width={32} height={32} className="rounded-full" data-ai-hint="team logo" />
                    </div>

                    <div className="text-center w-1/5">
                        <span className="text-lg font-light text-muted-foreground">VS</span>
                        <Badge variant="outline" className="text-xs">{match.time}</Badge>
                    </div>

                    <div className="flex items-center gap-3 w-2/5">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || 'Away'} width={32} height={32} className="rounded-full" data-ai-hint="team logo" />
                        <span className="font-bold text-sm truncate">{awayTeam?.name || 'Away'}</span>
                    </div>
                </CardContent>
                <div className="border-t p-2 flex justify-center items-center text-xs text-muted-foreground gap-4">
                     <span><Badge variant="outline" className="px-1.5 py-0.5">Cancha {match.field}</Badge></span>
                    <span><Badge variant="outline" className="px-1.5 py-0.5">V: {match.homeDressingRoom} / F: {match.awayDressingRoom}</Badge></span>
                </div>
            </Card>
        </Link>
    );
};

const useFixtureGenerator = (category: Category) => {
    const getTeamName = useCallback((teamId: string) => {
        const allTeams = [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')];
        return allTeams.find(t => t.id === teamId)?.name || teamId;
    }, []);

    const fixture = useMemo(() => {
        const generateRounds = (teams: Team[], group?: 'A' | 'B'): GeneratedMatch[][] => {
            let currentTeams = [...teams];
            if (currentTeams.length % 2 !== 0) {
                currentTeams.push({ id: 'dummy', name: 'Descansa', logoUrl: '', category: category, group });
            }
            const numRounds = currentTeams.length - 1;
            const matchesPerRound = currentTeams.length / 2;
            const rounds: GeneratedMatch[][] = Array.from({ length: numRounds }, () => []);

            for (let round = 0; round < numRounds; round++) {
                for (let i = 0; i < matchesPerRound; i++) {
                    const home = currentTeams[i];
                    const away = currentTeams[currentTeams.length - 1 - i];
                    if (home.id !== 'dummy' && away.id !== 'dummy') {
                        rounds[round].push({ home: home.id, away: away.id, category, group, round: round + 1 });
                    }
                }
                const lastTeam = currentTeams.pop();
                if (lastTeam) {
                    currentTeams.splice(1, 0, lastTeam);
                }
            }
            return rounds;
        };
        
        const categoryTeams = getTeamsByCategory(category);
        if (category === 'Segunda') {
            const groupA = categoryTeams.filter(t => t.group === 'A');
            const groupB = categoryTeams.filter(t => t.group === 'B');
            return {
                ida: [...generateRounds(groupA, 'A'), ...generateRounds(groupB, 'B')].flat(),
                vuelta: [...generateRounds(groupA, 'A'), ...generateRounds(groupB, 'B')].flat().map(m => ({...m, home: m.away, away: m.home}))
            }
        }
        
        const rounds = generateRounds(categoryTeams);
        return {
            ida: rounds.flat(),
            vuelta: rounds.flat().map(m => ({...m, home: m.away, away: m.home}))
        };
    }, [category]);

    return { fixture, getTeamName };
};


const FixtureView = ({ category }: { category: Category }) => {
    const { fixture, getTeamName } = useFixtureGenerator(category);
    
    const FixtureRoundTable = ({ title, matches }: { title: string, matches: GeneratedMatch[] }) => (
        <div className="space-y-4">
            <h4 className="text-xl font-bold text-center">{title}</h4>
            <Table>
                 <TableHeader className="bg-primary/10">
                    <TableRow>
                        <TableHead className="text-right w-2/5 font-semibold text-primary">Equipo Local</TableHead>
                        <TableHead className="text-center w-1/5 font-semibold text-primary">vs</TableHead>
                        <TableHead className="w-2/5 font-semibold text-primary">Equipo Visitante</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                     {matches.map((match, i) => (
                        <TableRow key={i}>
                            <TableCell className="text-right font-medium">{getTeamName(match.home)}</TableCell>
                            <TableCell className="text-center text-muted-foreground">vs</TableCell>
                            <TableCell className="font-medium">{getTeamName(match.away)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
    
    const roundsIda = useMemo(() => {
        return fixture.ida.reduce((acc, match) => {
            const round = match.round || 0;
            if (!acc[round]) acc[round] = [];
            acc[round].push(match);
            return acc;
        }, {} as Record<number, GeneratedMatch[]>);
    }, [fixture.ida]);
    
    const roundsVuelta = useMemo(() => {
        return fixture.vuelta.reduce((acc, match) => {
             const round = match.round || 0;
            if (!acc[round]) acc[round] = [];
            acc[round].push(match);
            return acc;
        }, {} as Record<number, GeneratedMatch[]>);
    }, [fixture.vuelta]);

    return (
        <div className="space-y-8 mt-4">
             <div>
                <h3 className="text-2xl font-bold text-center mb-4 pb-2 border-b-2">Primera Vuelta</h3>
                <div className="space-y-6">
                    {Object.entries(roundsIda).map(([roundNum, matches]) => (
                        <FixtureRoundTable key={`ida-${roundNum}`} title={`Fecha ${roundNum}`} matches={matches} />
                    ))}
                </div>
            </div>
             <div>
                <h3 className="text-2xl font-bold text-center mb-4 pb-2 border-b-2">Segunda Vuelta</h3>
                <div className="space-y-6">
                     {Object.entries(roundsVuelta).map(([roundNum, matches]) => (
                        <FixtureRoundTable key={`vuelta-${roundNum}`} title={`Fecha ${parseInt(roundNum) + Object.keys(roundsIda).length}`} matches={matches} />
                    ))}
                </div>
            </div>
        </div>
    );
};


const LeagueView = ({ category, generatedMatches }: { category: Category, generatedMatches: GeneratedMatch[] }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    
    useEffect(() => {
        const categoryTeams = getTeamsByCategory(category);
        setTeams(categoryTeams);
    }, [category]);
    
    const isGrouped = category === 'Segunda' && teams.length >= 16;
    const groups: (('A' | 'B') | undefined)[] = isGrouped ? ['A', 'B'] : [undefined];

    const standings = useMemo(() => {
        if (teams.length === 0) return [];
        
        return groups.map(group => {
            const groupTeams = teams.filter(t => isGrouped ? t.group === group : true);
            const categoryStandings = [...mockStandings].filter(s => groupTeams.some(t => t.id === s.teamId));

            const teamsWithLogos = categoryStandings.map(s => {
                const teamData = groupTeams.find(t => t.id === s.teamId);
                return {
                    ...s,
                    teamLogoUrl: teamData?.logoUrl || 'https://placehold.co/100x100.png',
                    group: teamData?.group
                };
            });
            return {
                group,
                standings: teamsWithLogos.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
            };
        });
        
    }, [teams, groups, isGrouped]);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    const groupedMatches = useMemo(() => {
        if (!isClient || generatedMatches.length === 0) return {};

        const categoryMatches = generatedMatches.filter(m => m.category === category);

        return categoryMatches.reduce((acc, match) => {
            if (!match.date) return acc;
            const dateKey = format(match.date, 'PPPP', { locale: es });
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(match);
            return acc;
        }, {} as Record<string, GeneratedMatch[]>);
    }, [generatedMatches, isClient, category]);


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
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Torneo {category}</CardTitle>
                    <CardDescription>Partidos de ida y vuelta. Los dos primeros de cada grupo (si aplica) o de la tabla general clasifican a la siguiente fase.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue='schedule'>
                     <TabsList>
                        <TabsTrigger value="schedule">Calendario de Partidos</TabsTrigger>
                        <TabsTrigger value="fixture">Fixture (Fechas)</TabsTrigger>
                        <TabsTrigger value="standings">Tabla de Posiciones</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fixture">
                         <FixtureView category={category} />
                    </TabsContent>
                    <TabsContent value="standings">
                        {standings.map(({ group, standings: groupStandings }) => (
                            <div key={group || 'general'} className="mt-4">
                                {isGrouped && <h3 className="text-xl font-bold mb-2">Grupo {group}</h3>}
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
                                        {groupStandings.map((s, index) => (
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
                            </div>
                        ))}
                    </TabsContent>
                    <TabsContent value="schedule" className="space-y-6 mt-6">
                         {Object.keys(groupedMatches).length > 0 ? Object.entries(groupedMatches)
                            .sort(([dateA], [dateB]) => {
                                 try {
                                     const parsedDateA = parse(dateA, 'PPPP', new Date(), { locale: es });
                                     const parsedDateB = parse(dateB, 'PPPP', new Date(), { locale: es });
                                     return parsedDateA.getTime() - parsedDateB.getTime();
                                 } catch (e) {
                                     return 0;
                                 }
                            })
                            .map(([date, matchesOnDate]) => (
                            <Card key={date} className="p-4">
                                <h3 className="text-lg font-semibold mb-3 text-muted-foreground">{date}</h3>
                                 <div className="space-y-2">
                                    {matchesOnDate
                                        .sort((a,b) => (a.time || "").localeCompare(b.time || ""))
                                        .map((match, index) => <CategoryMatchCard key={index} match={match} />)
                                    }
                                </div>
                            </Card>
                        )) : (
                            <p className="text-muted-foreground text-center py-8">Genere el calendario usando el botón "Sorteo de Equipos".</p>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const DrawSettingsDialog = ({ onGenerate, tournamentType }: { onGenerate: (settings: any) => void, tournamentType: 'league' | 'cup' }) => {
    const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 2));
    const [gameDays, setGameDays] = useState<number[]>([6, 0]); // Saturday, Sunday
    const [gameTimes, setGameTimes] = useState(['08:00', '10:00', '12:00', '14:00', '16:00']);
    const [numFields, setNumFields] = useState(1);
    const [numDressingRooms, setNumDressingRooms] = useState(4);

    const handleDayToggle = (day: number) => {
        setGameDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    }
    
    const handleTimeChange = (index: number, value: string) => {
        const newTimes = [...gameTimes];
        newTimes[index] = value;
        setGameTimes(newTimes);
    }
    
    const handleAddTime = () => setGameTimes([...gameTimes, '']);
    const handleRemoveTime = (index: number) => setGameTimes(gameTimes.filter((_, i) => i !== index));

    const handleSubmit = () => {
        onGenerate({
            startDate,
            gameDays,
            gameTimes: gameTimes.filter(t => t).sort(), // Filter out empty time slots and sort them
            numFields,
            numDressingRooms,
        });
    }

    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Configuración de Programación ({tournamentType === 'league' ? 'Liga' : 'Copa'})</DialogTitle>
                <DialogDescription>Define los parámetros para generar el calendario de partidos.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-6">
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Fecha de Inicio</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>Días de Juego</Label>
                        <div className="flex gap-2 mt-2">
                            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map((day, index) => (
                                <Button key={day} variant={gameDays.includes(index) ? 'default' : 'outline'} size="sm" onClick={() => handleDayToggle(index)}>{day}</Button>
                            ))}
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="numFields">Número de Canchas</Label>
                            <Input id="numFields" type="number" value={numFields} onChange={e => setNumFields(parseInt(e.target.value) || 1)} min="1" />
                        </div>
                         <div>
                            <Label htmlFor="numDressingRooms">Número de Camerinos</Label>
                            <Input id="numDressingRooms" type="number" value={numDressingRooms} onChange={e => setNumDressingRooms(parseInt(e.target.value) || 4)} min="4" />
                        </div>
                    </div>
                    <div>
                        <Label>Horarios de los Partidos</Label>
                        <div className="space-y-2 mt-2">
                            {gameTimes.map((time, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input type="time" value={time} onChange={e => handleTimeChange(index, e.target.value)} />
                                    <Button variant="destructive" size="sm" onClick={() => handleRemoveTime(index)}>X</Button>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={handleAddTime}>Agregar Horario</Button>
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                    <Button onClick={handleSubmit}>Generar Calendario</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

const RescheduleDialog = ({ allMatches, open, onOpenChange, onReschedule }: { allMatches: GeneratedMatch[], open: boolean, onOpenChange: (open: boolean) => void, onReschedule: (match: GeneratedMatch, newDate: Date, newTime: string) => void }) => {
    const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>();
    const [newDate, setNewDate] = useState<Date | undefined>();
    const [newTime, setNewTime] = useState<string>('');

    const allTeams = useMemo(() => [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')], []);
    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    
    const occupiedSlots = useMemo(() => {
        if (!newDate) return [];
        const dateStr = format(newDate, 'yyyy-MM-dd');
        return allMatches
            .filter(m => m.date && format(m.date, 'yyyy-MM-dd') === dateStr)
            .map(m => m.time)
            .filter(Boolean) as string[];
    }, [newDate, allMatches]);

    const handleConfirmReschedule = () => {
        if (!selectedMatchId || !newDate || !newTime) return;
        const matchToReschedule = allMatches.find(m => `${m.home}-${m.away}-${m.leg}` === selectedMatchId);
        if (matchToReschedule) {
            const [hours, minutes] = newTime.split(':').map(Number);
            const finalDate = setMinutes(setHours(startOfDay(newDate), hours), minutes);
            onReschedule(matchToReschedule, finalDate, newTime);
            onOpenChange(false); // Close dialog on success
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reagendar Partido</DialogTitle>
                    <DialogDescription>Seleccione un partido y elija una nueva fecha y hora.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Seleccionar Partido</Label>
                        <Select onValueChange={setSelectedMatchId} value={selectedMatchId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Elige un partido para mover..." />
                            </SelectTrigger>
                            <SelectContent>
                                {allMatches.map((match) => (
                                    <SelectItem key={`${match.home}-${match.away}-${match.leg}`} value={`${match.home}-${match.away}-${match.leg}`}>
                                        {getTeamName(match.home)} vs {getTeamName(match.away)} ({match.leg})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label>Nueva Fecha</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !newDate && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newDate ? format(newDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={newDate} onSelect={setNewDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    {newDate && (
                         <div>
                            <Label>Nueva Hora</Label>
                            <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                             {occupiedSlots.length > 0 && (
                                 <p className="text-xs text-muted-foreground mt-2">
                                     Horarios ocupados este día: {occupiedSlots.sort().join(', ')}
                                 </p>
                            )}
                         </div>
                    )}
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleConfirmReschedule} disabled={!selectedMatchId || !newDate || !newTime}>Confirmar Cambio</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const GeneralScheduleView = ({ generatedMatches, selectedCategory }: { generatedMatches: GeneratedMatch[], selectedCategory: Category | 'all' }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
    const filteredMatches = useMemo(() => {
        if (selectedCategory === 'all') {
            return generatedMatches;
        }
        return generatedMatches.filter(m => m.category === selectedCategory);
    }, [generatedMatches, selectedCategory]);

    const groupedMatches = useMemo(() => {
        if (filteredMatches.length === 0 || !isClient) return {};

        return filteredMatches
            .reduce((acc, match) => {
                if (!match.date) return acc;
                const dateKey = format(match.date, 'PPPP', {locale: es});
                
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(match);
                return acc;
            }, {} as Record<string, GeneratedMatch[]>);
    }, [filteredMatches, isClient]);

     if (generatedMatches.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Calendario General</CardTitle>
                    <CardDescription>Vista unificada de todos los partidos programados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">Genere el calendario usando el botón "Sorteo de Equipos".</p>
                </CardContent>
             </Card>
        )
     }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendario General</CardTitle>
                <CardDescription>Vista unificada de todos los partidos programados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-6">
                 {Object.entries(groupedMatches)
                    .sort(([dateA], [dateB]) => {
                         try {
                             const parsedDateA = parse(dateA, 'PPPP', new Date(), { locale: es });
                             const parsedDateB = parse(dateB, 'PPPP', new Date(), { locale: es });
                             return parsedDateA.getTime() - parsedDateB.getTime();
                         } catch (e) {
                             return 0; 
                         }
                    })
                    .map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matchesOnDate.sort((a,b) => (a.time || "").localeCompare(b.time || "")).map((match, index) => 
                                <GeneralMatchCard key={`${match.home}-${match.away}-${index}`} match={match} showCategory={true} />
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const RescheduledMatchesView = ({ matches, onUpdate }: { matches: GeneratedMatch[], onUpdate: () => void }) => {
    const allTeams = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda')
    ], []);
    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    const rescheduledMatches = matches.filter(m => m.rescheduled);

    // This is a bit of a hack to force a re-render when the parent's state changes.
    useEffect(() => {
        onUpdate();
    }, [matches, onUpdate]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Partidos Reagendados</CardTitle>
                <CardDescription>Historial de todos los partidos que han sido movidos de su fecha original.</CardDescription>
            </CardHeader>
            <CardContent>
                 {rescheduledMatches.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay partidos reagendados.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partido</TableHead>
                                <TableHead>Fecha Original</TableHead>
                                <TableHead>Nueva Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rescheduledMatches.map((match, i) => (
                                <TableRow key={`${match.home}-${match.away}-${i}`}>
                                    <TableCell className="font-medium">{getTeamName(match.home)} vs {getTeamName(match.away)}</TableCell>
                                    <TableCell>
                                        {match.originalDate ? format(match.originalDate, 'PPP, p', { locale: es }) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {match.date ? format(match.date, 'PPP, p', { locale: es }) : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}

const CopaSettingsDialog = ({ onGenerate }: { onGenerate: (settings: { teams: Team[] }) => void }) => {
    const allTeams = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda'),
    ], []);
    const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

    const handleTeamToggle = (teamId: string) => {
        setSelectedTeamIds(prev => 
            prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
        );
    };

    const handleSubmit = () => {
        const selectedTeams = allTeams.filter(team => selectedTeamIds.includes(team.id));
        onGenerate({ teams: selectedTeams });
    };

    return (
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Configuración de la Copa</DialogTitle>
                <DialogDescription>Selecciona los equipos que participarán en el torneo de copa.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTeams.map(team => (
                        <Card 
                            key={team.id} 
                            onClick={() => handleTeamToggle(team.id)}
                            className={cn(
                                "p-3 cursor-pointer transition-all flex items-center gap-3",
                                selectedTeamIds.includes(team.id) && "ring-2 ring-primary bg-primary/10"
                            )}
                        >
                            <Checkbox checked={selectedTeamIds.includes(team.id)} onCheckedChange={() => handleTeamToggle(team.id)} />
                            <Image src={team.logoUrl} alt={team.name} width={32} height={32} className="rounded-full" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{team.name}</p>
                                <p className="text-xs text-muted-foreground">{team.category}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                </DialogClose>
                 <DialogClose asChild>
                    <Button onClick={handleSubmit} disabled={selectedTeamIds.length === 0}>
                        Generar Bracket ({selectedTeamIds.length} equipos)
                    </Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


export default function SchedulePage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);
  const [copaTeams, setCopaTeams] = useState<Team[]>([]);
  const [copaMatches, setCopaMatches] = useState<GeneratedMatch[]>([]);
  const [isDrawLeagueDialogOpen, setIsDrawLeagueDialogOpen] = useState(false);
  const [isDrawCopaDialogOpen, setIsDrawCopaDialogOpen] = useState(false);
  const [isCopaSettingsDialogOpen, setIsCopaSettingsDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [resetAlertStep, setResetAlertStep] = useState(0);
  const [finalizeAlertStep, setFinalizeAlertStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const allTeams = useMemo(() => [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')], []);
  const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
  const [, forceUpdate] = useState({});


  const isTournamentStarted = generatedMatches.length > 0 || copaMatches.length > 0;
  
  useEffect(() => { setIsClient(true) }, []);

  const scheduleMatches = (matchesToSchedule: GeneratedMatch[], settings: { startDate: Date, gameDays: number[], gameTimes: string[], numFields: number, numDressingRooms: number }) => {
    let scheduledMatches: GeneratedMatch[] = [];
    const matchQueue = [...matchesToSchedule];
    
    let currentDate = startOfDay(settings.startDate);
    
    const allScheduledMatches = [...generatedMatches, ...copaMatches.filter(m => m.date)];
    if(allScheduledMatches.length > 0) {
      const lastMatchDate = allScheduledMatches.reduce((latest, match) => {
        return match.date && match.date > latest ? match.date : latest;
      }, new Date(0));
      currentDate = addDays(startOfDay(lastMatchDate), 1);
    }
    
    let dressingRoomCounter = 0;

    while(matchQueue.length > 0) {
        const dayOfWeek = getDay(currentDate);
        if(settings.gameDays.includes(dayOfWeek)) {
            const slotsPerDay = settings.gameTimes.length * settings.numFields;
            const matchesForDay = matchQueue.splice(0, slotsPerDay);

            matchesForDay.forEach((match, index) => {
                 const timeIndex = index % settings.gameTimes.length;
                 const fieldIndex = Math.floor(index / settings.gameTimes.length);
                 
                 const time = settings.gameTimes[timeIndex];
                 const field = fieldIndex + 1;

                 const timeParts = time.split(':');
                 const matchDateTime = setMinutes(setHours(currentDate, parseInt(timeParts[0])), parseInt(timeParts[1]));
                 
                 const homeDressingRoom = (dressingRoomCounter % settings.numDressingRooms) + 1;
                 const awayDressingRoom = ((homeDressingRoom + 1) % settings.numDressingRooms) + 1;
                 dressingRoomCounter += 2;


                 scheduledMatches.push({
                    ...match,
                    date: matchDateTime,
                    time: format(matchDateTime, 'HH:mm'),
                    field: field,
                    homeDressingRoom: homeDressingRoom,
                    awayDressingRoom: awayDressingRoom,
                });
            });
        }
        currentDate = addDays(currentDate, 1);
    }
    return scheduledMatches;
  };

  const generateLeagueSchedule = (settings: any) => {
    const generateRoundRobinMatches = (teams: Team[], category: Category, group?: 'A' | 'B'): { ida: GeneratedMatch[], vuelta: GeneratedMatch[] } => {
        let currentTeams = [...teams];
        if (currentTeams.length % 2 !== 0) {
            currentTeams.push({ id: 'dummy', name: 'Descansa', logoUrl: '', category: category, group });
        }

        const numTeams = currentTeams.length;
        const numRounds = numTeams - 1;
        let idaMatches: GeneratedMatch[] = [];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < numTeams / 2; i++) {
                const team1 = currentTeams[i];
                const team2 = currentTeams[numTeams - 1 - i];

                if (team1.id !== 'dummy' && team2.id !== 'dummy') {
                    idaMatches.push({ home: team1.id, away: team2.id, category, group, leg: 'Ida', round: round + 1 });
                }
            }
            const lastTeam = currentTeams.pop();
            if (lastTeam) {
                currentTeams.splice(1, 0, lastTeam);
            }
        }
        const vueltaMatches = idaMatches.map(m => ({...m, home: m.away, away: m.home, leg: 'Vuelta' as 'Vuelta'}));
        
        return { ida: idaMatches, vuelta: vueltaMatches };
    };
    
    const categoriesConfig: {category: Category, group?: 'A' | 'B'}[] = [
        { category: 'Máxima' },
        { category: 'Primera' },
        { category: 'Segunda', group: 'A' },
        { category: 'Segunda', group: 'B' }
    ];

    let allIdaMatches: GeneratedMatch[] = [];
    let allVueltaMatches: GeneratedMatch[] = [];

    categoriesConfig.forEach(cat => {
        const teams = getTeamsByCategory(cat.category, cat.group);
        if (teams.length > 1) {
            const { ida, vuelta } = generateRoundRobinMatches(teams, cat.category, cat.group);
            allIdaMatches.push(...ida);
            allVueltaMatches.push(...vuelta);
        }
    });
    
    allIdaMatches.sort(() => 0.5 - Math.random());
    allVueltaMatches.sort(() => 0.5 - Math.random());
    
    const scheduled = scheduleMatches([...allIdaMatches, ...allVueltaMatches], settings);
    setGeneratedMatches(scheduled);
    setIsSuccessDialogOpen(true);
};

  const handleCopaSettings = ({ teams }: { teams: Team[] }) => {
    setCopaTeams(teams);
    let shuffledTeams = [...teams].sort(() => 0.5 - Math.random());

    let matches: GeneratedMatch[] = [];
    for (let i = 0; i < shuffledTeams.length; i += 2) {
      if (shuffledTeams[i+1]) {
        matches.push({ home: shuffledTeams[i].id, away: shuffledTeams[i+1].id, category: 'Copa', leg: 'Ida', round: 1 });
        matches.push({ home: shuffledTeams[i+1].id, away: shuffledTeams[i].id, category: 'Copa', leg: 'Vuelta', round: 1 });
      }
    }
    setCopaMatches(matches);
    setIsCopaSettingsDialogOpen(false);
  }
  
  const scheduleCopaMatches = (settings: any) => {
    const scheduled = scheduleMatches(copaMatches.filter(m => !m.date), settings);
    setCopaMatches(prev => {
        return prev.map(unscheduled => {
            const found = scheduled.find(s => s.home === unscheduled.home && s.away === unscheduled.away && s.leg === unscheduled.leg);
            return found || unscheduled;
        });
    });
    setGeneratedMatches(prev => [...prev, ...scheduled]);
    setIsDrawCopaDialogOpen(false);
    setIsSuccessDialogOpen(true);
  }

  const handleReschedule = (matchToUpdate: GeneratedMatch, newDate: Date, newTime: string) => {
      const updateFn = (m: GeneratedMatch) => {
         if (m.home === matchToUpdate.home && m.away === matchToUpdate.away && m.leg === matchToUpdate.leg) {
              return {
                  ...m,
                  originalDate: m.date,
                  date: newDate,
                  time: newTime,
                  rescheduled: true,
              };
          }
          return m;
      }
      setGeneratedMatches(prev => prev.map(updateFn));
      setCopaMatches(prev => prev.map(updateFn));
  };


  const handleDrawButtonClick = () => {
      if (isTournamentStarted) {
          setIsRescheduleDialogOpen(true);
      } else {
         setIsDrawLeagueDialogOpen(true);
      }
  }

  const handleResetConfirm = () => {
    setGeneratedMatches([]);
    setCopaMatches([]);
    setResetAlertStep(0);
    toast({ title: '¡Calendarios Reiniciados!', description: 'Todos los partidos programados han sido borrados.'});
  };
  
  const handleFinalizeTournament = () => {
    setGeneratedMatches([]);
    setCopaMatches([]);
    setCopaTeams([]);
    setFinalizeAlertStep(0);
    toast({ title: '¡Torneo Finalizado!', description: 'Todos los datos de la temporada han sido reiniciados.'});
  };


  const unscheduledCopaMatches = useMemo(() => copaMatches.filter(m => !m.date).length, [copaMatches]);

    const ResetDialog = ({ step, onStepChange, onConfirm, actionType = 'restart' }: { step: number, onStepChange: (step: number) => void, onConfirm: () => void, actionType?: 'restart' | 'finalize' }) => {
        if (step === 0) return null;
        
        const content = [
            {
                title: actionType === 'restart' ? "¿Estás seguro de reiniciar los calendarios?" : "¿Estás seguro de finalizar el torneo?",
                description: actionType === 'restart' 
                    ? "Esta acción eliminará permanentemente todos los partidos programados (Liga y Copa). No se puede deshacer. Los partidos ya jugados no se verán afectados."
                    : "Esta acción reiniciará todo el estado del torneo, incluyendo calendarios y equipos de copa. Es ideal para empezar una nueva temporada.",
                confirmText: "Sí, entiendo los riesgos"
            },
            {
                title: "Confirmación Adicional",
                description: "Estás a un paso de realizar una acción irreversible. Esta es tu segunda advertencia.",
                confirmText: "Sí, estoy completamente seguro"
            },
            {
                title: "ÚLTIMA ADVERTENCIA",
                description: "Al hacer clic en \"PROCEDER\", los datos se eliminarán para siempre. Esta es tu última oportunidad para cancelar.",
                confirmText: "PROCEDER DEFINITIVAMENTE"
            }
        ];
        
        const currentContent = content[step - 1];
        
        return (
             <AlertDialog open={step > 0} onOpenChange={(open) => !open && onStepChange(0)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{currentContent.title}</AlertDialogTitle>
                        <AlertDialogDescription>{currentContent.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => onStepChange(0)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className={cn(step === 3 && buttonVariants({ variant: "destructive" }))}
                            onClick={() => step < 3 ? onStepChange(step + 1) : onConfirm()}
                        >
                            {currentContent.confirmText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight font-headline">
                Programación de Partidos
            </h2>
            <Card className="p-2 bg-card/50">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold mr-2">Admin:</span>
                     <Button 
                        variant={isTournamentStarted ? "outline" : "default"}
                        onClick={handleDrawButtonClick}
                        >
                         {isTournamentStarted ? <CalendarPlus className="mr-2" /> : <Dices className="mr-2" />}
                         {isTournamentStarted ? "Reagendar Partido" : "Sorteo de Liga"}
                     </Button>
                     {isTournamentStarted && (
                        <>
                            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setResetAlertStep(1)}>
                                <RefreshCw className="mr-2" />
                                Reiniciar Calendarios
                            </Button>
                            <Button variant="destructive" onClick={() => setFinalizeAlertStep(1)}>
                                <Trophy className="mr-2" />
                                Finalizar Torneo
                            </Button>
                        </>
                    )}
                </div>
            </Card>
        </div>

        <Dialog open={isDrawLeagueDialogOpen} onOpenChange={setIsDrawLeagueDialogOpen}>
            <DrawSettingsDialog onGenerate={generateLeagueSchedule} tournamentType="league" />
        </Dialog>

        <Dialog open={isDrawCopaDialogOpen} onOpenChange={setIsDrawCopaDialogOpen}>
            <DrawSettingsDialog onGenerate={scheduleCopaMatches} tournamentType="cup" />
        </Dialog>
        
        <RescheduleDialog 
            allMatches={[...generatedMatches, ...copaMatches]}
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
            onReschedule={handleReschedule}
        />
        
        <Dialog open={isCopaSettingsDialogOpen} onOpenChange={setIsCopaSettingsDialogOpen}>
            <CopaSettingsDialog onGenerate={handleCopaSettings} />
        </Dialog>

        <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
            <TabsTrigger value="maxima">Máxima</TabsTrigger>
            <TabsTrigger value="primera">Primera</TabsTrigger>
            <TabsTrigger value="segunda">Segunda</TabsTrigger>
            <TabsTrigger value="rescheduled"><History className="mr-2"/>Reagendados</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                 <div className="flex justify-end mb-4">
                    <div className="w-full max-w-xs">
                         <Select onValueChange={(value) => setSelectedCategory(value as Category | 'all')} value={selectedCategory}>
                            <SelectTrigger>
                                <Filter className="mr-2" />
                                <SelectValue placeholder="Filtrar por categoría..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Ver todas las categorías</SelectItem>
                                <SelectItem value="Máxima">Máxima</SelectItem>
                                <SelectItem value="Primera">Primera</SelectItem>
                                <SelectItem value="Segunda">Segunda</SelectItem>
                                <SelectItem value="Copa">Copa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <GeneralScheduleView generatedMatches={[...generatedMatches, ...copaMatches]} selectedCategory={selectedCategory} />
            </TabsContent>
            <TabsContent value="copa">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                     <div>
                        <CardTitle>Bracket del Torneo - Copa La Luz</CardTitle>
                        <CardDescription>Torneo de eliminación directa con los equipos seleccionados.</CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button onClick={() => setIsCopaSettingsDialogOpen(true)} variant="outline">
                            <Trophy className="mr-2"/>
                            Configurar Copa
                        </Button>
                        {copaTeams.length > 0 && unscheduledCopaMatches > 0 && (
                             <Button onClick={() => setIsDrawCopaDialogOpen(true)}>
                                <CalendarPlus className="mr-2"/>
                                Programar Partidos ({unscheduledCopaMatches})
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                  <CopaBracket teams={copaTeams} />
                  {copaMatches.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Partidos de Copa Programados</h3>
                       <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-2/5 text-right">Local</TableHead>
                            <TableHead className="w-1/5 text-center">Vs</TableHead>
                            <TableHead className="w-2/5">Visitante</TableHead>
                            <TableHead>Ronda</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {copaMatches.map((match, i) => (
                            <TableRow key={i}>
                              <TableCell className="text-right font-medium">{getTeamName(match.home)}</TableCell>
                              <TableCell className="text-center text-muted-foreground">vs</TableCell>
                              <TableCell className="font-medium">{getTeamName(match.away)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{match.leg}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
            </Card>
            </TabsContent>
            <TabsContent value="maxima">
            <LeagueView category="Máxima" generatedMatches={generatedMatches} />
            </TabsContent>
            <TabsContent value="primera">
            <LeagueView category="Primera" generatedMatches={generatedMatches} />
            </TabsContent>
            <TabsContent value="segunda">
            <LeagueView category="Segunda" generatedMatches={generatedMatches} />
            </TabsContent>
            <TabsContent value="rescheduled">
                <RescheduledMatchesView matches={[...generatedMatches, ...copaMatches]} onUpdate={() => forceUpdate({})} />
            </TabsContent>
        </Tabs>
        
        <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                     <AlertDialogTitle className="flex items-center gap-2">
                        <PartyPopper className="text-primary h-6 w-6"/>
                        ¡Calendario Generado Exitosamente!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Se ha generado el calendario de partidos. Puedes verlo en la pestaña "General" o en las pestañas de cada categoría.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>Entendido</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
        <ResetDialog step={resetAlertStep} onStepChange={setResetAlertStep} onConfirm={handleResetConfirm} actionType="restart" />
        <ResetDialog step={finalizeAlertStep} onStepChange={setFinalizeAlertStep} onConfirm={handleFinalizeTournament} actionType="finalize" />

    </div>
  );
}
