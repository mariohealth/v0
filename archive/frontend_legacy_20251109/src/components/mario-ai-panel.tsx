'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { MarioAIChatEnhanced } from './mario-ai-chat-enhanced';
import { cn } from './ui/utils';

interface MarioAIPanelProps {
  onBookAppointment?: (doctor: any) => void;
  onSearchSuggestion?: (query: string) => void;
}

export function MarioAIPanel({ onBookAppointment, onSearchSuggestion }: MarioAIPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 mario-transition",
        "md:left-64" // Account for desktop sidebar
      )}
      style={{
        maxWidth: isExpanded ? '100%' : '100%',
      }}
    >
      {isExpanded ? (
        <div className="max-w-2xl mx-auto">
          <MarioAIChatEnhanced
            isCollapsed={false}
            onToggle={() => setIsExpanded(false)}
            onBookAppointment={onBookAppointment}
            onSearchSuggestion={onSearchSuggestion}
          />
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-4">
          <Card
            className="cursor-pointer mario-transition mario-hover-primary"
            style={{
              borderRadius: '16px',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
              backgroundColor: '#FFFFFF'
            }}
            onClick={() => setIsExpanded(true)}
          >
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mario-ai-float-pulse"
                  style={{ backgroundColor: '#4DA1A9' }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Ask MarioAI</div>
                  <div className="text-xs text-muted-foreground">
                    Get help finding the right care
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
