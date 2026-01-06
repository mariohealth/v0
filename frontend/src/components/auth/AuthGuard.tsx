'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AuthGuardProps {
    children: ReactNode;
}

/**
 * AuthGuard component that protects client-side routes.
 * It waits for the auth state to load and redirects to /login if not authenticated.
 * It also prevents "flashing" of protected content by only rendering children
 * when the user is authenticated.
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            // Store the current path to redirect back after login
            const returnUrl = encodeURIComponent(pathname);
            router.push(`/login?returnUrl=${returnUrl}`);
        }
    }, [user, loading, router, pathname]);

    // Show nothing or a global loader while checking auth
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FDFCFA]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2E5077] border-t-transparent" />
                    <p className="text-[#2E5077] font-medium animate-pulse">Loading Mario...</p>
                </div>
            </div>
        );
    }

    // If not loading and no user, we are redirecting, so return null
    if (!user) {
        return null;
    }

    // User is authenticated, render the children
    return <>{children}</>;
}
