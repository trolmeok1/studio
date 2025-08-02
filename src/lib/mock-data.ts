
import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry } from './types';

export let teams: Team[] = [
  { 
    id: '1', 
    name: 'Cosmic Comets', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Máxima', 
    president: { name: 'Carlos Emilio Lasso Cuasapaz', phone: '0995168089' },
    vicePresident: { name: 'Ricardo Nepas Cholca', phone: '0992767019' },
    secretary: { name: 'Jeanette Toapanta', phone: '0987192255' },
    treasurer: { name: 'Patricio Cobos', phone: '0986695854' },
    vocal: { name: 'Juan Caiza Cumbal', phone: '0969134043' },
    delegates: [
        { name: 'Carlos Emilio Lasso Cuasapaz', phone: '0995168089' },
        { name: 'Juan Caiza Cumbal', phone: '0969134043' },
        { name: 'Jeanette Toapanta', phone: '0987192255' }
    ]
  },
  { 
    id: '2', 
    name: 'Solar Flares', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Máxima', 
    president: { name: 'John Doe', phone: '0991112233' },
    vicePresident: { name: 'VP Name' },
    secretary: { name: 'Secretary Name' },
    treasurer: { name: 'Treasurer Name' },
    vocal: { name: 'Vocal Name' },
    delegates: [
        { name: 'Delegate 1' },
    ]
  },
  { 
    id: '3', 
    name: 'Galaxy Gliders', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Máxima', 
    president: { name: 'Jane Smith', phone: '0993334455' },
  },
  { 
    id: '4', 
    name: 'Orion Stars', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Máxima', 
    president: { name: 'Peter Jones' } 
  },
  { 
    id: '5', 
    name: 'Vortex Voyagers', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Primera', 
    president: { name: 'Mary Johnson' } 
  },
  { 
    id: '6', 
    name: 'Pulsar Pioneers', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Primera', 
    president: { name: 'James Brown' } 
  },
  { 
    id: '7', 
    name: 'Quasar Quest', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Copa', 
    president: { name: 'Patricia Taylor' } 
  },
  { 
    id: '8', 
    name: 'Nebula Nomads', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Copa', 
    president: { name: 'Robert Wilson' } 
  },
  { 
    id: '9', 
    name: 'Asteroide FC', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Linda Garcia' } 
  },
  { 
    id: '10', 
    name: 'Supernova SC', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Michael Miller' } 
  },
  { 
    id: '11', 
    name: 'Blackhole United', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Barbara Davis' } 
  },
  { 
    id: '12', 
    name: 'Rocket Rangers', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'William Rodriguez' } 
  },
  { 
    id: '13', 
    name: 'Mars Rovers', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Elizabeth Martinez' } 
  },
  { 
    id: '14', 
    name: 'Jupiter Giants', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'David Hernandez' } 
  },
  { 
    id: '15', 
    name: 'Saturn Rings', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Jennifer Lopez' } 
  },
  { 
    id: '16', 
    name: 'Neptune Knights', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Richard Gonzalez' } 
  },
  { 
    id: '17', 
    name: 'Pluto Pups', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Susan Perez' } 
  },
  { 
    id: '18', 
    name: 'Mercury Meteors', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Joseph Sanchez' } 
  },
  { 
    id: '19', 
    name: 'Venus Vipers', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Thomas Ramirez' } 
  },
  { 
    id: '20', 
    name: 'Earth Eagles', 
    logoUrl: 'https://placehold.co/100x100.png', 
    category: 'Segunda', 
    president: { name: 'Charles Torres' } 
  },
];

