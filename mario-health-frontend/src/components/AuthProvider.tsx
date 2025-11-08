'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: null });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if auth is initialized
        if (!auth) {
            console.error('❌ Firebase Auth not initialized. Check Firebase configuration.');
            setError('Firebase Auth not initialized. Please check your configuration.');
            setLoading(false);
            return;
        }

        try {
            const unsubscribe = onAuthStateChanged(
                auth,
                (user) => {
                    setUser(user);
                    setLoading(false);
                    setError(null);
                    if (user) {
                        console.log('✅ User authenticated:', user.email);
                    }
                },
                (error) => {
                    console.error('❌ Auth state change error:', error);
                    setError(error.message);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.error('❌ Failed to set up auth listener:', err);
            setError(err instanceof Error ? err.message : 'Failed to initialize auth');
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

