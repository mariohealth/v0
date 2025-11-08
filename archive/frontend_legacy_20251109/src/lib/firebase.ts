import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";

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

// Validate and auto-fix storage bucket format
let storageBucket = firebaseConfig.storageBucket || 'mario-mrf-data.appspot.com';
if (storageBucket && !storageBucket.endsWith('.appspot.com')) {
    console.warn(`⚠️  Storage bucket should end with .appspot.com, got: ${storageBucket}`);
    // Auto-fix: if it ends with .firebasestorage.app, replace it
    if (storageBucket.endsWith('.firebasestorage.app')) {
        const projectId = storageBucket.split('.')[0];
        storageBucket = `${projectId}.appspot.com`;
        console.log(`✅ Auto-corrected storage bucket to: ${storageBucket}`);
    }
}
firebaseConfig.storageBucket = storageBucket;

// Validate required Firebase config
if (typeof window !== 'undefined') {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId'] as const;
    const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

    if (missingKeys.length > 0) {
        console.error(`❌ Missing Firebase configuration: ${missingKeys.join(', ')}. Please set NEXT_PUBLIC_FIREBASE_${missingKeys.map(k => k.toUpperCase()).join('_')} in .env.local`);
    } else {
        console.log('✅ Firebase config validated:', {
            projectId: firebaseConfig.projectId,
            authDomain: firebaseConfig.authDomain,
            storageBucket: firebaseConfig.storageBucket
        });
    }
}

// Initialize Firebase app only once
let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined') {
    try {
        if (getApps().length === 0) {
            app = initializeApp(firebaseConfig);
            console.log('✅ Firebase App initialized successfully');
        } else {
            app = getApp();
            console.log('✅ Firebase App already initialized, using existing instance');
        }

        // Initialize Auth
        if (app) {
            try {
                auth = getAuth(app);
                console.log('✅ Firebase Auth initialized successfully');
            } catch (authError) {
                console.error('❌ Failed to initialize Firebase Auth:', authError);
                auth = null;
            }
        }
    } catch (error) {
        console.error('❌ Failed to initialize Firebase App:', error);
        app = null;
        auth = null;
    }
}

export { app, auth };
export const googleProvider = new GoogleAuthProvider();

// Set auth persistence (do not await at module top-level; call in init function or first usage)
export async function ensureAuthPersistence() {
    if (auth) {
        try {
            await setPersistence(auth, browserLocalPersistence);
            console.log('✅ Auth persistence set');
        } catch (error) {
            console.error('❌ Failed to set auth persistence:', error);
        }
    }
}

