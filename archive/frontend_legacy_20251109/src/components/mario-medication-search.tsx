'use client'
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Pill, 
  Truck, 
  MapPin, 
  Award, 
  DollarSign,
  Plus,
  Minus,
  ExternalLink,
  Check,
  ChevronDown,
  RefreshCw,
  Shield
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from './ui/select';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { type Medication } from '@/lib/data/healthcare-data';

interface MedicationSearchResultsProps {
  medication: Medication;
  onBack: () => void;
}

export function MedicationSearchResults({ medication, onBack }: MedicationSearchResultsProps) {
  const [selectedDosage, setSelectedDosage] = useState(medication.dosage);
  const [selectedQuantity, setSelectedQuantity] = useState(30);
  const [showComparison, setShowComparison] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>('');

  // Calculate prices based on quantity (simple multiplier for demo)
  const quantityMultiplier = selectedQuantity / 30;
  const adjustedCashPrices = medication.cashPrices.map(price => ({
    ...price,
    price: Math.round(price.price * quantityMultiplier * 100) / 100
  }));
  const adjustedInsurancePrice = {
    ...medication.insurancePrice,
    copay: Math.round(medication.insurancePrice.copay * quantityMultiplier * 100) / 100
  };
  const adjustedMarioPick = medication.marioPick ? {
    ...medication.marioPick,
    price: Math.round(medication.marioPick.price * quantityMultiplier * 100) / 100,
    savings: Math.round((adjustedInsurancePrice.copay - (medication.marioPick.price * quantityMultiplier)) * 100) / 100
  } : null;

  const bestCashOption = adjustedCashPrices.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Medication Header */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Pill className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{medication.name}</h1>
              {medication.genericName && (
                <p className="text-sm text-muted-foreground">
                  Generic: {medication.genericName}
                </p>
              )}
              <p className="text-sm text-muted-foreground capitalize">
                {medication.dosage} {medication.form}
              </p>
            </div>
          </div>

          {/* Dosage and Quantity Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Dosage</Label>
              <Select value={selectedDosage} onValueChange={setSelectedDosage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10mg">10mg</SelectItem>
                  <SelectItem value="20mg">20mg</SelectItem>
                  <SelectItem value="40mg">40mg</SelectItem>
                  <SelectItem value="80mg">80mg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">Quantity</Label>
              <Select value={selectedQuantity.toString()} onValueChange={(value) => setSelectedQuantity(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {medication.quantities.map(qty => (
                    <SelectItem key={qty} value={qty.toString()}>
                      {qty} tablets
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-3">
          {/* Insurance Price Card */}
          <Card className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">With Your Insurance</h3>
              </div>
              <Badge variant="outline">Blue Cross Blue Shield</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${adjustedInsurancePrice.copay}</p>
                <p className="text-sm text-muted-foreground">
                  Copay at preferred pharmacy
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowComparison(true)}
              >
                Select Pharmacy
              </Button>
            </div>
          </Card>

          {/* Cash Price Card (Mario's Pick) */}
          {adjustedMarioPick && (
            <Card className="p-4 border-accent/30 bg-accent/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground px-4 py-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Award className="h-4 w-4" />
                  Mario's Pick - Save ${adjustedMarioPick.savings}!
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Cash Price</h3>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    +{medication.marioPoints} points
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-accent">
                      ${adjustedMarioPick.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {adjustedMarioPick.pharmacy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Delivered to your door
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedPharmacy(adjustedMarioPick.pharmacy);
                      setShowTransferModal(true);
                    }}
                  >
                    Get This Price
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Compare Prices Link */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowComparison(true)}
        >
          Compare All Prices
        </Button>

        {/* Annual Savings Info */}
        {adjustedMarioPick && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Annual Savings</h3>
            </div>
            <p className="text-sm text-green-700">
              If you refill monthly, you'll save approximately{' '}
              <span className="font-bold">${(adjustedMarioPick.savings * 12).toFixed(0)}</span>{' '}
              per year by choosing the cash option.
            </p>
          </Card>
        )}
      </div>

      {/* Price Comparison Modal */}
      <PriceComparisonModal
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        medicationName={medication.name}
        dosage={selectedDosage}
        quantity={selectedQuantity}
        insurancePrice={adjustedInsurancePrice}
        cashPrices={adjustedCashPrices}
        onSelectPharmacy={(pharmacy) => {
          setSelectedPharmacy(pharmacy);
          setShowComparison(false);
          setShowTransferModal(true);
        }}
      />

      {/* Transfer Prescription Modal */}
      <TransferPrescriptionModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        medicationName={medication.name}
        dosage={selectedDosage}
        quantity={selectedQuantity}
        selectedPharmacy={selectedPharmacy}
        price={selectedPharmacy === adjustedMarioPick?.pharmacy ? adjustedMarioPick.price : 
              adjustedCashPrices.find(p => p.pharmacy === selectedPharmacy)?.price || 0}
        savings={selectedPharmacy === adjustedMarioPick?.pharmacy ? adjustedMarioPick.savings : 0}
      />
    </div>
  );
}

