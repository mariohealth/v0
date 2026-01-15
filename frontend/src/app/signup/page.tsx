'use client';

import { MarioAuthEmailSignUp } from '@/components/mario-auth-email-signup';
import { MarioAuthGetStarted } from '@/components/mario-auth-get-started';
import { useAuth } from '@/lib/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

type SignupView = 'get-started' | 'email';

function SignupContent() {
  const { user, loading: authLoading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/home';
  
  const [isDesktop, setIsDesktop] = useState(false);
  const [view, setView] = useState<SignupView>('get-started');
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      router.push(`/profile-setup?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  }, [user, authLoading, router, returnUrl]);

  const handleGoogleSignUp = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Google signup failed:', error);
    }
  };

  const handleSignUp = async (fullName: string, email: string, password: string) => {
    setSignupError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      // Redirect handled by auth state change
    } catch (error: any) {
      console.error('Signup error:', error);
      setSignupError(error.message || 'Failed to create account');
    }
  };

  const handleBackToLogin = () => router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);

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

  if (view === 'get-started') {
    return (
      <MarioAuthGetStarted
        isDesktop={isDesktop}
        onGoogleSignUp={handleGoogleSignUp}
        onEmailSignUp={() => setView('email')}
        onSignInClick={handleBackToLogin}
      />
    );
  }

  return (
    <MarioAuthEmailSignUp
      isDesktop={isDesktop}
      onSignUp={handleSignUp}
      onBackToSignIn={handleBackToLogin}
      error={signupError || undefined}
      onDismissError={() => setSignupError(null)}
    />
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
