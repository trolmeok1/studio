export type Category = 'Copa' | 'Primera' | 'Máxima';

export interface Player {
  id: string;
  name: string;
  photoUrl: string;
  team: string;
  teamId: string;
  category: Category;
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
}

export interface Standing {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogoUrl: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

export interface Sanction {
  id: string;
  playerName: string;
  teamName: string;
  reason: string;
  gamesSuspended: number;
  date: string;
}

export interface Scorer {
  rank: number;
  playerName: string;
  teamName: string;
  goals: number;
}
