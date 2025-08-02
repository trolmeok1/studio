import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats } from './types';

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

export const players: Player[] = [
  { id: '101', name: 'Leo Astral', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 22, assists: 15, yellowCards: 3, redCards: 0 } },
  { id: '102', name: 'Chris Nova', photoUrl: 'https://placehold.co/400x400.png', team: 'Solar Flares', teamId: '2', category: 'Máxima', stats: { goals: 18, assists: 10, yellowCards: 5, redCards: 1 } },
  { id: '103', name: 'Alex Comet', photoUrl: 'https://placehold.co/400x400.png', team: 'Galaxy Gliders', teamId: '3', category: 'Máxima', stats: { goals: 15, assists: 20, yellowCards: 1, redCards: 0 } },
  { id: '104', name: 'Sam Meteor', photoUrl: 'https://placehold.co/400x400.png', team: 'Orion Stars', teamId: '4', category: 'Máxima', stats: { goals: 12, assists: 8, yellowCards: 7, redCards: 0 } },
  { id: '105', name: 'Jordan Vortex', photoUrl: 'https://placehold.co/400x400.png', team: 'Vortex Voyagers', teamId: '5', category: 'Primera', stats: { goals: 25, assists: 12, yellowCards: 2, redCards: 0 } },
  { id: '106', name: 'Taylor Pulsar', photoUrl: 'https://placehold.co/400x400.png', team: 'Pulsar Pioneers', teamId: '6', category: 'Primera', stats: { goals: 20, assists: 18, yellowCards: 4, redCards: 0 } },
  { id: '107', name: 'Morgan Quasar', photoUrl: 'https://placehold.co/400x400.png', team: 'Quasar Quest', teamId: '7', category: 'Copa', stats: { goals: 30, assists: 5, yellowCards: 6, redCards: 1 } },
  { id: '108', name: 'Casey Nebula', photoUrl: 'https://placehold.co/400x400.png', team: 'Nebula Nomads', teamId: '8', category: 'Copa', stats: { goals: 28, assists: 9, yellowCards: 1, redCards: 0 } },
  // Add more players to Cosmic Comets for testing
  { id: '109', name: 'Player Nine', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '110', name: 'Player Ten', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '111', name: 'Player Eleven', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '112', name: 'Player Twelve', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '113', name: 'Player Thirteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '114', name: 'Player Fourteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '115', name: 'Player Fifteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '116', name: 'Player Sixteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '117', name: 'Player Seventeen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '118', name: 'Player Eighteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '119', name: 'Player Nineteen', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '120', name: 'Player Twenty', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
  { id: '121', name: 'Player Twenty-One', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', stats: { goals: 5, assists: 5, yellowCards: 1, redCards: 0 } },
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


export const getPlayerById = (id: string): Player | undefined => players.find(p => p.id === id);

export const getTeamById = (id: string): Team | undefined => teams.find(t => t.id === id);
