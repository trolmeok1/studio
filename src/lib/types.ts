

export type Category = 'Copa' | 'Primera' | 'Máxima' | 'Segunda';
export type PlayerPosition = 'Portero' | 'Defensa' | 'Mediocampista' | 'Delantero';

export interface Player {
  id: string;
  name: string;
  photoUrl: string;
  team: string;
  teamId: string;
  category: Category;
  position: PlayerPosition;
  stats: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  category: Category;
  abbreviation?: string;
  foundationDate?: string;
  manager?: string;
}

export interface Match {
    id: string;
    date: string;
    category: Category;
    teams: {
        home: Team;
        away: Team;
    };
    lineup: {
        home: Player[];
        away: Player[];
    };
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
