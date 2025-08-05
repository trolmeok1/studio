'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Trophy, BarChart, Users, Calendar, ShieldCheck, ClipboardList } from 'lucide-react';
import { getStandings, getTopScorers, getMatches, getDashboardStats, type Standing, type Scorer, type Match } from '@/lib/mock-data';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
    color: string;
    link?: string;
}

const StatCard = ({ title, value, description, icon, color, link }: StatCardProps) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 h-full w-1.5 ${color}`}></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pl-6">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent className="pl-6">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
        {link && (
            <Link href={link} className="absolute bottom-2 right-2">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
        )}
    </Card>
);

export default function DashboardPage() {
    const [standings, setStandings] = useState<Standing[]>([]);
    const [topScorers, setTopScorers] = useState<Scorer[]>([]);
    const [recentMatches, setRecentMatches] = useState<Match[]>([]);
    const [stats, setStats] = useState<any>({ players: {}, teams: {} });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        async function loadDashboardData() {
            const [standingsData, scorersData, matchesData, dashboardStats] = await Promise.all([
                getStandings(),
                getTopScorers(),
                getMatches(),
                getDashboardStats()
            ]);

            setStandings(standingsData.filter(s => s.category === 'Máxima').slice(0, 5));
            setTopScorers(scorersData.slice(0, 5));
            
            const finishedMatches = matchesData
                .filter(m => m.status === 'finished')
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);
            setRecentMatches(finishedMatches);
            setStats(dashboardStats);
        }
        loadDashboardData();
    }, []);

    const getStatusBadge = (status: 'future' | 'in-progress' | 'finished') => {
        switch (status) {
            case 'finished': return <Badge>Finalizado</Badge>;
            case 'in-progress': return <Badge variant="destructive">En Juego</Badge>;
            case 'future': return <Badge variant="secondary">Próximo</Badge>;
            default: return null;
        }
    };

    if (!isClient) {
        // Render a skeleton or loading state on the server
        return <div className="p-8">Cargando...</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Jugadores Aprobados" value={stats.players?.approved ?? 0} description={`${stats.players?.new ?? 0} nuevos esta semana`} icon={<Users className="h-4 w-4 text-muted-foreground" />} color="bg-blue-500" />
                <StatCard title="Equipos Registrados" value={stats.teams?.registered ?? 0} description={`${stats.teams?.sanctioned ?? 0} sancionados`} icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />} color="bg-green-500" />
                <StatCard title="Partidos Jugados" value={stats.matchesPlayed ?? 0} description="En todas las categorías" icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />} color="bg-yellow-500" />
                <StatCard title="Goles Anotados" value={stats.goalsScored ?? 0} description="Total de la temporada" icon={<Trophy className="h-4 w-4 text-muted-foreground" />} color="bg-red-500" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Resultados Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Partido</TableHead>
                                    <TableHead>Resultado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentMatches.map(match => (
                                    <TableRow key={match.id}>
                                        <TableCell>
                                            <div className="font-medium">{match.teams.home.name} vs {match.teams.away.name}</div>
                                            <div className="text-sm text-muted-foreground">{match.category}</div>
                                        </TableCell>
                                        <TableCell className="font-bold">{match.score ? `${match.score.home} - ${match.score.away}` : 'N/A'}</TableCell>
                                        <TableCell>{new Date(match.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{getStatusBadge(match.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Máximos Goleadores</CardTitle>
                        <CardDescription>Top 5 de la categoría Máxima.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {topScorers.map(scorer => (
                                    <TableRow key={scorer.playerId}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={scorer.playerPhotoUrl} alt={scorer.playerName} data-ai-hint="player photo" />
                                                    <AvatarFallback>{scorer.playerName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{scorer.playerName}</p>
                                                    <p className="text-sm text-muted-foreground">{scorer.teamName}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-lg">{scorer.goals}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Tabla de Posiciones - Máxima</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Equipo</TableHead>
                                <TableHead>PJ</TableHead>
                                <TableHead>G</TableHead>
                                <TableHead>E</TableHead>
                                <TableHead>P</TableHead>
                                <TableHead>GF</TableHead>
                                <TableHead>GC</TableHead>
                                <TableHead>PTS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {standings.map(team => (
                                <TableRow key={team.teamId}>
                                    <TableCell>{team.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={team.teamLogoUrl} data-ai-hint="team logo" alt={team.teamName} />
                                                <AvatarFallback>{team.teamName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{team.teamName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{team.played}</TableCell>
                                    <TableCell>{team.wins}</TableCell>
                                    <TableCell>{team.draws}</TableCell>
                                    <TableCell>{team.losses}</TableCell>
                                    <TableCell>{team.goalsFor}</TableCell>
                                    <TableCell>{team.goalsAgainst}</TableCell>
                                    <TableCell className="font-bold">{team.points}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
