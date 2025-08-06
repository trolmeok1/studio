
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getPlayerById, getMatches, type Player, type Match } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Shield, Calendar, Goal, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
    const [player, setPlayer] = useState<Player | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!playerId) return;

        const fetchData = async () => {
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
        };

        fetchData();
    }, [playerId]);

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
                <Button asChild>
                    <Link href={`/players/${player.id}/id-card`}>Ver Carnet Digital</Link>
                </Button>
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
