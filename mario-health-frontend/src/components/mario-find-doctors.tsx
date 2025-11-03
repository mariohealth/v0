import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight, Users, ArrowLeft } from 'lucide-react';
import { specialties, type Specialty } from '@/lib/data/mario-doctors-data';

interface MarioFindDoctorsProps {
  onSpecialtySelect: (specialtyId: string) => void;
  onBack: () => void;
}

export function MarioFindDoctors({ onSpecialtySelect, onBack }: MarioFindDoctorsProps) {
  // Group specialties alphabetically
  const groupedSpecialties = specialties.reduce((acc, specialty) => {
    const firstLetter = specialty.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(specialty);
    return acc;
  }, {} as Record<string, Specialty[]>);

  const sortedLetters = Object.keys(groupedSpecialties).sort();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 md:pb-8">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-10"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
            </button>
            <div>
              <h1 
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#2E5077'
                }}
              >
                Find Doctors
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#6B7280', marginLeft: '52px' }}>
            Browse by specialty
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {sortedLetters.map((letter) => (
            <div key={letter} className="space-y-3">
              {/* Sticky Letter Header */}
              <div className="sticky top-[88px] bg-background py-2 z-10">
                <h2 className="text-primary">{letter}</h2>
              </div>

              {/* Specialty Cards */}
              <div className="space-y-2">
                {groupedSpecialties[letter].map((specialty) => (
                  <Card
                    key={specialty.id}
                    className="p-3 mario-transition hover:mario-hover-primary cursor-pointer"
                    onClick={() => onSpecialtySelect(specialty.id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3>{specialty.name}</h3>
                          <Badge 
                            variant="secondary" 
                            className="flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            {specialty.doctorCount}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground truncate">
                          {specialty.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total Count */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            {specialties.length} specialties • {specialties.reduce((sum, s) => sum + s.doctorCount, 0)} doctors
          </p>
        </div>
      </div>
    </div>
  );
}