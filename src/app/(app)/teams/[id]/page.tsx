

import { getTeamById, getPlayersByTeamId, getMatchesByTeamId, getStandings, getSanctions, type Standing } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { TeamDetailsClient } from './_components/TeamDetailsClient';

async function getTeamData(teamId: string) {
    const team = await getTeamById(teamId);
    if (!team) {
      return null;
    }
  
    const players = await getPlayersByTeamId(teamId);
    const matches = getMatchesByTeamId(teamId);
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
  
    return {
      team,
      players,
      matches,
      teamStandings,
      teamSanctions,
      vocalPayments
    };
}


export default async function TeamDetailsPage({ params }: { params: { id: string } }) {
  const teamData = await getTeamData(params.id);
  
  if (!teamData) {
    notFound();
  }

  return (
    <TeamDetailsClient 
      team={teamData.team} 
      players={teamData.players} 
      matches={teamData.matches}
      teamStandings={teamData.teamStandings as Standing}
      teamSanctions={teamData.teamSanctions}
      vocalPayments={teamData.vocalPayments}
    />
  );
}
