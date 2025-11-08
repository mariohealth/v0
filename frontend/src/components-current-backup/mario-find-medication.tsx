'use client'
import { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Pill,
  Heart,
  Syringe,
  Brain,
  Activity,
  Eye,
  Thermometer,
  Shield,
  Zap,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface FindMedicationProps {
  onBack: () => void;
  onMedicationClick: (medicationId: string) => void;
  onCategoryClick: (categoryId: string) => void;
  onBrowseByLetter: () => void;
}

// Top medications data
const topMedications = [
  { id: 'metformin-500', name: 'Metformin', category: 'Type 2 Diabetes', icon: '💊' },
  { id: 'atorvastatin-20', name: 'Atorvastatin', category: 'High Cholesterol', icon: '❤️' },
  { id: 'lisinopril-10', name: 'Lisinopril', category: 'Blood Pressure', icon: '💉' },
  { id: 'levothyroxine', name: 'Levothyroxine', category: 'Thyroid', icon: '🧠' },
  { id: 'amlodipine', name: 'Amlodipine', category: 'Blood Pressure', icon: '💓' },
  { id: 'omeprazole', name: 'Omeprazole', category: 'Acid Reflux', icon: '🔥' },
  { id: 'albuterol', name: 'Albuterol', category: 'Asthma', icon: '🌬️' },
  { id: 'gabapentin', name: 'Gabapentin', category: 'Nerve Pain', icon: '⚡' },
  { id: 'losartan', name: 'Losartan', category: 'Blood Pressure', icon: '💉' },
  { id: 'sertraline', name: 'Sertraline', category: 'Depression', icon: '🧠' },
  { id: 'ozempic-2', name: 'Ozempic', category: 'Type 2 Diabetes', icon: '💊' },
  { id: 'amoxicillin', name: 'Amoxicillin', category: 'Antibiotic', icon: '🛡️' }
];

// Medication categories
const categories = [
  { 
    id: 'diabetes', 
    name: 'Diabetes', 
    icon: '💊',
    count: 45,
    color: '#2E5077'
  },
  { 
    id: 'heart-health', 
    name: 'Heart Health', 
    icon: '❤️',
    count: 38,
    color: '#D32F2F'
  },
  { 
    id: 'pain-relief', 
    name: 'Pain Relief', 
    icon: '⚡',
    count: 52,
    color: '#FFA726'
  },
  { 
    id: 'mental-health', 
    name: 'Mental Health', 
    icon: '🧠',
    count: 29,
    color: '#4DA1A9'
  },
  { 
    id: 'respiratory', 
    name: 'Respiratory', 
    icon: '🌬️',
    count: 31,
    color: '#79D7BE'
  },
  { 
    id: 'antibiotics', 
    name: 'Antibiotics', 
    icon: '🛡️',
    count: 42,
    color: '#00AA66'
  },
  { 
    id: 'digestive', 
    name: 'Digestive Health', 
    icon: '🔥',
    count: 36,
    color: '#FF6F61'
  },
  { 
    id: 'eye-care', 
    name: 'Eye Care', 
    icon: '👁️',
    count: 18,
    color: '#5C6BC0'
  },
  { 
    id: 'skin-care', 
    name: 'Skin Care', 
    icon: '✨',
    count: 27,
    color: '#AB47BC'
  }
];

export function MarioFindMedication({
  onBack,
  onMedicationClick,
  onCategoryClick,
  onBrowseByLetter
}: FindMedicationProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopMedications = searchQuery
    ? topMedications.filter(med =>
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : topMedications;

  const filteredCategories = searchQuery
    ? categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F6F4F0' }}>
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full mario-transition hover:bg-gray-100 mario-focus-ring"
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: '#2E5077' }} />
            </button>
            
            <h1 
              className="flex-1"
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2E5077'
              }}
            >
              Find Medication
            </h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sticky top-14 z-10 bg-white" style={{ borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
              style={{ color: '#666666' }} 
            />
            <Input
              type="text"
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              style={{
                height: '44px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                fontSize: '14px',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Top Medications */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}
              >
                Top Medications
              </h2>
              <p style={{ fontSize: '14px', color: '#666666' }}>
                Most commonly searched medications
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTopMedications.map((medication) => (
                <Card
                  key={medication.id}
                  className="mario-transition hover:shadow-md cursor-pointer"
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  onClick={() => onMedicationClick(medication.id)}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div 
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: '#2E50770A',
                        fontSize: '24px'
                      }}
                    >
                      {medication.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1A1A1A',
                          marginBottom: '2px'
                        }}
                      >
                        {medication.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#666666' }}>
                        {medication.category}
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronRight 
                      className="w-5 h-5 flex-shrink-0" 
                      style={{ color: '#999999' }} 
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Categories */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1A1A1A',
                  marginBottom: '4px'
                }}
              >
                Browse by Category
              </h2>
              <p style={{ fontSize: '14px', color: '#666666' }}>
                Find medications by health condition
              </p>
            </div>

            {/* Category Grid */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px'
              }}
            >
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="mario-transition hover:shadow-md cursor-pointer group"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    textAlign: 'center'
                  }}
                  onClick={() => onCategoryClick(category.id)}
                >
                  {/* Icon Container */}
                  <div 
                    className="mx-auto flex items-center justify-center mb-3 mario-transition group-hover:scale-110"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: `${category.color}14`,
                      fontSize: '28px'
                    }}
                  >
                    {category.icon}
                  </div>

                  {/* Category Name */}
                  <h3 
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#1A1A1A',
                      marginBottom: '4px'
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* Medication Count */}
                  <p 
                    style={{ 
                      fontSize: '13px', 
                      color: '#666666' 
                    }}
                  >
                    {category.count} meds
                  </p>
                </Card>
              ))}
            </div>

            {/* Browse by Letter Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Button
                variant="outline"
                className="mario-transition"
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid #2E5077',
                  color: '#2E5077',
                  backgroundColor: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
                onClick={onBrowseByLetter}
              >
                Browse by Letter (A–Z)
              </Button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {searchQuery && filteredTopMedications.length === 0 && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div 
              className="mx-auto flex items-center justify-center mb-4"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '40px',
                backgroundColor: '#2E50770A'
              }}
            >
              <Pill className="w-10 h-10" style={{ color: '#2E5077' }} />
            </div>
            <h3 
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1A1A1A',
                marginBottom: '8px'
              }}
            >
              No medications found
            </h3>
            <p style={{ fontSize: '14px', color: '#666666' }}>
              Try searching with a different term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
