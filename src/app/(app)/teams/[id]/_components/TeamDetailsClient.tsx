

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Player, Team, Sanction, Match, Standing, Category } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Users, Calendar, ShieldAlert, BadgeInfo, Printer, List, LayoutGrid, DollarSign, Phone, User as UserIcon, BarChart3, TrendingUp, TrendingDown, Minus, Upload, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addPlayer, updateTeam } from '@/lib/mock-data';
import type { PlayerPosition, Person } from '@/lib/types';


const AddPlayerDialog = ({ team, onPlayerAdded }: { team: Team, onPlayerAdded: (newPlayer: Player) => void }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playerData, setPlayerData] = useState({
        name: '',
        idNumber: '',
        birthDate: '',
        jerseyNumber: '',
        position: '' as PlayerPosition | '',
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setPlayerData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setPlayerData(prev => ({ ...prev, [field]: value }));
    }

    const resetForm = () => {
        setPlayerData({ name: '', idNumber: '', birthDate: '', jerseyNumber: '', position: '' });
        setPhotoPreview(null);
    };

    const handleSave = async () => {
        if (!playerData.name || !playerData.idNumber || !playerData.birthDate || !playerData.jerseyNumber || !playerData.position || !photoPreview) {
            toast({
                title: 'Error de validación',
                description: 'Por favor, completa todos los campos, incluyendo la foto.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        try {
            const newPlayerData = {
                ...playerData,
                jerseyNumber: parseInt(playerData.jerseyNumber),
                teamId: team.id,
                team: team.name,
                category: team.category,
            };

            const newPlayer = await addPlayer(newPlayerData, photoPreview);

            toast({
                title: 'Jugador Agregado',
                description: `El jugador "${playerData.name}" ha sido agregado al equipo.`,
            });
            onPlayerAdded(newPlayer);
            resetForm();
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to add player:", error);
            toast({
                title: 'Error al guardar',
                description: 'No se pudo agregar el jugador. Por favor, inténtalo de nuevo.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            setIsOpen(open);
        }}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="mr-2 h-4 w-4" /> Agregar Jugador</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Jugador a {team.name}</DialogTitle>
                    <DialogDescription>Completa la información del nuevo integrante.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="space-y-2">
                        <Label>Foto del Jugador</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-24 h-24">
                                {photoPreview && <AvatarImage src={photoPreview} alt="Vista previa del jugador" />}
                                <AvatarFallback className="text-4xl"><UserIcon /></AvatarFallback>
                            </Avatar>
                            <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" value={playerData.name} onChange={handleChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="idNumber">Cédula</Label>
                        <Input id="idNumber" value={playerData.idNumber} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <Input id="birthDate" type="date" value={playerData.birthDate} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="jerseyNumber">Número de Camiseta</Label>
                            <Input id="jerseyNumber" type="number" value={playerData.jerseyNumber} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Posición</Label>
                            <Select onValueChange={(value) => handleSelectChange(value, 'position')} value={playerData.position}>
                                <SelectTrigger><SelectValue placeholder="Elegir..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Portero">Portero</SelectItem>
                                    <SelectItem value="Defensa">Defensa</SelectItem>
                                    <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                                    <SelectItem value="Delantero">Delantero</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Guardando...' : 'Guardar Jugador'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const InfoRow = ({ icon: Icon, label, person, showContact }: { icon: React.ElementType, label: string, person?: any, showContact: boolean }) => (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-1" />
        <div className="flex-grow">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">{person?.name || 'No asignado'}</p>
        </div>
        {showContact && person?.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Phone className="w-4 h-4" />
                <span>{person.phone}</span>
            </div>
        )}
    </div>
);

const PlayerCard = ({ player }: { player: Player }) => (
  <Card className="overflow-hidden text-center group">
    <div className="relative">
      <Image src={player.photoUrl} alt={player.name} width={200} height={250} className="w-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-300" data-ai-hint="player portrait" />
      <div className="absolute top-2 right-2 bg-background/80 text-foreground rounded-full h-10 w-10 flex items-center justify-center text-xl font-bold shadow-lg">
          {player.jerseyNumber}
      </div>
    </div>
    <CardHeader className="p-4">
      <CardTitle className="text-base truncate">{player.name}</CardTitle>
      <CardDescription>{player.position}</CardDescription>
    </CardHeader>
  </Card>
);

const RosterTab = ({ players }: { players: Player[] }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Plantilla del Equipo</CardTitle>
                    <CardDescription>Lista de todos los jugadores registrados en el equipo.</CardDescription>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}>
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}>
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
               {viewMode === 'grid' ? (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {players.map(player => <PlayerCard key={player.id} player={player} />)}
                </div>
               ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Jugador</TableHead>
                            <TableHead>Posición</TableHead>
                            <TableHead className="text-center">N°</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.map(player => (
                            <TableRow key={player.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={player.photoUrl} alt={player.name} data-ai-hint="player portrait" />
                                            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <span>{player.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{player.position}</TableCell>
                                <TableCell className="text-center font-mono">{player.jerseyNumber}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={player.status === 'activo' ? 'default' : 'destructive'}>{player.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
               )}
            </CardContent>
        </Card>
    );
};

const MatchesTab = ({ teamId, matches }: { teamId: string, matches: Match[] }) => {
    const sortedMatches = useMemo(() => 
        [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [matches]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Calendario y Resultados</CardTitle>
                <CardDescription>Próximos partidos y resultados anteriores del equipo.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Oponente</TableHead>
                            <TableHead>Resultado</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMatches.map(match => {
                            const isHome = match.teams.home.id === teamId;
                            const opponent = isHome ? match.teams.away : match.teams.home;
                            const score = match.status === 'finished' ? `${match.score?.home} - ${match.score?.away}` : '-';
                            const matchDate = useMemo(() => format(new Date(match.date), 'dd/MM/yyyy HH:mm', { locale: es }), [match.date]);

                            return (
                                 <TableRow key={match.id}>
                                    <TableCell>{matchDate}</TableCell>
                                    <TableCell>{opponent.name}</TableCell>
                                    <TableCell className="font-semibold">{score}</TableCell>
                                    <TableCell><Badge variant={match.status === 'finished' ? 'secondary' : 'default'}>{match.status}</Badge></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const SanctionsTab = ({ sanctions }: { sanctions: Sanction[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Sanciones y Suspensiones</CardTitle>
            <CardDescription>Registro disciplinario de los jugadores del equipo.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Jugador</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead className="text-center">Partidos Suspendido</TableHead>
                        <TableHead>Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sanctions.length > 0 ? sanctions.map(sanction => (
                        <TableRow key={sanction.id}>
                            <TableCell className="font-medium">
                                <Link href={`/players/${sanction.playerId}`} className="hover:underline text-primary">
                                    {sanction.playerName}
                                </Link>
                            </TableCell>
                            <TableCell>{sanction.reason}</TableCell>
                            <TableCell className="text-center">{sanction.gamesSuspended}</TableCell>
                            <TableCell>{format(new Date(sanction.date), 'dd/MM/yyyy', { locale: es })}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">No hay sanciones registradas para este equipo.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


const FinanceTab = ({ vocalPayments }: { vocalPayments: any[] }) => (
     <Card>
        <CardHeader>
            <CardTitle>Finanzas del Equipo</CardTitle>
            <CardDescription>Registro de pagos de vocalía y otras transacciones financieras.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                 <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Oponente</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                        <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vocalPayments.map((payment, i) => (
                        <TableRow key={i}>
                            <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy', { locale: es })}</TableCell>
                            <TableCell>
                                <Link href={`/teams/${payment.opponentId}`} className="hover:underline text-primary">
                                    {payment.opponent}
                                </Link>
                            </TableCell>
                            <TableCell className="text-right font-semibold">${payment.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'}>{payment.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const PerformanceChart = ({ teamId, matches }: { teamId: string, matches: Match[] }) => {
    const lastFive = useMemo(() => matches
        .filter(m => m.status === 'finished')
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .reverse(), [matches]);

    return (
        <div className="flex items-center justify-center gap-2">
            {lastFive.map((match, index) => {
                const isHome = match.teams.home.id === teamId;
                const homeScore = match.score?.home ?? 0;
                const awayScore = match.score?.away ?? 0;
                const isWin = (isHome && homeScore > awayScore) || (!isHome && awayScore > homeScore);
                const isDraw = homeScore === awayScore;
                
                let Icon = Minus;
                let color = 'text-yellow-500';

                if (isWin) {
                    Icon = TrendingUp;
                    color = 'text-green-500';
                } else if (!isDraw) {
                    Icon = TrendingDown;
                    color = 'text-red-500';
                }
                
                return (
                    <div key={index} className={cn("h-8 w-8 flex items-center justify-center rounded-full bg-muted", color)}>
                        <Icon className="h-5 w-5" />
                    </div>
                );
            })}
             {lastFive.length === 0 && (
                 <p className="text-sm text-muted-foreground">No hay partidos finalizados</p>
            )}
        </div>
    )
}

const EditTeamDialog = ({ team, onTeamUpdated }: { team: Team, onTeamUpdated: (updatedTeam: Team) => void }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [teamData, setTeamData] = useState<Team>(team);
    const [logoPreview, setLogoPreview] = useState<string | null>(team.logoUrl);

    useEffect(() => {
        setTeamData(team);
        setLogoPreview(team.logoUrl);
    }, [team, isOpen]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const [field, subField] = id.split('.');

        if (subField) {
            setTeamData(prev => ({
                ...prev,
                [field]: { ...(prev as any)[field], [subField]: value }
            }));
        } else {
            setTeamData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleDelegateChange = (index: number, field: 'name' | 'phone', value: string) => {
        setTeamData(prev => {
            const newDelegates = [...(prev.delegates || [])];
            while (newDelegates.length <= index) {
                newDelegates.push({ name: '' });
            }
            newDelegates[index] = { ...newDelegates[index], [field]: value };
            return { ...prev, delegates: newDelegates };
        });
    }

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedTeam = await updateTeam(teamData.id, teamData, logoPreview);
            toast({
                title: 'Equipo Actualizado',
                description: `La información de "${teamData.name}" ha sido guardada.`,
            });
            onTeamUpdated(updatedTeam);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update team:", error);
            toast({
                title: 'Error al actualizar',
                description: 'No se pudo guardar la información del equipo.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const DirectiveInput = ({ id, label, person }: { id: string, label: string, person?: Person }) => (
        <div>
            <Label>{label}</Label>
            <div className="grid grid-cols-2 gap-2">
                <Input id={`${id}.name`} placeholder="Nombre" value={person?.name || ''} onChange={handleChange} />
                <Input id={`${id}.phone`} placeholder="Teléfono" value={person?.phone || ''} onChange={handleChange} />
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary"><Edit className="mr-2 h-4 w-4" /> Editar Equipo</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Información del Equipo</DialogTitle>
                    <DialogDescription>Modifica los datos de la directiva y del equipo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label>Logo del Equipo</Label>
                        <div className="col-span-2 flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                {logoPreview && <AvatarImage src={logoPreview} alt={teamData.name} />}
                                <AvatarFallback className="text-2xl">{teamData.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} />
                        </div>
                    </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="name">Nombre del Equipo</Label>
                        <Input id="name" value={teamData.name} onChange={handleChange} className="col-span-2" />
                    </div>
                    <DirectiveInput id="president" label="Presidente/a" person={teamData.president} />
                    <DirectiveInput id="vicePresident" label="Vicepresidente/a" person={teamData.vicePresident} />
                    <DirectiveInput id="secretary" label="Secretario/a" person={teamData.secretary} />
                    <DirectiveInput id="treasurer" label="Tesorero/a" person={teamData.treasurer} />
                    <DirectiveInput id="vocal" label="Vocal Principal" person={teamData.vocal} />

                    <div>
                        <Label>Delegados</Label>
                        <div className="space-y-2 mt-1">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="grid grid-cols-[auto_1fr_1fr] items-center gap-2">
                                    <span>{index + 1}.</span>
                                    <Input placeholder="Nombre Delegado" value={teamData.delegates?.[index]?.name || ''} onChange={(e) => handleDelegateChange(index, 'name', e.target.value)} />
                                    <Input placeholder="Teléfono Delegado" value={teamData.delegates?.[index]?.phone || ''} onChange={(e) => handleDelegateChange(index, 'phone', e.target.value)} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export function TeamDetailsClient({
  team: initialTeam,
  players: initialPlayers,
  matches,
  teamStandings,
  teamSanctions,
  vocalPayments
}: {
  team: Team;
  players: Player[];
  matches: Match[];
  teamStandings?: Standing;
  teamSanctions: Sanction[];
  vocalPayments: any[];
}) {

  const { user } = useAuth();
  const [players, setPlayers] = useState(initialPlayers);
  const [team, setTeam] = useState(initialTeam);

  const activePlayers = useMemo(() => players.filter(p => p.status === 'activo'), [players]);

  const handlePlayerAdded = useCallback((newPlayer: Player) => {
    setPlayers(prev => [...prev, newPlayer]);
  }, []);
  
  const handleTeamUpdated = useCallback((updatedTeam: Team) => {
      setTeam(updatedTeam);
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <header className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="flex items-center gap-6">
          <Image
            src={team.logoUrl || 'https://placehold.co/128x128.png'}
            alt={`Logo de ${team.name}`}
            width={128}
            height={128}
            className="rounded-full border-4 border-primary shadow-lg"
            data-ai-hint="team logo"
          />
          <div>
            <Badge>{team.category}</Badge>
            <h2 className="text-4xl font-bold font-headline mt-1">{team.name}</h2>
            <p className="text-muted-foreground">{team.president?.name || 'Presidente no asignado'}</p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" asChild>
            <Link href={`/teams/${team.id}/roster`}>
                <Printer className="mr-2 h-4 w-4" /> Nómina
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/teams/${team.id}/info`}>
                <BadgeInfo className="mr-2 h-4 w-4" /> Directiva
            </Link>
          </Button>
          {user.permissions.teams.edit && (
            <>
              <EditTeamDialog team={team} onTeamUpdated={handleTeamUpdated} />
              <AddPlayerDialog team={team} onPlayerAdded={handlePlayerAdded} />
            </>
          )}
        </div>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Rendimiento del Equipo</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Posición en la Tabla</p>
                <p className="text-3xl font-bold mt-2">{teamStandings?.rank || 'N/A'}</p>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Puntos Totales</p>
                <p className="text-3xl font-bold mt-2">{teamStandings?.points || 0}</p>
            </div>
             <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Rendimiento (Últimos 5)</p>
                 <div className="mt-2 h-8 flex items-center justify-center">
                     <PerformanceChart teamId={team.id} matches={matches} />
                </div>
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="roster" className="w-full">
        <TabsList>
          <TabsTrigger value="roster"><Users className="mr-2" />Plantilla</TabsTrigger>
          <TabsTrigger value="matches"><Calendar className="mr-2" />Partidos</TabsTrigger>
          <TabsTrigger value="sanctions"><ShieldAlert className="mr-2" />Sanciones</TabsTrigger>
          <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
        </TabsList>
        <TabsContent value="roster" className="mt-4">
          <RosterTab players={activePlayers} />
        </TabsContent>
        <TabsContent value="matches" className="mt-4">
            <MatchesTab teamId={team.id} matches={matches} />
        </TabsContent>
        <TabsContent value="sanctions" className="mt-4">
          <SanctionsTab sanctions={teamSanctions} />
        </TabsContent>
        <TabsContent value="finances" className="mt-4">
            <FinanceTab vocalPayments={vocalPayments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
