
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

const MatchField = ({ match, teamType }: { match: Match, teamType: 'home' | 'away' }) => {
    const lineup = match.lineup[teamType] || [];

    const getPlayersForPosition = (
        players: Player[],
        position: Player['position'],
        count: number
    ): [Player[], Player[]] => {
        const positionPlayers: Player[] = [];
        const remainingPlayers: Player[] = [];
        const tempPlayers = [...players];

        for (const player of tempPlayers) {
            if (player.position === position && positionPlayers.length < count) {
                positionPlayers.push(player);
            } else {
                remainingPlayers.push(player);
            }
        }
        return [positionPlayers, remainingPlayers];
    };

    const fillFormation = (
        players: Player[],
        allPlayers: Player[]
    ): Player[] => {
        const formation: Player[] = [...players];
        const playerIdsInFormation = new Set(formation.map(p => p.id));
        const remainingPlayers = allPlayers.filter(p => !playerIdsInFormation.has(p.id));
        
        while (formation.length < 11 && remainingPlayers.length > 0) {
            formation.push(remainingPlayers.shift()!);
        }
        return formation;
    }
    
    const [forwards, remainingAfterForwards] = getPlayersForPosition(lineup, 'Delantero', 2);
    const [midfielders, remainingAfterMid] = getPlayersForPosition(remainingAfterForwards, 'Mediocampista', 4);
    const [defenders, remainingAfterDef] = getPlayersForPosition(remainingAfterMid, 'Defensa', 4);
    const [goalkeeper, remainingAfterGk] = getPlayersForPosition(remainingAfterDef, 'Portero', 1);

    const fullLineup = fillFormation(
        [...forwards, ...midfielders, ...defenders, ...goalkeeper],
        lineup
    );

    // Re-slice based on ideal formation counts, now that we have a full 11.
    const finalForwards = fullLineup.slice(0, 2);
    const finalMidfielders = fullLineup.slice(2, 6);
    const finalDefenders = fullLineup.slice(6, 10);
    const finalGoalkeeper = fullLineup.slice(10, 11);


    return (
        <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-green-600/80 rounded-lg overflow-hidden p-4 flex flex-col justify-around mt-4" style={{
            backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '3rem 3rem',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        }}>
            {/* Forwards */}
            <div className="flex justify-around h-1/4 items-center">
                {finalForwards.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Midfielders */}
            <div className="flex justify-around h-1/4 items-center">
                 {finalMidfielders.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Defenders */}
            <div className="flex justify-around h-1/4 items-center">
                 {finalDefenders.map(p => <PlayerMarker key={p.id} player={p} />)}
            </div>
             {/* Goalkeeper */}
            <div className="flex justify-around h-1/4 items-center">
                 {finalGoalkeeper.map(p => <PlayerMarker key={p.id} player={p} />)}
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
                                <Tabs defaultValue="home" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="home">{currentMatch.teams.home.name}</TabsTrigger>
                                        <TabsTrigger value="away">{currentMatch.teams.away.name}</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="home">
                                        <MatchField match={currentMatch} teamType="home" />
                                    </TabsContent>
                                    <TabsContent value="away">
                                        <MatchField match={currentMatch} teamType="away" />
                                    </TabsContent>
                                </Tabs>
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
