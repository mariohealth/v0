'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { UniversalSearch } from './mario-universal-search';
import { type SearchSuggestion } from '../data/healthcare-data';
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
  ArrowRight
} from 'lucide-react';

interface QuickActionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

interface SavingsCardProps {
  name: string;
  medianPrice: string;
  discountedPrice: string;
  savingsPercent: number;
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

function SavingsCard({ name, medianPrice, discountedPrice, savingsPercent, onClick }: SavingsCardProps) {
  return (
    <Card 
      className="flex-shrink-0 w-48 h-52 p-4 cursor-pointer mario-transition mario-hover-primary mario-button-scale mario-shadow-card" 
      onClick={onClick} 
      style={{ border: '1px solid transparent' }}
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

function MarioAIBox({ onClick }: { onClick: () => void }) {
  const [isFocused, setIsFocused] = useState(false);
  
  const quickActions = [
    { label: "I Have a Health Concern", action: () => console.log('Health Concern') },
    { label: "Book a Visit", action: () => console.log('Book Visit') },
    { label: "Rx Renewal", action: () => console.log('Rx Renewal') },
    { label: "Find a New Doctor", action: () => console.log('Find Doctor') }
  ];

  return (
    <div className="space-y-3">
      {/* MarioAI Search Bar - Secondary */}
      <div className="relative">
        <div 
          className={cn(
            "w-full px-4 py-3 text-left cursor-text mario-transition flex items-center",
            "border-2 transition-all duration-200",
            isFocused 
              ? "border-2 border-[#4DA1A9]" 
              : "border-2 border-border/30 hover:border-[#4DA1A9]/30"
          )}
          style={{ 
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            height: '48px',
            boxShadow: isFocused 
              ? '0 4px 16px rgba(77, 161, 169, 0.15), 0 0 0 2px #4DA1A9' 
              : '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          onClick={onClick}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          tabIndex={0}
        >
          <Search className={cn(
            "h-5 w-5 mr-3 transition-colors",
            isFocused ? "text-[#4DA1A9]" : "text-[#999999]"
          )} />
          <span className="flex-1" style={{ color: '#444444' }}>Ask MarioAI anything...</span>
        </div>
      </div>
      
      {/* Quick Actions Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {quickActions.map((action, index) => (
          <div key={index} className="flex items-center gap-2 flex-shrink-0">
            {/* Add Sparkles AI icon for "I Have a Health Concern" */}
            {action.label === "I Have a Health Concern" && (
              <Sparkles className="h-5 w-5 text-accent" />
            )}
            <Button
              variant="secondary"
              size="sm"
              className="text-xs rounded-full px-3 py-1 h-auto font-medium bg-accent/20 text-accent hover:bg-accent/30 hover:border-accent/50 mario-transition cursor-pointer"
              style={{ border: '1px solid transparent' }}
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

interface MarioHomeProps {
  isReturningUser?: boolean;
  onSearch?: (query: string, suggestion?: SearchSuggestion) => void;
}

export function MarioHomeNoSavings({ 
  isReturningUser = true, 
  onSearch 
}: MarioHomeProps) {
  // Sample data for pills
  const recentSearchesPills = [
    "Dr. Sarah Johnson", 
    "Annual Physical", 
    "Blood Work", 
    "Specialist Consultation",
    "MRI Scan"
  ];

  const commonSearches = [
    "Primary Care", 
    "Urgent Care", 
    "Dermatology", 
    "Annual Physical",
    "Blood Test"
  ];

  // Sample savings cards data
  const savingsCards = [
    {
      name: "Lipitor (Atorvastatin)",
      medianPrice: "$89",
      discountedPrice: "$12",
      savingsPercent: 86
    },
    {
      name: "Nexium (Esomeprazole)",
      medianPrice: "$240", 
      discountedPrice: "$18",
      savingsPercent: 92
    },
    {
      name: "Advair (Fluticasone)",
      medianPrice: "$380",
      discountedPrice: "$45", 
      savingsPercent: 88
    }
  ];

  // Quick actions data
  const quickActions = [
    {
      icon: Stethoscope,
      title: "Browse Procedures",
      description: "Imaging, Labs, Surgeries & More",
      onClick: () => console.log('Browse Procedures')
    },
    {
      icon: Building2,
      title: "MarioCare",
      description: "On-demand urgent care (24/7), scheduled primary care & mental health visits",
      onClick: () => console.log('MarioCare')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto">
        {/* Top Content with Standard Padding */}
        <div className="p-4 space-y-6">
          {/* Main Search Bar */}
          <div>
            <UniversalSearch 
              onSearch={onSearch || ((query) => console.log('Search:', query))}
              showFilters={false}
              autoFocus={!isReturningUser}
            />
          </div>
        </div>

        {/* Recent/Common Searches - White Background Strip */}
        <div 
          className="w-full py-4"
          style={{ 
            backgroundColor: '#FFFFFF'
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

        {/* Visual Separator - Whitespace Block (32px) */}
        <div className="h-8"></div>

        {/* Content Below Separator - Standard Padding */}
        <div className="p-4 space-y-6">
          {/* MarioAI Search (Secondary) */}
          <MarioAIBox onClick={() => console.log('MarioAI clicked')} />

          {/* Horizontal Savings Cards */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {savingsCards.map((card, index) => (
              <SavingsCard
                key={index}
                {...card}
                onClick={() => onSearch?.(card.name)}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}