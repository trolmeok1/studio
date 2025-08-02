
import { getPlayerById as getPlayerByIdFromAll } from './mock-data-internal';
import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, PlayerPosition, MatchData } from './types';

export let teams: Team[] = [
  { id: '1', name: 'Cosmic Comets', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', abbreviation: 'COS', foundationDate: '2015-03-12', manager: 'Danilo Guano' },
  { id: '2', name: 'Solar Flares', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', abbreviation: 'SOL', foundationDate: '2016-07-20', manager: 'John Doe' },
  { id: '3', name: 'Galaxy Gliders', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', abbreviation: 'GAL', foundationDate: '2017-01-30', manager: 'Jane Smith' },
  { id: '4', name: 'Orion Stars', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', abbreviation: 'ORI', foundationDate: '2018-05-24', manager: 'Peter Jones' },
  { id: '5', name: 'Vortex Voyagers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', abbreviation: 'VOR', foundationDate: '2019-02-11', manager: 'Mary Johnson' },
  { id: '6', name: 'Pulsar Pioneers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', abbreviation: 'PUL', foundationDate: '2020-11-01', manager: 'James Brown' },
  { id: '7', name: 'Quasar Quest', logoUrl: 'https://placehold.co/100x100.png', category: 'Copa', abbreviation: 'QUA', foundationDate: '2021-08-15', manager: 'Patricia Taylor' },
  { id: '8', name: 'Nebula Nomads', logoUrl: 'https://placehold.co/100x100.png', category: 'Copa', abbreviation: 'NEB', foundationDate: '2022-04-05', manager: 'Robert Wilson' },
  { id: '9', name: 'Asteroide FC', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'AST', foundationDate: '2022-05-01', manager: 'Linda Garcia' },
  { id: '10', name: 'Supernova SC', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'SUP', foundationDate: '2022-06-10', manager: 'Michael Miller' },
  { id: '11', name: 'Blackhole United', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'BLA', foundationDate: '2022-07-12', manager: 'Barbara Davis' },
  { id: '12', name: 'Rocket Rangers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'ROC', foundationDate: '2022-08-20', manager: 'William Rodriguez' },
  { id: '13', name: 'Mars Rovers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'MAR', foundationDate: '2022-09-21', manager: 'Elizabeth Martinez' },
  { id: '14', name: 'Jupiter Giants', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'JUP', foundationDate: '2022-10-18', manager: 'David Hernandez' },
  { id: '15', name: 'Saturn Rings', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'SAT', foundationDate: '2022-11-30', manager: 'Jennifer Lopez' },
  { id: '16', name: 'Neptune Knights', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'NEP', foundationDate: '2022-12-25', manager: 'Richard Gonzalez' },
  { id: '17', name: 'Pluto Pups', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'PLU', foundationDate: '2023-01-15', manager: 'Susan Perez' },
  { id: '18', name: 'Mercury Meteors', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'MER', foundationDate: '2023-02-18', manager: 'Joseph Sanchez' },
  { id: '19', name: 'Venus Vipers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'VEN', foundationDate: '2023-03-22', manager: 'Thomas Ramirez' },
  { id: '20', name: 'Earth Eagles', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', abbreviation: 'EAR', foundationDate: '2023-04-19', manager: 'Charles Torres' },
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
            stats: { goals: Math.floor(Math.random() * 20), assists: Math.floor(Math.random() * 15), yellowCards: Math.floor(Math.random() * 10), redCards: Math.floor(Math.random() * 2) }
        });
    }
    return players;
}

export let players: Player[] = [
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
  { id: '801', name: 'Casey Nebula', photoUrl: 'https://placehold.co/400x400.png', team: 'Nebula Nomads', teamId: '8', category: 'Copa', position: 'Portero', stats: { goals: 1, assists: 9, yellowCards: 1, redCards: 0 } },
];
players = [...players, ...generatePlayersForTeam('9', 'Asteroide FC', 'Segunda', 18, 900)];
players = [...players, ...generatePlayersForTeam('10', 'Supernova SC', 'Segunda', 18, 1000)];
players = [...players, ...generatePlayersForTeam('11', 'Blackhole United', 'Segunda', 18, 1100)];
players = [...players, ...generatePlayersForTeam('12', 'Rocket Rangers', 'Segunda', 18, 1200)];
players = [...players, ...generatePlayersForTeam('13', 'Mars Rovers', 'Segunda', 18, 1300)];
players = [...players, ...generatePlayersForTeam('14', 'Jupiter Giants', 'Segunda', 18, 1400)];
players = [...players, ...generatePlayersForTeam('15', 'Saturn Rings', 'Segunda', 18, 1500)];
players = [...players, ...generatePlayersForTeam('16', 'Neptune Knights', 'Segunda', 18, 1600)];
players = [...players, ...generatePlayersForTeam('17', 'Pluto Pups', 'Segunda', 18, 1700)];
players = [...players, ...generatePlayersForTeam('18', 'Mercury Meteors', 'Segunda', 18, 1800)];
players = [...players, ...generatePlayersForTeam('19', 'Venus Vipers', 'Segunda', 18, 1900)];
players = [...players, ...generatePlayersForTeam('20', 'Earth Eagles', 'Segunda', 18, 2000)];


export let standings: Standing[] = [
  { rank: 1, teamId: '9', teamName: 'Asteroide FC', played: 10, wins: 8, draws: 1, losses: 1, points: 25, goalsFor: 20, goalsAgainst: 5 },
  { rank: 2, teamId: '10', teamName: 'Supernova SC', played: 10, wins: 7, draws: 2, losses: 1, points: 23, goalsFor: 25, goalsAgainst: 10 },
  { rank: 3, teamId: '11', teamName: 'Blackhole United', played: 10, wins: 7, draws: 1, losses: 2, points: 22, goalsFor: 18, goalsAgainst: 8 },
  { rank: 4, teamId: '12', teamName: 'Rocket Rangers', played: 10, wins: 6, draws: 2, losses: 2, points: 20, goalsFor: 22, goalsAgainst: 12 },
  { rank: 5, teamId: '13', teamName: 'Mars Rovers', played: 10, wins: 5, draws: 2, losses: 3, points: 17, goalsFor: 15, goalsAgainst: 15 },
  { rank: 6, teamId: '14', teamName: 'Jupiter Giants', played: 10, wins: 4, draws: 3, losses: 3, points: 15, goalsFor: 13, goalsAgainst: 13 },
  { rank: 7, teamId: '15', teamName: 'Saturn Rings', played: 10, wins: 3, draws: 3, losses: 4, points: 12, goalsFor: 10, goalsAgainst: 14 },
  { rank: 8, teamId: '16', teamName: 'Neptune Knights', played: 10, wins: 2, draws: 4, losses: 4, points: 10, goalsFor: 8, goalsAgainst: 16 },
  { rank: 9, teamId: '17', teamName: 'Pluto Pups', played: 10, wins: 2, draws: 2, losses: 6, points: 8, goalsFor: 7, goalsAgainst: 20 },
  { rank: 10, teamId: '18', teamName: 'Mercury Meteors', played: 10, wins: 1, draws: 3, losses: 6, points: 6, goalsFor: 9, goalsAgainst: 22 },
  { rank: 11, teamId: '19', teamName: 'Venus Vipers', played: 10, wins: 1, draws: 2, losses: 7, points: 5, goalsFor: 5, goalsAgainst: 19 },
  { rank: 12, teamId: '20', teamName: 'Earth Eagles', played: 10, wins: 0, draws: 3, losses: 7, points: 3, goalsFor: 4, goalsAgainst: 25 },
];


export const getTopScorers = (): Scorer[] => players
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, 10)
    .map((player, index) => ({
        rank: index + 1,
        playerId: player.id,
        playerName: player.name,
        playerPhotoUrl: player.photoUrl,
        teamName: player.team,
        teamId: player.teamId,
        goals: player.stats.goals,
    }));

export let topScorers = getTopScorers();

export let sanctions: Sanction[] = players
    .filter(p => p.stats.redCards > 0)
    .map((player, index) => ({
        id: `s${index + 1}`,
        playerId: player.id,
        playerName: player.name,
        playerPhotoUrl: player.photoUrl,
        teamName: player.team,
        teamId: player.teamId,
        reason: 'Tarjeta Roja Directa',
        gamesSuspended: 1,
        date: '2024-07-20',
}));

export const addSanction = (newSanction: Sanction) => {
    // Avoid adding duplicate sanctions for the same player on the same day
    const existing = sanctions.find(s => s.playerId === newSanction.playerId && s.date === newSanction.date);
    if (!existing) {
        sanctions = [newSanction, ...sanctions];
    }
}

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

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);


export const upcomingMatches: Match[] = [
    {
        id: 'm1',
        date: yesterday.toISOString(),
        category: 'Máxima',
        teams: {
            home: { ...teams[0], attended: true, vocalPayment: 15 }, // Cosmic Comets
            away: { ...teams[1], attended: true, vocalPayment: 15 }  // Solar Flares
        },
        status: 'finished',
        score: { home: 2, away: 1 }
    },
    {
        id: 'm2',
        date: tomorrow.toISOString(),
        category: 'Primera',
        teams: {
            home: { ...teams[4], attended: true, vocalPayment: 0 }, // Vortex Voyagers
            away: { ...teams[5], attended: true, vocalPayment: 0 }  // Pulsar Pioneers
        },
        status: 'future'
    },
     {
        id: 'm3',
        date: today.toISOString(),
        category: 'Copa',
        teams: {
            home: { ...teams[6], attended: true, vocalPayment: 15 }, // Quasar Quest
            away: { ...teams[7], attended: false, vocalPayment: 0 }  // Nebula Nomads
        },
        status: 'in-progress'
    },
    {
        id: 'm4',
        date: yesterday.toISOString(),
        category: 'Segunda',
        teams: {
            home: { ...teams[8], attended: true, vocalPayment: 10 },
            away: { ...teams[9], attended: true, vocalPayment: 10 }
        },
        status: 'finished',
        score: { home: 0, away: 0 }
    }
];

export const matchData: MatchData = {
  date: '2024-07-28',
  time: '14:00',
  category: 'Máxima',
  phase: 'Fase de Grupos',
  matchday: 'Jornada 5',
  field: 'Cancha Principal',
  vocalTeam: 'Galaxy Gliders',
  teamA: {
    ...teams.find(t => t.id === '1')!,
    players: players.filter(p => p.teamId === '1').slice(0, 30),
    score: 0,
    attended: true,
    vocalPayment: 15
  },
  teamB: {
    ...teams.find(t => t.id === '2')!,
     players: players.filter(p => p.teamId === '2').slice(0, 30),
     score: 0,
     attended: true,
     vocalPayment: 15
  },
};

export const getPlayerById = (id: string): Player | undefined => players.find(p => p.id === id);
export const getPlayersByTeamId = (teamId: string): Player[] => players.filter(p => p.teamId === teamId);
export const getTeamById = (id: string): Team | undefined => teams.find(t => t.id === id);
export const getTeamsByCategory = (category: Category): Team[] => teams.filter(t => t.category === category);

// Function to update player stats
export const updatePlayerStats = (playerId: string, statsUpdate: { goals: number, yellowCards: number, redCards: number }) => {
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex !== -1) {
        players[playerIndex].stats.goals += statsUpdate.goals;
        players[playerIndex].stats.yellowCards += statsUpdate.yellowCards;
        players[playerIndex].stats.redCards += statsUpdate.redCards;
        // Recalculate top scorers after stats update
        topScorers = getTopScorers();
    }
};
