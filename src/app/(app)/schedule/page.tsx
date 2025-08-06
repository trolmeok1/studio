
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTeamsByCategory, Team, Category, getStandings, type Standing, getTeams, addMatch, deleteMatch, getMatches, updateMatchData, resetAllStandings, clearAllSanctions, deleteCopa, clearAllMatches } from '@/lib/mock-data';
import { Button, buttonVariants } from '@/components/ui/button';
import { Dices, RefreshCw, CalendarPlus, History, ClipboardList, Shield, Trophy, UserCheck, Filter, AlertTriangle, PartyPopper, CalendarDays, ChevronsRight, Home, Users as UsersIcon } from 'lucide-react';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { GeneratedMatch, Match } from '@/lib/types';
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


const CategoryMatchCard = ({ match, getTeam }: { match: Match, getTeam: (id: string) => Team | undefined }) => {
    const homeTeam = getTeam(match.teams.home.id);
    const awayTeam = getTeam(match.teams.away.id);
    const vocalTeam = getTeam(match.vocalTeam?.id || '');

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
                    </div>

                    {/* Match Info */}
                    <div className="flex flex-col items-center">
                        <p className="text-xl font-bold">{match.date ? format(new Date(match.date), 'HH:mm', { locale: es }) : 'VS'}</p>
                        <p className="text-xs text-slate-300">{match.date ? format(new Date(match.date), 'MMM d, yyyy', { locale: es }) : 'Por definir'}</p>
                        <Badge variant="secondary" className="mt-2 text-xs bg-black/30 text-white">
                           Por Jugar
                        </Badge>
                    </div>

                    {/* Team B */}
                    <div className="flex flex-col items-center gap-2">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || ''} width={64} height={64} className="rounded-full bg-white/10 p-1" data-ai-hint="team logo" />
                        <p className="font-bold text-sm leading-tight">{awayTeam?.name}</p>
                    </div>
                </div>
                 <div className="text-xs text-white/80 border-t border-white/20 pt-2 flex justify-between">
                    <span>Cancha: {match.field || 'N/A'}</span>
                    <span>Vocal: {vocalTeam?.name || 'N/A'}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const GeneralMatchCard = ({ match, getTeam }: { match: Match, getTeam: (id: string) => Team | undefined }) => {
    const homeTeam = getTeam(match.teams.home.id);
    const awayTeam = getTeam(match.teams.away.id);
    const vocalTeam = getTeam(match.vocalTeam?.id || '');

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between p-3 bg-muted/50">
                <Badge variant="outline">{match.category} {homeTeam?.group && `- Grupo ${homeTeam.group}`}</Badge>
                <div className="text-sm font-semibold">
                    {match.date ? format(new Date(match.date), 'HH:mm', { locale: es }) : 'Hora por definir'}
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
            </CardFooter>
        </Card>
    );
};


