

import type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry, MatchEvent, Expense, RequalificationRequest, User, Permissions } from './types';
export type { Player, Team, Standing, Sanction, Scorer, Achievement, DashboardStats, Category, Match, MatchData, VocalPaymentDetails, LogEntry, MatchEvent, Expense, RequalificationRequest, User, Permissions };
import { db, storage, auth } from './firebase';
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, updateDoc, query, where, limit, orderBy, writeBatch, setDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import type { CarouselImage } from '@/app/(app)/dashboard/page';

// --- IMPORTANT: Set your admin email here ---
export const ADMIN_EMAIL = 'alejandroespin2021@gmail.com';


// --- Settings ---
export const getCarouselImages = async (): Promise<CarouselImage[]> => {
    const settingsRef = doc(db, 'settings', 'carousel');
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
        return docSnap.data().images || [];
    }
    return [];
};

export const saveCarouselImages = async (images: CarouselImage[]) => {
    const settingsRef = doc(db, 'settings', 'carousel');
    // We only save the src, alt, and title. The hint is for generation and not stored.
    const imagesToSave = images.map(({ src, alt, title }) => ({ src, alt, title }));
    await setDoc(settingsRef, { images: imagesToSave });
};


// --- Users ---
export const getUsers = async (): Promise<User[]> => {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, where("email", "==", email.toLowerCase()), limit(1));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.empty) return undefined;
    const userDoc = userSnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
};

export const updateUser = async (updatedUser: User) => {
    if(!updatedUser.id) throw new Error("User ID is required for update.");
    const userRef = doc(db, 'users', updatedUser.id);
    const { id, ...userData } = updatedUser;
    await updateDoc(userRef, userData);
};

export const addUser = async (newUser: Omit<User, 'id'>): Promise<User> => {
    const usersCol = collection(db, 'users');
    
    // Normalize email for query
    const userEmailLower = newUser.email.toLowerCase();
    
    // Check if user already exists by email to prevent duplicates in Firestore
    const q = query(usersCol, where("email", "==", userEmailLower), limit(1));
    const existingUserSnapshot = await getDocs(q);
    if (!existingUserSnapshot.empty) {
        // User already exists in Firestore, just return it.
        const doc = existingUserSnapshot.docs[0];
        console.log("User already exists in Firestore:", doc.id);
        return { id: doc.id, ...doc.data() } as User;
    }
    
    // User does not exist, add them.
    console.log("Adding new user to Firestore:", userEmailLower);
    const docRef = await addDoc(usersCol, { ...newUser, email: userEmailLower });
    return { id: docRef.id, ...newUser, email: userEmailLower } as User;
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

export const addTeam = async (teamData: Pick<Team, 'name' | 'category'>, logoDataUri: string | null): Promise<Team> => {
    const newTeamRef = doc(collection(db, 'teams'));
    
    const newTeamData: Omit<Team, 'id' | 'logoUrl' | 'group'> & { group?: 'A' | 'B' } = {
        name: teamData.name,
        category: teamData.category,
        president: { name: '' },
        vicePresident: { name: '' },
        secretary: { name: '' },
        treasurer: { name: '' },
        vocal: { name: '' },
        delegates: [],
        logoUrl: '', // Will be updated after upload
    };

    if (teamData.category === 'Segunda') {
        newTeamData.group = 'A';
    }

    await setDoc(newTeamRef, newTeamData);
    const newTeamId = newTeamRef.id;

    let finalLogoUrl = 'https://placehold.co/100x100.png';
    if (logoDataUri && logoDataUri.startsWith('data:image')) {
        const storageRef = ref(storage, `team-logos/${newTeamId}`);
        const snapshot = await uploadString(storageRef, logoDataUri, 'data_url');
        finalLogoUrl = await getDownloadURL(snapshot.ref);
    }
    
    await updateDoc(newTeamRef, { logoUrl: finalLogoUrl });
    
    const finalDoc = await getDoc(newTeamRef);
    return { id: finalDoc.id, ...finalDoc.data() } as Team;
};

export const updateTeam = async (teamId: string, teamData: Partial<Team>, logoDataUri: string | null): Promise<Team> => {
    const teamRef = doc(db, 'teams', teamId);
    
    // Create a copy to avoid mutating the original object from the state
    const updateData: { [key: string]: any } = JSON.parse(JSON.stringify(teamData));

    // Remove the id from the data to be written to Firestore
    delete updateData.id;

    if (logoDataUri && logoDataUri.startsWith('data:image')) {
        const storageRef = ref(storage, `team-logos/${teamId}`);
        const snapshot = await uploadString(storageRef, logoDataUri, 'data_url');
        updateData.logoUrl = await getDownloadURL(snapshot.ref);
    }

    await updateDoc(teamRef, updateData);
    const updatedDoc = await getDoc(teamRef);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Team;
};

export const deleteTeam = async (teamId: string): Promise<void> => {
    if (!teamId) throw new Error("Team ID is required for deletion.");
    const batch = writeBatch(db);

    // Delete the team itself
    const teamRef = doc(db, 'teams', teamId);
    batch.delete(teamRef);

    // Find and delete all players associated with the team
    const playersRef = collection(db, 'players');
    const q = query(playersRef, where("teamId", "==", teamId));
    const playersSnapshot = await getDocs(q);
    playersSnapshot.forEach(playerDoc => {
        batch.delete(playerDoc.ref);
    });

    // Commit the batch delete
    await batch.commit();
};


export const getTeamById = async (id: string): Promise<Team | undefined> => {
    if (!id) return undefined;
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

export const addPlayer = async (playerData: Omit<Player, 'id' | 'photoUrl' | 'status' | 'stats' | 'careerHistory'>, photoDataUri: string): Promise<Player> => {
    const newPlayerRef = doc(collection(db, 'players'));
    
    const initialPlayerData: Omit<Player, 'id' | 'photoUrl'> = {
        ...playerData,
        photoUrl: '', 
        status: 'activo',
        stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
        careerHistory: [{
            teamName: playerData.team,
            startDate: new Date().toISOString(),
        }]
    };
    await setDoc(newPlayerRef, initialPlayerData);
    const newPlayerId = newPlayerRef.id;

    let photoUrl = 'https://placehold.co/200x200.png';
    if (photoDataUri) {
        try {
            const storageRef = ref(storage, `player-photos/${newPlayerId}`);
            const snapshot = await uploadString(storageRef, photoDataUri, 'data_url');
            photoUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Error uploading photo, deleting player doc. Error:", error);
            await deleteDoc(newPlayerRef);
            throw error;
        }
    }

    await updateDoc(newPlayerRef, { photoUrl: photoUrl });

    const finalPlayerDoc = await getDoc(newPlayerRef);
    return { id: newPlayerId, ...finalPlayerDoc.data() } as Player;
};


export const getPlayerById = async (id: string): Promise<Player | undefined> => {
    if (!id) return undefined;
    const playerRef = doc(db, 'players', id);
    const playerSnap = await getDoc(playerRef);
    return playerSnap.exists() ? { id: playerSnap.id, ...playerSnap.data() } as Player : undefined;
};

export const getPlayersByTeamId = async (teamId: string): Promise<Player[]> => {
    if (!teamId) return [];
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
            'stats.goals': (currentStats.goals || 0) + statsUpdate.goals,
            'stats.assists': (currentStats.assists || 0) + statsUpdate.assists,
            'stats.yellowCards': (currentStats.yellowCards || 0) + statsUpdate.yellowCards,
            'stats.redCards': (currentStats.redCards || 0) + statsUpdate.redCards,
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
            goals: player.stats?.goals || 0,
        };
    });
};

