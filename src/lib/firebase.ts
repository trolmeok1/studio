
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with offline persistence
// This check prevents re-initializing on hot reloads
let db;
try {
    // This will throw an error if Firestore has already been initialized,
    // which is what we want in order to fall back to getFirestore().
    db = initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });
} catch (e) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'failed-precondition') {
        // This error means Firestore has already been initialized.
        // We can safely ignore it and get the existing instance.
        db = getFirestore(app);
    } else {
        // A different error occurred
        console.error("Error initializing Firestore:", e);
        db = getFirestore(app); // Fallback
    }
}


const storage = getStorage(app);
const auth = getAuth(app);


export { app, db, storage, auth };
