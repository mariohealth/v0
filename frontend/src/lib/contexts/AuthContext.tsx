'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { getEffectiveZip, persistZip } from '../user-locale';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  zipCode?: string;
  profileComplete: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (currentUser?: User | null) => {
    const activeUser = currentUser || user;
    if (!activeUser) {
      setProfile(null);
      return;
    }

    try {
      // Placeholder: Fetch from /api/v1/profile
      // For now, satisfy logic with local storage and Firebase info
      const storedZip = typeof window !== 'undefined' ? localStorage.getItem('userZipCode') : null;
      const effectiveZip = getEffectiveZip({ profileZip: storedZip });
      if (effectiveZip) {
        persistZip(effectiveZip);
      }

      setProfile({
        uid: activeUser.uid,
        email: activeUser.email,
        displayName: activeUser.displayName,
        zipCode: effectiveZip || undefined,
        profileComplete: !!effectiveZip,
        avatarUrl: activeUser.photoURL || undefined
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await refreshProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshProfile]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

