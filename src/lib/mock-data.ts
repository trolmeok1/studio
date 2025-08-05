
import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry, MatchEvent, Expense, RequalificationRequest, User, Permissions } from './types';
export type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry, MatchEvent, Expense, RequalificationRequest, User, Permissions };
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, query, where, limit, orderBy } from 'firebase/firestore';


const allPermissions: Permissions = {
    dashboard: { view: true, edit: true },
    players: { view: true, edit: true },
    schedule: { view: true, edit: true },
    partido: { view: true, edit: true },
    copa: { view: true, edit: true },
    aiCards: { view: true, edit: true },
    committees: { view: true, edit: true },
    treasury: { view: true, edit: true },
    requests: { view: true, edit: true },
    reports: { view: true, edit: true },
    teams: { view: true, edit: true },
    roles: { view: true, edit: true },
    logs: { view: true, edit: true },
};

const secretaryPermissions: Permissions = {
    ...allPermissions,
    roles: { view: false, edit: false },
    logs: { view: false, edit: false },
};

// --- Users ---
export const getUsers = async (): Promise<User[]> => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where("email", "==", email), limit(1));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) return undefined;
    const userDoc = userSnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
};

export const updateUser = async (updatedUser: User) => {
    const userRef = doc(db, 'users', updatedUser.id);
    await updateDoc(userRef, { ...updatedUser });
};

// --- Expenses ---
export const getExpenses = async (): Promise<Expense[]> => {
    const expensesCol = collection(db, 'expenses');
    const expenseSnapshot = await getDocs(query(expensesCol, orderBy('date', 'desc')));
    return expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const expensesCol = collection(db, 'expenses');
    const docRef = await addDoc(expensesCol, expense);
    return { id: docRef.id, ...expense };
}

export const removeExpense = async (id: string) => {
    const expenseRef = doc(db, 'expenses', id);
    await deleteDoc(expenseRef);
}


// --- Teams ---
export const getTeams = async (): Promise<Team[]> => {
    const teamsCol = collection(db, 'teams');
    const teamSnapshot = await getDocs(teamsCol);
    return teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

export const getTeamById = async (id: string): Promise<Team | undefined> => {
    const teamRef = doc(db, 'teams', id);
    const teamSnap = await getDoc(teamRef);
    return teamSnap.exists() ? { id: teamSnap.id, ...teamSnap.data() } as Team : undefined;
};

export const getTeamsByCategory = async (category: Category, group?: 'A' | 'B'): Promise<Team[]> => {
    const teamsCol = collection(db, 'teams');
    let q;
    if (group) {
        q = query(teamsCol, where("category", "==", category), where("group", "==", group));
    } else {
        q = query(teamsCol, where("category", "==", category));
    }
    const teamSnapshot = await getDocs(q);
    return teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

// --- Players ---
export const getPlayers = async (): Promise<Player[]> => {
    const playersCol = collection(db, 'players');
    const playerSnapshot = await getDocs(playersCol);
    return playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
};

export const getPlayerById = async (id: string): Promise<Player | undefined> => {
    const playerRef = doc(db, 'players', id);
    const playerSnap = await getDoc(playerRef);
    return playerSnap.exists() ? { id: playerSnap.id, ...playerSnap.data() } as Player : undefined;
};

export const getPlayersByTeamId = async (teamId: string): Promise<Player[]> => {
    const playersCol = collection(db, 'players');
    const q = query(playersCol, where("teamId", "==", teamId));
    const playerSnapshot = await getDocs(q);
    return playerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
};

export const updatePlayerStats = async (playerId: string, statsUpdate: { goals: number, assists: number, yellowCards: number, redCards: number }) => {
    const playerRef = doc(db, 'players', playerId);
    const playerSnap = await getDoc(playerRef);
    if (playerSnap.exists()) {
        const currentStats = playerSnap.data().stats || { goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
        await updateDoc(playerRef, {
            'stats.goals': currentStats.goals + statsUpdate.goals,
            'stats.assists': currentStats.assists + statsUpdate.assists,
            'stats.yellowCards': currentStats.yellowCards + statsUpdate.yellowCards,
            'stats.redCards': currentStats.redCards + statsUpdate.redCards,
        });
    }
};

export const updatePlayerStatus = async (playerId: string, status: 'activo' | 'inactivo') => {
    const playerRef = doc(db, 'players', playerId);
    await updateDoc(playerRef, { status: status });
};

// --- Standings ---
export const getStandings = async (): Promise<Standing[]> => {
    const standingsCol = collection(db, 'standings');
    const standingsSnapshot = await getDocs(standingsCol);
    return standingsSnapshot.docs.map(doc => ({ ...doc.data(), teamId: doc.id } as Standing));
};


// --- Scorers ---
export const getTopScorers = async (): Promise<Scorer[]> => {
    const playersCol = collection(db, 'players');
    const q = query(playersCol, orderBy('stats.goals', 'desc'), limit(10));
    const playerSnapshot = await getDocs(q);
    return playerSnapshot.docs.map((doc, index) => {
        const player = doc.data() as Player;
        return {
            rank: index + 1,
            playerId: doc.id,
            playerName: player.name,
            playerPhotoUrl: player.photoUrl,
            teamName: player.team,
            teamId: player.teamId,
            goals: player.stats.goals,
        };
    });
};

// --- Sanctions ---
export const getSanctions = async (): Promise<Sanction[]> => {
    const sanctionsCol = collection(db, 'sanctions');
    const sanctionSnapshot = await getDocs(sanctionsCol);
    return sanctionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sanction));
};

export const addSanction = async (newSanction: Omit<Sanction, 'id'>) => {
    const sanctionsCol = collection(db, 'sanctions');
    await addDoc(sanctionsCol, newSanction);
};


// --- Matches ---
export const getMatches = async (): Promise<Match[]> => {
    const matchesCol = collection(db, 'matches');
    const matchSnapshot = await getDocs(matchesCol);
    return matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
};

export const getMatchesByTeamId = async (teamId: string): Promise<Match[]> => {
    const allMatches = await getMatches();
    return allMatches.filter(m => m.teams.home.id === teamId || m.teams.away.id === teamId);
}

export const getMatchById = async (id: string): Promise<Match | undefined> => {
    const matchRef = doc(db, 'matches', id);
    const matchSnap = await getDoc(matchRef);
    return matchSnap.exists() ? { id: matchSnap.id, ...matchSnap.data() } as Match : undefined;
};

export const updateMatchData = async (updatedMatch: Match) => {
    const matchRef = doc(db, 'matches', updatedMatch.id);
    await updateDoc(matchRef, { ...updatedMatch });
};

export const setMatchAsFinished = async (matchId: string) => {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, { status: 'finished' });
};