const DrawSettingsDialog = ({ onGenerate, title, description }: { onGenerate: (settings: any) => void, title: string, description: string }) => {
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
            gameTimes: gameTimes.filter(t => t).sort(), // Filter out empty time slots and sort them
            numFields,
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

const RescheduleDialog = ({ allMatches, open, onOpenChange, onReschedule, allTeams }: { allMatches: Match[], open: boolean, onOpenChange: (open: boolean) => void, onReschedule: (match: Match, newDate: Date) => void, allTeams: Team[] }) => {
    const [selectedMatchId, setSelectedMatchId] = useState<string | undefined>();
    const [newDate, setNewDate] = useState<Date | undefined>();
    const [newTime, setNewTime] = useState<string>('');

    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    
    const occupiedSlots = useMemo(() => {
        if (!newDate) return [];
        const dateStr = format(newDate, 'yyyy-MM-dd');
        return allMatches
            .filter(m => m.date && format(new Date(m.date), 'yyyy-MM-dd') === dateStr)
            .map(m => m.date ? format(new Date(m.date), 'HH:mm') : null)
            .filter(Boolean) as string[];
    }, [newDate, allMatches]);

    const handleConfirmReschedule = () => {
        if (!selectedMatchId || !newDate || !newTime) return;
        const matchToReschedule = allMatches.find(m => m.id === selectedMatchId);
        if (matchToReschedule) {
            const [hours, minutes] = newTime.split(':').map(Number);
            const finalDate = setMinutes(setHours(startOfDay(newDate), hours), minutes);
            onReschedule(matchToReschedule, finalDate);
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
                                {allMatches.filter(match => match.teams).map((match) => (
                                    <SelectItem key={match.id} value={match.id}>
                                        {getTeamName(match.teams.home.id)} vs {getTeamName(match.teams.away.id)}
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


const ScheduleView = ({ generatedMatches, selectedCategory, groupBy, allTeams }: { generatedMatches: Match[], selectedCategory: Category | 'all', groupBy: 'date' | 'round', allTeams: Team[] }) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);
    
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
            const dateA = a.date ? new Date(a.date).getTime() : Infinity;
            const dateB = b.date ? new Date(b.date).getTime() : Infinity;
            if (dateA !== dateB) return dateA - dateB;
            
            const timeA = a.date ? format(new Date(a.date), 'HH:mm') : '';
            const timeB = b.date ? format(new Date(b.date), 'HH:mm') : '';
            return timeA.localeCompare(timeB);
        });

        return sortedMatches
            .reduce((acc, match) => {
                 if (groupBy === 'date' && !match.date) return acc;
                const groupKey = groupBy === 'date'
                    ? (match.date ? format(new Date(match.date), 'PPPP', { locale: es }) : 'Fecha por definir')
                    : `Jornada (Aún no implementado)`;
                
                if (!acc[groupKey]) {
                    acc[groupKey] = [];
                }
                acc[groupKey].push(match);
                return acc;
            }, {} as Record<string, Match[]>);
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
                            {matchesInGroup.map((match) => 
                                <CardComponent key={match.id} match={match} getTeam={getTeam} />
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

const RescheduledMatchesView = ({ matches, allTeams }: { matches: Match[], allTeams: Team[] }) => {
    const getTeamName = (teamId: string) => allTeams.find(t => t.id === teamId)?.name || teamId;
    const rescheduledMatches = matches.filter(m => m.physicalSheetUrl?.includes('rescheduled')); // Placeholder for rescheduled flag

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
                            {rescheduledMatches.map((match) => (
                                <TableRow key={match.id}>
                                    <TableCell className="font-medium">{getTeamName(match.teams.home.id)} vs {getTeamName(match.teams.away.id)}</TableCell>
                                    <TableCell>
                                        {'N/A'}
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

const FinalsView = ({ finals, getTeam }: { finals: Match[], getTeam: (id: string) => Team | undefined }) => {
    if (finals.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>Aún no se han generado las finales.</p>
                <p>Completa todos los partidos de la temporada regular y luego usa el botón "Generar Finales".</p>
            </div>
        );
    }
    
    const FinalsCard = ({ match, title }: { match: Match, title: string }) => {
        const homeTeam = getTeam(match.teams.home.id);
        const awayTeam = getTeam(match.teams.away.id);
        
        return (
             <Card className="text-center" neon="purple">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-around">
                     <div className="flex flex-col items-center gap-2">
                        <Image src={homeTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={homeTeam?.name || ''} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-bold">{homeTeam?.name}</p>
                    </div>
                    <span className="text-2xl font-bold text-muted-foreground">VS</span>
                     <div className="flex flex-col items-center gap-2">
                        <Image src={awayTeam?.logoUrl || 'https://placehold.co/100x100.png'} alt={awayTeam?.name || ''} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <p className="font-bold">{awayTeam?.name}</p>
                    </div>
                </CardContent>
                <CardFooter className="p-3 bg-muted/50 text-xs text-muted-foreground">
                    {match.date ? format(new Date(match.date), 'PPP, p', { locale: es }) : 'Fecha y Hora por definir'}
                </CardFooter>
            </Card>
        )
    }

    const semiFinals = finals.filter(f => f.category === 'Copa');
    const maximaFinal = finals.find(f => f.category === 'Máxima');
    const primeraFinal = finals.find(f => f.category === 'Primera');
    const segundaFinal = finals.find(f => f.category === 'Segunda');

    return (
        <div className="space-y-8">
            {semiFinals.length > 0 && (
                <div>
                    <h3 className="text-2xl font-bold text-center mb-4">Semifinales - Segunda Categoría</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {semiFinals.map((match) => (
                            <FinalsCard key={match.id} match={match} title={`Semifinal ${semiFinals.indexOf(match) + 1}`} />
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
  const [generatedMatches, setGeneratedMatches] = useState<Match[]>([]);
  const [isDrawLeagueDialogOpen, setIsDrawLeagueDialogOpen] = useState(false);
  const [isDrawFinalsDialogOpen, setIsDrawFinalsDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [finalizeAlertStep, setFinalizeAlertStep] = useState(0);
  const [activeTab, setActiveTab] = useState('general');
  const [finalMatches, setFinalMatches] = useState<Match[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadData = useCallback(async () => {
    setIsLoading(true);
    const teams = await getTeams();
    setAllTeams(teams);
    const matches = await getMatches();
    setGeneratedMatches(matches.filter(m => m.category !== 'Copa'));
    setFinalMatches(matches.filter(m => m.category === 'Copa'));
    setIsLoading(false);
  }, []);

  useEffect(() => { 
    loadData();
  }, [loadData]);
  
  const getTeam = useCallback((id: string) => allTeams.find(t => t.id === id), [allTeams]);

  const isTournamentGenerated = useMemo(() => generatedMatches.length > 0, [generatedMatches]);
  
  const rescheduledMatchesCount = useMemo(() => {
    return generatedMatches.filter(m => m.physicalSheetUrl?.includes('rescheduled')).length; // Placeholder
  }, [generatedMatches]);

  const areAllMatchesFinished = isTournamentGenerated; 
  
  const generateLeagueSchedule = async (settings: any) => {
    const teamsMaxima = await getTeamsByCategory('Máxima');
    const teamsPrimera = await getTeamsByCategory('Primera');
    const teamsSegunda = await getTeamsByCategory('Segunda');

    const generateRoundRobinMatches = (teams: Team[], category: Category, group?: 'A' | 'B'): Omit<Match, 'id' | 'date'>[] => {
        let currentTeams = [...teams];
        if (currentTeams.length % 2 !== 0) {
            currentTeams.push({ id: 'dummy', name: 'Descansa', logoUrl: '', category: category, group });
        }

        const numTeams = currentTeams.length;
        const numRounds = numTeams - 1;
        let idaMatches: Omit<Match, 'id' | 'date'>[] = [];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < numTeams / 2; i++) {
                const team1 = currentTeams[i];
                const team2 = currentTeams[numTeams - 1 - i];

                if (team1.id !== 'dummy' && team2.id !== 'dummy') {
                    const baseMatch = { 
                        category, 
                        status: 'future' as const, 
                        events: [],
                        teams: {
                            home: { id: team1.id, name: team1.name, logoUrl: team1.logoUrl, attended: false },
                            away: { id: team2.id, name: team2.name, logoUrl: team2.logoUrl, attended: false }
                        }
                    };
                    idaMatches.push(baseMatch);
                }
            }
            const lastTeam = currentTeams.pop();
            if (lastTeam) {
                currentTeams.splice(1, 0, lastTeam);
            }
        }
        const vueltaMatches = idaMatches.map((m) => ({
            ...m, 
            teams: { home: m.teams.away, away: m.teams.home } 
        }));
        
        return [...idaMatches, ...vueltaMatches];
    };
    
    let allMatchData: Omit<Match, 'id'|'date'>[] = [];
    const categoriesConfig: {category: Category, isGrouped: boolean, teams: Team[]}[] = [
        { category: 'Máxima', isGrouped: false, teams: teamsMaxima },
        { category: 'Primera', isGrouped: false, teams: teamsPrimera },
        { category: 'Segunda', isGrouped: teamsSegunda.length >= 16, teams: teamsSegunda }
    ];

    categoriesConfig.forEach(cat => {
        if(cat.isGrouped) {
             const groupA = cat.teams.filter(t => t.group === 'A');
             const groupB = cat.teams.filter(t => t.group === 'B');
             if (groupA.length > 1) allMatchData.push(...generateRoundRobinMatches(groupA, cat.category, 'A'));
             if (groupB.length > 1) allMatchData.push(...generateRoundRobinMatches(groupB, cat.category, 'B'));
        } else {
            const teams = cat.teams;
            if (teams.length > 1) {
                allMatchData.push(...generateRoundRobinMatches(teams, cat.category));
            }
        }
    });

    let currentDate = startOfDay(settings.startDate);
    const allTeamIdsForVocal = allTeams.map(t => t.id);
    let scheduledMatches: Match[] = [];
    
    for (const matchData of allMatchData) {
        let dayFound = false;
        while(!dayFound) {
            const dayOfWeek = getDay(currentDate);
            if(settings.gameDays.includes(dayOfWeek)) {
                dayFound = true;
            } else {
                currentDate = addDays(currentDate, 1);
            }
        }
        const time = settings.gameTimes[scheduledMatches.filter(m => m.date && format(new Date(m.date), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')).length % settings.gameTimes.length];
        const [hours, minutes] = time.split(':').map(Number);
        const matchDateTime = setMinutes(setHours(currentDate, hours), minutes);
        
        const newMatch = await addMatch({ ...matchData, date: matchDateTime.toISOString() });
        scheduledMatches.push(newMatch);
    }

    await loadData();
    setIsSuccessDialogOpen(true);
};

  
  const handleReschedule = async (matchToUpdate: Match, newDate: Date) => {
    const updatedData: Partial<Match> = {
        date: newDate.toISOString(),
        // ToDo: Add originalDate logic for tracking
    };
    await updateMatchData(matchToUpdate.id, updatedData);
    await loadData();
    toast({ title: 'Partido Reagendado', description: 'La fecha del partido ha sido actualizada.'});
  };

  const handleDrawButtonClick = () => {
    setIsDrawLeagueDialogOpen(true);
  }
  
  const handleFinalizeTournament = async () => {
    setIsLoading(true);
    try {
        await clearAllMatches();
        await resetAllStandings();
        await clearAllSanctions();
        await deleteCopa();

        toast({
            title: '¡Temporada Finalizada!',
            description: 'Se han reiniciado partidos, tablas de posiciones y sanciones.',
        });
        
        setGeneratedMatches([]);
        setFinalMatches([]);
        await loadData();

    } catch (error) {
        console.error("Failed to finalize tournament:", error);
        toast({ title: 'Error', description: 'No se pudo finalizar el torneo.', variant: 'destructive'});
    } finally {
        setFinalizeAlertStep(0);
        setIsLoading(false);
    }
  };

   const handleGenerateFinals = async () => {
        let finals: Omit<Match, 'id'|'date'>[] = [];
        const standings = await getStandings();

        const getTopTeams = (category: Category, group?: 'A' | 'B') => {
            return standings
                .filter(s => {
                    const team = getTeam(s.teamId);
                    return team?.category === category && (group ? team.group === group : true);
                })
                .sort((a,b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst))
                .slice(0, 2);
        };
        
        const createMatchObject = (homeTeam: Team, awayTeam: Team, category: Category): Omit<Match, 'id' | 'date'> => ({
            category,
            status: 'future',
            events: [],
            teams: {
                home: { id: homeTeam.id, name: homeTeam.name, logoUrl: homeTeam.logoUrl, attended: false },
                away: { id: awayTeam.id, name: awayTeam.name, logoUrl: awayTeam.logoUrl, attended: false }
            }
        });

        const maximaTeams = getTopTeams('Máxima').map(s => getTeam(s.teamId)).filter(t => t) as Team[];
        if (maximaTeams.length === 2) {
            finals.push(createMatchObject(maximaTeams[0], maximaTeams[1], 'Copa'));
        }

        const primeraTeams = getTopTeams('Primera').map(s => getTeam(s.teamId)).filter(t => t) as Team[];
        if (primeraTeams.length === 2) {
            finals.push(createMatchObject(primeraTeams[0], primeraTeams[1], 'Copa'));
        }
        
        const groupATeams = getTopTeams('Segunda', 'A').map(s => getTeam(s.teamId)).filter(t => t) as Team[];
        const groupBTeams = getTopTeams('Segunda', 'B').map(s => getTeam(s.teamId)).filter(t => t) as Team[];
        
        if (groupATeams.length >= 2 && groupBTeams.length >= 2) {
            finals.push(createMatchObject(groupATeams[0], groupBTeams[1], 'Copa'));
            finals.push(createMatchObject(groupBTeams[0], groupATeams[1], 'Copa'));
            finals.push(createMatchObject(groupATeams[0], groupBTeams[0], 'Copa'));
        }
        
        const addedFinals = [];
        for (const finalData of finals) {
            const newFinal = await addMatch({ ...finalData, date: new Date().toISOString() });
            addedFinals.push(newFinal);
        }
        
        setFinalMatches(addedFinals);
        setIsDrawFinalsDialogOpen(true);
    };

    const scheduleFinals = async (settings: any) => {
        let currentDate = startOfDay(settings.startDate);
        let scheduledMatches: Match[] = [];

        for (const match of finalMatches) {
            let dayFound = false;
            while (!dayFound) {
                const dayOfWeek = getDay(currentDate);
                if (settings.gameDays.includes(dayOfWeek)) {
                    dayFound = true;
                } else {
                    currentDate = addDays(currentDate, 1);
                }
            }
            
            const time = settings.gameTimes[scheduledMatches.length % settings.gameTimes.length];
            const [hours, minutes] = time.split(':').map(Number);
            const matchDateTime = setMinutes(setHours(currentDate, hours), minutes);

            await updateMatchData(match.id, { date: matchDateTime.toISOString() });
        }
        
        await loadData();
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
            allTeams={allTeams}
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
                    {isTournamentGenerated && rescheduledMatchesCount > 0 && <TabsTrigger value="rescheduled"><History className="mr-2"/>Reagendados</TabsTrigger>}
                    {isTournamentGenerated && finalMatches.length > 0 && <TabsTrigger value="finals"><Trophy className="mr-2"/>Fase Final</TabsTrigger>}
                </TabsList>
                <TabsContent value="general">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="all" groupBy="date" allTeams={allTeams} />
                </TabsContent>
                <TabsContent value="maxima">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Máxima" groupBy="date" allTeams={allTeams} />
                </TabsContent>
                <TabsContent value="primera">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Primera" groupBy="date" allTeams={allTeams} />
                </TabsContent>
                <TabsContent value="segunda">
                    <ScheduleView generatedMatches={generatedMatches} selectedCategory="Segunda" groupBy="date" allTeams={allTeams} />
                </TabsContent>
                {rescheduledMatchesCount > 0 &&
                    <TabsContent value="rescheduled">
                        <RescheduledMatchesView matches={generatedMatches} allTeams={allTeams} />
                    </TabsContent>
                }
                {finalMatches.length > 0 &&
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
                }
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
