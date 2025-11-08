'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Home, Search, Gift, User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface GlobalNavProps {
    showOnMobile?: boolean;
    showOnDesktop?: boolean;
}

export function GlobalNav({ showOnMobile = true, showOnDesktop = true }: GlobalNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Don't show nav on login or landing page
    const hideNav = pathname === '/login' || pathname === '/';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        if (showProfileDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    if (hideNav || !user) {
        return null;
    }

    const navItems = [
        { href: '/home', label: 'Home', icon: Home },
        { href: '/health-hub', label: 'Health Hub', icon: Home },
        { href: '/rewards', label: 'Rewards', icon: Gift },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.displayName) {
            return user.displayName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        if (user?.email) {
            return user.email[0].toUpperCase();
        }
        return 'U';
    };

    return (
        <>
            {/* Desktop Top Nav */}
            {showOnDesktop && (
                <nav className="hidden md:block border-b border-gray-200 bg-white sticky top-0 z-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Left: Mario Logo */}
                            <div className="flex items-center">
                                <Link href="/home" className="text-xl font-bold" style={{ color: '#2E5077' }}>
                                    mario
                                </Link>
                            </div>

                            {/* Center: Navigation Links */}
                            <div className="flex items-center space-x-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                                active
                                                    ? 'text-[#2E5077] bg-[#E9F6F5]'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Right: Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#2E5077] flex items-center justify-center text-white text-sm font-medium">
                                        {getUserInitials()}
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-gray-600" />
                                </button>

                                {showProfileDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                        <Link
                                            href="/help"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            Help
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            )}
        </>
    );
}

