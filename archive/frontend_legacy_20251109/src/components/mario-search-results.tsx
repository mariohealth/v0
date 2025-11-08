'use client'
import { useState } from 'react';
import { ProviderCard } from './mario-card';
import { SearchHeader } from './mario-navigation';
import { FilterModal } from './mario-search';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Phone } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  results: ProviderResult[];
  showMap?: boolean;
}

interface ProviderResult {
  id: string;
  name: string;
  specialty: string;
  distance: string;
  inNetwork: boolean;
  price: string;
  comparedToMedian: string;
  savingsText?: string;
  mariosPick?: boolean;
  rating?: number;
  avatar?: string;
  address: string;
  phone: string;
  nextAvailable?: string;
}

export function MarioSearchResults({ query, results, showMap = false }: SearchResultsProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [mapView, setMapView] = useState(showMap);
  const [filteredResults, setFilteredResults] = useState(results);

  const handleFilterApply = (filters: any) => {
    // Apply filtering logic here
    console.log('Applied filters:', filters);
    setFilteredResults(results); // Placeholder - would filter based on actual criteria
  };

  const mockProviders: ProviderResult[] = [
    {
      id: '1',
      name: 'City Imaging Center',
      specialty: 'Radiology & Imaging',
      distance: '0.8 miles',
      inNetwork: true,
      price: '$450',
      comparedToMedian: '40% below average',
      savingsText: 'Earn 225 points',
      mariosPick: true,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1674043224800-88c3bd52de8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwY2xpbmljJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU5NDMxNTA4fDA&ixlib=rb-4.1.0&q=80&w=200',
      address: '123 Healthcare Blvd, New York, NY 10001',
      phone: '(555) 123-4567',
      nextAvailable: 'Tomorrow at 2:00 PM'
    },
    {
      id: '2',
      name: 'Manhattan Medical Associates',
      specialty: 'Radiology & Imaging',
      distance: '1.2 miles',
      inNetwork: true,
      price: '$625',
      comparedToMedian: '15% below average',
      savingsText: 'Earn 150 points',
      rating: 4.6,
      address: '456 Medical Plaza, New York, NY 10002',
      phone: '(555) 234-5678',
      nextAvailable: 'Friday at 10:00 AM'
    },
    {
      id: '3',
      name: 'Premier Diagnostics',
      specialty: 'Radiology & Imaging',
      distance: '2.1 miles',
      inNetwork: false,
      price: '$850',
      comparedToMedian: '25% above average',
      rating: 4.9,
      address: '789 Diagnostic Way, New York, NY 10003',
      phone: '(555) 345-6789',
      nextAvailable: 'Next Tuesday at 9:00 AM'
    },
    {
      id: '4',
      name: 'Downtown Radiology',
      specialty: 'Radiology & Imaging',
      distance: '2.8 miles',
      inNetwork: true,
      price: '$520',
      comparedToMedian: '20% below average',
      savingsText: 'Earn 180 points',
      rating: 4.4,
      address: '321 Downtown St, New York, NY 10004',
      phone: '(555) 456-7890',
      nextAvailable: 'Monday at 3:30 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader 
        query={query}
        resultCount={mockProviders.length}
        showMap={mapView}
        onFilterClick={() => setFilterOpen(true)}
        onMapToggle={() => setMapView(!mapView)}
      />

      <div className="max-w-6xl mx-auto p-4">
        {mapView ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map View */}
            <div className="bg-muted rounded-lg h-96 lg:h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>Interactive map would be displayed here</p>
                <p className="text-sm">Showing {mockProviders.length} providers</p>
              </div>
            </div>
            
            {/* Provider List */}
            <div className="space-y-4">
              {mockProviders.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  name={provider.name}
                  specialty={provider.specialty}
                  distance={provider.distance}
                  inNetwork={provider.inNetwork}
                  price={provider.price}
                  comparedToMedian={provider.comparedToMedian}
                  savingsText={provider.savingsText}
                  mariosPick={provider.mariosPick}
                  rating={provider.rating}
                  avatar={provider.avatar}
                  onBook={() => console.log('Book with', provider.name)}
                  onCall={() => console.log('Call', provider.name)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4 max-w-2xl mx-auto">
            {mockProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                name={provider.name}
                specialty={provider.specialty}
                distance={provider.distance}
                inNetwork={provider.inNetwork}
                price={provider.price}
                comparedToMedian={provider.comparedToMedian}
                savingsText={provider.savingsText}
                mariosPick={provider.mariosPick}
                rating={provider.rating}
                avatar={provider.avatar}
                onBook={() => console.log('Book with', provider.name)}
                onCall={() => console.log('Call', provider.name)}
              />
            ))}
          </div>
        )}
      </div>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}