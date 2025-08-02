
'use client';

import { useState, useEffect } from 'react';
import { getTeamById, getPlayersByTeamId, type Player, type Team, type PlayerPosition, upcomingMatches, type Person } from '@/lib/mock-data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Users, Calendar, BarChart2, ShieldAlert, BadgeInfo, Building, CalendarClock, UserSquare, AlertTriangle, DollarSign, Upload, FileText, Phone, User as UserIcon, Printer, Pencil, List, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialNewPlayerState = {
    id: '',
    name: '',
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: undefined as Date | undefined,
    position: '' as PlayerPosition | '',
    jerseyNumber: '',
    status: 'activo' as 'activo' | 'inactivo',
    statusReason: '',
    photoUrl: 'https://placehold.co/400x400.png',
    idCardUrl: 'https://placehold.co/856x540.png',
};

const PlayerEditDialog = ({ player, team, onSave, children }: { player: Partial<typeof initialNewPlayerState>, team: Team, onSave: (player: Player) => void, children: React.ReactNode }) => {
    const [editedPlayer, setEditedPlayer] = useState({
        ...initialNewPlayerState,
        ...player,
        firstName: player.name?.split(' ')[0] || '',
        lastName: player.name?.split(' ').slice(1).join(' ') || '',
        birthDate: player.birthDate ? new Date(player.birthDate) : undefined,
    });
    const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);

    const handleSave = () => {
        if (editedPlayer.firstName && editedPlayer.lastName && editedPlayer.position && editedPlayer.birthDate) {
            const playerData: Player = {
                id: editedPlayer.id || `p${Date.now()}`,
                name: `${editedPlayer.firstName} ${editedPlayer.lastName}`,
                position: editedPlayer.position as PlayerPosition,
                team: team.name,
                teamId: team.id,
                category: team.category,
                photoUrl: editedPlayer.photoUrl,
                stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
                idNumber: editedPlayer.idNumber,
                birthDate: editedPlayer.birthDate.toISOString().split('T')[0],
                jerseyNumber: parseInt(editedPlayer.jerseyNumber) || 0,
                status: editedPlayer.status,
                statusReason: editedPlayer.statusReason,
                idCardUrl: editedPlayer.idCardUrl,
            };
            onSave(playerData);
            setIsPlayerDialogOpen(false);
            if (!player.id) { // Reset only if it's a new player
                setEditedPlayer(initialNewPlayerState);
            }
        }
    };

    return (
        <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{player.id ? `Editar Jugador` : `Agregar Nuevo Jugador a ${team.name}`}</DialogTitle>
                    <DialogDescription>
                        {player.id ? `Actualiza los datos de ${player.name}.` : 'Completa los datos del jugador. Los campos de la cédula solo serán visibles para administradores.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="firstName">Nombres</Label>
                        <Input id="firstName" value={editedPlayer.firstName} onChange={(e) => setEditedPlayer({ ...editedPlayer, firstName: e.target.value })} placeholder="Nombres" />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input id="lastName" value={editedPlayer.lastName} onChange={(e) => setEditedPlayer({ ...editedPlayer, lastName: e.target.value })} placeholder="Apellidos" />
                    </div>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="idNumber">Número de Cédula</Label>
                    <Input id="idNumber" value={editedPlayer.idNumber} onChange={(e) => setEditedPlayer({ ...editedPlayer, idNumber: e.target.value })} placeholder="1234567890" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !editedPlayer.birthDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editedPlayer.birthDate ? format(editedPlayer.birthDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarPicker
                                    mode="single"
                                    selected={editedPlayer.birthDate}
                                    onSelect={(date) => setEditedPlayer({ ...editedPlayer, birthDate: date })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="jerseyNumber">No. Camiseta</Label>
                        <Input id="jerseyNumber" type="number" value={editedPlayer.jerseyNumber} onChange={(e) => setEditedPlayer({ ...editedPlayer, jerseyNumber: e.target.value })} placeholder="10" />
                     </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Posición</Label>
                     <Select onValueChange={(value) => setEditedPlayer({ ...editedPlayer, position: value as PlayerPosition })} value={editedPlayer.position}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una posición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portero">Portero</SelectItem>
                        <SelectItem value="Defensa">Defensa</SelectItem>
                        <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                        <SelectItem value="Delantero">Delantero</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                        <Label htmlFor="photoUrl">Foto de Perfil</Label>
                        <div className="flex items-center gap-2">
                            <Input id="photoUrl" type="file" className="flex-grow" />
                            <Button variant="ghost" size="icon"><Upload className="h-5 w-5"/></Button>
                        </div>
                  </div>
                   <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-dashed">
                        <Label htmlFor="idCardUrl">Cédula Completa (Administrativo)</Label>
                         <div className="flex items-center gap-2">
                            <Input id="idCardUrl" type="file" className="flex-grow" />
                             <Button variant="ghost" size="icon"><FileText className="h-5 w-5"/></Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Imagen rectangular. Visible solo para administradores.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado del Jugador</Label>
                    <RadioGroup
                        value={editedPlayer.status}
                        onValueChange={(value: 'activo' | 'inactivo') => setEditedPlayer({ ...editedPlayer, status: value })}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="activo" id="status-active" />
                            <Label htmlFor="status-active">Entrante (Activo)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inactivo" id="status-inactive" />
                            <Label htmlFor="status-inactive">Saliente (Inactivo)</Label>
                        </div>
                    </RadioGroup>
                    </div>
                    {editedPlayer.status === 'inactivo' && (
                        <div className="space-y-2">
                            <Label htmlFor="statusReason">Razón de Salida</Label>
                            <Textarea
                                id="statusReason"
                                value={editedPlayer.statusReason}
                                onChange={(e) => setEditedPlayer({ ...editedPlayer, statusReason: e.target.value })}
                                placeholder="Ej: Transferencia a otro club, retiro, etc."
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleSave} type="submit">{player.id ? "Guardar Cambios" : "Guardar Jugador"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const EditTeamDialog = ({ team, onSave }: { team: Team, onSave: (updatedTeam: Team) => void }) => {
    const [editedTeam, setEditedTeam] = useState(team);

    const handleDirectiveChange = (role: keyof typeof editedTeam, field: 'name' | 'phone', value: string) => {
        if (typeof editedTeam[role] === 'object' && editedTeam[role] !== null && 'name' in (editedTeam[role] as any)) {
            setEditedTeam({
                ...editedTeam,
                [role]: { ...(editedTeam[role] as Person), [field]: value }
            });
        }
    };
    
    const handleDelegateChange = (index: number, field: 'name' | 'phone', value: string) => {
        const updatedDelegates = [...(editedTeam.delegates || [])];
        updatedDelegates[index] = { ...updatedDelegates[index], [field]: value };
        setEditedTeam({ ...editedTeam, delegates: updatedDelegates });
    };

    return (
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Editar Información del Club</DialogTitle>
                <DialogDescription>
                    Actualice los datos del equipo y su directiva.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-6">
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Equipo</Label>
                        <Input id="name" value={editedTeam.name} onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo del Equipo</Label>
                        <div className="flex items-center gap-2">
                            <Input id="logoUrl" type="file" className="flex-grow" />
                            <Button variant="ghost" size="icon"><Upload className="h-5 w-5"/></Button>
                        </div>
                    </div>
                    
                    <h4 className="font-semibold text-lg border-t pt-4 mt-4">Directiva</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Presidente</Label>
                            <Input placeholder="Nombre" value={editedTeam.president?.name} onChange={(e) => handleDirectiveChange('president', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={editedTeam.president?.phone} onChange={(e) => handleDirectiveChange('president', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vicepresidente</Label>
                            <Input placeholder="Nombre" value={editedTeam.vicePresident?.name} onChange={(e) => handleDirectiveChange('vicePresident', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={editedTeam.vicePresident?.phone} onChange={(e) => handleDirectiveChange('vicePresident', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Secretario/a</Label>
                            <Input placeholder="Nombre" value={editedTeam.secretary?.name} onChange={(e) => handleDirectiveChange('secretary', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={editedTeam.secretary?.phone} onChange={(e) => handleDirectiveChange('secretary', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Tesorero/a</Label>
                            <Input placeholder="Nombre" value={editedTeam.treasurer?.name} onChange={(e) => handleDirectiveChange('treasurer', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={editedTeam.treasurer?.phone} onChange={(e) => handleDirectiveChange('treasurer', 'phone', e.target.value)} />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Vocal Principal</Label>
                            <Input placeholder="Nombre" value={editedTeam.vocal?.name} onChange={(e) => handleDirectiveChange('vocal', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Teléfono</Label>
                            <Input placeholder="099..." value={editedTeam.vocal?.phone} onChange={(e) => handleDirectiveChange('vocal', 'phone', e.target.value)} />
                        </div>
                    </div>

                    <h4 className="font-semibold text-lg border-t pt-4 mt-4">Delegados</h4>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Delegado {index + 1}</Label>
                                <Input placeholder="Nombre" value={editedTeam.delegates?.[index]?.name || ''} onChange={(e) => handleDelegateChange(index, 'name', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input placeholder="099..." value={editedTeam.delegates?.[index]?.phone || ''} onChange={(e) => handleDelegateChange(index, 'phone', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <Button onClick={() => onSave(editedTeam)} className="w-full mt-4">Guardar Cambios</Button>
        </DialogContent>
    );
};


export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';
  const { user } = useAuth();
  const canEdit = user.role === 'admin';

  const [team, setTeam] = useState<Team | undefined>(undefined);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [rosterView, setRosterView] = useState<'cards' | 'list'>('cards');

  useEffect(() => {
    setIsClient(true);
    const fetchedTeam = getTeamById(teamId);
    if (fetchedTeam) {
      setTeam(fetchedTeam);
      setPlayers(getPlayersByTeamId(teamId));
    }
  }, [teamId]);
  
  const handleUpdateTeam = (updatedTeam: Team) => {
    setTeam(updatedTeam);
    // Here you would also update the global state/DB
    setIsTeamDialogOpen(false);
  };

  const handleSavePlayer = (playerData: Player) => {
    setPlayers(prevPlayers => {
        const existingPlayerIndex = prevPlayers.findIndex(p => p.id === playerData.id);
        if (existingPlayerIndex > -1) {
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[existingPlayerIndex] = playerData;
            return updatedPlayers;
        } else {
            return [...prevPlayers, playerData];
        }
    });
  };

  if (!team) {
    return <div>Cargando...</div>;
  }
  
  const InfoRow = ({ icon: Icon, label, person, showContact }: { icon: React.ElementType, label: string, person?: Person, showContact: boolean }) => (
    <div className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
        <Icon className="w-5 h-5 text-primary mt-1" />
        <div className="flex-grow">
            <p className="font-semibold">{label}</p>
            <p className="text-muted-foreground">{person?.name || 'No asignado'}</p>
        </div>
        {showContact && person?.phone && (
             <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Phone className="w-4 h-4"/>
                <span>{person.phone}</span>
            </div>
        )}
    </div>
  );

  const pendingPayments = upcomingMatches.filter(match => 
    (match.teams.home.id === teamId && match.teams.home.vocalPaymentDetails?.paymentStatus === 'pending') ||
    (match.teams.away.id === teamId && match.teams.away.vocalPaymentDetails?.paymentStatus === 'pending')
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <Image
                    src={team.logoUrl}
                    alt={`Logo de ${team.name}`}
                    width={150}
                    height={150}
                    className="rounded-lg border-4 border-primary object-cover"
                    data-ai-hint="team logo"
                />
                <div className="flex-grow text-center md:text-left">
                    <h2 className="text-4xl font-bold tracking-tight font-headline">{team.name}</h2>
                    <p className="text-lg text-primary">Presidente: {team.president?.name || 'No asignado'}</p>
                    <Badge className="mt-2 text-md">{team.category}</Badge>
                </div>
                 {canEdit && (
                    <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Pencil className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <EditTeamDialog team={team} onSave={handleUpdateTeam} />
                    </Dialog>
                )}
            </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="info"><BadgeInfo className="mr-2" />Información</TabsTrigger>
            <TabsTrigger value="roster"><Users className="mr-2" />Nómina</TabsTrigger>
            <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
            <TabsTrigger value="calendar"><Calendar className="mr-2" />Calendario</TabsTrigger>
            <TabsTrigger value="stats"><BarChart2 className="mr-2" />Estadísticas</TabsTrigger>
            <TabsTrigger value="sanctions"><ShieldAlert className="mr-2" />Sanciones</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Información del Club</CardTitle>
                     {canEdit && (
                        <Button size="sm" variant="outline" asChild>
                            <Link href={`/teams/${teamId}/info`}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir Información
                            </Link>
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <InfoRow icon={UserIcon} label="Presidente" person={team.president} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Vicepresidente" person={team.vicePresident} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Secretario" person={team.secretary} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Tesorero" person={team.treasurer} showContact={canEdit} />
                         <InfoRow icon={UserIcon} label="Vocal Principal" person={team.vocal} showContact={canEdit} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg mb-2 mt-4">Delegados Autorizados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {team.delegates?.map((delegate, index) => (
                                <InfoRow key={index} icon={UserSquare} label={`Delegado ${index + 1}`} person={delegate} showContact={canEdit} />
                            ))}
                             {Array.from({ length: Math.max(0, 3 - (team.delegates?.length || 0)) }).map((_, index) => (
                                <InfoRow key={`empty-${index}`} icon={UserSquare} label={`Delegado ${ (team.delegates?.length || 0) + index + 1}`} showContact={false} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="roster">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <CardTitle>Plantilla de Jugadores ({players.length})</CardTitle>
                         {canEdit && (
                            <div className="flex items-center gap-2 mt-2">
                                <Button size="sm" variant={rosterView === 'cards' ? 'default' : 'outline'} onClick={() => setRosterView('cards')}><LayoutGrid className="mr-2"/> Tarjetas</Button>
                                <Button size="sm" variant={rosterView === 'list' ? 'default' : 'outline'} onClick={() => setRosterView('list')}><List className="mr-2"/> Lista Admin</Button>
                            </div>
                        )}
                    </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                         <Button size="sm" variant="outline" asChild>
                            <Link href={`/teams/${teamId}/roster`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Descargar Nómina
                            </Link>
                        </Button>
                        <PlayerEditDialog player={initialNewPlayerState} team={team} onSave={handleSavePlayer}>
                            <Button size="sm">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Agregar Jugador
                            </Button>
                        </PlayerEditDialog>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                    {rosterView === 'cards' || !canEdit ? (
                       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {players.map((player) => (
                          <Card key={player.id} className="overflow-hidden flex flex-col group transition-all hover:shadow-lg">
                            <CardHeader className="p-0 relative">
                               <Link href={`/players/${player.id}`}>
                                <Image
                                  src={player.photoUrl}
                                  alt={`Foto de ${player.name}`}
                                  width={400}
                                  height={400}
                                  className="w-full h-auto aspect-square object-cover"
                                  data-ai-hint="player portrait"
                                />
                               </Link>
                               <Badge className={cn(
                                   "absolute top-2 right-2",
                                   player.status === 'activo' ? 'bg-green-600' : 'bg-destructive'
                               )}>
                                    {player.status === 'activo' ? 'Activo' : 'Inactivo'}
                               </Badge>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                              <h3 className="text-xl font-bold font-headline mt-2">{player.name}</h3>
                               <p className="text-sm text-muted-foreground">{player.position}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                        <div className="space-y-4">
                            {players.map(player => (
                                <Card key={player.id} className="p-4 border-l-4 border-primary bg-background">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <p className="text-xs font-semibold text-muted-foreground mb-1">CÉDULA COMPLETA</p>
                                            <Image
                                                src={player.idCardUrl || 'https://placehold.co/856x540.png'}
                                                alt={`Cédula de ${player.name}`}
                                                width={856}
                                                height={540}
                                                className="rounded-md w-full object-contain border bg-muted"
                                                data-ai-hint="id card"
                                            />
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground mb-1">FOTO PERFIL</p>
                                                <Image
                                                    src={player.photoUrl}
                                                    alt={`Perfil de ${player.name}`}
                                                    width={150}
                                                    height={150}
                                                    className="rounded-md w-full aspect-square object-cover border-2"
                                                    data-ai-hint="player portrait"
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2 text-sm">
                                                <div className="grid grid-cols-2 gap-x-2">
                                                    <div>
                                                        <Label className="text-xs">Apellidos</Label>
                                                        <Input readOnly value={player.name.split(' ').slice(1).join(' ')} />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs">Nombres</Label>
                                                        <Input readOnly value={player.name.split(' ')[0]} />
                                                    </div>
                                                </div>
                                                 <div>
                                                    <Label className="text-xs">F. Nacimiento</Label>
                                                    <Input readOnly value={player.birthDate} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-x-2">
                                                    <div>
                                                        <Label className="text-xs">Cédula</Label>
                                                        <Input readOnly value={player.idNumber} />
                                                    </div>
                                                     <div>
                                                        <Label className="text-xs">N°</Label>
                                                        <Input readOnly value={player.jerseyNumber} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <PlayerEditDialog player={player} team={team} onSave={handleSavePlayer}>
                                            <Button variant="secondary" size="sm"><Pencil className="mr-2"/> Editar Jugador</Button>
                                        </PlayerEditDialog>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
              </Card>
        </TabsContent>
        <TabsContent value="finances">
            <Card>
                <CardHeader><CardTitle>Estado Financiero</CardTitle></CardHeader>
                <CardContent>
                    {pendingPayments.length > 0 ? (
                        <div className="space-y-4">
                            {pendingPayments.map(match => {
                                const details = match.teams.home.id === teamId ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
                                const opponent = match.teams.home.id === teamId ? match.teams.away : match.teams.home;
                                return (
                                <Card key={match.id} className="bg-destructive/10 border-destructive">
                                    <CardHeader className="flex-row items-center justify-between pb-2">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="text-destructive"/>
                                            <CardTitle className="text-lg">Pago de Vocalía Pendiente</CardTitle>
                                        </div>
                                         <Badge variant="destructive">DEUDA</Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Partido contra <strong>{opponent.name}</strong></p>
                                        <p>Fecha: {isClient ? new Date(match.date).toLocaleDateString() : ''}</p>
                                        <p className="text-2xl font-bold mt-2 text-destructive">${details?.total.toFixed(2)}</p>
                                        <Button className="mt-2" asChild>
                                            <Link href="/committees">Ir a Pagar</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )})}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">El equipo está al día con sus pagos.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="calendar">
            <Card>
                <CardHeader><CardTitle>Calendario</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stats">
            <Card>
                <CardHeader><CardTitle>Estadísticas</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="results">
            <Card>
                <CardHeader><CardTitle>Resultados</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="sanctions">
            <Card>
                <CardHeader><CardTitle>Sanciones</CardTitle></CardHeader>
                <CardContent><p className="text-muted-foreground">Próximamente...</p></CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
