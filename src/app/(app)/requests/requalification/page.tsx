

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTeams, getPlayers, addPlayer, updatePlayerStatus, type Player, type Team, type PlayerPosition, getRequalificationRequests, type RequalificationRequest, updateRequalificationRequestStatus } from '@/lib/mock-data';
import { UserPlus, Search, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PendingRequests = ({ requests, onAction }: { requests: RequalificationRequest[], onAction: () => void }) => {
    const { toast } = useToast();

    const handleApprove = async (request: RequalificationRequest) => {
        // Here you would add the player if it's a new qualification, 
        // or update their team/status if it's a transfer.
        // For simplicity, we'll just update the request status.
        await updateRequalificationRequestStatus(request.id, 'approved');
        toast({ title: 'Solicitud Aprobada', description: `La solicitud para ${request.playerInName} ha sido aprobada.` });
        onAction();
    };

    const handleReject = async (request: RequalificationRequest) => {
        await updateRequalificationRequestStatus(request.id, 'rejected');
        toast({ title: 'Solicitud Rechazada', description: `La solicitud para ${request.playerInName} ha sido rechazada.`, variant: 'destructive' });
        onAction();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitudes de Calificación Pendientes</CardTitle>
                <CardDescription>Aprueba o rechaza las nuevas solicitudes de calificación y recalificación de jugadores.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Jugador</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {requests.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No hay solicitudes pendientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{format(new Date(req.date), 'dd/MM/yyyy', { locale: es })}</TableCell>
                                    <TableCell>{req.teamName}</TableCell>
                                    <TableCell>
                                        <Badge variant={req.requestType === 'qualification' ? 'default' : 'secondary'}>
                                            {req.requestType === 'qualification' ? 'Nuevo Ingreso' : 'Recalificación'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{req.playerInName}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleApprove(req)}>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </Button>
                                         <Button variant="ghost" size="icon" onClick={() => handleReject(req)}>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


const PlayerList = ({ players, onStatusChange }: { players: Player[], onStatusChange: (player: Player, newStatus: 'activo' | 'inactivo') => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Jugadores Registrados</CardTitle>
                <CardDescription>Gestiona el estado de actividad de los jugadores.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Jugador</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead>Cédula</TableHead>
                            <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron jugadores.
                                </TableCell>
                            </TableRow>
                        ) : (
                            players.map(player => (
                                <TableRow key={player.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={player.photoUrl} alt={player.name} />
                                                <AvatarFallback>{player.name?.substring(0,2) || '??'}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name || '(Jugador sin nombre)'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{player.team}</TableCell>
                                    <TableCell>{player.idNumber}</TableCell>
                                    <TableCell className="text-right">
                                         <div className="flex items-center justify-end gap-2">
                                            <Label htmlFor={`status-${player.id}`} className={cn(player.status === 'activo' ? 'text-green-500' : 'text-red-500')}>
                                                {player.status === 'activo' ? 'Activo' : 'Inactivo'}
                                            </Label>
                                            <Switch 
                                                id={`status-${player.id}`} 
                                                checked={player.status === 'activo'} 
                                                onCheckedChange={(checked) => onStatusChange(player, checked ? 'activo' : 'inactivo')}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

const AddPlayerForm = ({ teams, onPlayerAdded }: { teams: Team[], onPlayerAdded: (newPlayer: Player) => void }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [teamId, setTeamId] = useState<string>('');
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [jerseyNumber, setJerseyNumber] = useState('');
    const [position, setPosition] = useState<PlayerPosition | ''>('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const resetForm = () => {
        setTeamId('');
        setName('');
        setIdNumber('');
        setBirthDate('');
        setJerseyNumber('');
        setPosition('');
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamId || !name || !idNumber || !birthDate || !jerseyNumber || !position || !photo) {
            toast({
                title: 'Campos incompletos',
                description: 'Por favor, llena todos los campos y sube una foto.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = async () => {
            try {
                const photoDataUri = reader.result as string;
                const team = teams.find(t => t.id === teamId)!;
                const newPlayer = await addPlayer({
                    name, idNumber, birthDate,
                    jerseyNumber: parseInt(jerseyNumber),
                    position, teamId: team.id, team: team.name, category: team.category
                }, photoDataUri);
                onPlayerAdded(newPlayer);
                toast({ title: 'Jugador Agregado', description: `${name} ha sido añadido al equipo ${team.name}.` });
                resetForm();
            } catch (error) {
                 toast({ title: 'Error', description: 'No se pudo agregar el jugador.', variant: 'destructive' });
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            toast({ title: 'Error de Lectura', description: 'No se pudo leer el archivo de imagen.', variant: 'destructive' });
            setIsLoading(false);
        };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Registro Rápido de Jugador</CardTitle>
                <CardDescription>Añade un nuevo jugador a cualquier equipo del sistema.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="team">Equipo</Label>
                        <Select onValueChange={setTeamId} value={teamId}>
                            <SelectTrigger id="team"><SelectValue placeholder="Selecciona un equipo" /></SelectTrigger>
                            <SelectContent>{teams.map(team => <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="idNumber">N° de Cédula</Label>
                            <Input id="idNumber" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                            <Input id="birthDate" type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="jerseyNumber">Número de Camiseta</Label>
                            <Input id="jerseyNumber" type="number" value={jerseyNumber} onChange={e => setJerseyNumber(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-1">
                        <Label htmlFor="position">Posición</Label>
                        <Select onValueChange={(v) => setPosition(v as PlayerPosition)} value={position}>
                            <SelectTrigger id="position"><SelectValue placeholder="Selecciona una posición..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Portero">Portero</SelectItem>
                                <SelectItem value="Defensa">Defensa</SelectItem>
                                <SelectItem value="Mediocampista">Mediocampista</SelectItem>
                                <SelectItem value="Delantero">Delantero</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label>Foto del Jugador</Label>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={photoPreview || ''} alt="Vista previa"/>
                                <AvatarFallback>Foto</AvatarFallback>
                            </Avatar>
                            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        <UserPlus className="mr-2" />
                        {isLoading ? 'Guardando...' : 'Agregar Jugador'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};


export default function RequalificationPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [requests, setRequests] = useState<RequalificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
    
    const loadData = useCallback(async () => {
        setLoading(true);
        const [teamsData, playersData, requestsData] = await Promise.all([
            getTeams(), 
            getPlayers(),
            getRequalificationRequests()
        ]);
        setAllTeams(teamsData);
        setAllPlayers(playersData.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
        setRequests(requestsData.filter(r => r.status === 'pending'));
        setLoading(false);
    }, []);

    useEffect(() => {
        if(user.permissions.requests.view) {
             loadData();
        }
    }, [user, loadData]);

    const handlePlayerAdded = useCallback((newPlayer: Player) => {
        setAllPlayers(prev => [newPlayer, ...prev].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    }, []);

    const handleStatusChange = async (player: Player, newStatus: 'activo' | 'inactivo') => {
        const originalStatus = player.status;
        setAllPlayers(prev => prev.map(p => p.id === player.id ? { ...p, status: newStatus } : p));
        try {
            await updatePlayerStatus(player.id, newStatus);
            toast({
                title: 'Estado Actualizado',
                description: `El estado de ${player.name} ha sido cambiado a ${newStatus}.`
            });
        } catch (error) {
             toast({ title: 'Error', description: 'No se pudo actualizar el estado.', variant: 'destructive' });
             setAllPlayers(prev => prev.map(p => p.id === player.id ? { ...p, status: originalStatus } : p));
        }
    };

    const filteredPlayers = useMemo(() => {
        return allPlayers.filter(player => {
            const matchesSearch = searchTerm === '' || (player.name && player.name.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesTeam = selectedTeamFilter === 'all' || player.teamId === selectedTeamFilter;
            return matchesSearch && matchesTeam;
        });
    }, [allPlayers, searchTerm, selectedTeamFilter]);

    if (!user.permissions.requests.view) {
        return (
            <div className="flex-1 p-8 text-center">
                <p>No tienes permiso para ver esta página.</p>
            </div>
        )
    }
    
    if (loading) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <div className="space-y-2 text-center">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                     <div className="lg:col-span-3">
                         <Skeleton className="h-96" />
                     </div>
                     <div className="lg:col-span-2">
                         <Skeleton className="h-96" />
                     </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="text-center">
                 <h2 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
                       Gestión de Calificación
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Inscribe nuevos jugadores y gestiona el estado de actividad de la plantilla.
                </p>
            </div>

            {user.permissions.requests.edit && <PendingRequests requests={requests} onAction={loadData} />}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                <div className="lg:col-span-3">
                     <div className="flex gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar por nombre de jugador..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
                            <SelectTrigger className="w-[280px]">
                                <SelectValue placeholder="Filtrar por equipo..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los equipos</SelectItem>
                                {allTeams.map(team => (
                                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <PlayerList players={filteredPlayers} onStatusChange={handleStatusChange} />
                </div>
                <div className="lg:col-span-2">
                    <AddPlayerForm teams={allTeams} onPlayerAdded={handlePlayerAdded} />
                </div>
            </div>
        </div>
    );
}
