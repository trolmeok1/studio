

import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, getSanctionsByTeamId, getStandings, getVocalPaymentsByTeamId } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { TeamDetailsClient } from './_components/TeamDetailsClient';

export default async function TeamDetailsPage({ params }: { params: { id: string }}) {
  const teamId = params.id;
  const team = await getTeamById(teamId);

  if (!team) {
    notFound();
  }

  const players = await getPlayersByTeamId(teamId);
  const matches = await getMatchesByTeamId(teamId);
  const teamSanctions = await getSanctionsByTeamId(teamId);
  const allStandings = await getStandings();
  const teamStandings = allStandings.find(s => s.teamId === teamId);
  const vocalPayments = await getVocalPaymentsByTeamId(teamId);

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
    
