

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, sanctions, type Player, type Team, type PlayerPosition, type Person, type Match, updatePlayerStatus } from '@/lib/mock-data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Users, Calendar, BarChart2, ShieldAlert, BadgeInfo, Building, CalendarClock, UserSquare, AlertTriangle, DollarSign, Upload, FileText, Phone, User as UserIcon, Printer, Pencil, List, LayoutGrid, Hand, Trophy, Check, X, ShieldCheck } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const initialNewPlayerState: Omit<Player, 'id' | 'team' | 'teamId' | 'category' | 'stats'> = {
    name: '',
    idNumber: '',
    birthDate: new Date().toISOString().split('T')[0],
    position: 'Delantero',
    jerseyNumber: 0,
    status: 'activo',
    photoUrl: 'https://placehold.co/400x400.png',
    idCardUrl: 'https://placehold.co/856x540.png',
};


const PlayerCard = ({ player: initialPlayer, onSave, onStatusChange }: { player: Player, onSave: (player: Player) => void, onStatusChange: (playerId: string, status: 'activo' | 'inactivo') => void }) => {
    const { toast } = useToast();
    const [player, setPlayer] = useState(initialPlayer);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleInputChange = (field: keyof Player, value: any) => {
        setPlayer(prev => ({ ...prev, [field]: value }));
    };

    const handleNameChange = (part: 'first' | 'last', value: string) => {
        const currentNameParts = player.name.split(' ');
        const firstName = part === 'first' ? value : currentNameParts[0] || '';
        const lastName = part === 'last' ? value : currentNameParts.slice(1).join(' ');
        setPlayer(prev => ({ ...prev, name: `${firstName} ${lastName}`.trim() }));
    }

    const handleSave = () => {
        onSave(player);
        setIsEditing(false);
        toast({ title: 'Jugador Guardado', description: `Los datos de ${player.name} se han actualizado.`});
    }

    const handleStatusToggle = (checked: boolean) => {
        const newStatus = checked ? 'activo' : 'inactivo';
        setPlayer(prev => ({ ...prev, status: newStatus }));
        onStatusChange(player.id, newStatus);
        toast({ 
            title: `Estado de ${player.name} actualizado`,
            description: `El jugador ahora está ${newStatus}.`,
        });
    }
    
    const getLastName = (name: string) => name.split(' ').slice(1).join(' ');
    const getFirstName = (name: string) => name.split(' ')[0] || '';

    return (
        <Card className="p-4 border-l-4 border-primary bg-background">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">CÉDULA COMPLETA</Label>
                    <Image
                        src={player.idCardUrl || 'https://placehold.co/856x540.png'}
                        alt={`Cédula de ${player.name}`}
                        width={856}
                        height={540}
                        className="rounded-md w-full object-contain border bg-muted"
                        data-ai-hint="id card"
                    />
                     <div className="flex items-center gap-2">
                        <Input id={`idCardUrl-${player.id}`} type="file" className="flex-grow text-xs" />
                        <Button variant="ghost" size="icon"><Upload className="h-5 w-5"/></Button>
                    </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">FOTO PERFIL</Label>
                        <Image
                            src={player.photoUrl}
                            alt={`Perfil de ${player.name}`}
                            width={150}
                            height={150}
                            className="rounded-md w-full aspect-square object-cover border-2"
                            data-ai-hint="player portrait"
                        />
                         <div className="flex items-center gap-2">
                            <Input id={`photoUrl-${player.id}`} type="file" className="flex-grow text-xs" />
                        </div>
                    </div>
                    <div className="col-span-2 space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-x-2">
                            <div>
                                <Label htmlFor={`lastName-${player.id}`} className="text-xs">Apellidos</Label>
                                <Input id={`lastName-${player.id}`} value={getLastName(player.name)} onChange={e => { handleNameChange('last', e.target.value); setIsEditing(true); }} />
                            </div>
                            <div>
                                <Label htmlFor={`firstName-${player.id}`} className="text-xs">Nombres</Label>
                                <Input id={`firstName-${player.id}`} value={getFirstName(player.name)} onChange={e => { handleNameChange('first', e.target.value); setIsEditing(true); }} />
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs">F. Nacimiento</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal text-xs h-9", !player.birthDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {player.birthDate ? format(new Date(player.birthDate), "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <CalendarPicker
                                        mode="single"
                                        selected={new Date(player.birthDate)}
                                        onSelect={(date) => { if(date) { handleInputChange('birthDate', date.toISOString().split('T')[0]); setIsEditing(true); } }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2">
                            <div>
                                <Label className="text-xs">Cédula</Label>
                                <Input value={player.idNumber} onChange={e => { handleInputChange('idNumber', e.target.value); setIsEditing(true); }} />
                            </div>
                            <div>
                                <Label className="text-xs">N°</Label>
                                <Input type="number" value={player.jerseyNumber} onChange={e => { handleInputChange('jerseyNumber', parseInt(e.target.value, 10)); setIsEditing(true); }} />
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="flex items-center justify-between mt-4 col-span-full">
                     <div className="flex items-center space-x-2">
                        <Switch id={`status-${player.id}`} checked={player.status === 'activo'} onCheckedChange={handleStatusToggle} />
                        <Label htmlFor={`status-${player.id}`} className={cn("font-semibold", player.status === 'activo' ? 'text-green-600' : 'text-red-600')}>
                            {player.status === 'activo' ? 'Aprobado' : 'No Aprobado'}
                        </Label>
                    </div>
                    {isEditing && (
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => { setPlayer(initialPlayer); setIsEditing(false); }}>Cancelar</Button>
                            <Button onClick={handleSave} size="sm"><Check className="mr-2"/> Guardar Cambios</Button>
                        </div>
                    )}
                 </div>
            </div>
        </Card>
    )
}

const AddPlayerDialog = ({ team, onSave, children }: { team: Team, onSave: (player: Player) => void, children: React.ReactNode }) => {
    const [newPlayer, setNewPlayer] = useState(initialNewPlayerState);
    const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);

    const handleSave = () => {
         if (newPlayer.name && newPlayer.position && newPlayer.birthDate) {
            const playerData: Player = {
                id: `p${Date.now()}`,
                team: team.name,
                teamId: team.id,
                category: team.category,
                stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
                ...newPlayer,
                birthDate: new Date(newPlayer.birthDate).toISOString().split('T')[0],
            };
            onSave(playerData);
            setIsPlayerDialogOpen(false);
            setNewPlayer(initialNewPlayerState);
        }
    };
    
    return (
        <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Jugador a {team.name}</DialogTitle>
                    <DialogDescription>
                        Completa los datos del jugador. Los campos de la cédula solo serán visibles para administradores.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input id="name" value={newPlayer.name} onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })} placeholder="Nombres y Apellidos" />
                     </div>
                   <div className="space-y-2">
                    <Label htmlFor="idNumber">Número de Cédula</Label>
                    <Input id="idNumber" value={newPlayer.idNumber} onChange={(e) => setNewPlayer({ ...newPlayer, idNumber: e.target.value })} placeholder="1234567890" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !newPlayer.birthDate && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {newPlayer.birthDate ? format(new Date(newPlayer.birthDate), "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <CalendarPicker
                                    mode="single"
                                    selected={new Date(newPlayer.birthDate)}
                                    onSelect={(date) => setNewPlayer({ ...newPlayer, birthDate: date?.toISOString().split('T')[0] || '' })}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="jerseyNumber">No. Camiseta</Label>
                        <Input id="jerseyNumber" type="number" value={newPlayer.jerseyNumber} onChange={(e) => setNewPlayer({ ...newPlayer, jerseyNumber: parseInt(e.target.value,10) })} placeholder="10" />
                     </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Posición</Label>
                     <Select onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value as PlayerPosition })} value={newPlayer.position}>
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
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button variant="secondary">Cancelar</Button></DialogClose>
                    <Button onClick={handleSave}>Guardar Jugador</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


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
  const [matches, setMatches] = useState<Match[]>([]);
  const [teamSanctions, setTeamSanctions] = useState<typeof sanctions>([]);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [rosterView, setRosterView] = useState<'cards' | 'list'>('cards');

  useEffect(() => {
    setIsClient(true);
    const fetchedTeam = getTeamById(teamId);
    if (fetchedTeam) {
      setTeam(fetchedTeam);
      setPlayers(getPlayersByTeamId(teamId));
      setMatches(getMatchesByTeamId(teamId));
      setTeamSanctions(sanctions.filter(s => s.teamId === teamId));
    }
  }, [teamId]);
  
  const futureMatches = useMemo(() => {
    return matches.filter(m => m.status === 'future' || m.status === 'in-progress');
  }, [matches]);

  const finishedMatches = useMemo(() => {
    return matches.filter(m => m.status === 'finished');
  }, [matches]);

  
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

  const handlePlayerStatusChange = (playerId: string, status: 'activo' | 'inactivo') => {
      updatePlayerStatus(playerId, status);
      setPlayers(getPlayersByTeamId(teamId));
  }

  if (!team || !isClient) {
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

  const vocalPayments = matches
    .filter(m => m.status === 'finished')
    .map(match => {
        const isHome = match.teams.home.id === teamId;
        const details = isHome ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
        return {
            date: match.date,
            opponent: isHome ? match.teams.away.name : match.teams.home.name,
            amount: details?.total || 0,
            status: details?.paymentStatus || 'pending'
        };
  });
  

  return (
    <div className="space-y-4 p-4 md:p-8">
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
        <ScrollArea>
          <TabsList className="w-max">
              <TabsTrigger value="info"><BadgeInfo className="mr-2" />Información</TabsTrigger>
              <TabsTrigger value="roster"><Users className="mr-2" />Nómina</TabsTrigger>
              <TabsTrigger value="finances"><DollarSign className="mr-2" />Finanzas</TabsTrigger>
              <TabsTrigger value="calendar"><Calendar className="mr-2" />Calendario</TabsTrigger>
              <TabsTrigger value="stats"><BarChart2 className="mr-2" />Estadísticas</TabsTrigger>
              <TabsTrigger value="sanctions"><ShieldAlert className="mr-2" />Sanciones</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
                        <AddPlayerDialog team={team} onSave={handleSavePlayer}>
                            <Button size="sm">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Agregar Jugador
                            </Button>
                        </AddPlayerDialog>
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
                                <PlayerCard key={player.id} player={player} onSave={handleSavePlayer} onStatusChange={handlePlayerStatusChange} />
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Oponente</TableHead>
                                <TableHead>Monto Vocalía</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vocalPayments.length > 0 ? vocalPayments.map((payment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{format(new Date(payment.date), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{payment.opponent}</TableCell>
                                    <TableCell>${payment.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'} className={payment.status === 'paid' ? 'bg-green-600' : ''}>
                                            {payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No hay registros financieros.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
         <TabsContent value="calendar">
            <Card>
                <CardHeader><CardTitle>Próximos Partidos</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {futureMatches.length > 0 ? futureMatches.map(match => (
                            <Card key={match.id} className="p-4 flex items-center justify-between">
                                <span className="text-sm font-medium">{format(new Date(match.date), "eeee, dd 'de' MMMM", { locale: es })}</span>
                                <div className="flex items-center gap-4">
                                    <span className={cn("font-bold", match.teams.home.id === teamId && "text-primary")}>{match.teams.home.name}</span>
                                    <span className="text-muted-foreground">vs</span>
                                    <span className={cn("font-bold", match.teams.away.id === teamId && "text-primary")}>{match.teams.away.name}</span>
                                </div>
                                <Badge variant="outline">{format(new Date(match.date), 'p', { locale: es })}</Badge>
                            </Card>
                        )) : (
                            <p className="text-muted-foreground text-center">No hay partidos programados para este equipo.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="stats">
             <Card>
                <CardHeader>
                    <CardTitle>Rendimiento del Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Oponente</TableHead>
                                <TableHead>Marcador</TableHead>
                                <TableHead className="text-right">Resultado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finishedMatches.length > 0 ? (
                                finishedMatches.map(match => {
                                    const isHome = match.teams.home.id === teamId;
                                    const score = match.score;
                                    let result: 'G' | 'P' | 'E' = 'E';
                                    let resultColor = 'bg-muted';
                                    let resultText = 'Empate';

                                    if (score) {
                                        if (isHome && score.home > score.away) result = 'G';
                                        else if (!isHome && score.away > score.home) result = 'G';
                                        else if (score.home !== score.away) result = 'P';
                                    }

                                    if (result === 'G') {
                                        resultColor = 'bg-green-600';
                                        resultText = 'Victoria';
                                    } else if (result === 'P') {
                                        resultColor = 'bg-destructive';
                                        resultText = 'Derrota';
                                    }

                                    return (
                                        <TableRow key={match.id}>
                                            <TableCell>{format(new Date(match.date), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{isHome ? match.teams.away.name : match.teams.home.name}</TableCell>
                                            <TableCell className="font-semibold">{score?.home} - {score?.away}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge className={cn(resultColor, 'text-white')}>{resultText}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No hay estadísticas de partidos finalizados.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="sanctions">
            <Card>
                <CardHeader><CardTitle>Sanciones del Equipo</CardTitle></CardHeader>
                <CardContent>
                    {teamSanctions.length > 0 ? (
                        <div className="space-y-4">
                        {teamSanctions.map(sanction => (
                            <Card key={sanction.id} className="flex items-center p-4 gap-4 bg-muted/50">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={sanction.playerPhotoUrl} alt={sanction.playerName} data-ai-hint="player portrait" />
                                    <AvatarFallback>{sanction.playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-bold">{sanction.playerName}</p>
                                    <p className="text-sm">{sanction.reason}</p>
                                </div>
                                <Badge variant="destructive">
                                    {sanction.gamesSuspended} Partido(s)
                                </Badge>
                            </Card>
                        ))}
                        </div>
                    ) : (
                         <p className="text-muted-foreground text-center">Este equipo no tiene jugadores sancionados.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    

    
