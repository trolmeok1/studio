

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTeamsByCategory, Team, Category, getStandings } from '@/lib/mock-data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dices, RefreshCw, CalendarPlus, History, ClipboardList, Shield, Trophy, UserCheck, Filter, AlertTriangle, PartyPopper, CalendarDays, ChevronsRight, Home, Users as UsersIcon } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { GeneratedMatch, Standing } from '@/lib/types';
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
import { useAuth } from '@/hooks/useAuth';



const CategoryMatchCard = ({ match, getTeam }: { match: GeneratedMatch, getTeam: (id: string) => Team | undefined }) => {
    const homeTeam = getTeam(match.home);
    const awayTeam = getTeam(match.away);

    const getNeonColor = (category: Category) => {
        switch(category) {
            case 'Máxima': return 'purple';
            case 'Primera': return 'blue';
            case 'Segunda': return 'green';
            default: return 'none';
        }
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col text-card-foreground" neon={getNeonColor(match.category)}>
            <CardContent className="p-4 flex-grow flex flex-col justify-between gap-4 bg-gradient-to-br from-card to-primary/20">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-white">
                    {/* Team A */}
                    <div className="flex flex-col items-center gap-2">
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || ''} width={64} height={64} className="rounded-full bg-white/10 p-1" data-ai-hint="team logo" />
                        <p className="font-bold text-sm leading-tight">{homeTeam?.name}</p>
                        <p className="text-xs text-slate-300 -mt-1">Camerino {match.homeDressingRoom || 'N/A'}</p>
                    </div>

                    {/* Match Info */}
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-bold">{match.date ? format(match.date, 'HH:mm', { locale: es }) : 'VS'}</p>
                        <p className="text-xs text-slate-300">{match.date ? format(match.date, 'MMM d, yyyy', { locale: es }) : 'Por definir'}</p>
                        <Badge variant="secondary" className="mt-2 text-xs bg-black/30 text-white">
                           Por Jugar
                        </Badge>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-2">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || ''} width={64} height={64} className="rounded-full bg-white/10 p-1" data-ai-hint="team logo" />
                        <p className="font-bold text-sm leading-tight">{awayTeam?.name}</p>
                        <p className="text-xs text-slate-300 -mt-1">Camerino {match.awayDressingRoom || 'N/A'}</p>
                    </div>
                </div>
                 <div className="text-xs text-white/80 border-t border-white/20 pt-2 flex justify-between">
                    <span>Cancha: {match.field || 'N/A'}</span>
                    <span>Vocal: {getTeam(match.vocalTeamId || '')?.name || 'N/A'}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const GeneralMatchCard = ({ match, getTeam }: { match: GeneratedMatch, getTeam: (id: string) => Team | undefined }) => {
    const homeTeam = getTeam(match.home);
    const awayTeam = getTeam(match.away);
    const vocalTeam = getTeam(match.vocalTeamId || '');

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 bg-muted/50">
                <Badge variant="outline">{match.category} {match.group && `- Grupo ${match.group}`}</Badge>
                <div className="text-sm font-semibold">
                    {match.date ? format(match.date, 'HH:mm', { locale: es }) : 'Hora por definir'}
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                 <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <Link href={`/teams/${homeTeam?.id}`} className="flex flex-col items-center text-center gap-2">
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || ''} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-semibold text-sm">{homeTeam?.name}</p>
                    </Link>
                    <div className="flex items-center justify-center">
                        <span className="font-bold text-lg text-muted-foreground">VS</span>
                        <div className="w-px h-10 bg-border mx-4"></div>
                    </div>
                    <Link href={`/teams/${awayTeam?.id}`} className="flex flex-col items-center text-center gap-2">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || ''} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-semibold text-sm">{awayTeam?.name}</p>
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="p-3 bg-muted/20 border-t grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /> <span className="font-semibold">Cancha:</span> {match.field || 'N/A'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><UserCheck className="w-4 h-4" /> <span className="font-semibold">Vocal:</span> {vocalTeam?.name || 'N/A'}</div>
                <div className="flex items-center gap-2 text-muted-foreground col-span-2"><Home className="w-4 h-4" /> <span className="font-semibold">Camerinos:</span> {match.homeDressingRoom}/{match.awayDressingRoom}</div>
            </CardFooter>
        </Card>
    );
};


