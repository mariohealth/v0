'use client'
import { Card } from './ui/card';
import { ChevronRight, Scan, Beaker, Shield, Stethoscope, HeartPulse, Activity } from 'lucide-react';
import { procedureCategories, type ProcedureCategory } from '../data/mario-procedures-data';

interface MarioBrowseProceduresProps {
  onCategorySelect: (categoryId: string) => void;
  onBack: () => void;
}

const iconMap: Record<string, any> = {
  'scan': Scan,
  'flask': Beaker,
  'shield': Shield,
  'user-doctor': Stethoscope,
  'heart-pulse': HeartPulse,
  'activity': Activity
};

export function MarioBrowseProcedures({ onCategorySelect, onBack }: MarioBrowseProceduresProps) {
  const categories = procedureCategories;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <h1 
            className="font-semibold mb-1"
            style={{ 
              fontSize: '18px',
              color: '#2E5077'
            }}
          >
            Compare procedure prices near you
          </h1>
          <p className="text-sm text-muted-foreground">
            Browse by category to see transparent pricing
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Scan;
            const procedureCount = category.procedures.length;

            return (
              <Card
                key={category.id}
                className="cursor-pointer mario-transition hover:opacity-90 mario-button-scale"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  border: 'none',
                  padding: '16px'
                }}
                onClick={() => onCategorySelect(category.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: '#E9F6F5' }}
                  >
                    <Icon className="h-7 w-7" style={{ color: '#2E5077' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1" style={{ color: '#2E5077' }}>
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {category.description}
                    </p>
                    <p className="text-xs" style={{ color: '#4DA1A9' }}>
                      {procedureCount} {procedureCount === 1 ? 'procedure' : 'procedures'} available
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 flex-shrink-0" style={{ color: '#4DA1A9' }} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card
          className="mt-6 p-4"
          style={{
            backgroundColor: '#E9F6F5',
            border: 'none'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <Shield className="h-5 w-5" style={{ color: '#4DA1A9' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-1" style={{ color: '#2E5077' }}>
                Mario's Price Transparency
              </h4>
              <p className="text-sm" style={{ color: '#2E5077', opacity: 0.8 }}>
                All prices shown are upfront estimates. No surprise bills. Save an average of 45% vs. median market prices.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