// --- Sanctions ---
export const getSanctions = async (): Promise<Sanction[]> => {
    const sanctionsCol = collection(db, 'sanctions');
    const sanctionSnapshot = await getDocs(sanctionsCol);
    return sanctionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sanction));
};

export const addSanction = async (newSanction: Omit<Sanction, 'id'>): Promise<Sanction> => {
    const sanctionsCol = collection(db, 'sanctions');
    const docRef = await addDoc(sanctionsCol, newSanction);
    return { id: docRef.id, ...newSanction };
};


// --- Matches ---
export const getMatches = async (): Promise<Match[]> => {
    const matchesCol = collection(db, 'matches');
    const matchSnapshot = await getDocs(matchesCol);
    return matchSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
};

export const addMatch = async (matchData: Omit<Match, 'id'>): Promise<Match> => {
    const matchesCol = collection(db, 'matches');
    const docRef = await addDoc(matchesCol, matchData);
    return { id: docRef.id, ...matchData };
};

export const deleteMatch = async (matchId: string) => {
    await deleteDoc(doc(db, "matches", matchId));
};

export const getMatchById = async (id: string): Promise<Match | undefined> => {
    if (!id) return undefined;
    const matchRef = doc(db, 'matches', id);
    const matchSnap = await getDoc(matchRef);
    return matchSnap.exists() ? { id: matchSnap.id, ...matchSnap.data() } as Match : undefined;
};

export const updateMatchData = async (matchId: string, updatedData: Partial<Match>) => {
    const matchRef = doc(db, 'matches', matchId);
    await updateDoc(matchRef, updatedData);
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

export const addRequalificationRequest = async (request: Omit<RequalificationRequest, 'id'>): Promise<RequalificationRequest> => {
    const requestsCol = collection(db, 'requalificationRequests');
    const docRef = await addDoc(requestsCol, request);
    return { id: docRef.id, ...request };
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
    const goalsScored = players.reduce((sum, p) => sum + (p.stats?.goals || 0), 0);
    
    return {
        categories: [...new Set(teams.map(t => t.category))].length,
        stages: 3, // Mock
        fines: 48, // Mock
        matchesPlayed: matches.filter(m => m.status === 'finished').length,
        goalsScored: goalsScored,
        yellowCards: players.reduce((sum, p) => sum + (p.stats?.yellowCards || 0), 0),
        redCards: players.reduce((sum, p) => sum + (p.stats?.redCards || 0), 0),
        teams: {
            registered: 2, // Mock
            approved: teams.length,
            rejected: 9, // Mock
            sanctioned: 1, // Mock
        },
        players: {
            approved: players.length,
            new: players.filter(p => p.careerHistory?.[0]?.startDate && new Date(p.careerHistory[0].startDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
            rejected: 1470, // Mock
        }
    };
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
export let expenses: Expense[] = [];
