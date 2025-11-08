'use client'
import { useState } from 'react';
import { ArrowLeft, MapPin, Star, DollarSign, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SavedProvider {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  distance: string;
  image: string;
}

interface MarioSavedProvidersProps {
  onBack: () => void;
  onProviderClick?: (providerId: string) => void;
}

export function MarioSavedProviders({ onBack, onProviderClick }: MarioSavedProvidersProps) {
  const [savedProviders, setSavedProviders] = useState<SavedProvider[]>([
    {
      id: '1',
      name: 'Dr. Rebecca Hart',
      specialty: 'Cardiology',
      hospital: 'Mercy Medical Center',
      location: 'Downtown',
      rating: 4.9,
      reviewCount: 342,
      price: 425,
      distance: '2.3 mi',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Orthopedic Surgery',
      hospital: 'St. Mary\'s Hospital',
      location: 'Westside',
      rating: 4.8,
      reviewCount: 287,
      price: 380,
      distance: '4.1 mi',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Primary Care',
      hospital: 'Community Health Center',
      location: 'Midtown',
      rating: 4.7,
      reviewCount: 195,
      price: 150,
      distance: '1.8 mi',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face'
    }
  ]);

  const handleRemove = (providerId: string) => {
    setSavedProviders(prev => prev.filter(p => p.id !== providerId));
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
              Saved Providers
            </h1>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666'
              }}
            >
              {savedProviders.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {savedProviders.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#4DA1A920' }}
            >
              <Star className="h-10 w-10" style={{ color: '#4DA1A9' }} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ 
                fontSize: '18px',
                color: '#2E5077'
              }}
            >
              No Saved Providers
            </h3>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666',
                maxWidth: '280px'
              }}
            >
              Save providers you like to easily access them later
            </p>
          </div>
        ) : (
          // Provider List
          <div className="space-y-4">
            {savedProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-2xl shadow-sm overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="p-4">
                  {/* Header with Image and Remove */}
                  <div className="flex gap-3 mb-3">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                      style={{ border: '2px solid #E8EAED' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          className="font-semibold truncate"
                          style={{ 
                            fontSize: '16px',
                            color: '#1A1A1A'
                          }}
                        >
                          {provider.name}
                        </h3>
                        <button
                          onClick={() => handleRemove(provider.id)}
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
                      <p 
                        style={{ 
                          fontSize: '14px',
                          color: '#4DA1A9',
                          marginTop: '2px'
                        }}
                      >
                        {provider.specialty}
                      </p>
                    </div>
                  </div>

                  {/* Hospital & Location */}
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: '#999999' }} />
                    <p 
                      className="truncate"
                      style={{ 
                        fontSize: '14px',
                        color: '#666666'
                      }}
                    >
                      {provider.hospital} • {provider.location}
                    </p>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star 
                        className="h-4 w-4 fill-current" 
                        style={{ color: '#FFC107' }} 
                      />
                      <span 
                        className="font-medium"
                        style={{ 
                          fontSize: '14px',
                          color: '#1A1A1A'
                        }}
                      >
                        {provider.rating}
                      </span>
                      <span 
                        style={{ 
                          fontSize: '14px',
                          color: '#999999'
                        }}
                      >
                        ({provider.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" style={{ color: '#79D7BE' }} />
                      <span 
                        className="font-semibold"
                        style={{ 
                          fontSize: '16px',
                          color: '#79D7BE'
                        }}
                      >
                        ${provider.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    onClick={() => onProviderClick?.(provider.id)}
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
                    View Provider
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
