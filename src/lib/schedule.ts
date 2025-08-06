
'use server';

import { db } from './firebase';
import { collection, getDocs, doc, writeBatch, Timestamp, query, deleteDoc, getDoc } from 'firebase/firestore';
import type { GeneratedMatch } from './types';


const SCHEDULE_COLLECTION = 'schedules';
const CURRENT_SCHEDULE_DOC_ID = 'current';


// Firestore stores Timestamps, so we need to convert Date objects before saving
// and convert them back after fetching.
const convertDatesToTimestamps = (matches: GeneratedMatch[]): any[] => {
    return matches.map(match => {
        const newMatch: any = { ...match };
        if (newMatch.date) {
            newMatch.date = Timestamp.fromDate(newMatch.date);
        }
        if (newMatch.originalDate) {
            newMatch.originalDate = Timestamp.fromDate(newMatch.originalDate);
        }
        return newMatch;
    });
};

const convertTimestampsToDates = (matches: any[]): GeneratedMatch[] => {
    return matches.map(match => {
        const newMatch = { ...match };
        if (newMatch.date && newMatch.date.toDate) {
            newMatch.date = newMatch.date.toDate();
        }
        if (newMatch.originalDate && newMatch.originalDate.toDate) {
            newMatch.originalDate = newMatch.originalDate.toDate();
        }
        return newMatch as GeneratedMatch;
    });
};

export const saveSchedule = async (matches: GeneratedMatch[], finals: GeneratedMatch[]) => {
    const docRef = doc(db, SCHEDULE_COLLECTION, CURRENT_SCHEDULE_DOC_ID);
    const dataToSave = {
        matches: convertDatesToTimestamps(matches),
        finals: convertDatesToTimestamps(finals),
        createdAt: Timestamp.now(),
    };
    await writeBatch(db).set(docRef, dataToSave).commit();
};

export const getSchedule = async (): Promise<{ matches: GeneratedMatch[], finals: GeneratedMatch[] }> => {
    const docRef = doc(db, SCHEDULE_COLLECTION, CURRENT_SCHEDULE_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            matches: convertTimestampsToDates(data.matches || []),
            finals: convertTimestampsToDates(data.finals || []),
        };
    } else {
        return { matches: [], finals: [] };
    }
};

export const deleteSchedule = async () => {
    const docRef = doc(db, SCHEDULE_COLLECTION, CURRENT_SCHEDULE_DOC_ID);
    await deleteDoc(docRef);
};
