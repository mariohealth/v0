/**
 * Firebase Client SDK initialization
 * 
 * Initializes Firebase App and Auth for client-side authentication.
 * Uses environment variables for configuration.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate required Firebase config
const requiredConfigKeys = [
    'apiKey',
    'authDomain',
    'projectId',
] as const;

const missingKeys = requiredConfigKeys.filter(
    (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
);

if (missingKeys.length > 0 && typeof window !== 'undefined') {
    console.warn(
        `⚠️  Missing Firebase configuration: ${missingKeys.join(', ')}. ` +
        `Please set NEXT_PUBLIC_FIREBASE_${missingKeys.join('_').toUpperCase()} in .env.local`
    );
}

// Initialize Firebase App (only once)
let app: FirebaseApp | undefined;
if (typeof window !== 'undefined' && getApps().length === 0) {
    try {
        app = initializeApp(firebaseConfig);
        console.log('✅ Firebase App initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase App:', error);
    }
} else if (typeof window !== 'undefined') {
    app = getApps()[0];
}

// Initialize Firebase Auth
let auth: Auth | undefined;
if (typeof window !== 'undefined' && app) {
    try {
        auth = getAuth(app);

        // Connect to Firebase Auth emulator in development if configured
        if (
            process.env.NODE_ENV === 'development' &&
            process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST
        ) {
            try {
                const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST.split(':');
                connectAuthEmulator(auth, `http://${host}:${port}`, { disableWarnings: true });
                console.log('🔧 Connected to Firebase Auth emulator');
            } catch (error) {
                // Emulator may already be connected
                console.log('Firebase Auth emulator connection skipped (may already be connected)');
            }
        }

        console.log('✅ Firebase Auth initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Auth:', error);
    }
}

// Initialize Firestore (optional, for future use)
let firestore: Firestore | undefined;
if (typeof window !== 'undefined' && app) {
    try {
        firestore = getFirestore(app);

        // Connect to Firestore emulator in development if configured
        if (
            process.env.NODE_ENV === 'development' &&
            process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST
        ) {
            try {
                const [host, port] = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST.split(':');
                connectFirestoreEmulator(firestore, host, parseInt(port, 10));
                console.log('🔧 Connected to Firestore emulator');
            } catch (error) {
                // Emulator may already be connected
                console.log('Firestore emulator connection skipped (may already be connected)');
            }
        }

        console.log('✅ Firestore initialized');
    } catch (error) {
        console.error('❌ Failed to initialize Firestore:', error);
    }
}

// Export Firebase instances
export { app, auth, firestore };

// Export Firebase types for convenience
export type { FirebaseApp, Auth, Firestore };

