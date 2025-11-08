/**
 * Auth Context Provider
 * 
 * Provides Firebase Auth state and methods to the application.
 * Handles user authentication state safely with proper error handling.
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Auth context type
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Auth Provider Component
 * 
 * Manages Firebase Auth state and provides auth methods to children.
 * Handles authentication state changes safely.
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to auth state changes
    useEffect(() => {
        if (!auth) {
            console.warn('⚠️  Firebase Auth not initialized');
            setLoading(false);
            return;
        }

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setUser(user);
                setLoading(false);
                setError(null);

                if (user) {
                    console.log('✅ User authenticated:', user.email);
                } else {
                    console.log('👤 User signed out');
                }
            },
            (error) => {
                console.error('❌ Auth state change error:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        // Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    // Handle Google sign-in redirect result
    useEffect(() => {
        if (!auth) return;

        // Check for redirect result on mount
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    console.log('✅ Google sign-in redirect successful');
                    setError(null);
                }
            })
            .catch((error) => {
                console.error('❌ Google sign-in redirect error:', error);
                setError(error.message);
            });
    }, []);

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        if (!auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            const errorMessage = err.code === 'auth/user-not-found'
                ? 'No account found with this email'
                : err.code === 'auth/wrong-password'
                    ? 'Incorrect password'
                    : err.code === 'auth/invalid-email'
                        ? 'Invalid email address'
                        : err.message || 'Failed to sign in';

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign up with email and password
     */
    const signUp = async (
        email: string,
        password: string,
        displayName?: string
    ): Promise<void> => {
        if (!auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            setError(null);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name if provided
            if (displayName && userCredential.user) {
                await updateProfile(userCredential.user, { displayName });
            }
        } catch (err: any) {
            const errorMessage = err.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists'
                : err.code === 'auth/weak-password'
                    ? 'Password is too weak'
                    : err.code === 'auth/invalid-email'
                        ? 'Invalid email address'
                        : err.message || 'Failed to sign up';

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign out
     */
    const handleSignOut = async (): Promise<void> => {
        if (!auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            setError(null);
            await signOut(auth);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to sign out';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Reset password
     */
    const resetPassword = async (email: string): Promise<void> => {
        if (!auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            setError(null);
            await sendPasswordResetEmail(auth, email);
        } catch (err: any) {
            const errorMessage = err.code === 'auth/user-not-found'
                ? 'No account found with this email'
                : err.code === 'auth/invalid-email'
                    ? 'Invalid email address'
                    : err.message || 'Failed to send password reset email';

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Sign in with Google
     */
    const signInWithGoogle = async (): Promise<void> => {
        if (!auth) {
            throw new Error('Firebase Auth not initialized');
        }

        try {
            setError(null);
            const provider = new GoogleAuthProvider();

            // Use popup for better UX (can fallback to redirect if needed)
            try {
                await signInWithPopup(auth, provider);
            } catch (popupError: any) {
                // If popup is blocked, fallback to redirect
                if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
                    console.log('Popup blocked, using redirect...');
                    await signInWithRedirect(auth, provider);
                } else {
                    throw popupError;
                }
            }
        } catch (err: any) {
            const errorMessage = err.code === 'auth/popup-closed-by-user'
                ? 'Sign-in popup was closed'
                : err.code === 'auth/cancelled-popup-request'
                    ? 'Sign-in cancelled'
                    : err.message || 'Failed to sign in with Google';

            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    /**
     * Clear error
     */
    const clearError = (): void => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut: handleSignOut,
        resetPassword,
        signInWithGoogle,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}

