
import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry, MatchEvent, Referee, Expense, RequalificationRequest } from './types';

export let referees: Referee[] = [
    { id: 'ref-1', name: 'Néstor Pitana', category: 'A' },
    { id: 'ref-2', name: 'Björn Kuipers', category: 'A' },
    { id: 'ref-3', name: 'Cüneyt Çakır', category: 'B' },
    { id: 'ref-4', name: 'Daniele Orsato', category: 'B' },
    { id: 'ref-5', name: 'Antonio Mateu Lahoz', category: 'C' },
    { id: 'ref-6', name: 'Szymon Marciniak', category: 'A' },
];

export const getReferees = (): Referee[] => referees;
export const addReferee = (referee: Omit<Referee, 'id'>) => {
    const newReferee: Referee = { id: `ref-${Date.now()}`, ...referee };
    referees.push(newReferee);
    return newReferee;
}
export const updateReferee = (updatedReferee: Referee) => {
    const index = referees.findIndex(r => r.id === updatedReferee.id);
    if (index !== -1) {
        referees[index] = updatedReferee;
    }
    return updatedReferee;
}

export let expenses: Expense[] = [
    { id: 'exp-1', date: new Date().toISOString(), description: 'Compra de trofeos para premiación', amount: 500 },
    { id: 'exp-2', date: new Date().toISOString(), description: 'Pago de servicios básicos de la oficina', amount: 120.50 },
];

export const getExpenses = (): Expense[] => expenses;
export const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { id: `exp-${Date.now()}`, ...expense };
    expenses.push(newExpense);
    return newExpense;
}
export const removeExpense = (id: string) => {
    expenses = expenses.filter(e => e.id !== id);
}


