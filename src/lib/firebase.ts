
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  projectId: "teamlink-hub-qennu",
  appId: "1:859037440361:web:17c901219ba23c393a85f8",
  storageBucket: "teamlink-hub-qennu.firebasestorage.app",
  apiKey: "AIzaSyAtrkvOubUuW7931jYcmBllaMJ4eBpiUkE",
  authDomain: "teamlink-hub-qenqu.firebaseapp.com",
  messagingSenderId: "859037440361",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