const DrawSettingsDialog = ({ onGenerate, title, description }: { onGenerate: (settings: any) => void, title: string, description: string }) => {
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
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
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
    const [allTeams, setAllTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const maxima = await getTeamsByCategory('Máxima');
            const primera = await getTeamsByCategory('Primera');
            const segunda = await getTeamsByCategory('Segunda');
            setAllTeams([...maxima, ...primera, ...segunda]);
        }
        fetchTeams();
    }, [])

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


const ScheduleView = ({ generatedMatches, selectedCategory, groupBy }: { generatedMatches: GeneratedMatch[], selectedCategory: Category | 'all', groupBy: 'date' | 'round' }) => {
    const [isClient, setIsClient] = useState(false);
    const [allTeams, setAllTeams] = useState<Team[]>([]);

    useEffect(() => { 
        setIsClient(true);
        const fetchTeams = async () => {
            const maxima = await getTeamsByCategory('Máxima');
            const primera = await getTeamsByCategory('Primera');
            const segunda = await getTeamsByCategory('Segunda');
            setAllTeams([...maxima, ...primera, ...segunda]);
        }
        fetchTeams();
    }, []);
    
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
            const dateA = a.date ? a.date.getTime() : Infinity;
            const dateB = b.date ? b.date.getTime() : Infinity;
            if (dateA !== dateB) return dateA - dateB;
            
            const timeA = a.time || '';
            const timeB = b.time || '';
            if (timeA !== timeB) return timeA.localeCompare(timeB);
            
            const roundA = a.round || 0;
            const roundB = b.round || 0;
            return roundA - roundB;
        });

        return sortedMatches
            .reduce((acc, match) => {
                 if (groupBy === 'date' && !match.date) return acc;
                 if (groupBy === 'round' && !match.round) return acc;

                const groupKey = groupBy === 'date'
                    ? (match.date ? format(match.date, 'PPPP', { locale: es }) : 'Fecha por definir')
                    : `Fecha ${match.round || 'N/A'}`;
                
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(match);
                return acc;
            }, {} as Record<string, GeneratedMatch[]>);
    }, [filteredMatches, isClient, groupBy]);

    const CardComponent = groupBy === 'date' ? GeneralMatchCard : CategoryMatchCard;
    const gridColsClass = groupBy === 'date' ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendario {selectedCategory === 'all' ? 'General' : selectedCategory}</CardTitle>
                <CardDescription>Vista unificada de todos los partidos programados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-6">
                 {Object.entries(groupedMatches)
                    .map(([groupKey, matchesInGroup]) => (
                    <div key={groupKey}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{groupKey}</h3>
                         <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                            {matchesInGroup.map((match, index) => 
                                <CardComponent key={`${match.home}-${match.away}-${index}`} match={match} getTeam={getTeam} />
                            )}
                        </div>
                    </div>
                ))}
                 {Object.keys(groupedMatches).length === 0 && (
                     <p className="text-muted-foreground text-center py-8">No hay partidos para mostrar en esta vista.</p>
                )}
            </CardContent>
        </Card>
    );
};