interface PriceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicationName: string;
  dosage: string;
  quantity: number;
  insurancePrice: { copay: number; pharmacy: string };
  cashPrices: Array<{
    pharmacy: string;
    price: number;
    distance?: number;
    delivery?: boolean;
    deliveryTime?: string;
  }>;
  onSelectPharmacy: (pharmacy: string) => void;
}

function PriceComparisonModal({
  isOpen,
  onClose,
  medicationName,
  dosage,
  quantity,
  insurancePrice,
  cashPrices,
  onSelectPharmacy
}: PriceComparisonModalProps) {
  const [sortBy, setSortBy] = useState<'price' | 'distance'>('price');
  
  const sortedPrices = [...cashPrices].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'distance') return (a.distance || 999) - (b.distance || 999);
    return 0;
  });

  const allOptions = [
    ...sortedPrices,
    {
      pharmacy: 'With Insurance (Your copay)',
      price: insurancePrice.copay,
      isInsurance: true
    }
  ].sort((a, b) => a.price - b.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Prices</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {medicationName} {dosage} - {quantity} tablets
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={(value: 'price' | 'distance') => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {allOptions.map((option, index) => (
              <Card 
                key={option.pharmacy}
                className={`p-3 cursor-pointer transition-colors hover:bg-muted ${
                  index === 0 ? 'border-accent border-2 bg-accent/5' : ''
                }`}
                onClick={() => !('isInsurance' in option) ? onSelectPharmacy(option.pharmacy) : undefined}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{option.pharmacy}</p>
                      {index === 0 && (
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          Best Price
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {'distance' in option && option.distance && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {option.distance} mi
                        </span>
                      )}
                      {'delivery' in option && option.delivery && (
                        <span className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {option.deliveryTime || 'Delivery available'}
                        </span>
                      )}
                      {'isInsurance' in option && (
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Insurance copay
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${option.price}</p>
                    {!('isInsurance' in option) && (
                      <Button size="sm" variant="outline">
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TransferPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicationName: string;
  dosage: string;
  quantity: number;
  selectedPharmacy: string;
  price: number;
  savings: number;
}

function TransferPrescriptionModal({
  isOpen,
  onClose,
  medicationName,
  dosage,
  quantity,
  selectedPharmacy,
  price,
  savings
}: TransferPrescriptionModalProps) {
  const [step, setStep] = useState<'current_pharmacy' | 'doctor_info' | 'delivery' | 'review' | 'confirmation'>('current_pharmacy');
  const [currentPharmacy, setCurrentPharmacy] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('home');

  const resetAndClose = () => {
    setStep('current_pharmacy');
    setCurrentPharmacy('');
    setDoctorName('');
    setDoctorPhone('');
    setDeliveryAddress('home');
    onClose();
  };

  const handleSubmit = () => {
    console.log('Transfer request submitted:', {
      medication: `${medicationName} ${dosage}`,
      quantity,
      fromPharmacy: currentPharmacy,
      toPharmacy: selectedPharmacy,
      doctor: { name: doctorName, phone: doctorPhone },
      delivery: deliveryAddress
    });
    setStep('confirmation');
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Prescription</DialogTitle>
        </DialogHeader>

        {step === 'current_pharmacy' && (
          <div className="space-y-4">
            <p className="text-sm">Where is your prescription currently?</p>
            
            <div className="space-y-2">
              <Input
                placeholder="Search pharmacies..."
                value={currentPharmacy}
                onChange={(e) => setCurrentPharmacy(e.target.value)}
              />
              
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Recent/Common:</p>
                {['Walgreens - 2.5 mi', 'CVS - 3.1 mi', 'Walmart - 1.2 mi'].map((pharmacy) => (
                  <Button
                    key={pharmacy}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setCurrentPharmacy(pharmacy)}
                  >
                    {pharmacy}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep('doctor_info')}
                disabled={!currentPharmacy}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'doctor_info' && (
          <div className="space-y-4">
            <p className="text-sm">Who prescribed this medication?</p>
            
            <div className="space-y-3">
              <div>
                <Label>Doctor Name</Label>
                <Input
                  placeholder="Dr. John Doe"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </div>
              <div>
                <Label>Doctor Phone</Label>
                <Input
                  placeholder="(555) 123-4567"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('current_pharmacy')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep('delivery')}
                disabled={!doctorName || !doctorPhone}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'delivery' && (
          <div className="space-y-4">
            <p className="text-sm">Where should we deliver?</p>
            
            <div className="space-y-2">
              <Card className={`p-3 cursor-pointer ${deliveryAddress === 'home' ? 'border-primary' : ''}`} 
                    onClick={() => setDeliveryAddress('home')}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${deliveryAddress === 'home' ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                  <div>
                    <p className="font-medium">Home address</p>
                    <p className="text-sm text-muted-foreground">123 Your St, City, ST 12345</p>
                  </div>
                </div>
              </Card>
              
              <Card className={`p-3 cursor-pointer ${deliveryAddress === 'different' ? 'border-primary' : ''}`} 
                    onClick={() => setDeliveryAddress('different')}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${deliveryAddress === 'different' ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                  <div>
                    <p className="font-medium">Different address</p>
                    <p className="text-sm text-muted-foreground">Enter custom address</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('doctor_info')}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep('review')}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <h3 className="font-semibold">Review & Submit</h3>
            
            <Card className="p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Medication:</span>
                <span className="font-medium">{medicationName} {dosage} - {quantity} tablets</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>From:</span>
                <span className="font-medium">{currentPharmacy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>To:</span>
                <span className="font-medium">{selectedPharmacy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Doctor:</span>
                <span className="font-medium">{doctorName}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span>Cost:</span>
                <span className="font-bold">${price}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span>You'll save:</span>
                  <span className="font-bold text-green-600">${savings}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Delivery:</span>
                <span className="font-medium">5-7 business days</span>
              </div>
            </Card>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="authorize" className="rounded" />
              <Label htmlFor="authorize" className="text-sm">
                I authorize the transfer of this prescription
              </Label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('delivery')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmit}>
                Submit Transfer Request
              </Button>
            </div>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Transfer Request Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                We'll contact your pharmacy to transfer your prescription. 
                You'll receive an email when it's ready to ship.
              </p>
            </div>

            <Card className="p-3 text-left">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Order #:</span>
                  <span className="font-medium">TX-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medication:</span>
                  <span className="font-medium">{medicationName} {dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost:</span>
                  <span className="font-medium">${price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Delivery:</span>
                  <span className="font-medium">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            <div className="space-y-2">
              <Button className="w-full" onClick={resetAndClose}>
                View Order Status
              </Button>
              <Button variant="ghost" className="w-full" onClick={resetAndClose}>
                Return Home
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}