
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { upcomingMatches as allMatches, type Match, type Team } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Goal } from 'lucide-react';

const MatchCard = ({ match }: { match: Match }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getStatusBadge = () => {
        if (!isClient) return null;
        switch (match.status) {
            case 'finished':
                return <Badge variant="secondary" className="bg-green-600/80 text-white">Finalizado</Badge>;
            case 'in-progress':
                return <Badge variant="default" className="bg-blue-500 animate-pulse">Jugando ahora</Badge>;
            case 'future':
                 return <Badge variant="outline">{new Date(match.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Badge>;
            default:
                return null;
        }
    };
    
    const goalScorersHome = match.events.filter(e => e.event === 'goal' && e.teamName === match.teams.home.name);
    const goalScorersAway = match.events.filter(e => e.event === 'goal' && e.teamName === match.teams.away.name);


    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <Link href={`/teams/${match.teams.home.id}`}>
                <CardContent className="p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3 w-2/5 justify-end">
                        <span className="font-bold text-right truncate">{match.teams.home.name}</span>
                        <Image src={match.teams.home.logoUrl} alt={match.teams.home.name} width={40} height={40} className="rounded-full" data-ai-hint="team logo" />
                    </div>

                    <div className="text-center w-1/5">
                        {match.status === 'finished' ? (
                            <div className="text-2xl font-bold">
                                <span>{match.score?.home}</span>
                                <span className="mx-2">-</span>
                                <span>{match.score?.away}</span>
                            </div>
                        ) : (
                            <span className="text-xl font-light text-muted-foreground">VS</span>
                        )}
                        {getStatusBadge()}
                    </div>

                    <div className="flex items-center gap-3 w-2/5">
                        <Image src={match.teams.away.logoUrl} alt={match.teams.away.name} width={40} height={40} className="rounded-full" data-ai-hint="team logo" />
                        <span className="font-bold truncate">{match.teams.away.name}</span>
                    </div>
                </CardContent>
            </Link>
             {match.status === 'finished' && (goalScorersHome.length > 0 || goalScorersAway.length > 0) && (
                <div className="p-4 border-t grid grid-cols-2 gap-4 text-xs">
                    <div>
                        <h4 className="font-semibold mb-2">Goles de {match.teams.home.name}</h4>
                        <ul className="space-y-1">
                            {goalScorersHome.map(event => (
                                <li key={event.id} className="flex items-center gap-2">
                                    <Goal className="h-4 w-4 text-primary" />
                                    <span>{event.playerName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-2">Goles de {match.teams.away.name}</h4>
                        <ul className="space-y-1">
                            {goalScorersAway.map(event => (
                                <li key={event.id} className="flex items-center gap-2">
                                    <Goal className="h-4 w-4 text-primary" />
                                    <span>{event.playerName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default function PartidoPage() {
    const [matches] = useState<Match[]>(allMatches);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const futureMatches = matches.filter(m => m.status === 'future' || m.status === 'in-progress').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const pastMatches = matches.filter(m => m.status === 'finished').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const groupedFutureMatches = futureMatches.reduce((acc, match) => {
        const date = isClient ? new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : '';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);
    
    const groupedPastMatches = pastMatches.reduce((acc, match) => {
        const date = isClient ? new Date(match.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) : '';
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Partidos y Resultados
        </h2>
        <Tabs defaultValue="future">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="future">Partidos Futuros</TabsTrigger>
                <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>
            <TabsContent value="future" className="space-y-6 mt-6">
                {Object.keys(groupedFutureMatches).length > 0 ? Object.entries(groupedFutureMatches).map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                        <div className="space-y-4">
                            {matchesOnDate.map(match => <MatchCard key={match.id} match={match} />)}
                        </div>
                    </div>
                )) : (
                    <p className="text-muted-foreground text-center py-8">No hay partidos futuros programados.</p>
                )}
            </TabsContent>
            <TabsContent value="results" className="space-y-6 mt-6">
                 {Object.keys(groupedPastMatches).length > 0 ? Object.entries(groupedPastMatches).map(([date, matchesOnDate]) => (
                    <div key={date}>
                        <h3 className="text-lg font-semibold mb-2 text-muted-foreground">{date}</h3>
                        <div className="space-y-4">
                            {matchesOnDate.map(match => <MatchCard key={match.id} match={match} />)}
                        </div>
                    </div>
                )) : (
                     <p className="text-muted-foreground text-center py-8">Aún no se han registrado resultados.</p>
                )}
            </TabsContent>
        </Tabs>
    </div>
  );
}