const RescheduledMatchesView = ({ matches }: { matches: GeneratedMatch[] }) => {
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    useEffect(() => {
        const fetchTeams = async () => {
            const maxima = await getTeamsByCategory('Máxima');
            const primera = await getTeamsByCategory('Primera');
            const segunda = await getTeamsByCategory('Segunda');
            setAllTeams([...maxima, ...primera, ...segunda]);
        }
        fetchTeams();
    }, [])
    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    const rescheduledMatches = matches.filter(m => m.rescheduled);

    return (
        <Card neon="blue">
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
                                        {match.originalDate ? format(new Date(match.originalDate), 'PPP, p', { locale: es }) : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {match.date ? format(new Date(match.date), 'PPP, p', { locale: es }) : 'N/A'}
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

const FinalsView = ({ finals, getTeam }: { finals: GeneratedMatch[], getTeam: (id: string) => Team | undefined }) => {
    if (finals.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>Aún no se han generado las finales.</p>
                <p>Completa todos los partidos de la temporada regular y luego usa el botón "Generar Finales".</p>
            </div>
        );
    }
    
    const FinalsCard = ({ match, title }: { match: GeneratedMatch, title: string }) => {
        const homeTeam = getTeam(match.home);
        const awayTeam = getTeam(match.away);
        
        return (
             <Card className="text-center" neon="purple">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around">
                     <div className="flex flex-col items-center gap-2">
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || ''} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-bold">{homeTeam?.name}</p>
                        <p className="text-xs text-muted-foreground">Camerino {match.homeDressingRoom || 'N/A'}</p>
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground">VS</span>
                     <div className="flex flex-col items-center gap-2">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || ''} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-bold">{awayTeam?.name}</p>
                        <p className="text-xs text-muted-foreground">Camerino {match.awayDressingRoom || 'N/A'}</p>
                    </div>
                </CardContent>
                <CardFooter className="p-3 bg-muted/50 text-xs text-muted-foreground">
                    {match.date ? format(new Date(match.date), 'PPP, p', { locale: es }) : 'Fecha y Hora por definir'}
                </CardFooter>
            </Card>
        )
    }

    const semiFinals = finals.filter(f => f.leg === 'Semifinal');
    const maximaFinal = finals.find(f => f.category === 'Máxima' && f.leg === 'Final');
    const primeraFinal = finals.find(f => f.category === 'Primera' && f.leg === 'Final');
    const segundaFinal = finals.find(f => f.category === 'Segunda' && f.leg === 'Final');

    return (
        <div className="space-y-8">
            {semiFinals.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4">Semifinales - Segunda Categoría</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {semiFinals.map((match, i) => (
                            <FinalsCard key={i} match={match} title={`Semifinal ${i+1}`} />
                        ))}
                    </div>
                </div>
            )}
            
             <div>
                <h3 className="text-2xl font-bold text-center mb-4">Finales</h3>
                 <div className="space-y-6">
                    {maximaFinal && <FinalsCard match={maximaFinal} title="Gran Final - Máxima Categoría" />}
                    {primeraFinal && <FinalsCard match={primeraFinal} title="Gran Final - Primera Categoría" />}
                    {segundaFinal && <FinalsCard match={segundaFinal} title="Final por el Ascenso - Segunda Categoría" />}
                </div>
            </div>
        </div>
    );
};

