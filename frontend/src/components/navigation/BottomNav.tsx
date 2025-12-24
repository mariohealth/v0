'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Home, Gift, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarioAIModal } from '@/components/mario-ai-modal';

export function BottomNav() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [showAIModal, setShowAIModal] = useState(false);

    // Don't show nav on login or landing page
    const hideNav = pathname === '/login' || pathname === '/';

    if (hideNav || !user) {
        return null;
    }

    const navItems = [
        { href: '/home', label: 'Home', icon: Home },
        { href: '/health-hub', label: 'Hub', icon: Home },
        { href: '/rewards', label: 'Rewards', icon: Gift },
        { href: '/profile', label: 'Profile', icon: User },
    ];


    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50 safe-area-inset-bottom">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                                    active ? 'text-[#2E5077]' : 'text-gray-600'
                                )}
                            >
                                <Icon className="h-5 w-5 mb-1" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                    {/* AI Button */}
                    <button
                        onClick={() => setShowAIModal(true)}
                        className={cn(
                            'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                            'text-gray-600'
                        )}
                    >
                        <Sparkles className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">AI</span>
                    </button>
                </div>
            </nav>
            <MarioAIModal
                open={showAIModal}
                onClose={() => setShowAIModal(false)}
                mode="search"
            />
        </>
    );
}

