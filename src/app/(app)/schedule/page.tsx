

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { standings as mockStandings, getTeamsByCategory, Team, Category } from '@/lib/mock-data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dices, RefreshCw, CalendarPlus, History, ClipboardList, Shield, Trophy, UserCheck, Filter, AlertTriangle, PartyPopper, CalendarDays, ChevronsRight, Home, Users as UsersIcon } from 'lucide-react';
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
import { Calendar as CalendarIcon, Users } from 'lucide-react';
import { format, addDays, setHours, setMinutes, getDay, startOfDay, parse, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';



const GeneralMatchCard = ({ match, getTeam }: { match: GeneratedMatch, getTeam: (id: string) => Team | undefined }) => {
    const homeTeam = getTeam(match.home);
    const awayTeam = getTeam(match.away);
    const vocalTeam = getTeam(match.vocalTeamId || '');

    const TeamDisplay = ({ team, dressingRoom }: { team?: Team, dressingRoom?: number }) => (
         <div className="flex flex-col items-center text-center gap-1">
            <Image src={team?.logoUrl || 'https://placehold.co/100x100.png'} alt={team?.name || ''} width={40} height={40} className="rounded-full" />
            <p className="text-xs font-semibold leading-tight">{team?.name}</p>
             {dressingRoom && <Badge variant="secondary" className="text-xs mt-1">Camerino {dressingRoom}</Badge>}
        </div>
    );

    const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="w-3.5 h-3.5" />
            <span className="font-semibold">{label}:</span>
            <span className="text-foreground text-right flex-1 truncate">{value}</span>
        </div>
    );

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <CardHeader className="p-2 bg-muted/50 text-center text-sm font-bold">
                <div className="flex justify-center items-center gap-2">
                    <span>{match.date ? format(match.date, 'HH:mm', { locale: es }) : 'Por definir'}</span>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3">
                    <TeamDisplay team={homeTeam} dressingRoom={match.homeDressingRoom} />
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-bold">VS</p>
                        <Badge variant="outline" className="mt-1">Por Jugar</Badge>
                    </div>
                    <TeamDisplay team={awayTeam} dressingRoom={match.awayDressingRoom} />
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-muted/20 border-t grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="space-y-1">
                     <p className="text-xs font-bold">{match.leg} - Fecha {match.round}</p>
                     <p className="text-xs text-muted-foreground">{match.category}</p>
                </div>
                 <div className="flex flex-col items-end gap-1">
                     <DetailRow icon={Shield} label="Cancha" value={match.field || 'N/A'} />
                    <DetailRow icon={UsersIcon} label="Vocalía" value={vocalTeam?.name || 'N/A'} />
                 </div>
            </CardFooter>
        </Card>
    );
};


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
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer p-0 relative overflow-hidden text-white">
                <div className="absolute inset-0 flex z-0">
                    <div className="w-1/2 bg-gray-700"></div>
                    <div className="w-1/2 bg-red-800 animate-pulse"></div>
                </div>
                <CardContent className="p-4 flex items-center justify-between relative z-10">
                    <div className="flex flex-col items-center gap-2 w-2/5 text-center">
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || 'Home'} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
                        <span className="font-bold text-sm text-center truncate">{homeTeam?.name || match.home}</span>
                    </div>

                    <div className="text-center w-1/5">
                        <span className="text-2xl font-bold">VS</span>
                        <p className="text-xs">{match.time}</p>
                        <p className="text-xs">{match.date ? format(match.date, 'dd/MM/yy', { locale: es }) : ''}</p>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-2/5 text-center">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || 'Away'} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
                        <span className="font-bold text-sm text-center truncate">{awayTeam?.name || 'Away'}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

