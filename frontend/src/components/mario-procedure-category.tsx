'use client'
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, MapPin, TrendingDown, Sparkles } from 'lucide-react';
import { procedureCategories, type Procedure } from '@/lib/data/mario-procedures-data';

interface MarioProcedureCategoryProps {
  categoryId: string;
  onBack: () => void;
  onProcedureSelect: (procedureId: string) => void;
}

export function MarioProcedureCategory({ 
  categoryId, 
  onBack, 
  onProcedureSelect 
}: MarioProcedureCategoryProps) {
  const category = procedureCategories.find(
    (cat) => cat.id === categoryId
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  const procedures = category.procedures as Procedure[];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card mario-shadow-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mario-button-scale"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold" style={{ color: '#2E5077' }}>
              {category.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {procedures.length} {procedures.length === 1 ? 'procedure' : 'procedures'} available
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {/* Category Info */}
        <Card
          className="p-4"
          style={{
            backgroundColor: '#E9F6F5',
            border: 'none'
          }}
        >
          <p className="text-sm" style={{ color: '#2E5077' }}>
            {category.description} • Showing upfront pricing near you
          </p>
        </Card>

        {/* Procedures List */}
        {procedures.map((procedure, index) => {
          const isMariosPick = index === 0; // First item is always Mario's Pick for demo

          return (
            <Card
              key={procedure.id}
              className="cursor-pointer mario-transition hover:opacity-90 mario-button-scale relative overflow-hidden"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                border: isMariosPick ? '2px solid #4DA1A9' : 'none'
              }}
              onClick={() => onProcedureSelect(procedure.id)}
            >
              {/* Mario's Pick Badge */}
              {isMariosPick && (
                <div
                  className="absolute top-0 right-0 px-3 py-1 flex items-center gap-1"
                  style={{
                    backgroundColor: '#4DA1A9',
                    borderBottomLeftRadius: '8px'
                  }}
                >
                  <Sparkles className="h-3 w-3 text-white" />
                  <span className="text-xs font-medium text-white">
                    Mario's Pick
                  </span>
                </div>
              )}

              <div className="p-4 pt-6">
                {/* Procedure Name */}
                <h3 className="font-semibold mb-1" style={{ color: '#2E5077' }}>
                  {procedure.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {procedure.description}
                </p>

                {/* Pricing */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span 
                        className="text-2xl font-bold" 
                        style={{ color: '#2E5077' }}
                      >
                        ${procedure.marioPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${procedure.avgPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4" style={{ color: '#79D7BE' }} />
                      <span className="text-sm font-medium" style={{ color: '#79D7BE' }}>
                        Save {procedure.savings}% (${procedure.avgPrice - procedure.marioPrice})
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onProcedureSelect(procedure.id);
                    }}
                    className="mario-button-scale"
                    style={{
                      backgroundColor: '#2E5077',
                      color: 'white'
                    }}
                  >
                    View Details
                  </Button>
                </div>

                {/* Location Info */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Available at 12+ nearby providers</span>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Bottom Info Card */}
        <Card
          className="p-4 mt-6"
          style={{
            backgroundColor: '#F9F9F9',
            border: 'none'
          }}
        >
          <h4 className="font-medium mb-2" style={{ color: '#2E5077' }}>
            Why choose Mario Health?
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Transparent, upfront pricing - no surprise bills</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Save an average of 45% vs. median market prices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Quality-vetted providers with verified ratings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5">✓</span>
              <span>Concierge support to book and coordinate care</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
