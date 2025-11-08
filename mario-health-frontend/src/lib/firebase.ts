import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

// Firebase configuration from environment variables
// CRITICAL: storageBucket MUST be mario-mrf-data.appspot.com (NOT .firebasestorage.app)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mario-mrf-data',
    // Ensure storage bucket is in the correct format: projectId.appspot.com
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mario-mrf-data.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate required Firebase config
if (typeof window !== 'undefined') {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

    if (missingKeys.length > 0) {
        console.error(`❌ Missing Firebase configuration: ${missingKeys.join(', ')}. Please set NEXT_PUBLIC_FIREBASE_${missingKeys.join('_').toUpperCase()} in .env.local`);
    }

    // Validate storage bucket format
    if (firebaseConfig.storageBucket && !firebaseConfig.storageBucket.endsWith('.appspot.com')) {
        console.warn(`⚠️  Storage bucket should end with .appspot.com, got: ${firebaseConfig.storageBucket}`);
        // Auto-fix: if it ends with .firebasestorage.app, replace it
        if (firebaseConfig.storageBucket.endsWith('.firebasestorage.app')) {
            const projectId = firebaseConfig.storageBucket.split('.')[0];
            firebaseConfig.storageBucket = `${projectId}.appspot.com`;
            console.log(`✅ Auto-corrected storage bucket to: ${firebaseConfig.storageBucket}`);
        }
    }
}

// Initialize Firebase app only if it doesn't exist
let app;
if (typeof window !== 'undefined') {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    console.log('✅ Firebase App initialized', {
        projectId: firebaseConfig.projectId,
        storageBucket: firebaseConfig.storageBucket
    });
} else {
    // Server-side: create a placeholder that won't be used
    app = null;
}

export const auth = typeof window !== 'undefined' && app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Set auth persistence (do not await at module top-level; call in init function or first usage)
export async function ensureAuthPersistence() {
    if (auth) {
        await setPersistence(auth, browserLocalPersistence);
    }
}