const CategoryScheduleView = ({ category, generatedMatches }: { category: Category, generatedMatches: GeneratedMatch[] }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true) }, []);

    const groupedMatchesByRound = useMemo(() => {
        if (!isClient) return {};

        const categoryMatches = generatedMatches.filter(m => m.category === category && (category !== 'Segunda' || m.group === 'A' || m.group === 'B'));
        
        return categoryMatches.reduce((acc, match) => {
            const roundKey = `Fecha ${match.round || 0}`;
            if (!acc[roundKey]) {
                acc[roundKey] = [];
            }
            acc[roundKey].push(match);
            return acc;
        }, {} as Record<string, GeneratedMatch[]>);
    }, [generatedMatches, category, isClient]);

    if (generatedMatches.length === 0) {
        return <p className="text-muted-foreground text-center py-8">Genere el calendario para ver los partidos de esta categoría.</p>
    }

    return (
        <div className="space-y-6 mt-4">
            {Object.entries(groupedMatchesByRound)
                .sort(([roundA], [roundB]) => parseInt(roundA.split(' ')[1]) - parseInt(roundB.split(' ')[1]))
                .map(([round, matches]) => (
                    <div key={round}>
                        <h3 className="text-xl font-bold mb-3">{round}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matches
                                .sort((a,b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0))
                                .map((match, index) => <CategoryMatchCard key={index} match={match} />)
                            }
                        </div>
                    </div>
            ))}
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
                        <TabsTrigger value="standings">Tabla de Posiciones</TabsTrigger>
                    </TabsList>
                    <TabsContent value="schedule">
                         <CategoryScheduleView category={category} generatedMatches={generatedMatches} />
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
                <DialogTitle>Configuración de Programación de Liga</DialogTitle>
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
    
    const allTeams = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda'),
    ], []);
    const getTeam = useCallback((id: string) => allTeams.find(t => t.id === id), [allTeams]);

    const filteredMatches = useMemo(() => {
        if (selectedCategory === 'all') {
            return generatedMatches;
        }
        return generatedMatches.filter(m => m.category === selectedCategory);
    }, [generatedMatches, selectedCategory]);

    const groupedMatches = useMemo(() => {
        if (filteredMatches.length === 0 || !isClient) return {};

        const sortedMatches = [...filteredMatches].sort((a, b) => {
            const dateA = a.date ? a.date.getTime() : 0;
            const dateB = b.date ? b.date.getTime() : 0;
            if (dateA !== dateB) return dateA - dateB;
            
            const roundA = a.round || 0;
            const roundB = b.round || 0;
            return roundA - roundB;
        });

        return sortedMatches
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
                    .map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {matchesOnDate.sort((a,b) => (a.time || "").localeCompare(b.time || "")).map((match, index) => 
                                <GeneralMatchCard key={`${match.home}-${match.away}-${index}`} match={match} getTeam={getTeam} />
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const RescheduledMatchesView = ({ matches }: { matches: GeneratedMatch[] }) => {
    const allTeams = useMemo(() => [
        ...getTeamsByCategory('Máxima'),
        ...getTeamsByCategory('Primera'),
        ...getTeamsByCategory('Segunda')
    ], []);
    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    const rescheduledMatches = matches.filter(m => m.rescheduled);

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

export default function SchedulePage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);
  const [isDrawLeagueDialogOpen, setIsDrawLeagueDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [finalizeAlertStep, setFinalizeAlertStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const allTeams = useMemo(() => [...getTeamsByCategory('Máxima'), ...getTeamsByCategory('Primera'), ...getTeamsByCategory('Segunda')], []);
  const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;


  const isTournamentStarted = generatedMatches.length > 0;
  
  useEffect(() => { setIsClient(true) }, []);

  const scheduleMatches = (matchesToSchedule: GeneratedMatch[], settings: { startDate: Date, gameDays: number[], gameTimes: string[], numFields: number, numDressingRooms: number }) => {
    let scheduledMatches: GeneratedMatch[] = [];
    const matchQueue = [...matchesToSchedule];
    
    let currentDate = startOfDay(settings.startDate);
    
    let dressingRoomCounter = 0;

    const allTeamsForVocal = [...new Set(matchesToSchedule.flatMap(m => [m.home, m.away]))]
        .map(id => allTeams.find(t => t.id === id))
        .filter(Boolean) as Team[];

    while(matchQueue.length > 0) {
        const dayOfWeek = getDay(currentDate);
        if(settings.gameDays.includes(dayOfWeek)) {
            for (const time of settings.gameTimes) {
                 if (matchQueue.length === 0) break;
                 const matchesInSlot = matchQueue.splice(0, settings.numFields);
                 const teamsPlayingInSlot = new Set(matchesInSlot.flatMap(m => [m.home, m.away]));

                 const eligibleVocalTeams = allTeamsForVocal.filter(t => !teamsPlayingInSlot.has(t.id));
                 const vocalTeam = eligibleVocalTeams[Math.floor(Math.random() * eligibleVocalTeams.length)];

                 matchesInSlot.forEach((match, fieldIndex) => {
                     const field = fieldIndex + 1;
                     const timeParts = time.split(':');
                     const matchDateTime = setMinutes(setHours(currentDate, parseInt(timeParts[0])), parseInt(timeParts[1]));
                     
                     const homeDressingRoom = (dressingRoomCounter % settings.numDressingRooms) + 1;
                     dressingRoomCounter++;
                     const awayDressingRoom = (dressingRoomCounter % settings.numDressingRooms) + 1;
                     dressingRoomCounter++;


                     scheduledMatches.push({
                        ...match,
                        date: matchDateTime,
                        time: format(matchDateTime, 'HH:mm'),
                        field: field,
                        homeDressingRoom: homeDressingRoom,
                        awayDressingRoom: awayDressingRoom,
                        vocalTeamId: vocalTeam?.id
                    });
                 });
            }
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
        const vueltaMatches = idaMatches.map(m => ({...m, home: m.away, away: m.home, leg: 'Vuelta' as 'Vuelta', round: m.round ? m.round + numRounds : undefined }));
        
        return { ida: idaMatches, vuelta: vueltaMatches };
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
            const { ida, vuelta } = generateRoundRobinMatches(teams, cat.category, cat.group);
            allMatches.push(...ida, ...vuelta);
        }
    });
    
    allMatches.sort(() => 0.5 - Math.random());
    
    const scheduled = scheduleMatches(allMatches, settings);
    setGeneratedMatches(scheduled);
    setIsSuccessDialogOpen(true);
};

  
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
  };


  const handleDrawButtonClick = () => {
      if (isTournamentStarted) {
          setIsRescheduleDialogOpen(true);
      } else {
         setIsDrawLeagueDialogOpen(true);
      }
  }
  
  const handleFinalizeTournament = () => {
    setGeneratedMatches([]);
    setFinalizeAlertStep(0);
    toast({ title: '¡Torneo Finalizado!', description: 'Todos los datos de la temporada han sido reiniciados.'});
  };


    const ResetDialog = ({ step, onStepChange, onConfirm }: { step: number, onStepChange: (step: number) => void, onConfirm: () => void }) => {
        if (step === 0) return null;
        
        const content = [
            {
                title: "¿Estás seguro de finalizar el torneo?",
                description: "Esta acción reiniciará todo el estado del torneo, incluyendo calendarios y equipos de copa. Es ideal para empezar una nueva temporada y no se puede deshacer.",
                confirmText: "Sí, entiendo los riesgos"
            },
            {
                title: "Confirmación Adicional",
                description: "Estás a un paso de realizar una acción irreversible. Esta es tu segunda advertencia.",
                confirmText: "Sí, estoy completamente seguro"
            },
            {
                title: "ÚLTIMA ADVERTENCIA",
                description: "Al hacer clic en \"FINALIZAR TORNEO\", los datos se eliminarán para siempre. Esta es tu última oportunidad para cancelar.",
                confirmText: "FINALIZAR TORNEO"
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
             <div className="text-center w-full">
                <h2 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                        Programación de Partidos
                    </span>
                </h2>
            </div>
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
                        <Button variant="destructive" onClick={() => setFinalizeAlertStep(1)}>
                            <Trophy className="mr-2" />
                            Finalizar Torneo
                        </Button>
                    )}
                </div>
            </Card>
        </div>

        <Dialog open={isDrawLeagueDialogOpen} onOpenChange={setIsDrawLeagueDialogOpen}>
            <DrawSettingsDialog onGenerate={generateLeagueSchedule} />
        </Dialog>

        
        <RescheduleDialog 
            allMatches={generatedMatches}
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
            onReschedule={handleReschedule}
        />
        
        <Tabs defaultValue="general" className="space-y-4">
             <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
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
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <GeneralScheduleView generatedMatches={generatedMatches} selectedCategory={selectedCategory} />
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
                <RescheduledMatchesView matches={generatedMatches} />
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
        
        <ResetDialog step={finalizeAlertStep} onStepChange={setFinalizeAlertStep} onConfirm={handleFinalizeTournament} />

    </div>
  );
}

