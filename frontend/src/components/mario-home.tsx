'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { MarioSmartSearch } from './mario-smart-search';
import { type SearchSuggestion } from '@/lib/data/healthcare-data';
import { type Provider } from '@/lib/api';
import { cn } from './ui/utils';
import aiGlyph from 'figma:asset/be45d2fdb826eadb9df8b88213c90c19c77e04b0.png';
import { 
  Search, 
  Heart, 
  Calendar, 
  Shield, 
  Gift, 
  User,
  Stethoscope,
  Pill,
  Building2,
  TrendingDown,
  Award,
  ChevronRight,
  DollarSign,
  Sparkles,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Star,
  Navigation
} from 'lucide-react';

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickAction({ icon: Icon, title, description, onClick }: QuickActionProps) {
  return (
    <Card 
      className="p-2 cursor-pointer mario-transition mario-hover-primary mario-button-scale mario-shadow-card" 
      onClick={onClick} 
      style={{ border: '1px solid transparent' }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-card-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </Card>
  );
}

function SavingsHighlight({ amount }: { amount: string }) {
  return (
    <Card className="bg-white text-foreground p-4 relative overflow-hidden mario-shadow-elevated" style={{ border: 'none' }}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-base">You've saved <span className="font-bold">{amount}</span> 🎉</p>
            <p className="text-sm text-muted-foreground">this year with Mario</p>
          </div>
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-accent h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
      </div>
    </Card>
  );
}



interface RecentSearchProps {
  title: string;
  type: string;
  date: string;
  onClick: () => void;
}

function MarioAIBox({ onClick, onQuickAction }: { onClick: () => void; onQuickAction?: (prompt: string) => void }) {
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  
  const quickActions = [
    { 
      label: "I have a health concern", 
      action: () => {
        router.push('/ai?context=concern');
      }
    },
    { 
      label: "Book a visit", 
      action: () => {
        router.push('/home?mode=book');
      }
    },
    { 
      label: "Rx renewal", 
      action: () => {
        router.push('/medications');
      }
    }
  ];

  return (
    <div className="space-y-3">
      {/* MarioAI Search Bar - Secondary */}
      <div className="relative">
        <div 
          className={cn(
            "w-full px-4 py-3 mario-transition flex items-center relative",
            "transition-all duration-200",
            isFocused 
              ? "border-2 border-[#4DA1A9]" 
              : "border border-[#4DA1A9]"
          )}
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            height: '48px',
            boxShadow: isFocused 
              ? '0 4px 16px rgba(77, 161, 169, 0.15)' 
              : '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Search className={cn(
            "h-5 w-5 mr-3 transition-colors",
            isFocused ? "text-[#4DA1A9]" : "text-[#999999]"
          )} />
          <input
            type="text"
            placeholder="Ask MarioAI anything..."
            className="flex-1 bg-transparent outline-none"
            style={{ color: '#444444' }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={onClick}
          />
        </div>
      </div>
      
      {/* Quick Actions Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickActions.map((action, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            {/* Add Sparkles AI icon for "I have a health concern" */}
            {action.label === "I have a health concern" && (
              <Sparkles className="h-5 w-5 text-accent" />
            )}
            <Button
              variant="secondary"
              size="sm"
              className="text-xs rounded-full px-3 py-1 h-auto font-medium bg-white text-primary hover:bg-accent/5 mario-transition cursor-pointer"
              style={{ border: '1px solid #4DA1A9' }}
              onClick={action.action}
            >
              {action.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SavingsCardProps {
  name: string;
  medianPrice: string;
  discountedPrice: string;
  savingsPercent: string;
  onClick: () => void;
}

function SavingsCard({ name, medianPrice, discountedPrice, savingsPercent, onClick }: SavingsCardProps) {
  return (
    <Card 
      className="flex-shrink-0 w-48 h-52 p-4 cursor-pointer mario-transition mario-hover-primary mario-button-scale mario-shadow-card" 
      onClick={onClick}
    >
      <div className="space-y-4 h-full flex flex-col">
        {/* Medication Name */}
        <div>
          <h3 className="font-medium text-sm leading-tight">{name}</h3>
        </div>
        
        {/* Pricing - Balanced 18-20px */}
        <div className="flex-1 space-y-3">
          <div className="text-xl font-bold text-primary leading-none">{discountedPrice}</div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground line-through">{medianPrice}</div>
            <div className="inline-block bg-white text-[#2E5077] border border-[#4DA1A9] px-2 py-1 rounded-full text-xs font-normal">
              {savingsPercent}% off
            </div>
          </div>
        </div>
        
        {/* Find Savings Button */}
        <Button 
          className="w-full mario-button-scale bg-primary text-white hover:bg-primary/90"
          size="sm"
        >
          Find Savings
        </Button>
      </div>
    </Card>
  );
}

interface HomeProps {
  isReturningUser?: boolean;
  onSearch?: (query: string, suggestion?: SearchSuggestion) => void;
  onOpenAI?: () => void;
  onOpenAIWithPrompt?: (prompt: string) => void;
  onBrowseProcedures?: () => void;
  onFindDoctors?: () => void;
  onFindMedication?: () => void;
  onMarioCare?: () => void;
  procedureSlug?: string;
  procedureName?: string;
  providers?: Provider[];
  loadingProviders?: boolean;
  providersError?: string | null;
  onProviderClick?: (providerId: string) => void;
}

export function MarioHome({ 
  isReturningUser = false, 
  onSearch, 
  onOpenAI, 
  onOpenAIWithPrompt, 
  onBrowseProcedures, 
  onFindDoctors, 
  onFindMedication, 
  onMarioCare,
  procedureSlug,
  procedureName,
  providers = [],
  loadingProviders = false,
  providersError,
  onProviderClick
}: HomeProps) {
  const commonSearches = [
    "MRI Scan", "Annual Physical", "Mammogram", "Colonoscopy", 
    "Blood Work", "X-Ray", "Dermatologist", "Cardiologist"
  ];

  const quickActions = [
    {
      icon: Stethoscope,
      title: "Browse Procedures",
      description: "Find and compare medical procedures",
      onClick: () => onBrowseProcedures?.()
    },
    {
      icon: User,
      title: "Find Doctors",
      description: "Search by specialty and location",
      onClick: () => onFindDoctors?.()
    },
    {
      icon: Pill,
      title: "Medications",
      description: "Compare prescription prices",
      onClick: () => onFindMedication?.()
    },
    {
      icon: Building2,
      title: "MarioCare",
      description: "On-demand urgent care (24/7), scheduled primary care & mental health visits",
      onClick: () => onMarioCare?.()
    }
  ];

  const recentSearchesPills = [
    "MRI Scan - Brain",
    "Dr. Sarah Johnson", 
    "Lipitor 20mg",
    "Annual Physical",
    "Blood Work"
  ];

  const savingsCards = [
    {
      name: "MRI Scan (Brain)",
      medianPrice: "$1,400",
      discountedPrice: "$850",
      savingsPercent: "39"
    },
    {
      name: "Annual Physical Exam",
      medianPrice: "$220",
      discountedPrice: "$95",
      savingsPercent: "57"
    },
    {
      name: "Blood Work Panel",
      medianPrice: "$180",
      discountedPrice: "$75",
      savingsPercent: "58"
    },
    {
      name: "Mammogram Screening",
      medianPrice: "$280",
      discountedPrice: "$125",
      savingsPercent: "55"
    },
    {
      name: "Colonoscopy",
      medianPrice: "$1,200",
      discountedPrice: "$695",
      savingsPercent: "42"
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto">
        {/* Top Content with Adjusted Spacing */}
        <div className="pt-8 px-4 pb-4">
          {/* 1. Hero Heading */}
          <div className="space-y-1 mb-6">
            <h1 className="text-[#1A1A1A] font-medium animate-in fade-in duration-300 ease-in" style={{
              fontSize: 'clamp(22px, 3.5vw, 30px)',
              lineHeight: '1.3'
            }}>
              Know what care costs. Choose smart.
            </h1>
            <p className="text-[#1A1A1A] font-normal animate-in fade-in duration-300 ease-in" style={{
              fontSize: 'clamp(20px, 3vw, 26px)',
              lineHeight: '1.3',
              opacity: '0.8'
            }}>
              Save with Mario.
            </p>
          </div>

          {/* 2. Main Search Bar */}
          <div className="space-y-3">
            <MarioSmartSearch 
              onSearch={onSearch || ((query) => console.log('Search:', query))}
              autoFocus={!isReturningUser}
            />
            
            {/* MarioAI Quick Access Chip */}
            <button
              onClick={() => onOpenAI?.()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mario-transition hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: '#E9F6F5',
                border: '1px solid #4DA1A9'
              }}
            >
              <Sparkles className="h-4 w-4" style={{ color: '#4DA1A9' }} />
              <span className="text-sm font-medium" style={{ color: '#2E5077' }}>
                Ask MarioAI 🩺
              </span>
            </button>
          </div>
        </div>

        {/* 3. Recent/Common Searches + Spacing - Unified Teal Band Background */}
        <div className="relative" style={{ paddingBottom: '32px' }}>
          {/* Single Unified Curved Teal Band Background - spans both sections */}
          <div className="absolute inset-0 w-full overflow-hidden z-0" style={{ height: 'calc(100% + 32px)' }}>
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none"
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id="unifiedTealBand" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(121, 215, 190, 0.12)', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: 'rgba(121, 215, 190, 0.12)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(121, 215, 190, 0.12)', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path 
                d="M0,20 Q300,10 600,5 T1200,0 L1200,120 Q900,110 600,115 T0,120 Z" 
                fill="url(#unifiedTealBand)"
              />
            </svg>
          </div>
          
          {/* Recent Searches Content */}
          <div 
            className="w-full py-4 relative z-10"
            style={{ 
              backgroundColor: 'transparent'
            }}
          >
            <div className="max-w-4xl mx-auto px-4">
              {isReturningUser ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Recent Searches</h3>
                    <button 
                      className="text-xs text-primary hover:text-primary/80 hover:underline hover:decoration-dotted cursor-pointer"
                      onClick={() => console.log('Clear history')}
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-1">
                    {recentSearchesPills.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => onSearch?.(search)}
                        className="text-sm text-black underline decoration-dotted underline-offset-8 hover:no-underline flex-shrink-0 cursor-pointer mario-transition whitespace-nowrap"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Common Searches</h3>
                  <div className="flex gap-4 overflow-x-auto pb-1">
                    {commonSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => onSearch?.(search)}
                        className="text-sm text-black underline decoration-dotted underline-offset-8 hover:no-underline flex-shrink-0 cursor-pointer mario-transition whitespace-nowrap"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtle divider for section clarity */}
        <div className="px-4">
          <div style={{ height: '1px', backgroundColor: '#E0E0E0', opacity: 0.5 }} />
        </div>

        {/* Provider Results Section - Show inline when procedure is selected */}
        {procedureSlug && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: '#2E5077' }}>
                  {procedureName || 'Providers'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {providers.length} {providers.length === 1 ? 'provider' : 'providers'} available
                </p>
              </div>
            </div>

            {loadingProviders ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : providersError ? (
              <div className="rounded-lg bg-yellow-50 p-4 text-yellow-800">
                {providersError}
              </div>
            ) : providers.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No providers found for this procedure.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {providers.map((provider) => (
                  <Card
                    key={provider.provider_id}
                    className="cursor-pointer mario-transition hover:opacity-90 mario-button-scale p-4"
                    onClick={() => onProviderClick?.(provider.provider_id)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                      border: 'none'
                    }}
                  >
                    <div className="space-y-3">
                      {/* Provider Name */}
                      <div>
                        <h3 className="font-semibold mb-1" style={{ color: '#2E5077' }}>
                          {provider.provider_name}
                        </h3>
                        {provider.address && (
                          <p className="text-sm text-muted-foreground">
                            {provider.address}
                            {provider.city && `, ${provider.city}`}
                            {provider.state && ` ${provider.state}`}
                            {provider.zip && ` ${provider.zip}`}
                          </p>
                        )}
                      </div>

                      {/* Details Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {provider.distance_miles !== null && provider.distance_miles !== undefined && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#2E5077' }}>
                            <Navigation className="h-3 w-3" />
                            <span>{provider.distance_miles.toFixed(1)} miles</span>
                          </div>
                        )}
                        
                        {provider.phone && (
                          <div className="flex items-center gap-1 text-sm" style={{ color: '#2E5077' }}>
                            <Phone className="h-3 w-3" />
                            <span>{provider.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      {provider.price && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xl" style={{ color: '#2E5077' }}>
                            {provider.price}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Section - Adjusted spacing (24px from divider) */}
        <div className="p-4 space-y-6" style={{ paddingTop: '24px' }}>
          {/* Only show Savings Highlight and other sections if no procedure is selected */}
          {!procedureSlug && (
            <>
              {/* Savings Highlight */}
              <SavingsHighlight amount="$1,247" />

              {/* Save on These - Horizontal Savings Cards */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Save on These</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">{savingsCards.map((card, index) => (
                  <SavingsCard
                    key={index}
                    {...card}
                    onClick={() => onSearch?.(card.name)}
                  />
                ))}</div>
              </div>

              {/* MarioAI Search (Secondary) */}
              <MarioAIBox 
                onClick={() => onOpenAI?.()} 
                onQuickAction={onOpenAIWithPrompt}
              />
            </>
          )}

          {/* Common Actions - Always show */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Common Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}