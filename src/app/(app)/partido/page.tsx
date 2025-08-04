
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { upcomingMatches as allMatches, type Match, type Team, getTeamsByCategory, standings as mockStandings, type Standing, type Category } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Goal, User, Home, Calendar as CalendarIcon, Users as UsersIcon, Shield } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MatchCard = ({ match }: { match: Match }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const goalScorersHome = match.events.filter(e => e.event === 'goal' && e.teamName === match.teams.home.name);
    const goalScorersAway = match.events.filter(e => e.event === 'goal' && e.teamName === match.teams.away.name);

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col" neon="blue">
            <CardHeader className="p-2 bg-muted/50 text-center text-sm font-bold">
                <div className="flex justify-center items-center gap-2">
                    <span>{isClient ? new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long'}) : ''}</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                 <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex flex-col items-center text-center gap-2">
                        <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <h3 className="font-bold text-lg">{match.teams.home.name}</h3>
                    </div>
                    <div className="flex flex-col items-center">
                        <p className="text-4xl font-bold">{match.score?.home} - {match.score?.away}</p>
                        <Badge variant="secondary" className="bg-green-600/80 text-white mt-1">Finalizado</Badge>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={64} height={64} className="rounded-full" data-ai-hint="team logo" />
                        <h3 className="font-bold text-lg">{match.teams.away.name}</h3>
                    </div>
                </div>

                <div className="p-4 mt-4 border-t grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <h4 className="font-semibold mb-2">Goles de {match.teams.home.name}</h4>
                        <ul className="space-y-1">
                            {goalScorersHome.length > 0 ? goalScorersHome.map(event => (
                                <li key={event.id} className="flex items-center gap-2">
                                    <Goal className="h-4 w-4 text-primary" />
                                    <span>{event.playerName}</span>
                                </li>
                            )) : <li className="text-muted-foreground">Sin goles</li>}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Goles de {match.teams.away.name}</h4>
                        <ul className="space-y-1">
                             {goalScorersAway.length > 0 ? goalScorersAway.map(event => (
                                <li key={event.id} className="flex items-center gap-2">
                                    <Goal className="h-4 w-4 text-primary" />
                                    <span>{event.playerName}</span>
                                </li>
                            )) : <li className="text-muted-foreground">Sin goles</li>}
                        </ul>
                    </div>
                </div>
            </CardContent>
             <CardFooter className="p-3 bg-muted/20 border-t grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground"><CalendarIcon className="w-4 h-4" /> <span className="font-semibold">Fecha:</span> {isClient ? new Date(match.date).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) : ''}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /> <span className="font-semibold">Vocalía:</span> {match.vocalTeam?.name || 'N/A'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Shield className="w-4 h-4" /> <span className="font-semibold">Cancha:</span> {match.field || 'N/A'}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Home className="w-4 h-4" /> <span className="font-semibold">Camerinos:</span> {match.teams.home.vocalPaymentDetails?.otherFinesDescription}/{match.teams.away.vocalPaymentDetails?.otherFinesDescription}</div>
             </CardFooter>
        </Card>
    );
};

const LeagueView = ({ category, group }: { category: Category; group?: 'A' | 'B' }) => {
    const standings = useMemo(() => {
        const filteredStandings = mockStandings.filter(s => {
            const team = getTeamsByCategory(category, group).find(t => t.id === s.teamId);
            return !!team;
        });

        return filteredStandings
            .sort((a, b) => {
                if (b.points !== a.points) return b.points - a.points;
                const gdA = a.goalsFor - a.goalsAgainst;
                const gdB = b.goalsFor - b.goalsAgainst;
                return gdB - gdA;
            })
            .map((s, index) => ({ ...s, rank: index + 1 }));
    }, [category, group]);

    return (
        <Card neon="blue">
            <CardHeader>
                <CardTitle>
                    Tabla de Posiciones - {category} {group ? `- Grupo ${group}` : ''}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>Equipo</TableHead>
                            <TableHead className="text-center">PJ</TableHead>
                            <TableHead className="text-center">G</TableHead>
                            <TableHead className="text-center">E</TableHead>
                            <TableHead className="text-center">P</TableHead>
                            <TableHead className="text-center">GF</TableHead>
                            <TableHead className="text-center">GC</TableHead>
                            <TableHead className="text-center">GD</TableHead>
                            <TableHead className="text-center font-bold">PTS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((s) => (
                            <TableRow key={s.teamId}>
                                <TableCell className="font-bold">{s.rank}</TableCell>
                                <TableCell>
                                    <Link href={`/teams/${s.teamId}`} className="flex items-center gap-3 hover:text-primary">
                                        <Image
                                            src={getTeamsByCategory(category, group).find(t => t.id === s.teamId)?.logoUrl || ''}
                                            alt={s.teamName}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                            data-ai-hint="team logo"
                                        />
                                        <span className="font-medium">{s.teamName}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="text-center">{s.played}</TableCell>
                                <TableCell className="text-center">{s.wins}</TableCell>
                                <TableCell className="text-center">{s.draws}</TableCell>
                                <TableCell className="text-center">{s.losses}</TableCell>
                                <TableCell className="text-center">{s.goalsFor}</TableCell>
                                <TableCell className="text-center">{s.goalsAgainst}</TableCell>
                                <TableCell className="text-center">{s.goalsFor - s.goalsAgainst}</TableCell>
                                <TableCell className="text-center font-bold">{s.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};


export default function PartidoPage() {
    const [isClient, setIsClient] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    useEffect(() => {
        setIsClient(true);
    }, []);

    const groupedPastMatches = useMemo(() => {
        if (!isClient) return {};

        const pastMatches = allMatches
            .filter(m => m.status === 'finished')
            .filter(m => selectedCategory === 'all' || m.category === selectedCategory)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return pastMatches.reduce((acc, match) => {
            const date = new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(match);
            return acc;
        }, {} as Record<string, Match[]>);

    }, [isClient, selectedCategory]);

    if (!isClient) {
        return null;
    }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-orange-500 text-transparent bg-clip-text">
                Resultados y Posiciones
              </span>
            </h2>
        </div>
        <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="results">Resultados</TabsTrigger>
                <TabsTrigger value="maxima">Posiciones: Máxima</TabsTrigger>
                <TabsTrigger value="primera">Posiciones: Primera</TabsTrigger>
                <TabsTrigger value="segunda">Posiciones: Segunda</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-6 mt-6">
                 <div className="flex justify-end">
                    <div className="w-full max-w-xs">
                         <Select onValueChange={(value) => setSelectedCategory(value as Category | 'all')} defaultValue="all">
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por categoría..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las Categorías</SelectItem>
                                <SelectItem value="Máxima">Máxima</SelectItem>
                                <SelectItem value="Primera">Primera</SelectItem>
                                <SelectItem value="Segunda">Segunda</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 {Object.keys(groupedPastMatches).length > 0 ? Object.entries(groupedPastMatches).map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {matchesOnDate.map(match => <MatchCard key={match.id} match={match} />)}
                        </div>
                    </div>
                )) : (
                     <p className="text-muted-foreground text-center py-8">No se han registrado resultados para la categoría seleccionada.</p>
                )}
            </TabsContent>
             <TabsContent value="maxima">
                <LeagueView category="Máxima" />
            </TabsContent>
            <TabsContent value="primera">
                <LeagueView category="Primera" />
            </TabsContent>
            <TabsContent value="segunda" className="space-y-6">
                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <LeagueView category="Segunda" group="A" />
                    <LeagueView category="Segunda" group="B" />
                </div>
            </TabsContent>
        </Tabs>
    </div>
  );
}
