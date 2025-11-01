'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  ArrowLeft,
  Save,
  MapPin,
  Package,
  ChevronDown,
  Truck,
  Store
} from 'lucide-react';
import type { MedicationData } from '@/lib/data/mario-medication-data';
import { toast } from 'sonner@2.0.3';

interface PharmacyComparison {
  name: string;
  distance: string;
  distanceValue: number; // for sorting
  price: string;
  priceValue: number; // for sorting
  delivery?: boolean;
  marioPick?: boolean;
  savings?: string;
}

interface MarioMedicationComparePricesProps {
  medication: MedicationData;
  selectedDosage: string;
  selectedQuantity: string;
  onBack: () => void;
}

type SortOption = 'price' | 'distance' | 'name';

export function MarioMedicationComparePrices({
  medication,
  selectedDosage,
  selectedQuantity,
  onBack
}: MarioMedicationComparePricesProps) {
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [zipCode, setZipCode] = useState('10001');
  const [tempZipCode, setTempZipCode] = useState('10001');
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock pharmacy data based on medication type
  const pharmacyData: PharmacyComparison[] = medication.name.includes('Atorvastatin') ? [
    {
      name: 'Cost Plus Drugs',
      distance: 'Mail',
      distanceValue: 0,
      price: '$8.50',
      priceValue: 8.50,
      marioPick: true,
      savings: 'Save $6.50',
      delivery: true
    },
    {
      name: 'Walmart Pharmacy',
      distance: '1.2 mi',
      distanceValue: 1.2,
      price: '$12.00',
      priceValue: 12.00
    },
    {
      name: 'Amazon Pharmacy',
      distance: 'Delivery',
      distanceValue: 0,
      price: '$13.75',
      priceValue: 13.75,
      delivery: true
    },
    {
      name: 'CVS Pharmacy',
      distance: '2.4 mi',
      distanceValue: 2.4,
      price: '$14.50',
      priceValue: 14.50
    },
    {
      name: 'Walgreens',
      distance: '2.6 mi',
      distanceValue: 2.6,
      price: '$15.00',
      priceValue: 15.00
    },
    {
      name: 'Rite Aid',
      distance: '3.2 mi',
      distanceValue: 3.2,
      price: '$16.00',
      priceValue: 16.00
    },
  ] : [
    {
      name: 'Walmart Pharmacy',
      distance: '0.8 mi',
      distanceValue: 0.8,
      price: '$5.00',
      priceValue: 5.00,
      marioPick: true,
      savings: 'Save $5.00'
    },
    {
      name: 'Costco Pharmacy',
      distance: '1.5 mi',
      distanceValue: 1.5,
      price: '$6.25',
      priceValue: 6.25
    },
    {
      name: 'CVS Pharmacy',
      distance: '2.1 mi',
      distanceValue: 2.1,
      price: '$7.50',
      priceValue: 7.50
    },
    {
      name: 'Capsule',
      distance: 'Delivery',
      distanceValue: 0,
      price: '$8.25',
      priceValue: 8.25,
      delivery: true
    },
    {
      name: 'Walgreens',
      distance: '2.7 mi',
      distanceValue: 2.7,
      price: '$9.00',
      priceValue: 9.00
    },
  ];

  // Sort pharmacies based on selected option
  const sortedPharmacies = [...pharmacyData].sort((a, b) => {
    if (sortBy === 'price') {
      return a.priceValue - b.priceValue;
    } else if (sortBy === 'distance') {
      // Delivery/Mail should come last
      if (a.delivery && !b.delivery) return 1;
      if (!a.delivery && b.delivery) return -1;
      return a.distanceValue - b.distanceValue;
    } else { // name
      return a.name.localeCompare(b.name);
    }
  });

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Medication saved', {
        description: 'Added to your saved medications'
      });
    }
  };

  const handleGetPrice = (pharmacyName: string, price: string) => {
    toast.success('🎁 +50 MarioPoints earned', {
      description: `You chose a value medication option at ${pharmacyName} for ${price}!`
    });
  };

  const handleZipChange = () => {
    setZipCode(tempZipCode);
    setZipModalOpen(false);
    setIsLoading(true);
    
    toast.success('Location updated', {
      description: `Now showing prices near ${tempZipCode}`
    });
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F6F4F0]">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={onBack}
                className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
                style={{ minWidth: '44px', minHeight: '44px' }}
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
              </button>
              
              <div className="flex-1 min-w-0">
                <h1 
                  className="truncate"
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#2E5077'
                  }}
                >
                  Compare Prices – {medication.name}
                </h1>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  {selectedDosage} · {selectedQuantity}
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label={isSaved ? 'Remove from saved' : 'Save medication'}
            >
              <Save 
                className="w-5 h-5" 
                style={{ 
                  color: isSaved ? '#4DA1A9' : '#6B7280',
                  fill: isSaved ? '#4DA1A9' : 'none'
                }} 
              />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {/* Filter Row */}
        <Card 
          className="p-4"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="space-y-4">
            {/* Sort Options */}
            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}
              >
                Sort by
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setSortBy('price')}
                  variant={sortBy === 'price' ? 'default' : 'outline'}
                  style={{
                    backgroundColor: sortBy === 'price' ? '#2E5077' : 'white',
                    color: sortBy === 'price' ? 'white' : '#2E5077',
                    border: '1px solid #2E5077',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}
                >
                  Price <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setSortBy('distance')}
                  variant={sortBy === 'distance' ? 'default' : 'outline'}
                  style={{
                    backgroundColor: sortBy === 'distance' ? '#2E5077' : 'white',
                    color: sortBy === 'distance' ? 'white' : '#2E5077',
                    border: '1px solid #2E5077',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}
                >
                  Distance <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setSortBy('name')}
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  style={{
                    backgroundColor: sortBy === 'name' ? '#2E5077' : 'white',
                    color: sortBy === 'name' ? 'white' : '#2E5077',
                    border: '1px solid #2E5077',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    minHeight: '40px'
                  }}
                >
                  Pharmacy Name <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* ZIP Code Section */}
            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ fontSize: '13px', color: '#6B7280' }}>
                  Near {zipCode}
                </span>
              </div>
              <button
                onClick={() => {
                  setTempZipCode(zipCode);
                  setZipModalOpen(true);
                }}
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#2E5077',
                  textDecoration: 'underline'
                }}
              >
                Change ZIP
              </button>
            </div>

            {/* Subtext */}
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
              Prices via GoodRx and SingleCare networks.
            </p>
          </div>
        </Card>

        {/* Price Comparison Cards (Mobile) / Table (Desktop) */}
        <div className="space-y-3">
          {/* Desktop Table View - Hidden on Mobile */}
          <div className="hidden lg:block">
            <Card 
              style={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden'
              }}
            >
              {/* Table Header */}
              <div 
                className="grid grid-cols-12 gap-4 px-6 py-3"
                style={{
                  backgroundColor: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB'
                }}
              >
                <div className="col-span-5">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Pharmacy
                  </p>
                </div>
                <div className="col-span-2">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Distance
                  </p>
                </div>
                <div className="col-span-2">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Price
                  </p>
                </div>
                <div className="col-span-3">
                  <p style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>
                    Action
                  </p>
                </div>
              </div>

              {/* Table Rows */}
              <div>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div 
                      key={idx}
                      className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse"
                      style={{ borderBottom: '1px solid #E5E7EB' }}
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-200" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                      <div className="col-span-2">
                        <div className="h-6 bg-gray-200 rounded w-20" />
                      </div>
                      <div className="col-span-3">
                        <div className="h-10 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  ))
                ) : (
                  sortedPharmacies.map((pharmacy, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-4 px-6 py-4 mario-transition hover:bg-gray-50"
                      style={{
                        borderBottom: idx < sortedPharmacies.length - 1 ? '1px solid #E5E7EB' : 'none',
                        backgroundColor: pharmacy.marioPick ? '#F0FDFA' : 'white',
                        borderLeft: pharmacy.marioPick ? '4px solid #4DA1A9' : '4px solid transparent'
                      }}
                    >
                      {/* Pharmacy Name */}
                      <div className="col-span-5 flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: '#F3F4F6',
                            border: '1px solid #E5E7EB'
                          }}
                        >
                          <Package className="w-5 h-5" style={{ color: '#6B7280' }} />
                        </div>
                        <div>
                          <p 
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1A1A1A'
                            }}
                          >
                            {pharmacy.name}
                          </p>
                          {pharmacy.marioPick && (
                            <Badge 
                              style={{
                                backgroundColor: '#4DA1A9',
                                color: 'white',
                                fontSize: '11px',
                                padding: '2px 8px',
                                marginTop: '4px'
                              }}
                            >
                              🎯 Mario's Pick
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Distance */}
                      <div className="col-span-2 flex items-center">
                        <div className="flex items-center gap-1">
                          {pharmacy.delivery ? (
                            <Truck className="w-4 h-4" style={{ color: '#79D7BE' }} />
                          ) : (
                            <Store className="w-4 h-4" style={{ color: '#6B7280' }} />
                          )}
                          <p style={{ fontSize: '14px', color: '#1A1A1A' }}>
                            {pharmacy.distance}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 flex items-center">
                        <div>
                          <p 
                            style={{
                              fontSize: '18px',
                              fontWeight: '700',
                              color: '#2E5077'
                            }}
                          >
                            {pharmacy.price}
                          </p>
                          {pharmacy.savings && (
                            <p 
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#79D7BE'
                              }}
                            >
                              {pharmacy.savings}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="col-span-3 flex items-center">
                        <Button
                          onClick={() => handleGetPrice(pharmacy.name, pharmacy.price)}
                          style={{
                            backgroundColor: pharmacy.marioPick ? '#2E5077' : 'white',
                            color: pharmacy.marioPick ? 'white' : '#2E5077',
                            border: pharmacy.marioPick ? 'none' : '1px solid #2E5077',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            minHeight: '40px',
                            width: '100%'
                          }}
                        >
                          {pharmacy.marioPick ? 'Get This Price' : 'Get Coupon'}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Mobile Card View - Hidden on Desktop */}
          <div className="block lg:hidden space-y-3">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <Card 
                  key={idx}
                  className="p-4 animate-pulse"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white'
                  }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-16" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </Card>
              ))
            ) : (
              sortedPharmacies.map((pharmacy, idx) => (
                <Card
                  key={idx}
                  className="p-4"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: pharmacy.marioPick ? '#F0FDFA' : 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    borderLeft: pharmacy.marioPick ? '4px solid #4DA1A9' : 'none'
                  }}
                >
                  {pharmacy.marioPick && (
                    <Badge 
                      className="mb-3"
                      style={{
                        backgroundColor: '#4DA1A9',
                        color: 'white',
                        fontSize: '11px',
                        padding: '2px 8px'
                      }}
                    >
                      🎯 Mario's Pick — {pharmacy.savings}
                    </Badge>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: '#F3F4F6',
                          border: '1px solid #E5E7EB'
                        }}
                      >
                        <Package className="w-5 h-5" style={{ color: '#6B7280' }} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p 
                          className="truncate"
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#1A1A1A'
                          }}
                        >
                          {pharmacy.name}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {pharmacy.delivery ? (
                            <Truck className="w-3 h-3" style={{ color: '#79D7BE' }} />
                          ) : (
                            <Store className="w-3 h-3" style={{ color: '#6B7280' }} />
                          )}
                          <p style={{ fontSize: '13px', color: '#6B7280' }}>
                            {pharmacy.distance}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-3">
                      <p 
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#2E5077'
                        }}
                      >
                        {pharmacy.price}
                      </p>
                      {pharmacy.savings && !pharmacy.marioPick && (
                        <p 
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            color: '#79D7BE'
                          }}
                        >
                          {pharmacy.savings}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGetPrice(pharmacy.name, pharmacy.price)}
                    className="w-full"
                    style={{
                      backgroundColor: pharmacy.marioPick ? '#2E5077' : 'white',
                      color: pharmacy.marioPick ? 'white' : '#2E5077',
                      border: pharmacy.marioPick ? 'none' : '1px solid #2E5077',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      minHeight: '44px'
                    }}
                  >
                    {pharmacy.marioPick ? 'Get This Price' : 'Get Coupon'}
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ZIP Code Change Modal */}
      <Dialog open={zipModalOpen} onOpenChange={setZipModalOpen}>
        <DialogContent 
          style={{
            borderRadius: '12px',
            maxWidth: '400px'
          }}
        >
          <DialogHeader>
            <DialogTitle 
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2E5077'
              }}
            >
              Change ZIP Code
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', color: '#6B7280' }}>
              Enter your ZIP code to see prices at nearby pharmacies
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <Input
              type="text"
              placeholder="Enter ZIP code"
              value={tempZipCode}
              onChange={(e) => setTempZipCode(e.target.value)}
              maxLength={5}
              style={{
                borderRadius: '8px',
                fontSize: '15px',
                minHeight: '44px'
              }}
            />

            <div className="flex gap-2">
              <Button
                onClick={() => setZipModalOpen(false)}
                variant="outline"
                className="flex-1"
                style={{
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '44px'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleZipChange}
                className="flex-1"
                style={{
                  backgroundColor: '#2E5077',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '44px'
                }}
              >
                Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
