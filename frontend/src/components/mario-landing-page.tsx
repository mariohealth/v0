'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MarioSmartSearch } from './mario-smart-search';
import { type AutocompleteSuggestion } from './mario-autocomplete';
import { Sheet, SheetContent, SheetTrigger, SheetPortal, SheetOverlay } from './ui/sheet';
import {
  Search,
  Pill,
  Building2,
  Gift,
  ArrowRight,
  Lock,
  Settings,
  ShieldCheck,
  Star,
  TrendingDown,
  Award,
  ChevronRight,
  Menu,
  X,
  Home,
  Users,
  Shield,
  Mail
} from 'lucide-react';

interface MarioLandingPageProps {
  onSearch?: (query: string, suggestion?: AutocompleteSuggestion) => void;
  onSignUp?: () => void;
  onLogin?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToTransparency?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToEmployers?: () => void;
  onNavigateToPrivacy?: () => void;
}

export function MarioLandingPage({ onSearch, onSignUp, onLogin, onNavigateToAbout, onNavigateToTransparency, onNavigateToContact, onNavigateToEmployers, onNavigateToPrivacy }: MarioLandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initialize desktop state after mount
    setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768);

    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (query: string, suggestion?: AutocompleteSuggestion) => {
    if (query.trim() && onSearch) {
      onSearch(query, suggestion);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDFCFA' }}>
      {/* Header - Only show on the actual landing page route */}
      {pathname === '/' && (
        <header className="bg-white" style={{ borderBottom: '1px solid #E0E0E0' }}>
          <div className="mx-auto" style={{ maxWidth: isDesktop ? '1440px' : '100%', padding: isDesktop ? '0 80px' : '0 16px' }}>
            <div className="flex items-center justify-between" style={{ height: '64px' }}>
              {/* Logo */}
              <div className="flex items-center">
                <span
                  style={{
                    color: '#2E5077',
                    fontSize: '20px',
                    fontWeight: '700',
                    letterSpacing: '-0.01em'
                  }}
                >
                  mario
                </span>
              </div>

              {/* Desktop Navigation */}
              {isDesktop ? (
                <>
                  <nav className="hidden md:flex items-center" style={{ gap: '32px' }}>
                    <a
                      href="#"
                      className="mario-transition hover:opacity-75 mario-focus-ring"
                      style={{
                        color: '#2E5077',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                    >
                      Prescription Savings
                    </a>
                    <a
                      href="#"
                      className="mario-transition hover:opacity-75 mario-focus-ring"
                      style={{
                        color: '#2E5077',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                    >
                      Telehealth
                    </a>
                    <a
                      href="#"
                      className="mario-transition hover:opacity-75 mario-focus-ring"
                      style={{
                        color: '#2E5077',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                    >
                      Health Services
                    </a>
                    <a
                      href="#"
                      className="mario-transition hover:opacity-75 mario-focus-ring"
                      style={{
                        color: '#2E5077',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                    >
                      Plus Membership
                    </a>
                  </nav>

                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <Button
                      variant="ghost"
                      onClick={onLogin}
                      className="mario-transition mario-focus-ring"
                      style={{
                        color: '#2E5077',
                        fontSize: '15px',
                        fontWeight: '500'
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      onClick={onSignUp}
                      className="mario-transition mario-button-scale mario-focus-ring"
                      style={{
                        backgroundColor: '#2E5077',
                        color: 'white',
                        height: '48px',
                        padding: '0 16px',
                        borderRadius: '16px',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}
                    >
                      Sign Up Free
                    </Button>
                  </div>
                </>
              ) : (
                /* Mobile Menu Sheet */
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      style={{ color: '#2E5077' }}
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[280px] p-0"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderLeft: '1px solid #E0E0E0'
                    }}
                  >
                    <nav
                      className="flex flex-col h-full"
                      style={{
                        paddingTop: '32px',
                        paddingLeft: '24px',
                        paddingRight: '24px'
                      }}
                    >
                      {/* Menu Items */}
                      <div className="flex flex-col" style={{ gap: '20px' }}>
                        <button
                          onClick={scrollToTop}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Home
                        </button>

                        <button
                          onClick={() => scrollToSection('how-it-works')}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          How It Works
                        </button>

                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onNavigateToEmployers?.();
                          }}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          For Employers
                        </button>

                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onNavigateToPrivacy?.();
                          }}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Privacy & Security
                        </button>

                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onNavigateToContact?.();
                          }}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Contact Us
                        </button>
                      </div>

                      {/* Divider */}
                      <div
                        style={{
                          height: '1px',
                          backgroundColor: '#E0E0E0',
                          margin: '20px 0'
                        }}
                      />

                      {/* Auth Section */}
                      <div className="flex flex-col" style={{ gap: '12px' }}>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onLogin?.();
                          }}
                          className="text-left transition-all"
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1A1A1A',
                            padding: '12px 0',
                            minHeight: '44px',
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 80, 119, 0.04)';
                            e.currentTarget.style.color = '#2E5077';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#1A1A1A';
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid #79D7BE';
                            e.currentTarget.style.outlineOffset = '2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          Sign In
                        </button>

                        <Button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onSignUp?.();
                          }}
                          className="transition-all w-full"
                          style={{
                            backgroundColor: '#2E5077',
                            color: '#FFFFFF',
                            height: '48px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            padding: '16px',
                            border: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#243f5e';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2E5077';
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section style={{ padding: isDesktop ? '64px 80px' : '64px 16px' }}>
        <div className="mx-auto text-center" style={{ maxWidth: '640px' }}>
          {/* Headline */}
          <h1
            className="mx-auto"
            style={{
              fontSize: isDesktop ? '32px' : '28px',
              fontWeight: '700',
              lineHeight: '1.2',
              color: '#2E5077',
              maxWidth: '20ch',
              marginBottom: '16px'
            }}
          >
            Know what you're paying before you go in.
          </h1>

          {/* Search Bar */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <MarioSmartSearch
              placeholder="Search doctors, services, or meds..."
              onSearch={(query, suggestion) => handleSearch(query, suggestion)}
              onAutocompleteSelect={(suggestion: AutocompleteSuggestion) => {
                handleSearch(suggestion.primaryText, suggestion);
              }}
              className="w-full"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center" style={{ gap: '12px' }}>
            <Button
              onClick={onSignUp}
              className="mario-transition mario-button-scale mario-focus-ring"
              style={{
                backgroundColor: '#2E5077',
                color: 'white',
                height: '48px',
                padding: '0 16px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Get Started
              <ArrowRight style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
            </Button>
            <Button
              variant="outline"
              onClick={onLogin}
              className="mario-transition mario-button-scale mario-focus-ring"
              style={{
                border: '1px solid #2E5077',
                backgroundColor: 'transparent',
                color: '#2E5077',
                height: '48px',
                padding: '0 16px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Overview Section */}
      <section id="how-it-works" style={{ padding: isDesktop ? '48px 80px' : '48px 16px', backgroundColor: '#F9F9F9' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          <div className="grid md:grid-cols-3" style={{ gap: isDesktop ? '24px' : '16px' }}>
            {/* Save on Prescriptions */}
            <Card
              className="text-center mario-shadow-card mario-transition hover:mario-shadow-elevated"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="mx-auto rounded-full flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'rgba(121, 215, 190, 0.1)',
                  marginBottom: '12px'
                }}
              >
                <Pill style={{ width: '40px', height: '40px', color: '#2E5077' }} />
              </div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                Save on Prescriptions
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                Compare pharmacy prices and get exclusive discounts on your medications with real-time pricing data.
              </p>
            </Card>

            {/* Transparent Provider Costs */}
            <Card
              className="text-center mario-shadow-card mario-transition hover:mario-shadow-elevated"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="mx-auto rounded-full flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'rgba(77, 161, 169, 0.1)',
                  marginBottom: '12px'
                }}
              >
                <Building2 style={{ width: '40px', height: '40px', color: '#2E5077' }} />
              </div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                Transparent Provider Costs
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                See actual procedure costs upfront from verified providers before you book your appointment.
              </p>
            </Card>

            {/* Earn Rewards */}
            <Card
              className="text-center mario-shadow-card mario-transition hover:mario-shadow-elevated"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="mx-auto rounded-full flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'rgba(46, 80, 119, 0.1)',
                  marginBottom: '12px'
                }}
              >
                <Gift style={{ width: '40px', height: '40px', color: '#2E5077' }} />
              </div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                Earn Rewards
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                Get MarioPoints for every healthcare decision and redeem them for gift cards and rewards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: isDesktop ? '48px 80px' : '48px 16px' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Section Header */}
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2E5077',
                marginBottom: '8px'
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#667085'
              }}
            >
              Three simple steps to start saving on healthcare
            </p>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: isDesktop ? '24px' : '16px' }}>
            {/* Step 1 */}
            <Card
              className="text-center mario-shadow-card relative"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: '24px',
                  height: '24px',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#2E5077',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                1
              </div>
              <div style={{ paddingTop: '12px' }}>
                <div
                  className="mx-auto rounded-full flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(77, 161, 169, 0.1)',
                    marginBottom: '12px'
                  }}
                >
                  <Search style={{ width: '24px', height: '24px', color: '#2E5077' }} />
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Search
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#667085',
                    lineHeight: '1.5'
                  }}
                >
                  Enter your procedure, medication, or find a provider in your area
                </p>
              </div>
            </Card>

            {/* Step 2 */}
            <Card
              className="text-center mario-shadow-card relative"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: '24px',
                  height: '24px',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#4DA1A9',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                2
              </div>
              <div style={{ paddingTop: '12px' }}>
                <div
                  className="mx-auto rounded-full flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(121, 215, 190, 0.1)',
                    marginBottom: '12px'
                  }}
                >
                  <TrendingDown style={{ width: '24px', height: '24px', color: '#2E5077' }} />
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Compare
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#667085',
                    lineHeight: '1.5'
                  }}
                >
                  See transparent pricing, provider ratings, and Mario's recommendations
                </p>
              </div>
            </Card>

            {/* Step 3 */}
            <Card
              className="text-center mario-shadow-card relative"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div
                className="absolute rounded-full flex items-center justify-center"
                style={{
                  width: '24px',
                  height: '24px',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#79D7BE',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                3
              </div>
              <div style={{ paddingTop: '12px' }}>
                <div
                  className="mx-auto rounded-full flex items-center justify-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(46, 80, 119, 0.1)',
                    marginBottom: '12px'
                  }}
                >
                  <Award style={{ width: '24px', height: '24px', color: '#2E5077' }} />
                </div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2E5077',
                    marginBottom: '8px'
                  }}
                >
                  Save & Earn
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                    color: '#667085',
                    lineHeight: '1.5'
                  }}
                >
                  Book with confidence and earn MarioPoints for every decision
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sample Results Preview */}
      <section style={{ padding: isDesktop ? '48px 80px' : '48px 16px', backgroundColor: '#F9F9F9' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px' }}>
          {/* Section Header */}
          <div className="text-center" style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2E5077',
                marginBottom: '8px'
              }}
            >
              See the Savings
            </h2>
            <p
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#667085'
              }}
            >
              Real examples of how Mario helps you save
            </p>
          </div>

          <div className="grid lg:grid-cols-2" style={{ gap: isDesktop ? '24px' : '16px' }}>
            {/* Medication Example */}
            <Card
              className="mario-shadow-card"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2E5077',
                      marginBottom: '4px'
                    }}
                  >
                    Lipitor (Atorvastatin) 20mg
                  </h3>
                  <p style={{ fontSize: '14px', color: '#667085' }}>
                    30-day supply
                  </p>
                </div>
                <Badge
                  style={{
                    backgroundColor: 'rgba(121, 215, 190, 0.15)',
                    color: '#2E5077',
                    fontSize: '12px',
                    fontWeight: '500',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    border: 'none'
                  }}
                >
                  Mario's Pick
                </Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#667085' }}>Cash Price</span>
                  <span className="line-through" style={{ fontSize: '14px', fontWeight: '500', color: '#999999' }}>$127.99</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#667085' }}>Insurance Price</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#2E5077' }}>$45.00</span>
                </div>
                <div
                  className="flex items-center justify-between border-t"
                  style={{ paddingTop: '12px', marginTop: '4px', borderTopColor: '#E5E7EB' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>Mario Price</span>
                  <div className="text-right">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#79D7BE' }}>$12.99</div>
                    <p style={{ fontSize: '12px', color: '#667085' }}>Save $32.01</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Procedure Example - MRI Knee */}
            <Card
              className="mario-shadow-card"
              style={{
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: 'white',
                border: 'none'
              }}
            >
              <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
                <div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2E5077',
                      marginBottom: '4px'
                    }}
                  >
                    MRI - Knee
                  </h3>
                  <p style={{ fontSize: '14px', color: '#667085' }}>
                    Including consultation
                  </p>
                </div>
                <div className="flex items-center" style={{ gap: '4px' }}>
                  <Star style={{ width: '16px', height: '16px', color: '#FFA726', fill: '#FFA726' }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>4.8</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#667085' }}>Dr. Sarah Johnson</span>
                  <span style={{ fontSize: '14px', color: '#667085' }}>2.1 miles</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', color: '#667085' }}>Hospital estimate</span>
                  <span className="line-through" style={{ fontSize: '14px', fontWeight: '500', color: '#999999' }}>$2,400</span>
                </div>
                <div
                  className="flex items-center justify-between border-t"
                  style={{ paddingTop: '12px', marginTop: '4px', borderTopColor: '#E5E7EB' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#2E5077' }}>Your cost</span>
                  <div className="text-right">
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#2E5077', marginBottom: '4px' }}>$680</div>
                    <Badge
                      style={{
                        backgroundColor: 'rgba(121, 215, 190, 0.15)',
                        color: '#2E5077',
                        fontSize: '12px',
                        fontWeight: '500',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        border: 'none'
                      }}
                    >
                      +150 points
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Compliance Strip */}
      <section style={{ padding: '40px 16px', backgroundColor: '#FDFCFA' }}>
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: isDesktop ? '0 80px' : '0' }}>
          <div className="grid md:grid-cols-3 text-center" style={{ gap: isDesktop ? '40px' : '24px' }}>
            <div className="flex flex-col items-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(46, 80, 119, 0.1)',
                  marginBottom: '8px'
                }}
              >
                <Lock style={{ width: '24px', height: '24px', color: '#2E5077' }} />
              </div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                HIPAA Compliant
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                Your health data is secure and protected
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(77, 161, 169, 0.1)',
                  marginBottom: '8px'
                }}
              >
                <Settings style={{ width: '24px', height: '24px', color: '#2E5077' }} />
              </div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                Real-Time MRF Pricing Data
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                Always current, transparent pricing
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: 'rgba(121, 215, 190, 0.1)',
                  marginBottom: '8px'
                }}
              >
                <ShieldCheck style={{ width: '24px', height: '24px', color: '#2E5077' }} />
              </div>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '8px'
                }}
              >
                Secure & Private by Design
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: '#667085',
                  lineHeight: '1.5'
                }}
              >
                Privacy-first architecture and encryption
              </p>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: '#667085' }}>
              Powered by machine-readable insurance files (MRFs) and real-time pharmacy data.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 16px',
          backgroundColor: '#F9F9F9',
          borderTop: '2px solid rgba(77, 161, 169, 0.2)'
        }}
      >
        <div className="mx-auto" style={{ maxWidth: '1280px', padding: isDesktop ? '0 80px' : '0' }}>
          <div className="flex flex-col md:flex-row items-center justify-between" style={{ gap: '24px' }}>
            <div className="flex flex-wrap items-center justify-center" style={{ gap: '24px' }}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToAbout?.();
                }}
                className="mario-transition hover:opacity-75 mario-focus-ring"
                style={{
                  fontSize: '14px',
                  color: '#2E5077',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  minHeight: '44px',
                  textDecoration: 'none'
                }}
              >
                About
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToTransparency?.();
                }}
                className="mario-transition hover:opacity-75 mario-focus-ring"
                style={{
                  fontSize: '14px',
                  color: '#2E5077',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  minHeight: '44px',
                  textDecoration: 'none'
                }}
              >
                Transparency Statement
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToContact?.();
                }}
                className="mario-transition hover:opacity-75 mario-focus-ring"
                style={{
                  fontSize: '14px',
                  color: '#2E5077',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  minHeight: '44px',
                  textDecoration: 'none'
                }}
              >
                Contact
              </button>
            </div>

            <Button
              onClick={onSignUp}
              className="mario-transition mario-button-scale mario-focus-ring"
              style={{
                backgroundColor: '#2E5077',
                color: 'white',
                height: '48px',
                padding: '0 16px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Sign Up Free
              <ChevronRight style={{ marginLeft: '4px', width: '16px', height: '16px' }} />
            </Button>
          </div>

          <div
            className="text-center border-t"
            style={{
              marginTop: '32px',
              paddingTop: '32px',
              borderTopColor: '#E0E0E0'
            }}
          >
            <p style={{ fontSize: '14px', color: '#667085' }}>
              © 2024 Mario Health. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}