'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Home, Search, Gift, User } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface GlobalNavProps {
    showOnMobile?: boolean;
    showOnDesktop?: boolean;
}

export function GlobalNav({ showOnMobile = true, showOnDesktop = true }: GlobalNavProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Don't show nav on login or landing page
    const hideNav = pathname === '/login' || pathname === '/';

    if (hideNav || !user) {
        return null;
    }

    const navItems = [
        { href: '/', label: 'Landing', icon: Home, mobile: false },
        { href: '/home', label: 'Health Hub', icon: Home, mobile: true },
        { href: '/search', label: 'Search', icon: Search, mobile: true },
        { href: '/rewards', label: 'Rewards', icon: Gift, mobile: true },
        { href: '/profile', label: 'Profile', icon: User, mobile: true },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Desktop Top Nav */}
            {showOnDesktop && (
                <nav className="hidden md:block border-b border-gray-200 bg-white sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Link href="/home" className="text-xl font-bold text-gray-900">
                                    Mario Health
                                </Link>
                            </div>
                            <div className="flex items-center space-x-1">
                                {navItems
                                    .filter((item) => !item.mobile || item.href !== '/')
                                    .map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                                    active
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Mobile Bottom Nav */}
            {showOnMobile && (
                <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50 safe-area-inset-bottom">
                    <div className="flex items-center justify-around h-16">
                        {navItems
                            .filter((item) => item.mobile)
                            .map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                                            active ? 'text-blue-600' : 'text-gray-600'
                                        )}
                                    >
                                        <Icon className="h-5 w-5 mb-1" />
                                        <span className="text-xs font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                    </div>
                </nav>
            )}
        </>
    );
}

