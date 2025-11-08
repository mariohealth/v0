'use client'
import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Phone, X, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SavedPharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  isOpen: boolean;
}

interface MarioSavedPharmaciesProps {
  onBack: () => void;
}

export function MarioSavedPharmacies({ onBack }: MarioSavedPharmaciesProps) {
  const [savedPharmacies, setSavedPharmacies] = useState<SavedPharmacy[]>([
    {
      id: '1',
      name: 'CVS Pharmacy',
      address: '123 Main Street, Downtown',
      distance: '0.8 mi',
      phone: '(555) 123-4567',
      hours: 'Open until 9:00 PM',
      isOpen: true
    }
  ]);

  const handleRemove = (pharmacyId: string) => {
    setSavedPharmacies(prev => prev.filter(p => p.id !== pharmacyId));
  };

  const handleGetDirections = (pharmacy: SavedPharmacy) => {
    // In a real app, this would open maps
    console.log('Get directions to:', pharmacy.name);
  };

  const handleCall = (pharmacy: SavedPharmacy) => {
    // In a real app, this would initiate a phone call
    window.location.href = `tel:${pharmacy.phone}`;
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: '#F6F4F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-40"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8EAED'
        }}
      >
        <div className="px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ color: '#2E5077' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 
              className="font-semibold"
              style={{ 
                fontSize: '22px',
                color: '#2E5077'
              }}
            >
              Saved Pharmacies
            </h1>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666'
              }}
            >
              {savedPharmacies.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {savedPharmacies.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#4DA1A920' }}
            >
              <MapPin className="h-10 w-10" style={{ color: '#4DA1A9' }} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ 
                fontSize: '18px',
                color: '#2E5077'
              }}
            >
              No Saved Pharmacies
            </h3>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666',
                maxWidth: '280px'
              }}
            >
              Save your favorite pharmacies for quick access
            </p>
          </div>
        ) : (
          // Pharmacy List
          <div className="space-y-4">
            {savedPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                className="rounded-2xl shadow-sm overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="p-4">
                  {/* Header with Name and Remove */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold"
                        style={{ 
                          fontSize: '18px',
                          color: '#1A1A1A'
                        }}
                      >
                        {pharmacy.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={pharmacy.isOpen ? "default" : "secondary"}
                          style={{
                            backgroundColor: pharmacy.isOpen ? '#79D7BE20' : '#E0E0E0',
                            color: pharmacy.isOpen ? '#79D7BE' : '#666666',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}
                        >
                          {pharmacy.isOpen ? 'Open' : 'Closed'}
                        </Badge>
                        <span 
                          style={{ 
                            fontSize: '14px',
                            color: '#999999'
                          }}
                        >
                          {pharmacy.distance} away
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(pharmacy.id)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                      style={{ color: '#999999' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FFE5E5';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#999999';
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: '#999999' }} />
                    <p 
                      style={{ 
                        fontSize: '14px',
                        color: '#666666',
                        lineHeight: '1.5'
                      }}
                    >
                      {pharmacy.address}
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-4 w-4 flex-shrink-0" style={{ color: '#999999' }} />
                    <p 
                      style={{ 
                        fontSize: '14px',
                        color: '#666666'
                      }}
                    >
                      {pharmacy.hours}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 mb-4">
                    <Phone className="h-4 w-4 flex-shrink-0" style={{ color: '#999999' }} />
                    <button
                      onClick={() => handleCall(pharmacy)}
                      style={{ 
                        fontSize: '14px',
                        color: '#2E5077',
                        textDecoration: 'underline'
                      }}
                    >
                      {pharmacy.phone}
                    </button>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleGetDirections(pharmacy)}
                    style={{
                      backgroundColor: '#2E5077',
                      color: '#FFFFFF',
                      minHeight: '44px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#274666';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2E5077';
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
