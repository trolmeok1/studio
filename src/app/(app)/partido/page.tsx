
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { upcomingMatches, type Match, type Player } from '@/lib/mock-data';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const PlayerMarker = ({ player, className }: { player: Player; className?: string }) => (
  <div className={cn('flex flex-col items-center gap-1', className)}>
    <Avatar className="w-12 h-12 border-2 border-white/50">
      <AvatarImage src={player.photoUrl} alt={player.name} data-ai-hint="player portrait" />
      <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <span className="text-xs font-bold text-white bg-black/50 px-2 py-0.5 rounded">{player.name.split(' ')[0]}</span>
  </div>
);

const MatchField = ({ match }: { match: Match }) => {
    // Filter players by position for a 4-4-2 formation
    const lineup = match.lineup.home;
    const goalkeeper = lineup.filter(p => p.position === 'Portero').slice(0, 1);
    const defenders = lineup.filter(p => p.position === 'Defensa').slice(0, 4);
    const midfielders = lineup.filter(p => p.position === 'Mediocampista').slice(0, 4);
    const forwards = lineup.filter(p => p.position === 'Delantero').slice(0, 2);

    // Fill remaining spots if categories don't have enough players, to ensure 11 players are shown
    const displayedPlayers = new Set([...goalkeeper, ...defenders, ...midfielders, ...forwards].map(p => p.id));
    const remainingPlayers = lineup.filter(p => !displayedPlayers.has(p.id));
    
    const fillPlayers = (target: Player[], count: number) => {
        while(target.length < count && remainingPlayers.length > 0) {
            target.push(remainingPlayers.shift()!);
        }
    }

    fillPlayers(forwards, 2);
    fillPlayers(midfielders, 4);
    fillPlayers(defenders, 4);
    fillPlayers(goalkeeper, 1);


    return (
        <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-green-600/80 rounded-lg overflow-hidden p-4 flex flex-col justify-around" style={{
            backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '3rem 3rem',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}>
            {/* Forwards */}
            <div className="flex justify-around h-1/4 items-center">
                {forwards.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Midfielders */}
            <div className="flex justify-around h-1/4 items-center">
                 {midfielders.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Defenders */}
            <div className="flex justify-around h-1/4 items-center">
                 {defenders.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Goalkeeper */}
            <div className="flex justify-around h-1/4 items-center">
                 {goalkeeper.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
        </div>
    );
};


export default function PartidoPage() {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const currentMatch = upcomingMatches[currentMatchIndex];

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % upcomingMatches.length);
  };

  const prevMatch = () => {
    setCurrentMatchIndex((prev) => (prev - 1 + upcomingMatches.length) % upcomingMatches.length);
  };

  return (
    <div className="p-4 md:p-8 text-white">
        <div className="max-w-md mx-auto bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <header className="p-4 text-center border-b border-white/10">
                 <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={prevMatch}>
                        <ChevronLeft />
                    </Button>
                    <p className="text-lg font-semibold">{new Date(currentMatch.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    <Button variant="ghost" size="icon" onClick={nextMatch}>
                        <ChevronRight />
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex flex-col items-center gap-2">
                        <Image src={currentMatch.teams.home.logoUrl} alt={currentMatch.teams.home.name} width={60} height={60} className="rounded-full" data-ai-hint="team logo" />
                        <h2 className="text-xl font-bold">{currentMatch.teams.home.name}</h2>
                    </div>
                    <span className="text-2xl font-light text-muted-foreground">VS</span>
                     <div className="flex flex-col items-center gap-2">
                        <Image src={currentMatch.teams.away.logoUrl} alt={currentMatch.teams.away.name} width={60} height={60} className="rounded-full" data-ai-hint="team logo" />
                        <h2 className="text-xl font-bold">{currentMatch.teams.away.name}</h2>
                    </div>
                </div>
            </header>
            <main>
                 <Tabs defaultValue="lineup" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-t border-white/10 rounded-none">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="lineup">Alineación</TabsTrigger>
                        <TabsTrigger value="players">Jugadores</TabsTrigger>
                        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <Card className="bg-transparent border-0">
                            <CardContent className="text-center p-6">
                                <p className="text-lg">Próximo partido de la categoría {currentMatch.category}.</p>
                                <p className="text-muted-foreground">Más detalles estarán disponibles pronto.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="lineup">
                         <Card className="bg-transparent border-0">
                            <CardContent className="p-2">
                                <MatchField match={currentMatch} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="players">
                         <Card className="bg-transparent border-0">
                            <CardContent className="text-center p-6">
                                <p>Lista de jugadores convocados no disponible.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="stats">
                         <Card className="bg-transparent border-0">
                            <CardContent className="text-center p-6">
                                <p>Estadísticas pre-partido no disponibles.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    </div>
  );
}
