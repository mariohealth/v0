'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { MarioAuthGetStarted } from '@/components/mario-auth-get-started';
import { MarioAuthLogin } from '@/components/mario-auth-login';

type AuthView = 'get-started' | 'login-form';

function LoginContent() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/home';
  const initialView = searchParams.get('view') === 'login' ? 'login-form' : 'get-started';

  const [view, setView] = useState<AuthView>(initialView);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push(returnUrl);
    }
  }, [user, loading, router, returnUrl]);

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleEmailSignUp = () => {
    router.push('/signup');
  };

  const handleSignInClick = () => {
    setView('login-form');
  };

  const handleBackToGetStarted = () => {
    setView('get-started');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  if (view === 'login-form') {
    return (
      <MarioAuthLogin
        isDesktop={isDesktop}
        onGoogleLogin={handleGoogleLogin}
        onCreateAccount={() => router.push('/signup')}
        onBack={handleBackToGetStarted}
        showBackButton={true}
        onAuthSuccess={() => router.push(returnUrl)}
      />
    );
  }

  return (
    <MarioAuthGetStarted
      isDesktop={isDesktop}
      onGoogleSignUp={handleGoogleLogin}
      onEmailSignUp={handleEmailSignUp}
      onSignInClick={handleSignInClick}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