const ResetDialog = ({
  step,
  onStepChange,
  onConfirm,
}: {
  step: number;
  onStepChange: (step: number) => void;
  onConfirm: () => void;
}) => {
  if (step === 0) return null;

  const content = [
    {
      title: '¿Estás seguro de finalizar el torneo?',
      description: 'Esta acción reiniciará todo el estado del torneo, incluyendo calendarios y equipos de copa. Es ideal para empezar una nueva temporada y no se puede deshacer.',
      confirmText: 'Sí, entiendo los riesgos',
    },
    {
      title: 'ÚLTIMA ADVERTENCIA',
      description: 'Al hacer clic en "FINALIZAR TORNEO", los datos se eliminarán para siempre. Esta es tu última oportunidad para cancelar.',
      confirmText: 'FINALIZAR TORNEO',
    },
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
            className={cn(step === 2 && buttonVariants({ variant: 'destructive' }))}
            onClick={() => (step < 2 ? onStepChange(step + 1) : onConfirm())}
          >
            {currentContent.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};


export default function SchedulePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [generatedMatches, setGeneratedMatches] = useState<GeneratedMatch[]>([]);
  const [isDrawLeagueDialogOpen, setIsDrawLeagueDialogOpen] = useState(false);
  const [isDrawFinalsDialogOpen, setIsDrawFinalsDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [finalizeAlertStep, setFinalizeAlertStep] = useState(0);
  const [activeTab, setActiveTab] = useState('general');
  const [finalMatches, setFinalMatches] = useState<GeneratedMatch[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => { 
      setIsClient(true);
      const fetchData = async () => {
        const maxima = await getTeamsByCategory('Máxima');
        const primera = await getTeamsByCategory('Primera');
        const segunda = await getTeamsByCategory('Segunda');
        setAllTeams([...maxima, ...primera, ...segunda]);
        const standingsData = await getStandings();
        setStandings(standingsData);
      }
      fetchData();
  }, []);
  
  const getTeam = useCallback((id: string) => allTeams.find(t => t.id === id), [allTeams]);


  const isTournamentGenerated = useMemo(() => generatedMatches.length > 0, [generatedMatches]);
  const areAllMatchesFinished = isTournamentGenerated; 
  

  const generateLeagueSchedule = async (settings: any) => {
    const generateRoundRobinMatches = (teams: Team[], category: Category, group?: 'A' | 'B'): GeneratedMatch[] => {
        let currentTeams = [...teams];
        if (currentTeams.length % 2 !== 0) {
            const dummyTeam: Team = { id: 'dummy', name: 'Descansa', logoUrl: '', category: category, group };
            currentTeams.push(dummyTeam);
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
        
        return [...idaMatches, ...vueltaMatches];
    };
    
    let allMatches: GeneratedMatch[] = [];
    const maximaTeams = await getTeamsByCategory('Máxima');
    const primeraTeams = await getTeamsByCategory('Primera');
    const segundaTeams = await getTeamsByCategory('Segunda');
    
    const categoriesConfig: {category: Category; teams: Team[], isGrouped: boolean}[] = [
        { category: 'Máxima', teams: maximaTeams, isGrouped: false },
        { category: 'Primera', teams: primeraTeams, isGrouped: false },
        { category: 'Segunda', teams: segundaTeams, isGrouped: segundaTeams.length >= 16 }
    ];

    categoriesConfig.forEach(cat => {
        if(cat.isGrouped) {
             const groupA = cat.teams.filter(t => t.group === 'A');
             const groupB = cat.teams.filter(t => t.group === 'B');
             if (groupA.length > 1) allMatches.push(...generateRoundRobinMatches(groupA, cat.category, 'A'));
             if (groupB.length > 1) allMatches.push(...generateRoundRobinMatches(groupB, cat.category, 'B'));
        } else {
            const teams = cat.teams;
            if (teams.length > 1) {
                allMatches.push(...generateRoundRobinMatches(teams, cat.category));
            }
        }
    });

    const matchesByRound = allMatches.reduce((acc, match) => {
        const round = match.round || 0;
        if (!acc[round]) {
            acc[round] = [];
        }
        acc[round].push(match);
        return acc;
    }, {} as Record<number, GeneratedMatch[]>);
    
    let scheduledMatches: GeneratedMatch[] = [];
    let currentDate = startOfDay(settings.startDate);
    const allTeamIdsForVocal = [...new Set(allMatches.flatMap(m => [m.home, m.away]))];
    const sortedRounds = Object.keys(matchesByRound).map(Number).sort((a,b) => a - b);
    
    let dressingRoomCursor = 0;

    for (const round of sortedRounds) {
        let roundMatches = [...matchesByRound[round]].sort(() => Math.random() - 0.5);
        let matchesForCurrentDate = 0;
        
        while(roundMatches.length > 0) {
            const dayOfWeek = getDay(currentDate);

            if(settings.gameDays.includes(dayOfWeek)) {
                 const availableSlotsToday = settings.gameTimes.length * settings.numFields;

                for (let i = 0; i < availableSlotsToday && roundMatches.length > 0; i++) {
                    const timeIndex = Math.floor(matchesForCurrentDate / settings.numFields) % settings.gameTimes.length;
                    const fieldIndex = matchesForCurrentDate % settings.numFields;

                    const match = roundMatches.shift()!;
                    const teamsPlayingInSlot = new Set([match.home, match.away]);
                    const eligibleVocalTeams = allTeamIdsForVocal.filter(id => !teamsPlayingInSlot.has(id));
                    const vocalTeamId = eligibleVocalTeams[Math.floor(Math.random() * eligibleVocalTeams.length)];
                    
                    const time = settings.gameTimes[timeIndex];
                    const timeParts = time.split(':');
                    const matchDateTime = setMinutes(setHours(currentDate, parseInt(timeParts[0])), parseInt(timeParts[1]));
                    
                    const numDressingRooms = settings.numDressingRooms;
                    const homeDressingRoom = (dressingRoomCursor % numDressingRooms) + 1;
                    const awayDressingRoom = ((dressingRoomCursor + 2) % numDressingRooms) + 1;
                    dressingRoomCursor = (dressingRoomCursor + 1) % numDressingRooms;
                    

                    scheduledMatches.push({
                       ...match,
                       date: matchDateTime,
                       time: format(matchDateTime, 'HH:mm'),
                       field: fieldIndex + 1,
                       homeDressingRoom: homeDressingRoom,
                       awayDressingRoom: awayDressingRoom,
                       vocalTeamId: vocalTeamId
                    });

                    matchesForCurrentDate++;
                }
            }

            if(roundMatches.length > 0) {
              currentDate = addDays(currentDate, 1);
              matchesForCurrentDate = 0;
            }
        }
        currentDate = addDays(currentDate, 1);
        matchesForCurrentDate = 0;
        dressingRoomCursor = 0; // Reset for the new round/week
    }

    setGeneratedMatches(scheduledMatches);
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
    setIsDrawLeagueDialogOpen(true);
  }
  
  const handleFinalizeTournament = () => {
    setGeneratedMatches([]);
    setFinalMatches([]);
    setFinalizeAlertStep(0);
    toast({ title: '¡Torneo Finalizado!', description: 'Todos los datos de la temporada han sido reiniciados.'});
  };

   const handleGenerateFinals = () => {
        let finals: GeneratedMatch[] = [];

        const getTopTeams = (category: Category, group?: 'A' | 'B') => {
            return standings
                .filter(s => {
                    const team = getTeam(s.teamId);
                    return team?.category === category && (group ? team.group === group : true);
                })
                .slice(0, 2);
        };
        
        const maximaTeams = getTopTeams('Máxima');
        if (maximaTeams.length === 2) {
            finals.push({ home: maximaTeams[0].teamId, away: maximaTeams[1].teamId, category: 'Máxima', leg: 'Final' });
        }

        const primeraTeams = getTopTeams('Primera');
        if (primeraTeams.length === 2) {
            finals.push({ home: primeraTeams[0].teamId, away: primeraTeams[1].teamId, category: 'Primera', leg: 'Final' });
        }
        
        const groupATeams = getTopTeams('Segunda', 'A');
        const groupBTeams = getTopTeams('Segunda', 'B');
        
        if (groupATeams.length >= 2 && groupBTeams.length >= 2) {
            finals.push({ home: groupATeams[0].teamId, away: groupBTeams[1].teamId, category: 'Segunda', leg: 'Semifinal' });
            finals.push({ home: groupBTeams[0].teamId, away: groupATeams[1].teamId, category: 'Segunda', leg: 'Semifinal' });
            finals.push({ home: groupATeams[0].teamId, away: groupBTeams[0].teamId, category: 'Segunda', leg: 'Final' });
        }
        
        setFinalMatches(finals);
        setIsDrawFinalsDialogOpen(true);
    };

    const scheduleFinals = (settings: any) => {
        let scheduledFinals: GeneratedMatch[] = [];
        let currentDate = startOfDay(settings.startDate);
        let matchesForCurrentDate = 0;
        let dressingRoomCursor = 0;
        
        const allFinalTeams = [...new Set(finalMatches.flatMap(m => [m.home, m.away]))];


        for (const match of finalMatches) {
             let dayFound = false;
             while(!dayFound) {
                 const dayOfWeek = getDay(currentDate);
                 if(settings.gameDays.includes(dayOfWeek)) {
                     dayFound = true;
                 } else {
                     currentDate = addDays(currentDate, 1);
                 }
             }
            
            const timeIndex = matchesForCurrentDate % settings.gameTimes.length;
            const fieldIndex = Math.floor(matchesForCurrentDate / settings.gameTimes.length) % settings.numFields;
            
            const time = settings.gameTimes[timeIndex];
            const timeParts = time.split(':');
            const matchDateTime = setMinutes(setHours(currentDate, parseInt(timeParts[0])), parseInt(timeParts[1]));

            const teamsPlayingInSlot = new Set([match.home, match.away]);
            const eligibleVocalTeams = allFinalTeams.filter(id => !teamsPlayingInSlot.has(id));
            const vocalTeamId = eligibleVocalTeams.length > 0 ? eligibleVocalTeams[Math.floor(Math.random() * eligibleVocalTeams.length)] : allTeams[Math.floor(Math.random() * allTeams.length)].id;

            const numDressingRooms = settings.numDressingRooms;
            const homeDressingRoom = (dressingRoomCursor % numDressingRooms) + 1;
            const awayDressingRoom = ((dressingRoomCursor + 2) % numDressingRooms) + 1;
            dressingRoomCursor = (dressingRoomCursor + 1) % numDressingRooms;

            scheduledFinals.push({
                ...match,
                date: matchDateTime,
                time: format(matchDateTime, 'HH:mm'),
                field: fieldIndex + 1,
                homeDressingRoom,
                awayDressingRoom,
                vocalTeamId
            });

            matchesForCurrentDate++;
        }

        setFinalMatches(scheduledFinals);
        setActiveTab('finals');
        toast({ title: 'Fase Final Programada', description: 'Los partidos de las finales han sido agendados.' });
    }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
             <div className="text-center w-full">
                <h2 className="text-4xl font-extrabold tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-blue-500 to-sky-400 text-transparent bg-clip-text">
                    Programación de Partidos
                  </span>
                </h2>
            </div>
            {user.permissions.schedule.edit && !isTournamentGenerated && (
                <Card className="p-2 bg-card/50">
                    <div className="flex items-center gap-2">
                        <Button onClick={handleDrawButtonClick}>
                            <Dices className="mr-2" />
                            Sorteo de Liga
                        </Button>
                    </div>
                </Card>
            )}
             {user.permissions.schedule.edit && isTournamentGenerated && (
                <Card className="p-2 bg-card/50">
                    <div className="flex items-center gap-2">
                         <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(true)}>
                            <CalendarPlus className="mr-2" />
                            Reagendar Partido
                        </Button>
                        <Button variant="destructive" onClick={() => setFinalizeAlertStep(1)}>
                            <Trophy className="mr-2" />
                            Finalizar Torneo
                        </Button>
                    </div>
                </Card>
            )}
        </div>

        <Dialog open={isDrawLeagueDialogOpen} onOpenChange={setIsDrawLeagueDialogOpen}>
            <DrawSettingsDialog 
                onGenerate={generateLeagueSchedule}
                title="Configuración de Programación de Liga"
                description="Define los parámetros para generar el calendario de partidos."
            />
        </Dialog>
         <Dialog open={isDrawFinalsDialogOpen} onOpenChange={setIsDrawFinalsDialogOpen}>
            <DrawSettingsDialog 
                onGenerate={scheduleFinals}
                title="Configuración de Programación de Finales"
                description="Define los parámetros para agendar las semifinales y finales."
            />
        </Dialog>

        
        <RescheduleDialog 
            allMatches={generatedMatches}
            open={isRescheduleDialogOpen}
            onOpenChange={setIsRescheduleDialogOpen}
            onReschedule={handleReschedule}
        />
        
        {!isTournamentGenerated && !user.permissions.schedule.edit ? (
            <Card className="h-96 flex flex-col items-center justify-center text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Torneo en Preparación</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        El calendario aún no ha sido generado. <br/> ¡Mantente atento para futuras actualizaciones!
                    </p>
                </CardContent>
            </Card>
        ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="maxima">Máxima</TabsTrigger>
                    <TabsTrigger value="primera">Primera</TabsTrigger>
                    <TabsTrigger value="segunda">Segunda</TabsTrigger>
                    {isTournamentGenerated && <TabsTrigger value="rescheduled"><History className="mr-2"/>Reagendados</TabsTrigger>}
                    {isTournamentGenerated && <TabsTrigger value="finals"><Trophy className="mr-2"/>Fase Final</TabsTrigger>}
                </TabsList>
                <TabsContent value="general">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="all" groupBy="date" />
                </TabsContent>
                <TabsContent value="maxima">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Máxima" groupBy="round" />
                </TabsContent>
                <TabsContent value="primera">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Primera" groupBy="round" />
                </TabsContent>
                <TabsContent value="segunda">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Segunda" groupBy="round" />
                </TabsContent>
                <TabsContent value="rescheduled">
                    <RescheduledMatchesView matches={generatedMatches} />
                </TabsContent>
                <TabsContent value="finals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Fase Final del Torneo</CardTitle>
                            <CardDescription>Partidos de eliminación directa para definir a los campeones.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {finalMatches.length === 0 && areAllMatchesFinished && user.permissions.schedule.edit && (
                                <div className="text-center py-10">
                                    <p className="text-muted-foreground mb-4">La temporada regular ha concluido. ¡Es hora de definir a los campeones!</p>
                                    <Button onClick={handleGenerateFinals}>
                                        <Trophy className="mr-2"/>
                                        Generar Finales
                                    </Button>
                                </div>
                            )}
                            <FinalsView finals={finalMatches} getTeam={getTeam} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        )}
        
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
    
