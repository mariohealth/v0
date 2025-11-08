'use client'
import { useState } from 'react';
import { ArrowLeft, Pill, DollarSign, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface SavedMedication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  quantity: string;
  lowestPrice: number;
  pharmacy: string;
  category: string;
}

interface MarioSavedMedicationsProps {
  onBack: () => void;
  onMedicationClick?: (medicationId: string) => void;
}

export function MarioSavedMedications({ onBack, onMedicationClick }: MarioSavedMedicationsProps) {
  const [savedMedications, setSavedMedications] = useState<SavedMedication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      dosage: '10mg',
      quantity: '30 tablets',
      lowestPrice: 12,
      pharmacy: 'Costco Pharmacy',
      category: 'Blood Pressure'
    },
    {
      id: '2',
      name: 'Lipitor',
      genericName: 'Atorvastatin',
      dosage: '20mg',
      quantity: '30 tablets',
      lowestPrice: 18,
      pharmacy: 'CVS Pharmacy',
      category: 'Cholesterol'
    }
  ]);

  const handleRemove = (medicationId: string) => {
    setSavedMedications(prev => prev.filter(m => m.id !== medicationId));
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
              Saved Medications
            </h1>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666'
              }}
            >
              {savedMedications.length} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {savedMedications.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: '#4DA1A920' }}
            >
              <Pill className="h-10 w-10" style={{ color: '#4DA1A9' }} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ 
                fontSize: '18px',
                color: '#2E5077'
              }}
            >
              No Saved Medications
            </h3>
            <p 
              style={{ 
                fontSize: '14px',
                color: '#666666',
                maxWidth: '280px'
              }}
            >
              Save medications to track prices and reorder easily
            </p>
          </div>
        ) : (
          // Medication List
          <div className="space-y-4">
            {savedMedications.map((medication) => (
              <div
                key={medication.id}
                className="rounded-2xl shadow-sm overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="p-4">
                  {/* Header with Icon and Remove */}
                  <div className="flex gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#4DA1A920' }}
                    >
                      <Pill className="h-6 w-6" style={{ color: '#4DA1A9' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 
                            className="font-semibold truncate"
                            style={{ 
                              fontSize: '16px',
                              color: '#1A1A1A'
                            }}
                          >
                            {medication.name}
                          </h3>
                          {medication.genericName !== medication.name && (
                            <p 
                              className="truncate"
                              style={{ 
                                fontSize: '13px',
                                color: '#999999',
                                marginTop: '2px'
                              }}
                            >
                              Generic: {medication.genericName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(medication.id)}
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
                    </div>
                  </div>

                  {/* Dosage & Quantity */}
                  <div className="flex items-center gap-3 mb-3">
                    <Badge 
                      variant="outline"
                      style={{
                        borderColor: '#4DA1A9',
                        color: '#4DA1A9',
                        fontSize: '12px'
                      }}
                    >
                      {medication.dosage}
                    </Badge>
                    <span 
                      style={{ 
                        fontSize: '14px',
                        color: '#666666'
                      }}
                    >
                      {medication.quantity}
                    </span>
                  </div>

                  {/* Category */}
                  <p 
                    className="mb-3"
                    style={{ 
                      fontSize: '13px',
                      color: '#999999'
                    }}
                  >
                    Category: {medication.category}
                  </p>

                  {/* Pricing Info */}
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg mb-4"
                    style={{ backgroundColor: '#79D7BE20' }}
                  >
                    <div>
                      <p 
                        style={{ 
                          fontSize: '12px',
                          color: '#666666',
                          marginBottom: '2px'
                        }}
                      >
                        Lowest price at
                      </p>
                      <p 
                        className="font-medium"
                        style={{ 
                          fontSize: '14px',
                          color: '#1A1A1A'
                        }}
                      >
                        {medication.pharmacy}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-5 w-5" style={{ color: '#79D7BE' }} />
                      <span 
                        className="font-semibold"
                        style={{ 
                          fontSize: '20px',
                          color: '#79D7BE'
                        }}
                      >
                        {medication.lowestPrice}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => onMedicationClick?.(medication.id)}
                      style={{
                        borderColor: '#2E5077',
                        color: '#2E5077',
                        minHeight: '44px',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      className="flex items-center gap-2"
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
                      <ShoppingCart className="h-4 w-4" />
                      Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
