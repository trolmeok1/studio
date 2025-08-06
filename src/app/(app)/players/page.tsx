
'use client';
import { getPlayers, getTeams, type Player, type Team } from '@/lib/mock-data';
import { PlayerSearch } from './_components/PlayerSearch';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function PlayersPage() {
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [allTeams, setAllTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [players, teams] = await Promise.all([getPlayers(), getTeams()]);
            setAllPlayers(players);
            setAllTeams(teams);
            setLoading(false);
        }
        loadData();
    }, []);

  if (loading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="text-center w-full">
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 text-transparent bg-clip-text">
                        Lista de Jugadores
                        </span>
                    </h2>
                </div>
            </div>
            <Card>
                <div className="p-4"><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-12 w-full rounded-none" />
                <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
          <div className="text-center w-full">
            <h2 className="text-4xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-400 text-transparent bg-clip-text">
                Lista de Jugadores
              </span>
            </h2>
          </div>
      </div>
       
       <PlayerSearch allPlayers={allPlayers} allTeams={allTeams} />
    </div>
  );
}