// --- Requests ---
export const getRequalificationRequests = async (): Promise<RequalificationRequest[]> => {
    const requestsCol = collection(db, 'requalificationRequests');
    const requestSnapshot = await getDocs(requestsCol);
    return requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequalificationRequest));
};

// --- Logs ---
export const getSystemLogs = async (): Promise<LogEntry[]> => {
    const logsCol = collection(db, 'logs');
    const logSnapshot = await getDocs(query(logsCol, orderBy('timestamp', 'desc')));
    return logSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry));
};

// --- Dashboard Stats ---
export const getDashboardStats = async (): Promise<DashboardStats> => {
    // This is a complex aggregation. For a real app, this would be better handled 
    // by a backend function or by keeping aggregate counts in a separate document.
    // Here, we'll fetch everything and compute, which is inefficient for large datasets.
    const players = await getPlayers();
    const teams = await getTeams();
    const matches = await getMatches();
    const goalsScored = players.reduce((sum, p) => sum + (p.stats.goals || 0), 0);
    
    return Promise.resolve({
        categories: [...new Set(teams.map(t => t.category))].length,
        stages: 3, // Mock
        fines: 48, // Mock
        matchesPlayed: matches.filter(m => m.status === 'finished').length,
        goalsScored: goalsScored,
        yellowCards: players.reduce((sum, p) => sum + (p.stats.yellowCards || 0), 0),
        redCards: players.reduce((sum, p) => sum + (p.stats.redCards || 0), 0),
        teams: {
            registered: 2, // Mock
            approved: teams.length,
            rejected: 9, // Mock
            sanctioned: 1, // Mock
        },
        players: {
            approved: players.length,
            new: players.filter(p => new Date(p.careerHistory?.[0]?.startDate || 0) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
            rejected: 1470, // Mock
        }
    });
}


// These are now empty or used as fallbacks, as data comes from Firestore.
export let players: Player[] = [];
export let teams: Team[] = [];
export let standings: Standing[] = [];
export let systemLogs: LogEntry[] = [];
export let requalificationRequests: RequalificationRequest[] = [];
export let upcomingMatches: Match[] = [];
export const achievements: Achievement[] = [];
export const matchData: MatchData | {} = {};
