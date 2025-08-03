

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category } from '@/lib/mock-data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
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


const BracketNode = ({ team, isWinner }: { team: string | null; isWinner?: boolean }) => {
    const [isClientWinner, setIsClientWinner] = useState(false);

    useEffect(() => {
        if (team) { // Only determine winner if there is a team
            setIsClientWinner(Math.random() > 0.5);
        }
    }, [team]);

    return (
        <div
        className={cn(`flex items-center w-full h-8 px-2 border text-xs rounded-md`,
            isWinner ?? isClientWinner ? 'bg-primary/20 border-primary font-bold' : 'bg-muted/50',
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
    const [bracketTeams, setBracketTeams] = useState<Team[]>([]);

    useEffect(() => {
        const allTeams: Team[] = [
            ...getTeamsByCategory('Máxima'),
            ...getTeamsByCategory('Primera'),
            ...getTeamsByCategory('Segunda')
        ];
        
        allTeams.sort(() => 0.5 - Math.random());

        const selectedTeams = allTeams.slice(0, 16);

        while (selectedTeams.length < 16) {
            selectedTeams.push({
                id: `fake-${selectedTeams.length + 1}`,
                name: `Equipo ${selectedTeams.length + 1}`,
                logoUrl: 'https://placehold.co/100x100.png',
                category: 'Máxima'
            });
        }
        setBracketTeams(selectedTeams);
    }, []);

    if (bracketTeams.length === 0) {
        return <div>Generando bracket...</div>
    }

    const octavos = Array.from({ length: 8 }).map((_, i) => ({ teamA: bracketTeams[i*2], teamB: bracketTeams[i*2+1] }));
    const cuartos = Array.from({ length: 4 }).map((_, i) => ({ teamA: octavos[i*2].teamA, teamB: octavos[i*2+1].teamA })); // Dummy winners
    const semifinal = Array.from({ length: 2 }).map((_, i) => ({ teamA: cuartos[i*2].teamA, teamB: cuartos[i*2+1].teamA })); // Dummy winners
    const final = { teamA: semifinal[0].teamA, teamB: semifinal[1].teamA }; // Dummy winners

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

const MatchCard = ({ match, showCategory = false }: { match: GeneratedMatch, showCategory?: boolean }) => {
    const allTeams = [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')];
    const homeTeam = allTeams.find(t => t.id === match.home);
    const awayTeam = allTeams.find(t => t.id === match.away);
    
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
    return (
    <Link href={`/partido`}>
        <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md text-sm hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-semibold text-right w-2/5 justify-end">
                <span className="truncate">{homeTeam?.name || match.home}</span>
                <Image src={homeTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={homeTeam?.name || 'Home'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            </div>
             <div className="text-center w-1/5">
                <span className="text-primary font-bold mx-2">VS</span>
                 <div className="mt-1 text-xs text-muted-foreground">
                    {isClient && match.time ? `${match.time}` : 'Por definir'}
                    {match.field && <span className="block">Cancha {match.field}</span>}
                </div>
            </div>
            <div className="flex items-center gap-2 font-semibold text-left w-2/5">
                <Image src={awayTeam?.logoUrl || 'https://placehold.co/40x40.png'} alt={awayTeam?.name || 'Away'} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
                <span className="truncate">{awayTeam?.name || 'Away'}</span>
            </div>
             {showCategory && (
                <div className="w-24 text-right">
                    <Badge variant="outline">{match.category}{match.group && ` - ${match.group}`}</Badge>
                </div>
            )}
        </div>
    </Link>
);
}


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
        if (teams.length === 0 || generatedMatches.length === 0 || !isClient) return {};

        return generatedMatches
            .filter(m => m.category === category)
            .reduce((acc, match) => {
                if (!match.date) return acc;
                // Group by actual date, not by round number
                const dateKey = format(match.date, 'PPPP', {locale: es});
                
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(match);
                return acc;
            }, {} as Record<string, GeneratedMatch[]>);
    }, [generatedMatches, isClient, teams, category]);


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
                <Tabs defaultValue='standings'>
                     <TabsList>
                        <TabsTrigger value="standings">Tabla de Posiciones</TabsTrigger>
                        <TabsTrigger value="schedule">Calendario de Partidos</TabsTrigger>
                    </TabsList>
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
                            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                            .map(([date, matchesOnDate]) => (
                            <div key={date}>
                                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                                <div className="space-y-2">
                                    {matchesOnDate.sort((a,b) => (a.time || "").localeCompare(b.time || "")).map((match, index) => <MatchCard key={index} match={match} />)}
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted-foreground text-center py-8">Genere el calendario usando el botón "Sorteo de Equipos".</p>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

const DrawSettingsDialog = ({ onGenerate }: { onGenerate: (settings: any) => void }) => {
    const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 2));
    const [gameDays, setGameDays] = useState<number[]>([6, 0]); // Saturday, Sunday
    const [gameTimes, setGameTimes] = useState(['08:00', '10:00', '12:00', '14:00', '16:00']);
    const [numFields, setNumFields] = useState(1);

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
            gameTimes: gameTimes.filter(t => t), // Filter out empty time slots
            numFields,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Configuración del Sorteo</DialogTitle>
                <DialogDescription>Define los parámetros para generar el calendario de partidos.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div>
                    <Label>Fecha de Inicio del Torneo</Label>
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
                 <div>
                    <Label htmlFor="numFields">Número de Canchas</Label>
                    <Input id="numFields" type="number" value={numFields} onChange={e => setNumFields(parseInt(e.target.value) || 1)} min="1" />
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

const GeneralScheduleView = ({ generatedMatches }: { generatedMatches: GeneratedMatch[] }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    const groupedMatches = useMemo(() => {
        if (generatedMatches.length === 0 || !isClient) return {};

        return generatedMatches
            .reduce((acc, match) => {
                if (!match.date) return acc;
                const dateKey = format(match.date, 'PPPP', {locale: es});
                
                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }
                acc[dateKey].push(match);
                return acc;
            }, {} as Record<string, GeneratedMatch[]>);
    }, [generatedMatches, isClient]);

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
                             if (!dateA || !dateB) return 0;
                             // Use a known format for parsing that matches the key format
                             return new Date(dateA).getTime() - new Date(dateB).getTime()
                        } catch(e) {
                            console.error("Date parsing error", e);
                            return 0;
                        }
                    })
                    .map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                        <div className="space-y-2">
                            {matchesOnDate.sort((a,b) => (a.time || "").localeCompare(b.time || "")).map((match, index) => 
                                <MatchCard key={index} match={match} showCategory={true} />
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};


export default function SchedulePage() {
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);
  const [isDrawDialogOpen, setIsDrawDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [resetAlertStep, setResetAlertStep] = useState(0);

  const isTournamentStarted = generatedMatches.length > 0;
  
  useEffect(() => { setIsClient(true) }, []);

  const generateMasterSchedule = (settings: { startDate: Date, gameDays: number[], gameTimes: string[], numFields: number }) => {
    
    const generateRoundRobinMatches = (teams: Team[], category: Category, group?: 'A' | 'B'): GeneratedMatch[] => {
        let currentTeams = [...teams];
        if (currentTeams.length % 2 !== 0) {
            currentTeams.push({ id: 'dummy', name: 'Descansa', logoUrl: '', category: category, group });
        }

        const numTeams = currentTeams.length;
        const numRounds = numTeams - 1;
        const matchesPerRound = numTeams / 2;
        let allMatches: GeneratedMatch[] = [];
        
        const scheduleMatches = (leg: 'Ida' | 'Vuelta') => {
            let roundTeams = [...currentTeams];
             for (let round = 0; round < numRounds; round++) {
                for (let i = 0; i < matchesPerRound; i++) {
                    const team1 = roundTeams[i];
                    const team2 = roundTeams[numTeams - 1 - i];

                    if (team1.id !== 'dummy' && team2.id !== 'dummy') {
                        const home = leg === 'Ida' ? team1.id : team2.id;
                        const away = leg === 'Ida' ? team2.id : team1.id;
                        allMatches.push({ home, away, category, group, roundNumber: round + 1, leg });
                    }
                }
                // Rotate teams
                const lastTeam = roundTeams.pop();
                if (lastTeam) {
                    roundTeams.splice(1, 0, lastTeam);
                }
            }
        }
        
        scheduleMatches('Ida');
        scheduleMatches('Vuelta');

        return allMatches;
    };
    
    const categoriesConfig: {category: Category, group?: 'A' | 'B'}[] = [
        { category: 'Máxima' },
        { category: 'Primera' },
        { category: 'Segunda', group: 'A' },
        { category: 'Segunda', group: 'B' }
    ];

    let allMatches: GeneratedMatch[] = [];
    
    categoriesConfig.forEach(cat => {
        const teams = getTeamsByCategory(cat.category, cat.group);
        if (teams.length > 1) {
            const categoryMatches = generateRoundRobinMatches(teams, cat.category, cat.group);
            allMatches.push(...categoryMatches);
        }
    });

    // Shuffle all matches randomly
    for (let i = allMatches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allMatches[i], allMatches[j]] = [allMatches[j], allMatches[i]];
    }
    
    // Assign dates and times
    let scheduledMatches: GeneratedMatch[] = [];
    let matchQueue = [...allMatches];
    let currentDate = startOfDay(settings.startDate);
    
    while(matchQueue.length > 0) {
        const dayOfWeek = getDay(currentDate);
        if(settings.gameDays.includes(dayOfWeek)) {
            // Create slots for the current valid day
            const daySlots: { date: Date, field: number }[] = [];
            settings.gameTimes.sort().forEach(time => {
                for(let field = 1; field <= settings.numFields; field++) {
                    const timeParts = time.split(':');
                    const matchDateTime = setMinutes(setHours(currentDate, parseInt(timeParts[0])), parseInt(timeParts[1]));
                    daySlots.push({ date: matchDateTime, field: field });
                }
            });

            // Assign matches to the day's slots
            const matchesForDay = matchQueue.splice(0, daySlots.length);
            matchesForDay.forEach((match, index) => {
                if (daySlots[index]) {
                    scheduledMatches.push({
                        ...match,
                        date: daySlots[index].date,
                        time: format(daySlots[index].date, 'HH:mm'),
                        field: daySlots[index].field,
                    });
                }
            });
        }
        currentDate = addDays(currentDate, 1);
    }
    
    setGeneratedMatches(scheduledMatches);
    setIsSuccessDialogOpen(true);
};


  const handleDrawButtonClick = () => {
      if (isTournamentStarted) {
          setResetAlertStep(1);
      } else {
         setIsDrawDialogOpen(true);
      }
  }

  const handleResetConfirm = () => {
    setGeneratedMatches([]);
    setResetAlertStep(0);
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
                    <Dialog open={isDrawDialogOpen} onOpenChange={setIsDrawDialogOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                variant={isTournamentStarted ? "destructive" : "outline"}
                                onClick={handleDrawButtonClick}
                                
                            >
                                <Dices className="mr-2" />
                                {isTournamentStarted ? "Torneo Iniciado" : "Sorteo de Equipos"}
                            </Button>
                         </DialogTrigger>
                         <DrawSettingsDialog onGenerate={(settings) => {
                            generateMasterSchedule(settings);
                            setIsDrawDialogOpen(false);
                        }} />
                    </Dialog>
                     {isTournamentStarted && (
                        <Button variant="secondary" onClick={() => setResetAlertStep(1)}>
                            <RefreshCw className="mr-2" />
                            Reiniciar
                        </Button>
                    )}
                </div>
            </Card>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
            <TabsTrigger value="maxima">Máxima</TabsTrigger>
            <TabsTrigger value="primera">Primera</TabsTrigger>
            <TabsTrigger value="segunda">Segunda</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
                <GeneralScheduleView generatedMatches={generatedMatches} />
            </TabsContent>
            <TabsContent value="copa">
            <Card>
                <CardHeader>
                <CardTitle>Bracket del Torneo - Copa La Luz</CardTitle>
                <CardDescription>Torneo de eliminación directa con 16 equipos de todas las categorías.</CardDescription>
                </CardHeader>
                <CardContent>
                <CopaBracket />
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
        </Tabs>
        
        <AlertDialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¡Calendario Generado Exitosamente!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se ha generado el calendario de partidos para todas las categorías. Puedes verlo en las pestañas correspondientes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>Entendido</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

         <AlertDialog open={resetAlertStep > 0} onOpenChange={(open) => !open && setResetAlertStep(0)}>
            <AlertDialogContent>
                 {resetAlertStep === 1 ? (
                    <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro de reiniciar el calendario?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción eliminará permanentemente todos los partidos generados y no se puede deshacer. Deberás generar un nuevo calendario.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setResetAlertStep(0)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction className={buttonVariants({variant: "destructive"})} onClick={() => setResetAlertStep(2)}>
                                Sí, reiniciar calendario
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                 ) : (
                      <>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Calendario Reiniciado</AlertDialogTitle>
                            <AlertDialogDescription>
                                Se han borrado todos los partidos. Ahora puedes generar un nuevo calendario desde el botón "Sorteo de Equipos".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                             <AlertDialogAction onClick={handleResetConfirm}>
                                Entendido
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </>
                 )}
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}

    

    