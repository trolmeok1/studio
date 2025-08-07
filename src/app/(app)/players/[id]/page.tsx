
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getPlayerById, getMatches, type Player, type Match, updatePlayer } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Shield, Calendar, Goal, TrendingUp, TrendingDown, Minus, Edit, Loader2, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { PlayerPosition } from '@/lib/types';


const EditPlayerDialog = ({ player, onPlayerUpdated }: { player: Player, onPlayerUpdated: (updatedPlayer: Player) => void }) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [playerData, setPlayerData] = useState<Player>(player);
    const [photoPreview, setPhotoPreview] = useState<string | null>(player.photoUrl);

    useEffect(() => {
        if (isOpen) {
            setPlayerData(JSON.parse(JSON.stringify(player)));
            setPhotoPreview(player.photoUrl);
        }
    }, [player, isOpen]);

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

    const handleSelectChange = (value: string) => {
        setPlayerData(prev => ({ ...prev, position: value as PlayerPosition }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedPlayer = await updatePlayer(player.id, playerData, photoPreview);
            toast({
                title: 'Jugador Actualizado',
                description: `La información de "${playerData.name}" ha sido guardada.`,
            });
            onPlayerUpdated(updatedPlayer);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to update player:", error);
            toast({
                title: 'Error al actualizar',
                description: 'No se pudo guardar la información del jugador.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary"><Edit className="mr-2 h-4 w-4" /> Editar Jugador</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Jugador</DialogTitle>
                    <DialogDescription>Modifica la información del jugador.</DialogDescription>
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
                            <Input id="jerseyNumber" type="number" value={playerData.jerseyNumber} onChange={(e) => setPlayerData(prev => ({ ...prev, jerseyNumber: parseInt(e.target.value) || 0 }))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Posición</Label>
                            <Select onValueChange={handleSelectChange} value={playerData.position}>
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
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const StatCard = ({ icon: Icon, title, value, color }: { icon: React.ElementType, title: string, value: string | number, color?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className={cn("h-4 w-4 text-muted-foreground", color)} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default function PlayerDetailsPage() {
    const params = useParams();
    const playerId = typeof params.id === 'string' ? params.id : '';
    const { user } = useAuth();
    const [player, setPlayer] = useState<Player | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!playerId) return;
        setLoading(true);
        const playerData = await getPlayerById(playerId);
        if (!playerData) {
            notFound();
            return;
        }
        setPlayer(playerData);
        
        const allMatches = await getMatches();
        const playerMatches = allMatches.filter(m => 
            m.events.some(e => e.playerId === playerId) ||
            (m.teams.home.id === playerData.teamId || m.teams.away.id === playerData.teamId)
        );
        setMatches(playerMatches);

        setLoading(false);
    }, [playerId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePlayerUpdated = useCallback((updatedPlayer: Player) => {
        setPlayer(updatedPlayer);
    }, []);

    if (loading || !player) {
        return (
             <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                 <div className="flex items-center gap-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                 </div>
                 <Skeleton className="h-64 mt-6" />
             </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <header className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="flex items-center gap-6">
                    <Avatar className="w-32 h-32 border-4 border-primary">
                        <AvatarImage src={player.photoUrl} alt={player.name} data-ai-hint="player portrait" />
                        <AvatarFallback className="text-4xl">{player.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                     <div>
                        <div className="flex items-center gap-2">
                            <Badge>{player.category}</Badge>
                            <Badge variant={player.status === 'activo' ? 'default' : 'destructive'}>{player.status}</Badge>
                        </div>
                        <h2 className="text-4xl font-bold font-headline mt-1">{player.name}</h2>
                        <Link href={`/teams/${player.teamId}`} className="text-muted-foreground hover:text-primary flex items-center gap-2">
                            <Shield className="h-4 w-4" /> {player.team}
                        </Link>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button asChild>
                        <Link href={`/players/${player.id}/id-card`}>Ver Carnet Digital</Link>
                    </Button>
                    {user.permissions.players.edit && (
                        <EditPlayerDialog player={player} onPlayerUpdated={handlePlayerUpdated} />
                    )}
                </div>
            </header>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <StatCard icon={Goal} title="Goles" value={player.stats.goals} color="text-green-500" />
                <StatCard icon={Goal} title="Asistencias" value={player.stats.assists} color="text-blue-500" />
                <StatCard icon={Goal} title="Tarjetas Amarillas" value={player.stats.yellowCards} color="text-yellow-500" />
                <StatCard icon={Goal} title="Tarjetas Rojas" value={player.stats.redCards} color="text-red-500" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historial de Carrera</CardTitle>
                    <CardDescription>Equipos en los que el jugador ha participado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Equipo</TableHead>
                                <TableHead>Fecha de Inicio</TableHead>
                                <TableHead>Fecha de Fin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {player.careerHistory && player.careerHistory.length > 0 ? player.careerHistory.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.teamName}</TableCell>
                                    <TableCell>{format(new Date(item.startDate), 'dd/MM/yyyy', { locale: es })}</TableCell>
                                    <TableCell>{item.endDate ? format(new Date(item.endDate), 'dd/MM/yyyy', { locale: es }) : 'Presente'}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">No hay historial de carrera disponible.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

    