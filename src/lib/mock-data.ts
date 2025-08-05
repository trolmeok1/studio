

import { db } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import type { Player, Team, Standing, Sanction, Scorer, Match, Expense, RequalificationRequest, VocalPaymentDetails, LogEntry, User, Category } from './types';
import { get } from 'http';

// Firestore collection references
const teamsCollection = collection(db, 'teams');
const playersCollection = collection(db, 'players');
const standingsCollection = collection(db, 'standings');
const sanctionsCollection = collection(db, 'sanctions');
const matchesCollection = collection(db, 'matches');
const expensesCollection = collection(db, 'expenses');
const requalificationRequestsCollection = collection(db, 'requalificationRequests');
const usersCollection = collection(db, 'users');
const logsCollection = collection(db, 'logs');

// Helper to convert Firestore snapshot to array
const snapshotToArray = <T>(snapshot: any): (T & { id: string })[] => {
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
};

// --- Teams ---
export const getTeams = async (): Promise<Team[]> => {
    const snapshot = await getDocs(teamsCollection);
    return snapshotToArray<Team>(snapshot);
};

export const getTeamById = async (id: string): Promise<Team | undefined> => {
    if (!id) return undefined;
    const teamDoc = await getDoc(doc(db, 'teams', id));
    return teamDoc.exists() ? { id: teamDoc.id, ...teamDoc.data() } as Team : undefined;
};

export const getTeamsByCategory = async (category: string, group?: 'A' | 'B'): Promise<Team[]> => {
    let q = query(teamsCollection, where("category", "==", category));
    if (group) {
        q = query(q, where("group", "==", group));
    }
    const snapshot = await getDocs(q);
    return snapshotToArray<Team>(snapshot);
}

// --- Players ---
export const getPlayers = async (): Promise<Player[]> => {
    const snapshot = await getDocs(playersCollection);
    return snapshotToArray<Player>(snapshot);
};

export const getPlayerById = async (id: string): Promise<Player | undefined> => {
    if (!id) return undefined;
    const playerDoc = await getDoc(doc(db, 'players', id));
    return playerDoc.exists() ? { id: playerDoc.id, ...playerDoc.data() } as Player : undefined;
};

export const getPlayersByTeamId = async (teamId: string): Promise<Player[]> => {
    if (!teamId) return [];
    const q = query(playersCollection, where("teamId", "==", teamId));
    const snapshot = await getDocs(q);
    return snapshotToArray<Player>(snapshot);
};

export const updatePlayerStats = async (playerId: string, statsUpdate: { goals: number, assists: number, yellowCards: number, redCards: number }) => {
    const playerRef = doc(db, 'players', playerId);
    const playerDoc = await getDoc(playerRef);
    if (playerDoc.exists()) {
        const currentStats = playerDoc.data().stats || { goals: 0, assists: 0, yellowCards: 0, redCards: 0 };
        await updateDoc(playerRef, {
            'stats.goals': currentStats.goals + statsUpdate.goals,
            'stats.assists': currentStats.assists + statsUpdate.assists,
            'stats.yellowCards': currentStats.yellowCards + statsUpdate.yellowCards,
            'stats.redCards': currentStats.redCards + statsUpdate.redCards,
        });
    }
};

