
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTeamsByCategory, Team, Category } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { GeneratedMatch } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, Trophy, CalendarPlus } from 'lucide-react';
import { format, addDays, setHours, setMinutes, getDay, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const DrawCopaSettingsDialog = ({ onGenerate }: { onGenerate: (settings: any) => void }) => {
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
                <DialogTitle>Configuración de Programación de Copa</DialogTitle>
                <DialogDescription>Define los parámetros para generar el calendario de partidos de la copa.</DialogDescription>
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
                    <Button onClick={handleSubmit}>Programar Partidos</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};


export default function CopaPage() {
    const { toast } = useToast();
    const [copaTeams, setCopaTeams] = useState<Team[]>([]);
    const [copaMatches, setCopaMatches] = useState<GeneratedMatch[]>([]);
    const [isCopaSettingsDialogOpen, setIsCopaSettingsDialogOpen] = useState(false);
    const [isDrawCopaDialogOpen, setIsDrawCopaDialogOpen] = useState(false);

    const getTeamName = useCallback((teamId: string) => {
        const allTeams = [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')];
        return allTeams.find(t => t.id === teamId)?.name || teamId;
    }, []);

    const scheduleCopaMatches = (settings: any) => {
        // Dummy scheduling logic, replace with actual logic
        const scheduled = copaMatches.filter(m => !m.date).map((match, index) => {
            const date = addDays(new Date(settings.startDate), Math.floor(index / settings.gameTimes.length));
            const time = settings.gameTimes[index % settings.gameTimes.length];
            const [hours, minutes] = time.split(':').map(Number);
            const matchDateTime = setMinutes(setHours(startOfDay(date), hours), minutes);

            return {
                ...match,
                date: matchDateTime,
                time: format(matchDateTime, 'HH:mm'),
            }
        });
        
        setCopaMatches(prev => {
            const updated = [...prev];
            scheduled.forEach(sMatch => {
                const index = updated.findIndex(uMatch => uMatch.home === sMatch.home && uMatch.away === sMatch.away && uMatch.leg === sMatch.leg);
                if (index !== -1) {
                    updated[index] = sMatch;
                }
            });
            return updated;
        });

        setIsDrawCopaDialogOpen(false);
        toast({ title: "Partidos de Copa Programados", description: "El calendario de la copa ha sido generado." });
    }

    const handleCopaSettings = ({ teams }: { teams: Team[] }) => {
        setCopaTeams(teams);
        let shuffledTeams = [...teams].sort(() => 0.5 - Math.random());

        let matches: GeneratedMatch[] = [];
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            if (shuffledTeams[i + 1]) {
                matches.push({ home: shuffledTeams[i].id, away: shuffledTeams[i + 1].id, category: 'Copa', leg: 'Ida', round: 1 });
                matches.push({ home: shuffledTeams[i + 1].id, away: shuffledTeams[i].id, category: 'Copa', leg: 'Vuelta', round: 1 });
            }
        }
        setCopaMatches(matches);
        setIsCopaSettingsDialogOpen(false);
    }
    
    const unscheduledCopaMatches = useMemo(() => copaMatches.filter(m => !m.date).length, [copaMatches]);


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <h2 className="text-3xl font-bold tracking-tight font-headline">
                Copa La Luz
            </h2>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Bracket del Torneo - Copa La Luz</CardTitle>
                        <CardDescription>Torneo de eliminación directa con los equipos seleccionados.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isCopaSettingsDialogOpen} onOpenChange={setIsCopaSettingsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Trophy className="mr-2" />
                                    Configurar Copa
                                </Button>
                            </DialogTrigger>
                            <CopaSettingsDialog onGenerate={handleCopaSettings} />
                        </Dialog>
                        {copaTeams.length > 0 && unscheduledCopaMatches > 0 && (
                             <Dialog open={isDrawCopaDialogOpen} onOpenChange={setIsDrawCopaDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <CalendarPlus className="mr-2" />
                                        Programar Partidos ({unscheduledCopaMatches})
                                    </Button>
                                </DialogTrigger>
                                <DrawCopaSettingsDialog onGenerate={scheduleCopaMatches} />
                            </Dialog>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <CopaBracket teams={copaTeams} />
                    {copaMatches.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Partidos de Copa Programados</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {copaMatches.sort((a,b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0)).map((match, i) => (
                                    <Card key={i} className="p-3">
                                        <p className="font-semibold">{getTeamName(match.home)} vs {getTeamName(match.away)}</p>
                                        <p className="text-sm text-muted-foreground">{match.leg}</p>
                                         <p className="text-xs text-muted-foreground mt-2">{match.date ? format(match.date, 'PPP p', {locale: es}) : 'Por programar'}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
