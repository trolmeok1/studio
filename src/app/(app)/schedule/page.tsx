
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category, upcomingMatches as initialMatches } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Dices, RefreshCw } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Match, GeneratedMatch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, setHours, setMinutes, setSeconds, parse, addHours, addWeeks } from 'date-fns';
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

const MatchCard = ({ match }: { match: GeneratedMatch }) => {
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
        if (teams.length === 0 || generatedMatches.length === 0) return {};

        return generatedMatches
            .filter(m => m.category === category)
            .reduce((acc, match) => {
                const categoryTeams = teams.filter(t => t.category === category && (isGrouped ? t.group === match.group : true));
                const roundSize = Math.floor(categoryTeams.length / 2);
                if (roundSize === 0) return acc;
                
                const categoryMatches = generatedMatches.filter(m => m.category === category && (isGrouped ? m.group === match.group : true));
                const totalRounds = (categoryTeams.length - (categoryTeams.length % 2 === 0 ? 0 : 1) -1);

                const matchIndexInSchedule = categoryMatches.indexOf(match);

                let leg = 'Ida';
                let currentRound = Math.floor(matchIndexInSchedule / roundSize) + 1;
                
                if (currentRound > totalRounds) {
                    leg = 'Vuelta';
                    currentRound = currentRound - totalRounds;
                }
                
                const dateKey = `Fecha ${currentRound} (${leg})` + (isGrouped ? ` - Grupo ${match.group}` : '');
                
                if (!acc[dateKey]) {
                    acc[dateKey] = {
                        date: isClient && match.date ? format(match.date, 'PPPP', {locale: es}) : '',
                        matches: []
                    };
                }
                acc[dateKey].matches.push(match);
                return acc;
            }, {} as Record<string, { date: string, matches: GeneratedMatch[] }>);
    }, [generatedMatches, isClient, teams, category, isGrouped]);


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
                        {Object.keys(groupedMatches).length > 0 ? Object.entries(groupedMatches).sort().map(([roundName, roundData]) => (
                            <div key={roundName}>
                                <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{roundName} - <span className="font-normal">{roundData.date}</span></h3>
                                <div className="space-y-2">
                                    {roundData.matches.sort((a,b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0)).map((match, index) => <MatchCard key={index} match={match} />)}
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

const DrawDialog = ({ onGenerate, onOpenChange, open }: { onGenerate: (startDate: Date, playDays: Record<string, boolean>, dayConfigs: Record<string, { start: string; end: string }>, numberOfFields: number) => void, onOpenChange: (open: boolean) => void, open: boolean }) => {
    const [startDate, setStartDate] = useState<Date | undefined>(new Date());
    const [numberOfFields, setNumberOfFields] = useState(1);
    const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
        '4': false, 
        '5': false, 
        '6': true, // Saturday
        '0': true, // Sunday
    });
     const [dayConfigs, setDayConfigs] = useState<Record<string, { start: string; end: string }>>({
        '4': { start: '08:00', end: '18:00' },
        '5': { start: '08:00', end: '18:00' },
        '6': { start: '10:00', end: '18:00' },
        '0': { start: '09:00', end: '17:00' }, 
    });
    
    const daysOfWeek = [
        { id: '4', label: 'Jueves' }, { id: '5', label: 'Viernes' }, { id: '6', label: 'Sábado' }, { id: '0', label: 'Domingo' }
    ];

    const handleGenerateClick = () => {
        if (startDate) {
            onGenerate(startDate, selectedDays, dayConfigs, numberOfFields);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configurar Sorteo y Calendario</DialogTitle>
                    <DialogDescription>
                        Seleccione la fecha de inicio y los días y horas en que se jugarán los partidos para generar el calendario automáticamente.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha de Inicio del Torneo</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="fields">Número de Canchas</Label>
                            <Input id="fields" type="number" min="1" value={numberOfFields} onChange={(e) => setNumberOfFields(parseInt(e.target.value) || 1)} />
                         </div>
                    </div>
                    <div className="space-y-2">
                         <Label>Días y Horarios de Juego</Label>
                         <div className="grid grid-cols-1 gap-4">
                             {daysOfWeek.map(day => (
                                <div key={day.id} className="flex items-center space-x-4 p-2 rounded-md bg-muted/50">
                                    <Checkbox
                                        id={day.id}
                                        checked={selectedDays[day.id]}
                                        onCheckedChange={(checked) => setSelectedDays(prev => ({...prev, [day.id]: !!checked}))}
                                    />
                                    <label htmlFor={day.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow">
                                        {day.label}
                                    </label>
                                    <div className="flex items-center gap-2">
                                         <Input
                                            type="time"
                                            className="w-28"
                                            disabled={!selectedDays[day.id]}
                                            value={dayConfigs[day.id]?.start || '08:00'}
                                            onChange={(e) => setDayConfigs(prev => ({...prev, [day.id]: { ...prev[day.id], start: e.target.value }}))}
                                         />
                                          <span>-</span>
                                         <Input
                                            type="time"
                                            className="w-28"
                                            disabled={!selectedDays[day.id]}
                                            value={dayConfigs[day.id]?.end || '18:00'}
                                            onChange={(e) => setDayConfigs(prev => ({...prev, [day.id]: { ...prev[day.id], end: e.target.value }}))}
                                         />
                                    </div>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                       <Button variant="ghost">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleGenerateClick}>
                        <RefreshCw className="mr-2" />
                        Generar Calendario
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export default function SchedulePage() {
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);
  const [isDrawDialogOpen, setIsDrawDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [resetAlertStep, setResetAlertStep] = useState(0);

  const isTournamentStarted = generatedMatches.length > 0;
  
  const resetAlerts = [
      {
          title: "Reiniciar Torneo",
          description: "¿Ya iniciaste un torneo, vas a reiniciar todo?",
          action: "Continuar"
      },
      {
          title: "Confirmación Adicional",
          description: "¿Estás seguro que quieres reiniciar el torneo? Esta acción no se puede deshacer.",
          action: "Sí, reiniciar"
      },
      {
          title: "Advertencia Final",
          description: "Una vez reiniciado el torneo, se borrará toda la programación. Los resultados de partidos ya jugados no se verán afectados.",
          action: "Entendido, reiniciar torneo"
      }
  ]

  useEffect(() => { setIsClient(true) }, []);

  const handleDrawButtonClick = () => {
      if(isTournamentStarted) {
          setResetAlertStep(1);
      } else {
          setIsDrawDialogOpen(true);
      }
  }

  const handleResetAlertNext = () => {
      if(resetAlertStep < resetAlerts.length) {
          setResetAlertStep(resetAlertStep + 1);
      } else {
          // All alerts confirmed, proceed with reset and open draw dialog
          setGeneratedMatches([]);
          setResetAlertStep(0);
          setIsDrawDialogOpen(true);
      }
  }
  
  const handleResetAlertCancel = () => {
      setResetAlertStep(0);
  }

  const generateMasterSchedule = (startDate: Date, playDays: Record<string, boolean>, dayConfigs: Record<string, { start: string; end: string }>, numberOfFields: number) => {
    
    const generateRoundRobinMatches = (teams: Team[], category: Category, group?: 'A' | 'B'): GeneratedMatch[] => {
        let matches: GeneratedMatch[] = [];
        let teamIds = teams.map(t => t.id);
        if (teamIds.length < 2) return [];

        if (teamIds.length % 2 !== 0) teamIds.push("BYE");

        const rounds = teamIds.length - 1;
        const half = teamIds.length / 2;

        for (let leg = 0; leg < 2; leg++) { // Two legs
            let currentTeams = [...teamIds];
            for (let i = 0; i < rounds; i++) {
                for (let j = 0; j < half; j++) {
                    let home, away;
                    if (leg === 0) {
                        home = currentTeams[j];
                        away = currentTeams[currentTeams.length - 1 - j];
                    } else {
                        away = currentTeams[j];
                        home = currentTeams[currentTeams.length - 1 - j];
                    }
                    if (home !== "BYE" && away !== "BYE") {
                        matches.push({ home, away, category, group });
                    }
                }
                const lastTeam = currentTeams.pop();
                if(lastTeam) currentTeams.splice(1, 0, lastTeam);
            }
        }
        return matches;
    };
    
    const enabledPlayDays = Object.keys(playDays).filter(day => playDays[day]).map(Number);
    if (enabledPlayDays.length === 0) return;

    let maximaMatches: GeneratedMatch[] = [];
    let primeraMatches: GeneratedMatch[] = [];
    let segundaMatches: GeneratedMatch[] = [];

    // Generate matches for each category
    const maximaTeams = getTeamsByCategory('Máxima');
    maximaTeams.sort(() => 0.5 - Math.random());
    maximaMatches = generateRoundRobinMatches(maximaTeams, 'Máxima');

    const primeraTeams = getTeamsByCategory('Primera');
    primeraTeams.sort(() => 0.5 - Math.random());
    primeraMatches = generateRoundRobinMatches(primeraTeams, 'Primera');

    let segundaTeams = getTeamsByCategory('Segunda');
    segundaTeams.sort(() => 0.5 - Math.random());
    if (segundaTeams.length >= 16) {
        const groupA = segundaTeams.slice(0, Math.ceil(segundaTeams.length / 2));
        const groupB = segundaTeams.slice(Math.ceil(segundaTeams.length / 2));
        groupA.forEach(t => t.group = 'A');
        groupB.forEach(t => t.group = 'B');
        segundaMatches = [
            ...generateRoundRobinMatches(groupA, 'Segunda', 'A'),
            ...generateRoundRobinMatches(groupB, 'Segunda', 'B')
        ];
    } else {
        segundaMatches = generateRoundRobinMatches(segundaTeams, 'Segunda');
    }

    // Prioritized match queue
    const matchQueue: GeneratedMatch[] = [...maximaMatches, ...primeraMatches, ...segundaMatches];
    let scheduledMatches: GeneratedMatch[] = [];
    let matchIndex = 0;
    
    let currentDate = new Date(startDate);

    while(matchIndex < matchQueue.length) {
        // Find the next available play day
        while (!enabledPlayDays.includes(currentDate.getDay())) {
            currentDate = addDays(currentDate, 1);
        }
        
        const dayOfWeek = currentDate.getDay();
        const config = dayConfigs[dayOfWeek];
        const [startHour, startMinute] = config.start.split(':').map(Number);
        const [endHour, endMinute] = config.end.split(':').map(Number);

        let matchTime = setMinutes(setHours(new Date(currentDate), startHour), startMinute);
        const endTime = setMinutes(setHours(new Date(currentDate), endHour), endMinute);

        // Schedule matches for the current day
        while (matchTime < endTime && matchIndex < matchQueue.length) {
            for (let field = 1; field <= numberOfFields && matchIndex < matchQueue.length; field++) {
                let matchToSchedule = matchQueue[matchIndex];
                
                scheduledMatches.push({
                    ...matchToSchedule,
                    date: new Date(matchTime),
                    time: format(matchTime, 'HH:mm'),
                    field
                });
                matchIndex++;
            }
             
            matchTime = addHours(matchTime, 2);
        }

        // Move to the next day
        currentDate = addDays(currentDate, 1);
    }
    
    setGeneratedMatches(scheduledMatches);
    setIsDrawDialogOpen(false);
    setIsSuccessDialogOpen(true);
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
                    variant={isTournamentStarted ? "destructive" : "outline"}
                    onClick={handleDrawButtonClick}
                  >
                    <Dices className="mr-2" />
                    {isTournamentStarted ? "Torneo Iniciado" : "Sorteo de Equipos"}
                </Button>
            </div>
        </Card>
      </div>

       <DrawDialog open={isDrawDialogOpen} onOpenChange={setIsDrawDialogOpen} onGenerate={generateMasterSchedule} />

        <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl text-primary">¡Felicidades!</DialogTitle>
                    <DialogDescription className="text-center text-lg">
                        Has iniciado el torneo.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        {resetAlerts.map((alert, index) => (
             <AlertDialog key={index} open={resetAlertStep === index + 1}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{alert.title}</AlertDialogTitle>
                        <AlertDialogDescription>{alert.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleResetAlertCancel}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetAlertNext}>{alert.action}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        ))}


      <Tabs defaultValue="copa" className="space-y-4">
        <TabsList>
          <TabsTrigger value="copa">Copa La Luz</TabsTrigger>
          <TabsTrigger value="maxima">Máxima</TabsTrigger>
          <TabsTrigger value="primera">Primera</TabsTrigger>
          <TabsTrigger value="segunda">Segunda</TabsTrigger>
        </TabsList>
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
    </div>
  );
}

