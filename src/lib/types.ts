

export type Category = 'Primera' | 'Máxima' | 'Segunda' | 'Copa';
export type PlayerPosition = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';
export type PlayerStatus = 'activo' | 'inactivo';

export interface PlayerCareer {
    teamName: string;
    startDate: string;
    endDate?: string;
}

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
  careerHistory?: PlayerCareer[];
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
  group?: 'A' | 'B';
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
    advancePayment: number;
    includePendingDebt: boolean;
    total: number;
    paymentStatus: 'paid' | 'pending';
}

export interface MatchTeam {
    id: string;
    name: string;
    logoUrl: string;
    attended: boolean;
    vocalPaymentDetails?: VocalPaymentDetails;
}

export type MatchEventType = 'goal' | 'assist' | 'yellow_card' | 'red_card';

export interface MatchEvent {
  id: string;
  playerId: string;
  playerName: string;
  teamName: string;
  event: MatchEventType;
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
    events: MatchEvent[];
    refereeName?: string;
    vocalName?: string;
    field?: number;
    vocalTeam?: Team;
    physicalSheetUrl?: string;
}

export interface GeneratedMatch {
    id: string;
    home: string; // teamId
    away: string; // teamId
    category: Category;
    group?: 'A' | 'B';
    leg?: 'Ida' | 'Vuelta' | 'Semifinal' | 'Final';
    date: Date;
    time: string;
    field?: number;
    rescheduled?: boolean;
    originalDate?: Date;
    homeDressingRoom?: number;
    awayDressingRoom?: number;
    round?: number;
    vocalTeamId?: string;
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
  group?: 'A' | 'B';
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

export interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  userAvatar: string;
  action: 'create' | 'update' | 'delete' | 'payment' | 'generate' | 'system';
  category: 'team' | 'player' | 'treasury' | 'system' | 'match';
  description: string;
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
}

export interface RequalificationRequest {
    id: string;
    teamId: string;
    teamName: string;
    requestType: 'qualification' | 'requalification';
    playerInName: string;
    playerOutName?: string | null;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
}

export type UserRole = 'admin' | 'secretary' | 'guest';

export interface Permissions {
    dashboard: { view: boolean; edit: boolean };
    players: { view: boolean; edit: boolean };
    schedule: { view: boolean; edit: boolean };
    partido: { view: boolean; edit: boolean };
    copa: { view: boolean; edit: boolean };
    aiCards: { view: boolean; edit: boolean };
    committees: { view: boolean; edit: boolean };
    treasury: { view: boolean; edit: boolean };
    requests: { view: boolean; edit: boolean };
    reports: { view: boolean; edit: boolean };
    teams: { view: boolean; edit: boolean };
    roles: { view: boolean; edit: boolean };
    logs: { view: boolean; edit: boolean };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  permissions: Permissions;
  avatarUrl?: string;
}