// --- Standings ---
export const getStandings = async (): Promise<Standing[]> => {
    const snapshot = await getDocs(standingsCollection);
    const standingsData = snapshotToArray<Standing>(snapshot);
    
    // Group by category to rank separately
    const categories = [...new Set(standingsData.map(s => s.category))];
    let allRankedStandings: Standing[] = [];

    categories.forEach(category => {
        const categoryStandings = standingsData
            .filter(s => s.category === category)
            .sort((a, b) => {
                if (b.points !== a.points) {
                    return b.points - a.points;
                }
                return (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
            })
            .map((s, index) => ({...s, rank: index + 1}));
        allRankedStandings.push(...categoryStandings);
    });

    return allRankedStandings;
};


// --- Scorers (Top 10) ---
export const getTopScorers = async (): Promise<Scorer[]> => {
    const snapshot = await getDocs(query(playersCollection));
    const playersData = snapshotToArray<Player>(snapshot);
    return playersData
        .filter(player => player.stats && player.stats.goals > 0) // Ensure player has stats and goals
        .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
        .slice(0, 10)
        .map((player, index) => ({
            rank: index + 1,
            playerId: player.id,
            playerName: player.name,
            playerPhotoUrl: player.photoUrl,
            teamName: player.team,
            teamId: player.teamId,
            goals: player.stats?.goals || 0,
        }));
};

// --- Sanctions ---
export const getSanctions = async (): Promise<Sanction[]> => {
    const snapshot = await getDocs(sanctionsCollection);
    return snapshotToArray<Sanction>(snapshot);
};

export const getSanctionsByTeamId = async (teamId: string): Promise<Sanction[]> => {
    if (!teamId) return [];
    const q = query(sanctionsCollection, where("teamId", "==", teamId));
    const snapshot = await getDocs(q);
    return snapshotToArray<Sanction>(snapshot);
};

export const addSanction = async (newSanction: Omit<Sanction, 'id'>) => {
    await addDoc(sanctionsCollection, newSanction);
};

// --- Matches ---
export const getMatches = async (): Promise<Match[]> => {
    const snapshot = await getDocs(matchesCollection);
    return snapshotToArray<Match>(snapshot);
};

export const getMatchById = async (id: string): Promise<Match | undefined> => {
    if (!id) return undefined;
    const matchDoc = await getDoc(doc(db, 'matches', id));
    return matchDoc.exists() ? { id: matchDoc.id, ...matchDoc.data() } as Match : undefined;
};

export const getMatchesByTeamId = async (teamId: string): Promise<Match[]> => {
    if (!teamId) return [];
    const homeQuery = query(matchesCollection, where("teams.home.id", "==", teamId));
    const awayQuery = query(matchesCollection, where("teams.away.id", "==", teamId));
    const [homeSnapshot, awaySnapshot] = await Promise.all([getDocs(homeQuery), getDocs(awayQuery)]);
    const homeMatches = snapshotToArray<Match>(homeSnapshot);
    const awayMatches = snapshotToArray<Match>(awaySnapshot);
    const allMatches = [...homeMatches, ...awayMatches];
    // Remove duplicates
    return allMatches.filter((match, index, self) => index === self.findIndex(m => m.id === match.id));
};

export const updateMatchData = async (updatedMatch: Match) => {
    const matchRef = doc(db, 'matches', updatedMatch.id);
    await updateDoc(matchRef, { ...updatedMatch });
};

export const setMatchAsFinished = async (matchId: string) => {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, { status: 'finished' });
};

// --- Expenses ---
export const getExpenses = async (): Promise<Expense[]> => {
    const snapshot = await getDocs(expensesCollection);
    return snapshotToArray<Expense>(snapshot);
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
    const docRef = await addDoc(expensesCollection, expense);
    return { id: docRef.id, ...expense };
};

export const removeExpense = async (id: string) => {
    await deleteDoc(doc(db, 'expenses', id));
};


// --- Vocal Payments --- (Derived from matches, not a separate collection)
export const getVocalPaymentsByTeamId = async (teamId: string): Promise<any[]> => {
    if (!teamId) return [];
    const matches = await getMatchesByTeamId(teamId);
    return matches
        .filter(m => m.status === 'finished')
        .map(match => {
            const isHome = match.teams.home.id === teamId;
            const details = isHome ? match.teams.home.vocalPaymentDetails : match.teams.away.vocalPaymentDetails;
            const opponent = isHome ? match.teams.away : match.teams.home;
            return {
                date: match.date,
                opponent: opponent.name,
                opponentId: opponent.id,
                amount: details?.total || 0,
                status: details?.paymentStatus || 'pending'
            };
    });
};

// --- Requalification Requests ---
export const getRequalificationRequests = async (): Promise<RequalificationRequest[]> => {
    const snapshot = await getDocs(requalificationRequestsCollection);
    return snapshotToArray<RequalificationRequest>(snapshot);
};

// --- USERS (for auth roles) ---
export const getUsers = async (): Promise<User[]> => {
    const snapshot = await getDocs(usersCollection);
    return snapshotToArray<User>(snapshot);
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    if (!email) return null;
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const userDoc = snapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

export const updateUser = async (user: User) => {
     if (!user || !user.id) return;
     const userRef = doc(db, 'users', user.id);
     // Omit id from the data being written to Firestore
     const { id, ...userData } = user;
     await updateDoc(userRef, userData);
}

// --- Logs ---
export const getSystemLogs = async (): Promise<LogEntry[]> => {
    const snapshot = await getDocs(logsCollection);
    const logs = snapshotToArray<LogEntry>(snapshot);
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};


// --- Dashboard data would be derived/aggregated in a real app ---
export const getDashboardStats = async () => {
    const [playersSnap, teamsSnap, matchesSnap] = await Promise.all([
        getDocs(playersCollection),
        getDocs(teamsCollection),
        getDocs(matchesCollection)
    ]);
    const matches = snapshotToArray<Match>(matchesSnap);
    
    return {
        players: { approved: playersSnap.size, new: 0, rejected: 0 },
        teams: { approved: teamsSnap.size, registered: teamsSnap.size, rejected: 0, sanctioned: 0 },
        matchesPlayed: matches.filter(m => m.status === 'finished').length,
        goalsScored: matches.reduce((acc, m) => acc + (m.score?.home || 0) + (m.score?.away || 0), 0),
    };
};
