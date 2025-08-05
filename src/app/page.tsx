'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, Goal, Shield, Activity, CalendarDays, ClipboardList, HandCoins } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { DashboardStats, Match, Scorer, Standing } from '@/lib/types';
import { getDashboardStats, getMatches, getTopScorers, getStandings } from '@/lib/mock-data';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ title, value, icon: Icon, description, neonColor }: { title: string; value: string | number; icon: React.ElementType, description?: string, neonColor?: 'purple' | 'blue' | 'green' | 'yellow' | 'cyan' | 'none' }) => (
  <Card neon={neonColor}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
       {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);


const RecentMatches = ({ matches }: { matches: Match[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Resultados Recientes</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                 {matches.slice(0, 3).map(match => (
                    <div key={match.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                            <span>{match.teams.home.name}</span>
                        </div>
                        <div className="text-center">
                            <span className="font-bold text-lg">{match.score?.home} - {match.score?.away}</span>
                            <p className="text-xs text-muted-foreground">{format(new Date(match.date), 'dd MMM', {locale: es})}</p>
                        </div>
                         <div className="flex items-center gap-2 text-sm font-semibold">
                            <span>{match.teams.away.name}</span>
                            <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={24} height={24} className="rounded-full" data-ai-hint="team logo" />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

const TopScorersTable = ({ scorers }: { scorers: Scorer[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Máximos Goleadores</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Jugador</TableHead>
                        <TableHead className="text-right">Goles</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scorers.filter(scorer => scorer.playerName).map(scorer => (
                        <TableRow key={scorer.playerId}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={scorer.playerPhotoUrl} alt={scorer.playerName} data-ai-hint="player portrait" />
                                        <AvatarFallback>{scorer.playerName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{scorer.playerName}</p>
                                        <p className="text-xs text-muted-foreground">{scorer.teamName}</p>
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
)

const StandingsWidget = ({ standings }: {standings: Standing[]}) => (
    <Card>
        <CardHeader>
            <CardTitle>Tabla de Posiciones (Máxima)</CardTitle>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[10px]">#</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead className="text-right">Pts</TableHead>
                         <TableHead className="text-right">PJ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {standings.filter(s => s.teamName !== 'Descansa').slice(0, 5).map((s, i) => (
                        <TableRow key={`${s.teamId}-${i}`}>
                            <TableCell className="font-bold">{i + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                     <Image src={s.teamLogoUrl || 'https://placehold.co/100x100.png'} alt={s.teamName || 'Logo del equipo'} width={20} height={20} className="rounded-full" data-ai-hint="team logo"/>
                                    <span className="font-medium truncate">{s.teamName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-bold">{s.points}</TableCell>
                            <TableCell className="text-right">{s.played}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
)


export default function DashboardPage() {
    const { user, isAuthLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentMatches, setRecentMatches] = useState<Match[]>([]);
    const [topScorers, setTopScorers] = useState<Scorer[]>([]);
    const [standings, setStandings] = useState<Standing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthLoading && user.role === 'guest') {
            // No redirect, allow guest access
        }
    }, [user, isAuthLoading]);
    
     useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [statsData, matchesData, scorersData, standingsData] = await Promise.all([
                getDashboardStats(),
                getMatches(),
                getTopScorers(),
                getStandings()
            ]);
            setStats(statsData);
            const finishedMatches = matchesData
                .filter(m => m.status === 'finished')
                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setRecentMatches(finishedMatches);
            setTopScorers(scorersData);
            const maximaStandings = standingsData.filter(s => s.rank <= 5); // Assuming getStandings returns sorted by category
            setStandings(maximaStandings);
            setLoading(false);
        };
        fetchData();
    }, [user]);

    if (isAuthLoading || loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-lg text-muted-foreground">Cargando datos del dashboard...</p>
                </div>
            </div>
        );
    }
    
    if (!stats) return null;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Bienvenido, {user.name}</h2>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Equipos Aprobados" value={stats.teams.approved} icon={Shield} neonColor="purple" description={`${stats.teams.registered} registrados`} />
            <StatCard title="Jugadores Activos" value={stats.players.approved} icon={Users} neonColor="blue" description={`${stats.players.new} nuevos esta semana`} />
            <StatCard title="Partidos Jugados" value={stats.matchesPlayed} icon={CalendarDays} neonColor="green" description="Esta temporada" />
            <StatCard title="Goles Anotados" value={stats.goalsScored} icon={Goal} neonColor="yellow" description="En todas las categorías" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4 space-y-4">
                <RecentMatches matches={recentMatches} />
                <TopScorersTable scorers={topScorers} />
            </div>
            <div className="lg:col-span-3">
                 <StandingsWidget standings={standings} />
            </div>
        </div>
    </div>
  );
}
