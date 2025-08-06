

'use client';

import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, getStandings, getSanctions, type Standing, type Team } from '@/lib/mock-data';
import { notFound, useParams } from 'next/navigation';
import { TeamDetailsClient } from './_components/TeamDetailsClient';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function TeamDetailsPage() {
  const params = useParams();
  const teamId = typeof params.id === 'string' ? params.id : '';
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeamData = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    const team = await getTeamById(teamId);
    if (!team) {
      notFound();
      return;
    }
  
    const players = await getPlayersByTeamId(teamId);
    const matches = await getMatchesByTeamId(teamId);
    const standings = await getStandings();
    const allSanctions = await getSanctions();
    
    const teamStandings = standings.find(s => s.teamId === teamId);
    const teamSanctions = allSanctions.filter(s => s.teamId === teamId);
    
    const vocalPayments = matches
      .filter(m => m.status === 'finished')
      .map(match => {
          const isHome = match.teams.home.id === team.id;
          const teamInMatch = isHome ? match.teams.home : match.teams.away;
          const opponent = isHome ? match.teams.away : match.teams.home;
          
          return {
              date: match.date,
              opponent: opponent.name,
              opponentId: opponent.id,
              amount: teamInMatch.vocalPaymentDetails?.total || 0,
              status: teamInMatch.vocalPaymentDetails?.paymentStatus || 'pending'
          }
      });
  
    setTeamData({
      team,
      players,
      matches,
      teamStandings,
      teamSanctions,
      vocalPayments
    });
    setLoading(false);
  }, [teamId]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  const handleTeamDeleted = useCallback((deletedTeamId: string) => {
    // In a real app, you might want to redirect or show a message.
    // For now, we can just refetch data or navigate away.
    console.log(`Team ${deletedTeamId} was deleted.`);
  }, []);

  if (loading || !teamData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
            <div className="flex items-center gap-6">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
         <Skeleton className="h-40 w-full" />
         <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <TeamDetailsClient 
      team={teamData.team} 
      players={teamData.players} 
      matches={teamData.matches}
      teamStandings={teamData.teamStandings as Standing}
      teamSanctions={teamData.teamSanctions}
      vocalPayments={teamData.vocalPayments}
      onTeamDeleted={handleTeamDeleted}
    />
  );
}
