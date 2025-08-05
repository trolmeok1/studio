
import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, getStandings, getSanctions } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { TeamDetailsClient } from './_components/TeamDetailsClient';

export default async function TeamDetailsPage({ params }: { params: { id: string } }) {
  const team = await getTeamById(params.id);
  
  if (!team) {
    notFound();
  }

  const players = await getPlayersByTeamId(params.id);
  const matches = getMatchesByTeamId(params.id);
  const standings = await getStandings();
  const allSanctions = await getSanctions();
  
  const teamStandings = standings.find(s => s.teamId === params.id);
  const teamSanctions = allSanctions.filter(s => s.teamId === params.id);
  
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
