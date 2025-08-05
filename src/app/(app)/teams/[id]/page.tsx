

import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, sanctions, type Player, type Team, type Match, standings } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { TeamDetailsClient } from './_components/TeamDetailsClient';
import { useMemo } from 'react';

export default async function TeamDetailsPage({ params }: { params: { id: string }}) {
  const teamId = params.id;
  const team = getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const players = getPlayersByTeamId(teamId);
  const matches = getMatchesByTeamId(teamId);
  const teamSanctions = sanctions.filter(s => s.teamId === teamId);
  const teamStandings = standings.find(s => s.teamId === teamId);
  
  const vocalPayments = matches
    .filter(m => m.status === 'finished')
    .map(match => {
        const isHome = match.teams.home.id === teamId;
        const details = isHome ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
        const opponent = isHome ? match.teams.away : match.teams.home;
        return {
            date: match.date,
            opponent: opponent.name,
            opponentId: opponent.id,
            amount: details?.total || 0,
            status: details?.paymentStatus || 'pending'
        };
  });

  return (
    <TeamDetailsClient
        team={team}
        players={players}
        matches={matches}
        teamStandings={teamStandings}
        teamSanctions={teamSanctions}
        vocalPayments={vocalPayments}
    />
  );
}
