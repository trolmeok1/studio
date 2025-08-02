
import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, PlayerPosition } from './types';

export const teams: Team[] = [
  { id: '1', name: 'Cosmic Comets', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima' },
  { id: '2', name: 'Solar Flares', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima' },
  { id: '3', name: 'Galaxy Gliders', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima' },
  { id: '4', name: 'Orion Stars', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima' },
  { id: '5', name: 'Vortex Voyagers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera' },
  { id: '6', name: 'Pulsar Pioneers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera' },
  { id: '7', name: 'Quasar Quest', logoUrl: 'https://placehold.co/100x100.png', category: 'Copa' },
  { id: '8', name: 'Nebula Nomads', logoUrl: 'https://placehold.co/100x100.png', category: 'Copa' },
];

const generatePlayersForTeam = (teamId: string, teamName: string, category: Category, count: number, startId: number): Player[] => {
    const players: Player[] = [];
    const positions: PlayerPosition[] = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];
    for (let i = 1; i <= count; i++) {
        players.push({
            id: `${startId + i}`,
            name: `${teamName} Player ${i}`,
            photoUrl: 'https://placehold.co/400x400.png',
            team: teamName,
            teamId: teamId,
            category: category,
            position: positions[i % 4],
            stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 }
        });
    }
    return players;
}

export const players: Player[] = [
  // Cosmic Comets (Team 1) - 30 players
  ...generatePlayersForTeam('1', 'Cosmic Comets', 'Máxima', 30, 100),
  
  // Solar Flares (Team 2) - 30 players
  ...generatePlayersForTeam('2', 'Solar Flares', 'Máxima', 30, 200),

  // Other players
  { id: '301', name: 'Alex Comet', photoUrl: 'https://placehold.co/400x400.png', team: 'Galaxy Gliders', teamId: '3', category: 'Máxima', position: 'Mediocampista', stats: { goals: 15, assists: 20, yellowCards: 1, redCards: 0 } },
  { id: '401', name: 'Sam Meteor', photoUrl: 'https://placehold.co/400x400.png', team: 'Orion Stars', teamId: '4', category: 'Máxima', position: 'Defensa', stats: { goals: 12, assists: 8, yellowCards: 7, redCards: 0 } },
  { id: '501', name: 'Jordan Vortex', photoUrl: 'https://placehold.co/400x400.png', team: 'Vortex Voyagers', teamId: '5', category: 'Primera', position: 'Delantero', stats: { goals: 25, assists: 12, yellowCards: 2, redCards: 0 } },
  { id: '601', name: 'Taylor Pulsar', photoUrl: 'https://placehold.co/400x400.png', team: 'Pulsar Pioneers', teamId: '6', category: 'Primera', position: 'Mediocampista', stats: { goals: 20, assists: 18, yellowCards: 4, redCards: 0 } },
  { id: '701', name: 'Morgan Quasar', photoUrl: 'https://placehold.co/400x400.png', team: 'Quasar Quest', teamId: '7', category: 'Copa', position: 'Delantero', stats: { goals: 30, assists: 5, yellowCards: 6, redCards: 1 } },
  { id: '801', name: 'Casey Nebula', photoUrl: 'https://placehold.co/400x400.png', team: 'Nebula Nomads', teamId: '8', category: 'Copa', position: 'Portero', stats: { goals: 28, assists: 9, yellowCards: 1, redCards: 0 } },
];

export const standings: Standing[] = [
  { rank: 1, teamId: '1', teamName: 'Cosmic Comets', teamLogoUrl: 'https://placehold.co/40x40.png', played: 10, wins: 8, draws: 1, losses: 1, points: 25 },
  { rank: 2, teamId: '2', teamName: 'Solar Flares', teamLogoUrl: 'https://placehold.co/40x40.png', played: 10, wins: 7, draws: 2, losses: 1, points: 23 },
  { rank: 3, teamId: '3', teamName: 'Galaxy Gliders', teamLogoUrl: 'https://placehold.co/40x40.png', played: 10, wins: 6, draws: 1, losses: 3, points: 19 },
  { rank: 4, teamId: '4', teamName: 'Orion Stars', teamLogoUrl: 'https://placehold.co/40x40.png', played: 10, wins: 5, draws: 2, losses: 3, points: 17 },
];

export const topScorers: Scorer[] = [
  { rank: 1, playerName: 'Leo Astral', teamName: 'Cosmic Comets', goals: 22 },
  { rank: 2, playerName: 'Jordan Vortex', teamName: 'Vortex Voyagers', goals: 25 },
  { rank: 3, playerName: 'Morgan Quasar', teamName: 'Quasar Quest', goals: 30 },
  { rank: 4, playerName: 'Chris Nova', teamName: 'Solar Flares', goals: 18 },
];

export const sanctions: Sanction[] = [
  { id: 's1', playerName: 'Chris Nova', teamName: 'Solar Flares', reason: 'Unsportsmanlike conduct', gamesSuspended: 2, date: '2024-07-20' },
  { id: 's2', playerName: 'Sam Meteor', teamName: 'Orion Stars', reason: 'Accumulation of yellow cards', gamesSuspended: 1, date: '2024-07-18' },
  { id: 's3', playerName: 'Morgan Quasar', teamName: 'Quasar Quest', reason: 'Violent conduct', gamesSuspended: 3, date: '2024-07-15' },
];

export const achievements: Achievement[] = [
    { teamName: 'Athletic Bilbao Jr', teamLogoUrl: 'https://placehold.co/100x100.png', achievement: 'Campeón', category: 'Categoría Máxima', year: '2018-2019' },
    { teamName: 'Cruzeiro', teamLogoUrl: 'https://placehold.co/100x100.png', achievement: 'Vicecampeón', category: 'Categoría Máxima', year: '2018-2019' },
    { teamName: 'Jesús Del Gran Poder', teamLogoUrl: 'https://placehold.co/100x100.png', achievement: 'Campeón', category: 'Categoría Femenino', year: '2018-2019' },
    { teamName: 'Union Bautista', teamLogoUrl: 'https://placehold.co/100x100.png', achievement: 'Vicecampeón', category: 'Categoría Femenino', year: '2018-2019' },
]

export const dashboardStats: DashboardStats = {
    categories: 6,
    stages: 3,
    referees: 69,
    fines: 48,
    matchesPlayed: 698,
    goalsScored: 4856,
    yellowCards: 2768,
    redCards: 335,
    teams: {
        registered: 2,
        approved: 65,
        rejected: 9,
        sanctioned: 1,
    },
    players: {
        approved: 1730,
        new: 394,
        rejected: 1470,
    }
}

const getPlayersForTeam = (teamId: string) => {
    return players.filter(p => p.teamId === teamId);
}

export const upcomingMatches: Match[] = [
    {
        id: 'm1',
        date: '2024-08-10T16:00:00Z',
        category: 'Máxima',
        teams: {
            home: teams[0], // Cosmic Comets
            away: teams[1]  // Solar Flares
        },
        lineup: {
            home: getPlayersForTeam('1'),
            away: getPlayersForTeam('2'),
        }
    },
    {
        id: 'm2',
        date: '2024-08-11T18:00:00Z',
        category: 'Primera',
        teams: {
            home: teams[4], // Vortex Voyagers
            away: teams[5]  // Pulsar Pioneers
        },
        lineup: {
            home: getPlayersForTeam('5'),
            away: getPlayersForTeam('6'),
        }
    }
];


export const getPlayerById = (id: string): Player | undefined => players.find(p => p.id === id);
export const getPlayersByTeamId = (teamId: string): Player[] => players.filter(p => p.teamId === teamId);
export const getTeamById = (id: string): Team | undefined => teams.find(t => t.id === id);
