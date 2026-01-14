'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { MarioAuthEmailSignUp } from '@/components/mario-auth-email-signup';

export default function SignupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/profile-setup');
    }
  }, [user, authLoading, router]);

  const handleSignUp = async (fullName: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the display name in Firebase
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      // Redirect will happen via useEffect
    } catch (error: any) {
      console.error('Signup error:', error);
      // In a real app, we'd pass this error back to the component
      alert(error.message || 'Failed to create account');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <MarioAuthEmailSignUp
      isDesktop={isDesktop}
      onSignUp={handleSignUp}
      onBackToSignIn={() => router.push('/login')}
    />
  );
}
