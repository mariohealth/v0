'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Home, ShoppingCart, Info, ArrowRight, Settings } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';
import { PreferencesModal } from '@/components/preferences/PreferencesModal';

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const pathname = usePathname();

    // Handle scroll shadow
    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            <nav className={`sticky top-0 z-50 bg-white border-b transition-shadow ${hasScrolled ? 'shadow-md' : 'shadow-sm'
                }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-foreground">Mario Health</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Category Links */}
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/category/dental"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Dental
                                </Link>
                                <Link
                                    href="/category/diagnostics"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Diagnostics
                                </Link>
                                <Link
                                    href="/category/surgery"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Surgery
                                </Link>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-border" />

                            {/* Links */}
                            <Link
                                href="/search"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Search className="w-4 h-4" />
                                Search
                            </Link>

                            <Link
                                href="#how-it-works"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                How it Works
                            </Link>

                            {/* Preferences Button */}
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                                aria-label="Edit preferences"
                            >
                                <Settings className="w-4 h-4" />
                            </button>

                            {/* CTA Button */}
                            <Link
                                href="/search"
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-foreground" />
                            ) : (
                                <Menu className="w-6 h-6 text-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white">
                    <div className="flex flex-col h-full">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between px-4 py-4 border-b">
                            <Link
                                href="/"
                                className="flex items-center gap-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                                    <span className="text-white font-bold">M</span>
                                </div>
                                <span className="text-lg font-bold text-foreground">Mario Health</span>
                            </Link>
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6 text-foreground" />
                            </button>
                        </div>

                        {/* Mobile Navigation Links */}
                        <nav className="flex-1 px-4 py-6 space-y-2">
                            <MobileNavLink
                                href="/"
                                icon={<Home className="w-5 h-5" />}
                                label="Home"
                                active={isActive('/')}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            <MobileNavLink
                                href="/search"
                                icon={<Search className="w-5 h-5" />}
                                label="Search Procedures"
                                active={isActive('/search')}
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            <div className="pt-4 border-t mt-4">
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                                    Categories
                                </p>
                                {MOCK_CATEGORIES.slice(0, 4).map((category) => (
                                    <MobileNavLink
                                        key={category.id}
                                        href={`/category/${category.slug}`}
                                        icon={<span className="text-xl">{category.icon}</span>}
                                        label={category.name}
                                        active={isActive(`/category/${category.slug}`)}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                ))}
                            </div>

                            <div className="pt-4 border-t mt-4">
                                <MobileNavLink
                                    href="#how-it-works"
                                    icon={<Info className="w-5 h-5" />}
                                    label="How it Works"
                                    active={false}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                />
                            </div>
                        </nav>

                        {/* Mobile CTA */}
                        <div className="px-4 py-6 border-t">
                            <Link
                                href="/search"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg text-base font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Search Procedures
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Preferences Modal */}
            <PreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
        </>
    );
}

function MobileNavLink({
    href,
    icon,
    label,
    active,
    onClick
}: {
    href: string;
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <span className="flex-shrink-0">{icon}</span>
            <span className="text-base">{label}</span>
        </Link>
    );
}

