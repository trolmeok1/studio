


export type Category = 'Primera' | 'Máxima' | 'Segunda';
export type PlayerPosition = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
export type PlayerStatus = 'activo' | 'inactivo';

export interface Player {
  id: string;
  name: string;
  idNumber: string;
  birthDate: string;
  jerseyNumber: number;
  photoUrl: string;
  idCardUrl?: string; // Image of the full ID card
  team: string;
  teamId: string;
  category: Category;
  position: PlayerPosition;
  status: PlayerStatus;
  statusReason?: string;
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface Person {
    name: string;
    phone?: string;
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  category: Category;
  president?: Person;
  vicePresident?: Person;
  secretary?: Person;
  treasurer?: Person;
  vocal?: Person;
  delegates?: Person[];
}

export interface VocalPaymentDetails {
    referee: number;
    fee: number;
    yellowCardFine: number;
    redCardFine: number;
    otherFines: number;
    otherFinesDescription: string;
    total: number;
    paymentStatus: 'paid' | 'pending';
}

export interface MatchTeam extends Team {
    attended: boolean;
    vocalPaymentDetails?: VocalPaymentDetails;
}

export interface Match {
    id: string;
    date: string;
    category: Category;
    teams: {
        home: MatchTeam;
        away: MatchTeam;
    };
    status: 'future' | 'in-progress' | 'finished';
    score?: {
        home: number;
        away: number;
    };
}

export interface GeneratedMatch {
    home: string;
    away: string;
    date?: Date;
    time?: string;
}

export interface MatchDataTeam extends Team {
    players: Player[];
    score: number;
    attended: boolean;
    vocalPaymentDetails: VocalPaymentDetails;
}

export interface MatchData {
    date: string;
    time: string;
    category: Category;
    phase: string;
    matchday: string;
    field: string;
    vocalTeam: string;
    teamA: MatchDataTeam;
    teamB: MatchDataTeam;
}


export interface Standing {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogoUrl?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Sanction {
  id: string;
  playerId: string;
  playerName: string;
  playerPhotoUrl: string;
  teamName: string;
  teamId: string;
  reason: string;
  gamesSuspended: number;
  date: string;
}

export interface Scorer {
  rank: number;
  playerId: string;
  playerName: string;
  playerPhotoUrl: string;
  teamName: string;
  teamId: string;
  goals: number;
}

export interface Achievement {
    teamName: string;
    teamLogoUrl: string;
    achievement: string;
    category: string;
    year: string;
}

export interface DashboardStats {
    categories: number;
    stages: number;
    referees: number;
    fines: number;
    matchesPlayed: number;
    goalsScored: number;
    yellowCards: number;
    redCards: number;
    teams: {
        registered: number;
        approved: number;
        rejected: number;
        sanctioned: number;
    };
    players: {
        approved: number;
        new: number;
        rejected: number;
    };
}

export type MatchEventType = 'goal' | 'yellow_card' | 'red_card';

export interface MatchEvent {
  id: string;
  playerId: string;
  playerName: string;
  teamName: string;
  event: MatchEventType;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  userAvatar: string;
  action: 'create' | 'update' | 'delete' | 'payment' | 'generate' | 'system';
  category: 'team' | 'player' | 'treasury' | 'system' | 'match';
  description: string;
}

    