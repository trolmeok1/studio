
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTeams, getPlayers, addPlayer, updatePlayerStatus, type Player, type Team, type PlayerPosition, getRequalificationRequests, type RequalificationRequest, updateRequalificationRequestStatus, updateTeam, type Category } from '@/lib/mock-data';
import { UserPlus, Search, CheckCircle, XCircle, FileUp, Eye, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const RequestDetailsDialog = ({ request }: { request: RequalificationRequest }) => {
    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Detalle de la Solicitud</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <p><strong>Equipo:</strong> {request.teamName}</p>
                <p><strong>Tipo:</strong> {request.requestType === 'qualification' ? 'Nuevo Ingreso' : 'Recalificación'}</p>
                <p><strong>Jugador Entrante:</strong> {request.playerInName}</p>
                <p><strong>Cédula Entrante:</strong> {request.playerInIdNumber}</p>
                <p><strong>Fecha Nac. Entrante:</strong> {request.playerInBirthDate}</p>
                {request.playerOutName && <p><strong>Jugador Saliente:</strong> {request.playerOutName}</p>}
                {request.reason && <p><strong>Motivo:</strong> {request.reason}</p>}
                <div className="flex gap-4">
                    {request.playerInPhotoUrl && (
                        <div>
                            <Label>Foto de Perfil</Label>
                            <Image src={request.playerInPhotoUrl} alt="Foto de perfil" width={100} height={100} className="rounded-md border p-1" />
                        </div>
                    )}
                    {request.playerInIdCardUrl && (
                        <div>
                            <Label>Foto de Cédula</Label>
                            <Image src={request.playerInIdCardUrl} alt="Foto de cédula" width={150} height={100} className="rounded-md border p-1 object-contain" />
                        </div>
                    )}
                </div>
            </div>
        </DialogContent>
    );
};


const RequestsSection = ({ requests, onAction }: { requests: RequalificationRequest[], onAction: () => void }) => {
    const { toast } = useToast();

    const handleApprove = async (request: RequalificationRequest) => {
        await updateRequalificationRequestStatus(request.id, 'approved');
        toast({ title: 'Solicitud Aprobada', description: `La solicitud para ${request.playerInName} ha sido aprobada.` });
        onAction();
    };

    const handleReject = async (request: RequalificationRequest) => {
        await updateRequalificationRequestStatus(request.id, 'rejected');
        toast({ title: 'Solicitud Rechazada', description: `La solicitud para ${request.playerInName} ha sido rechazada.`, variant: 'destructive' });
        onAction();
    };
    
    const requestsByStatus = useMemo(() => {
        return {
            pending: requests.filter(r => r.status === 'pending'),
            approved: requests.filter(r => r.status === 'approved'),
            rejected: requests.filter(r => r.status === 'rejected'),
        }
    }, [requests]);

    const RequestTable = ({ requests }: { requests: RequalificationRequest[] }) => (
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
                    <TableRow><TableCell colSpan={5} className="h-24 text-center">No hay solicitudes en esta categoría.</TableCell></TableRow>
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4"/>Ver Ficha</Button>
                                    </DialogTrigger>
                                    <RequestDetailsDialog request={req} />
                                </Dialog>
                                {req.status === 'pending' && (
                                    <>
                                        <Button variant="ghost" size="icon" onClick={() => handleApprove(req)}>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleReject(req)}>
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );


    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitudes de Calificación</CardTitle>
                <CardDescription>Gestiona las solicitudes de calificación y recalificación de jugadores.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="pending">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pending">Pendientes ({requestsByStatus.pending.length})</TabsTrigger>
                        <TabsTrigger value="approved">Aprobadas ({requestsByStatus.approved.length})</TabsTrigger>
                        <TabsTrigger value="rejected">Rechazadas ({requestsByStatus.rejected.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pending"><RequestTable requests={requestsByStatus.pending} /></TabsContent>
                    <TabsContent value="approved"><RequestTable requests={requestsByStatus.approved} /></TabsContent>
                    <TabsContent value="rejected"><RequestTable requests={requestsByStatus.rejected} /></TabsContent>
                </Tabs>
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
                            <TableHead>Cédula</TableHead>
                            <TableHead>F. Nacimiento</TableHead>
                            <TableHead className="text-right">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {players.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron jugadores para los filtros seleccionados.
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
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {player.idNumber}
                                            {player.idCardUrl && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                         <DialogHeader>
                                                            <DialogTitle>Cédula de {player.name}</DialogTitle>
                                                        </DialogHeader>
                                                        <Image src={player.idCardUrl} alt={`Cédula de ${player.name}`} width={400} height={250} className="rounded-md mx-auto" />
                                                    </DialogContent>
                                                </Dialog>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{player.birthDate}</TableCell>
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

export default function PlayerManagementPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [allRequests, setAllRequests] = useState<RequalificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<Category | 'all'>('all');
    
    const loadData = useCallback(async () => {
        setLoading(true);
        const [teamsData, playersData, requestsData] = await Promise.all([
            getTeams(), 
            getPlayers(),
            getRequalificationRequests()
        ]);
        setAllTeams(teamsData);
        setAllPlayers(playersData.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
        setAllRequests(requestsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setLoading(false);
    }, []);

    useEffect(() => {
        if(user.permissions.requests.view) {
             loadData();
        }
    }, [user, loadData]);

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
            const name = player.name || '';
            const matchesSearch = searchTerm === '' || name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTeam = selectedTeamFilter === 'all' || player.teamId === selectedTeamFilter;
            const matchesCategory = selectedCategoryFilter === 'all' || player.category === selectedCategoryFilter;
            return matchesSearch && matchesTeam && matchesCategory;
        });
    }, [allPlayers, searchTerm, selectedTeamFilter, selectedCategoryFilter]);

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
                <Skeleton className="h-64 mt-8" />
                <Skeleton className="h-96 mt-8" />
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
            <div className="text-center">
                 <h2 className="text-4xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
                       Gestión de Jugadores
                    </span>
                </h2>
                <p className="text-lg text-muted-foreground mt-2">
                    Aprueba solicitudes y gestiona el estado de actividad de la plantilla.
                </p>
            </div>

            {user.permissions.requests.edit && <RequestsSection requests={allRequests} onAction={loadData} />}

            <div className="mt-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative md:col-span-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre de jugador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                     <Select value={selectedCategoryFilter} onValueChange={(v) => setSelectedCategoryFilter(v as Category | 'all')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por categoría..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            <SelectItem value="Máxima">Máxima</SelectItem>
                            <SelectItem value="Primera">Primera</SelectItem>
                            <SelectItem value="Segunda">Segunda</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={selectedTeamFilter} onValueChange={setSelectedTeamFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filtrar por equipo..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los equipos</SelectItem>
                            {allTeams.filter(team => selectedCategoryFilter === 'all' || team.category === selectedCategoryFilter).map(team => (
                                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <PlayerList players={filteredPlayers} onStatusChange={handleStatusChange} />
            </div>
        </div>
    );
}

    