export let players: Player[] = [
    { id: 'p-001', name: 'Lionel Messi', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 22, assists: 10, yellowCards: 3, redCards: 0 }, idNumber: '1712345678', birthDate: '1987-06-24', jerseyNumber: 10, status: 'activo' },
    { id: 'p-002', name: 'Cristiano Ronaldo', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 25, assists: 5, yellowCards: 4, redCards: 0 }, idNumber: '1712345679', birthDate: '1985-02-05', jerseyNumber: 7, status: 'activo' },
    { id: 'p-003', name: 'Neymar Jr', photoUrl: 'https://placehold.co/400x400.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 18, assists: 15, yellowCards: 6, redCards: 1 }, idNumber: '1712345680', birthDate: '1992-02-05', jerseyNumber: 11, status: 'inactivo', statusReason: 'Transferencia a otro club' },
    { id: 'p-004', name: 'Kylian Mbappé', photoUrl: 'https://placehold.co/400x400.png', team: 'Solar Flares', teamId: '2', category: 'Máxima', position: 'Delantero', stats: { goals: 28, assists: 8, yellowCards: 2, redCards: 0 }, idNumber: '1712345681', birthDate: '1998-12-20', jerseyNumber: 7, status: 'activo' },
    { id: 'p-005', name: 'Kevin De Bruyne', photoUrl: 'https://placehold.co/400x400.png', team: 'Solar Flares', teamId: '2', category: 'Máxima', position: 'Mediocampista', stats: { goals: 12, assists: 25, yellowCards: 3, redCards: 0 }, idNumber: '1712345682', birthDate: '1991-06-28', jerseyNumber: 17, status: 'activo' },
    { id: 'p-006', name: 'Virgil van Dijk', photoUrl: 'https://placehold.co/400x400.png', team: 'Galaxy Gliders', teamId: '3', category: 'Máxima', position: 'Defensa', stats: { goals: 5, assists: 3, yellowCards: 1, redCards: 0 }, idNumber: '1712345683', birthDate: '1991-07-08', jerseyNumber: 4, status: 'activo' },
    { id: 'p-007', name: 'Luka Modric', photoUrl: 'https://placehold.co/400x400.png', team: 'Orion Stars', teamId: '4', category: 'Máxima', position: 'Mediocampista', stats: { goals: 8, assists: 18, yellowCards: 2, redCards: 0 }, idNumber: '1712345684', birthDate: '1985-09-09', jerseyNumber: 10, status: 'activo' },
    { id: 'p-008', name: 'Erling Haaland', photoUrl: 'https://placehold.co/400x400.png', team: 'Vortex Voyagers', teamId: '5', category: 'Primera', position: 'Delantero', stats: { goals: 35, assists: 5, yellowCards: 1, redCards: 0 }, idNumber: '1712345685', birthDate: '2000-07-21', jerseyNumber: 9, status: 'activo' },
    { id: 'p-009', name: 'Mohamed Salah', photoUrl: 'https://placehold.co/400x400.png', team: 'Pulsar Pioneers', teamId: '6', category: 'Primera', position: 'Delantero', stats: { goals: 25, assists: 12, yellowCards: 0, redCards: 0 }, idNumber: '1712345686', birthDate: '1992-06-15', jerseyNumber: 11, status: 'activo' },
    { id: 'p-010', name: 'Alisson Becker', photoUrl: 'https://placehold.co/400x400.png', team: 'Quasar Quest', teamId: '7', category: 'Copa', position: 'Portero', stats: { goals: 0, assists: 1, yellowCards: 1, redCards: 0 }, idNumber: '1712345687', birthDate: '1992-10-02', jerseyNumber: 1, status: 'activo' },
];


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

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const defaultVocalPayment: VocalPaymentDetails = {
    referee: 11.00,
    fee: 2.00,
    yellowCardFine: 0,
    redCardFine: 0,
    otherFines: 0,
    otherFinesDescription: '',
    total: 13.00,
    paymentStatus: 'paid'
}

export const upcomingMatches: Match[] = [
    {
        id: 'm1',
        date: yesterday.toISOString(),
        category: 'Máxima',
        teams: {
            home: { ...teams[0], attended: true, vocalPaymentDetails: {...defaultVocalPayment, redCardFine: 5, total: 18, paymentStatus: 'paid'} },
            away: { ...teams[1], attended: true, vocalPaymentDetails: {...defaultVocalPayment, yellowCardFine: 2, total: 15, paymentStatus: 'pending'}  }
        },
        status: 'finished',
        score: { home: 2, away: 1 }
    },
    {
        id: 'm2',
        date: tomorrow.toISOString(),
        category: 'Primera',
        teams: {
            home: { ...teams[4], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams[5], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} }
        },
        status: 'future'
    },
     {
        id: 'm3',
        date: today.toISOString(),
        category: 'Copa',
        teams: {
            home: { ...teams[6], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams[7], attended: false, vocalPaymentDetails: { ...defaultVocalPayment, total: 0, paymentStatus: 'pending'} }
        },
        status: 'in-progress'
    },
    {
        id: 'm4',
        date: yesterday.toISOString(),
        category: 'Segunda',
        teams: {
            home: { ...teams[8], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams[9], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} }
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
    vocalPaymentDetails: defaultVocalPayment,
  },
  teamB: {
    ...teams.find(t => t.id === '2')!,
     players: players.filter(p => p.teamId === '2').slice(0, 30),
     score: 0,
     attended: true,
     vocalPaymentDetails: defaultVocalPayment,
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

export const systemLogs: LogEntry[] = [
    {
        id: 'log1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        user: 'Usuario Admin',
        userAvatar: 'https://placehold.co/100x100.png',
        action: 'create',
        category: 'team',
        description: "agregó el equipo 'Asteroide FC'."
    },
    {
        id: 'log2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        user: 'Secretario/a',
        userAvatar: 'https://placehold.co/100x100.png',
        action: 'payment',
        category: 'treasury',
        description: "marcó como pagada la vocalía de 'Solar Flares' ($15.00)."
    },
     {
        id: 'log3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        user: 'Usuario Admin',
        userAvatar: 'https://placehold.co/100x100.png',
        action: 'update',
        category: 'team',
        description: "editó la información del club 'Cosmic Comets'."
    },
     {
        id: 'log4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
        user: 'Usuario Admin',
        userAvatar: 'https://placehold.co/100x100.png',
        action: 'generate',
        category: 'system',
        description: "generó la nómina de jugadores para 'Galaxy Gliders'."
    },
    {
        id: 'log5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        user: 'Usuario Admin',
        userAvatar: 'https://placehold.co/100x100.png',
        action: 'delete',
        category: 'player',
        description: "eliminó al jugador 'Neymar Jr' del equipo 'Cosmic Comets'."
    },
];
