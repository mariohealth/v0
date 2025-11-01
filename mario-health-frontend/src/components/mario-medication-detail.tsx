'use client'
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  ArrowLeft,
  Save,
  MapPin,
  Package,
  Target
} from 'lucide-react';
import type { MedicationData } from '../data/mario-medication-data';
import { toast } from 'sonner@2.0.3';

interface MarioMedicationDetailProps {
  medication: MedicationData;
  onBack: () => void;
  onOrderOnline: (pharmacy: string) => void;
  onSearch?: (query: string) => void;
}

interface PharmacyOffer {
  name: string;
  logo?: string;
  distance: string;
  price: string;
  priceValue: number;
  savings?: string;
  source?: string;
  delivery?: boolean;
}

export function MarioMedicationDetail({
  medication,
  onBack,
  onOrderOnline
}: MarioMedicationDetailProps) {
  const [selectedDosage, setSelectedDosage] = useState(medication.dosage[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(medication.quantity[0]);
  const [zipModalOpen, setZipModalOpen] = useState(false);
  const [zipCode, setZipCode] = useState('10001');
  const [tempZipCode, setTempZipCode] = useState('10001');
  const [isSaved, setIsSaved] = useState(false);

  // Determine Mario's Pick and pharmacy data based on medication
  const getMedicationData = () => {
    if (medication.name.includes('Atorvastatin')) {
      return {
        marioPick: {
          name: 'Cost Plus Drugs',
          distance: 'Mail order',
          price: '$8.50',
          priceValue: 8.50,
          copayComparison: '$15',
          savings: 'Save $6.50 this month',
          yearSavings: '$78 per year',
          source: 'via GoodRx',
          delivery: true
        },
        withInsurance: [
          { name: 'Walmart Pharmacy', distance: '1.2 mi', price: '$14', priceValue: 14, source: 'Your plan' },
          { name: 'Walgreens', distance: '2.4 mi', price: '$15', priceValue: 15, source: 'Your plan' },
          { name: 'CVS Pharmacy', distance: '2.6 mi', price: '$17', priceValue: 17, source: 'Your plan' },
          { name: 'Rite Aid', distance: '3.2 mi', price: '$19', priceValue: 19, source: 'Your plan' }
        ],
        withoutInsurance: [
          { name: 'Cost Plus Drugs', distance: 'Mail order', price: '$8.50', priceValue: 8.50, source: 'via GoodRx', delivery: true },
          { name: 'Walmart Pharmacy', distance: '1.2 mi', price: '$12.00', priceValue: 12.00, source: 'via SingleCare' },
          { name: 'Amazon Pharmacy', distance: 'Delivery', price: '$13.75', priceValue: 13.75, source: 'via GoodRx', delivery: true },
          { name: 'Capsule', distance: 'Delivery', price: '$14.50', priceValue: 14.50, source: 'via SingleCare', delivery: true }
        ]
      };
    } else {
      // Metformin
      return {
        marioPick: {
          name: 'Walmart Pharmacy',
          distance: '0.8 mi',
          price: '$5.00',
          priceValue: 5.00,
          copayComparison: '$10',
          savings: 'Save $5.00 this month',
          yearSavings: '$60 per year',
          source: 'via SingleCare',
          delivery: false
        },
        withInsurance: [
          { name: 'Kroger Pharmacy', distance: '1.0 mi', price: '$9', priceValue: 9, source: 'Your plan' },
          { name: 'Walgreens', distance: '1.5 mi', price: '$10', priceValue: 10, source: 'Your plan' },
          { name: 'CVS Pharmacy', distance: '2.1 mi', price: '$12', priceValue: 12, source: 'Your plan' }
        ],
        withoutInsurance: [
          { name: 'Walmart Pharmacy', distance: '0.8 mi', price: '$5.00', priceValue: 5.00, source: 'via SingleCare' },
          { name: 'Costco Pharmacy', distance: '1.5 mi', price: '$6.25', priceValue: 6.25, source: 'via GoodRx' },
          { name: 'CVS Pharmacy', distance: '2.1 mi', price: '$7.50', priceValue: 7.50, source: 'via SingleCare' },
          { name: 'Capsule', distance: 'Delivery', price: '$8.25', priceValue: 8.25, source: 'via GoodRx', delivery: true }
        ]
      };
    }
  };

  const { marioPick, withInsurance, withoutInsurance } = getMedicationData();

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Medication saved', {
        description: 'Added to your saved medications'
      });
    }
  };

  const handleGetPrice = (pharmacyName: string, price: string) => {
    toast.success('🎁 +50 MarioPoints earned!', {
      description: `You chose ${pharmacyName} at ${price}`
    });
    onOrderOnline(pharmacyName);
  };

  const handleZipChange = () => {
    setZipCode(tempZipCode);
    setZipModalOpen(false);
    toast.success('Location updated', {
      description: `Now showing prices near ${tempZipCode}`
    });
  };

  const lowestInsurancePrice = Math.min(...withInsurance.map(o => o.priceValue));
  const lowestCashPrice = Math.min(...withoutInsurance.map(o => o.priceValue));

  return (
    <div className="min-h-screen bg-[#F6F4F0] pb-20">
      {/* Header */}
      <div 
        className="bg-white sticky top-0 z-20"
        style={{
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
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
                  {medication.name}
                </h1>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  {medication.category}
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

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Dosage & Quantity Selectors */}
        <Card 
          className="p-4"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}
              >
                Dosage
              </label>
              <Select value={selectedDosage} onValueChange={setSelectedDosage}>
                <SelectTrigger 
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    minHeight: '44px'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {medication.dosage.map((dose) => (
                    <SelectItem key={dose} value={dose}>
                      {dose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label 
                className="block mb-2"
                style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#6B7280'
                }}
              >
                Quantity
              </label>
              <Select value={selectedQuantity} onValueChange={setSelectedQuantity}>
                <SelectTrigger 
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    minHeight: '44px'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {medication.quantity.map((qty) => (
                    <SelectItem key={qty} value={qty}>
                      {qty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Mario's Pick Section - Hero Card */}
        <Card 
          className="overflow-hidden"
          style={{
            borderRadius: '12px',
            border: '2px solid #4DA1A9',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
          aria-label="Best value price"
        >
          {/* Teal Banner */}
          <div 
            className="p-3 flex items-center gap-2"
            style={{
              backgroundColor: '#4DA1A9'
            }}
          >
            <Target className="w-4 h-4" style={{ color: 'white' }} />
            <span 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white'
              }}
            >
              🎯 Mario's Pick — Best overall savings
            </span>
          </div>

          {/* Card Content */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <Package className="w-6 h-6" style={{ color: '#6B7280' }} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p 
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1A1A1A',
                      marginBottom: '2px'
                    }}
                  >
                    {marioPick.name}
                  </p>
                  <p style={{ fontSize: '13px', color: '#6B7280' }}>
                    {marioPick.distance}
                  </p>
                </div>
              </div>

              <div className="text-right ml-3">
                <p 
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#2E5077'
                  }}
                >
                  {marioPick.price}
                </p>
                <p 
                  style={{
                    fontSize: '12px',
                    color: '#6B7280'
                  }}
                >
                  vs {marioPick.copayComparison} copay
                </p>
              </div>
            </div>

            {/* Savings Info */}
            <div 
              className="p-3 rounded-lg mb-3"
              style={{
                backgroundColor: 'rgba(121, 215, 190, 0.1)',
                border: '1px solid rgba(121, 215, 190, 0.3)'
              }}
            >
              <p 
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2E5077',
                  marginBottom: '2px'
                }}
              >
                {marioPick.savings}
              </p>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                {marioPick.yearSavings}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Badge 
                style={{
                  backgroundColor: 'rgba(77, 161, 169, 0.15)',
                  color: '#2E5077',
                  fontSize: '11px',
                  padding: '4px 8px'
                }}
              >
                +50 MarioPoints
              </Badge>

              <Button
                onClick={() => handleGetPrice(marioPick.name, marioPick.price)}
                style={{
                  backgroundColor: '#2E5077',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '40px',
                  paddingLeft: '24px',
                  paddingRight: '24px'
                }}
              >
                Get This Price
              </Button>
            </div>

            <p 
              className="mt-3 text-center"
              style={{ fontSize: '11px', color: '#9CA3AF' }}
            >
              Prices {marioPick.source}
            </p>
          </div>
        </Card>

        {/* Accordion Sections */}
        <Accordion type="multiple" className="space-y-3">
          {/* Paying with Insurance */}
          <AccordionItem 
            value="with-insurance"
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <AccordionTrigger 
              className="px-4 py-3 hover:no-underline"
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1A1A1A'
              }}
            >
              <div className="flex-1 text-left">
                <p style={{ marginBottom: '4px' }}>Paying with Insurance</p>
                <p 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: '400', 
                    color: '#6B7280' 
                  }}
                >
                  Lowest copay ${lowestInsurancePrice} at {withInsurance.find(o => o.priceValue === lowestInsurancePrice)?.name}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 mt-2">
                {withInsurance.map((offer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg"
                    style={{
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB'
                    }}
                  >
                    <div className="flex items-center justify-between">
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
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1A1A1A'
                            }}
                          >
                            {offer.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>
                            {offer.distance} · {offer.source}
                          </p>
                        </div>
                      </div>

                      <p 
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#2E5077'
                        }}
                      >
                        {offer.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Paying without Insurance */}
          <AccordionItem 
            value="without-insurance"
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <AccordionTrigger 
              className="px-4 py-3 hover:no-underline"
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1A1A1A'
              }}
            >
              <div className="flex-1 text-left">
                <p style={{ marginBottom: '4px' }}>Paying without Insurance</p>
                <p 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: '400', 
                    color: '#6B7280' 
                  }}
                >
                  Cash prices from ${lowestCashPrice.toFixed(2)}
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-2 mt-2">
                {withoutInsurance.map((offer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg"
                    style={{
                      border: '1px solid #E5E7EB',
                      backgroundColor: '#F9FAFB'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
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
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1A1A1A'
                            }}
                          >
                            {offer.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#6B7280' }}>
                            {offer.distance} · {offer.source}
                          </p>
                        </div>
                      </div>

                      <p 
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#2E5077'
                        }}
                      >
                        {offer.price}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleGetPrice(offer.name, offer.price)}
                      className="w-full"
                      style={{
                        backgroundColor: 'white',
                        color: '#2E5077',
                        border: '1px solid #2E5077',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        minHeight: '40px'
                      }}
                    >
                      Get Coupon
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ZIP Code Section */}
        <div className="flex items-center justify-center gap-2 py-2">
          <MapPin className="w-4 h-4" style={{ color: '#6B7280' }} />
          <span style={{ fontSize: '13px', color: '#6B7280' }}>
            Showing prices near {zipCode}
          </span>
          <button
            onClick={() => {
              setTempZipCode(zipCode);
              setZipModalOpen(true);
            }}
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#2E5077',
              textDecoration: 'underline',
              marginLeft: '4px'
            }}
          >
            Change ZIP Code
          </button>
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