export let teams: Team[] = [
  // Máxima Category - 12 teams
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
    delegates: [ { name: 'Delegate 1' } ]
  },
  { id: '3', name: 'Galaxy Gliders', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Jane Smith', phone: '0993334455' } },
  { id: '4', name: 'Orion Stars', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Peter Jones' } },
  { id: 't-max-5', name: 'Andromeda Avengers', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Alex Ray' } },
  { id: 't-max-6', name: 'Meteor Monarchs', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Sue Storm' } },
  { id: 't-max-7', name: 'Gravity Giants', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Ben Grimm' } },
  { id: 't-max-8', name: 'Starship Strikers', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Reed Richards' } },
  { id: 't-max-9', name: 'Celestial FC', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Victor Von Doom' } },
  { id: 't-max-10', name: 'Eclipse Enforcers', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Tony Stark' } },
  { id: 't-max-11', name: 'Dark Matter Dynamos', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Bruce Banner' } },
  { id: 't-max-12', name: 'Lightyear Legends', logoUrl: 'https://placehold.co/100x100.png', category: 'Máxima', president: { name: 'Steve Rogers' } },

  // Primera Category - 12 teams
  { id: '5', name: 'Vortex Voyagers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Mary Johnson' } },
  { id: '6', name: 'Pulsar Pioneers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'James Brown' } },
  { id: 't-pri-3', name: 'Equinox FC', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Chris Evans' } },
  { id: 't-pri-4', name: 'Solstice Spirits', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Scarlett Johansson' } },
  { id: 't-pri-5', name: 'Orbital Outlaws', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Mark Ruffalo' } },
  { id: 't-pri-6', name: 'Comet Crusaders', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Chris Hemsworth' } },
  { id: 't-pri-7', name: 'Asteroid Aces', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Jeremy Renner' } },
  { id: 't-pri-8', name: 'Zenith Zephyrs', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Tom Hiddleston' } },
  { id: 't-pri-9', name: 'Nadir Nomads', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Samuel L. Jackson' } },
  { id: 't-pri-10', name: 'Infinity FC', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Cobie Smulders' } },
  { id: 't-pri-11', name: 'Quantum Questers', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Clark Gregg' } },
  { id: 't-pri-12', name: 'Dimension Drifters', logoUrl: 'https://placehold.co/100x100.png', category: 'Primera', president: { name: 'Gwyneth Paltrow' } },

  // Segunda Category - 16 teams
  { id: '7', name: 'Quasar Quest', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Patricia Taylor' } },
  { id: '8', name: 'Nebula Nomads', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Robert Wilson' } },
  { id: '9', name: 'Asteroide FC', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Linda Garcia' } },
  { id: '10', name: 'Supernova SC', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Michael Miller' } },
  { id: '11', name: 'Blackhole United', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Barbara Davis' } },
  { id: '12', name: 'Rocket Rangers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'William Rodriguez' } },
  { id: '13', name: 'Mars Rovers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'Elizabeth Martinez' } },
  { id: '14', name: 'Jupiter Giants', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'A', president: { name: 'David Hernandez' } },
  { id: '15', name: 'Saturn Rings', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Jennifer Lopez' } },
  { id: '16', name: 'Neptune Knights', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Richard Gonzalez' } },
  { id: '17', name: 'Pluto Pups', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Susan Perez' } },
  { id: '18', name: 'Mercury Meteors', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Joseph Sanchez' } },
  { id: '19', name: 'Venus Vipers', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Thomas Ramirez' } },
  { id: '20', name: 'Earth Eagles', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Charles Torres' } },
  { id: '21', name: 'Alpha Centauri', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Daniel Clark' } },
  { id: '22', name: 'Proxima Centauri', logoUrl: 'https://placehold.co/100x100.png', category: 'Segunda', group: 'B', president: { name: 'Nancy Lewis' } }
];

export let players: Player[] = [
    { id: 'p-001', name: 'Lionel Messi', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 22, assists: 10, yellowCards: 3, redCards: 0 }, idNumber: '1712345678', birthDate: '1987-06-24', jerseyNumber: 10, status: 'activo' },
    { id: 'p-002', name: 'Cristiano Ronaldo', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 25, assists: 5, yellowCards: 4, redCards: 0 }, idNumber: '1712345679', birthDate: '1985-02-05', jerseyNumber: 7, status: 'activo' },
    { id: 'p-003', name: 'Neymar Jr', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Cosmic Comets', teamId: '1', category: 'Máxima', position: 'Delantero', stats: { goals: 18, assists: 15, yellowCards: 6, redCards: 1 }, idNumber: '1712345680', birthDate: '1992-02-05', jerseyNumber: 11, status: 'inactivo', statusReason: 'Transferencia a otro club' },
    { id: 'p-004', name: 'Kylian Mbappé', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Solar Flares', teamId: '2', category: 'Máxima', position: 'Delantero', stats: { goals: 28, assists: 8, yellowCards: 2, redCards: 0 }, idNumber: '1712345681', birthDate: '1998-12-20', jerseyNumber: 7, status: 'activo' },
    { id: 'p-005', name: 'Kevin De Bruyne', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Solar Flares', teamId: '2', category: 'Máxima', position: 'Mediocampista', stats: { goals: 12, assists: 25, yellowCards: 3, redCards: 0 }, idNumber: '1712345682', birthDate: '1991-06-28', jerseyNumber: 17, status: 'activo' },
    { id: 'p-006', name: 'Virgil van Dijk', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Galaxy Gliders', teamId: '3', category: 'Máxima', position: 'Defensa', stats: { goals: 5, assists: 3, yellowCards: 1, redCards: 0 }, idNumber: '1712345683', birthDate: '1991-07-08', jerseyNumber: 4, status: 'activo' },
    { id: 'p-007', name: 'Luka Modric', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Orion Stars', teamId: '4', category: 'Máxima', position: 'Mediocampista', stats: { goals: 8, assists: 18, yellowCards: 2, redCards: 0 }, idNumber: '1712345684', birthDate: '1985-09-09', jerseyNumber: 10, status: 'activo' },
    { id: 'p-008', name: 'Erling Haaland', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Vortex Voyagers', teamId: '5', category: 'Primera', position: 'Delantero', stats: { goals: 35, assists: 5, yellowCards: 1, redCards: 0 }, idNumber: '1712345685', birthDate: '2000-07-21', jerseyNumber: 9, status: 'activo' },
    { id: 'p-009', name: 'Mohamed Salah', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Pulsar Pioneers', teamId: '6', category: 'Primera', position: 'Delantero', stats: { goals: 25, assists: 12, yellowCards: 0, redCards: 0 }, idNumber: '1712345686', birthDate: '1992-06-15', jerseyNumber: 11, status: 'activo' },
    { id: 'p-010', name: 'Alisson Becker', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Quasar Quest', teamId: '7', category: 'Segunda', position: 'Portero', stats: { goals: 0, assists: 1, yellowCards: 1, redCards: 0 }, idNumber: '1712345687', birthDate: '1992-10-02', jerseyNumber: 1, status: 'activo' },
    { id: 'p-011', name: 'Robert Lewandowski', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Andromeda Avengers', teamId: 't-max-5', category: 'Máxima', position: 'Delantero', stats: { goals: 30, assists: 3, yellowCards: 2, redCards: 0 }, idNumber: '1712345688', birthDate: '1988-08-21', jerseyNumber: 9, status: 'activo' },
    { id: 'p-012', name: 'Sadio Mané', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Equinox FC', teamId: 't-pri-3', category: 'Primera', position: 'Delantero', stats: { goals: 20, assists: 8, yellowCards: 3, redCards: 0 }, idNumber: '1712345689', birthDate: '1992-04-10', jerseyNumber: 10, status: 'activo' },
    { id: 'p-013', name: 'Joshua Kimmich', photoUrl: 'https://placehold.co/400x400.png', idCardUrl: 'https://placehold.co/856x540.png', team: 'Asteroide FC', teamId: '9', category: 'Segunda', position: 'Mediocampista', stats: { goals: 7, assists: 15, yellowCards: 5, redCards: 0 }, idNumber: '1712345690', birthDate: '1995-02-08', jerseyNumber: 6, status: 'activo' },
];


export let standings: Standing[] = teams.map((team, index) => ({
    rank: index + 1,
    teamId: team.id,
    teamName: team.name,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
}));


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

export let upcomingMatches: Match[] = [
    {
        id: 'm1',
        date: yesterday.toISOString(),
        category: 'Máxima',
        teams: {
            home: { ...teams[0], attended: true, vocalPaymentDetails: {...defaultVocalPayment, redCardFine: 5, total: 18, paymentStatus: 'paid'} },
            away: { ...teams[1], attended: true, vocalPaymentDetails: {...defaultVocalPayment, yellowCardFine: 2, total: 15, paymentStatus: 'pending'}  }
        },
        status: 'finished',
        score: { home: 2, away: 1 },
        events: [
            { id: 'evt-m1-1', playerId: 'p-001', playerName: 'Lionel Messi', teamName: 'Cosmic Comets', event: 'goal' },
            { id: 'evt-m1-2', playerId: 'p-002', playerName: 'Cristiano Ronaldo', teamName: 'Cosmic Comets', event: 'goal' },
            { id: 'evt-m1-3', playerId: 'p-004', playerName: 'Kylian Mbappé', teamName: 'Solar Flares', event: 'goal' },
        ]
    },
    {
        id: 'm2',
        date: tomorrow.toISOString(),
        category: 'Primera',
        teams: {
            home: { ...teams[4], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams[5], attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} }
        },
        status: 'future',
        score: { home: 0, away: 0 },
        events: []
    },
     {
        id: 'm3',
        date: today.toISOString(),
        category: 'Segunda',
        teams: {
            home: { ...teams.find(t => t.id === '7')!, attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams.find(t => t.id === '8')!, attended: false, vocalPaymentDetails: { ...defaultVocalPayment, total: 0, paymentStatus: 'pending'} }
        },
        status: 'in-progress',
        score: { home: 0, away: 0 },
        events: []
    },
    {
        id: 'm4',
        date: yesterday.toISOString(),
        category: 'Segunda',
        teams: {
            home: { ...teams.find(t => t.id === '9')!, attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} },
            away: { ...teams.find(t => t.id === '10')!, attended: true, vocalPaymentDetails: {...defaultVocalPayment, paymentStatus: 'paid'} }
        },
        status: 'finished',
        score: { home: 0, away: 0 },
        events: []
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
export const getTeamsByCategory = (category: Category, group?: 'A' | 'B'): Team[] => teams.filter(t => {
    const categoryMatch = t.category === category;
    if (!group) return categoryMatch;
    return categoryMatch && t.group === group;
});
export const getMatchesByTeamId = (teamId: string): Match[] => upcomingMatches.filter(m => m.teams.home.id === teamId || m.teams.away.id === teamId);


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

export const getMatchById = (id: string): Match | undefined => upcomingMatches.find(m => m.id === id);

export const updateMatchData = (updatedMatch: Match) => {
    const index = upcomingMatches.findIndex(m => m.id === updatedMatch.id);
    if (index !== -1) {
        upcomingMatches[index] = updatedMatch;
    }
};

export const setMatchAsFinished = (matchId: string) => {
    const index = upcomingMatches.findIndex(m => m.id === matchId);
    if (index !== -1) {
        upcomingMatches[index].status = 'finished';
    }
};

export const generateFinancialReport = (matches: Match[], expenses: Expense[]): string => {
    let report = "REPORTE FINANCIERO - LIGA LA LUZ\n";
    report += "===================================\n\n";

    let totalIncome = 0;
    const incomeByTeam: Record<string, number> = {};

    report += "INGRESOS POR VOCALÍA:\n";
    report += "---------------------\n";

    matches.forEach(match => {
        if (match.teams.home.vocalPaymentDetails?.paymentStatus === 'paid') {
            const income = match.teams.home.vocalPaymentDetails.total;
            totalIncome += income;
            incomeByTeam[match.teams.home.name] = (incomeByTeam[match.teams.home.name] || 0) + income;
            report += `[${new Date(match.date).toLocaleDateString()}] ${match.teams.home.name}: $${income.toFixed(2)}\n`;
        }
        if (match.teams.away.vocalPaymentDetails?.paymentStatus === 'paid') {
            const income = match.teams.away.vocalPaymentDetails.total;
            totalIncome += income;
            incomeByTeam[match.teams.away.name] = (incomeByTeam[match.teams.away.name] || 0) + income;
            report += `[${new Date(match.date).toLocaleDateString()}] ${match.teams.away.name}: $${income.toFixed(2)}\n`;
        }
    });
    
    report += `\n**SUBTOTAL INGRESOS POR VOCALÍAS: $${totalIncome.toFixed(2)}**\n`;

    report += "\n\nGASTOS REGISTRADOS:\n";
    report += "-------------------\n";
    let totalExpenses = 0;
    expenses.forEach(expense => {
        totalExpenses += expense.amount;
        report += `[${new Date(expense.date).toLocaleDateString()}] ${expense.description}: -$${expense.amount.toFixed(2)}\n`;
    });
    report += `\n**TOTAL GASTOS: $${totalExpenses.toFixed(2)}**\n`;


    report += "\n\nPAGOS PENDIENTES:\n";
    report += "-----------------\n";
    let totalPending = 0;
    matches.forEach(match => {
        if (match.teams.home.vocalPaymentDetails?.paymentStatus === 'pending') {
            const pendingAmount = match.teams.home.vocalPaymentDetails.total;
            totalPending += pendingAmount;
            report += `[${new Date(match.date).toLocaleDateString()}] ${match.teams.home.name}: $${pendingAmount.toFixed(2)}\n`;
        }
        if (match.teams.away.vocalPaymentDetails?.paymentStatus === 'pending') {
            const pendingAmount = match.teams.away.vocalPaymentDetails.total;
            totalPending += pendingAmount;
            report += `[${new Date(match.date).toLocaleDateString()}] ${match.teams.away.name}: $${pendingAmount.toFixed(2)}\n`;
        }
    });
     report += `\n**TOTAL PENDIENTE: $${totalPending.toFixed(2)}**\n`;

     report += "\n\n===================================\n";
     report += ` BALANCE FINAL (Ingresos - Gastos): $${(totalIncome - totalExpenses).toFixed(2)}\n`;
     report += "===================================\n";


    return report;
};

export let requalificationRequests: RequalificationRequest[] = [
    {
        id: 'req-1',
        teamId: '1',
        teamName: 'Cosmic Comets',
        requestType: 'requalification',
        playerInName: 'Ansu Fati',
        playerOutName: 'Neymar Jr',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        status: 'pending',
    },
    {
        id: 'req-2',
        teamId: '2',
        teamName: 'Solar Flares',
        requestType: 'qualification',
        playerInName: 'Pedri González',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        status: 'pending',
    },
    {
        id: 'req-3',
        teamId: '5',
        teamName: 'Vortex Voyagers',
        requestType: 'qualification',
        playerInName: 'Gavi',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        status: 'approved',
    },
     {
        id: 'req-4',
        teamId: '7',
        teamName: 'Quasar Quest',
        requestType: 'requalification',
        playerInName: 'Ferran Torres',
        playerOutName: 'Un Jugador Viejo',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        status: 'rejected',
    },
];

export const getRequalificationRequests = (): RequalificationRequest[] => requalificationRequests;
