'use client'
import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Heart, Check, ChevronRight, Shield, Calendar, Pill, DollarSign, ArrowLeft } from 'lucide-react';

interface MarioCareonboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const needs = [
  {
    id: 'managing-condition',
    title: 'Managing a condition',
    icon: Heart,
    description: 'Track and manage chronic conditions'
  },
  {
    id: 'finding-care',
    title: 'Finding affordable care',
    icon: DollarSign,
    description: 'Compare costs and find savings'
  },
  {
    id: 'tracking-benefits',
    title: 'Tracking my benefits',
    icon: Shield,
    description: 'Monitor insurance and claims'
  },
  {
    id: 'prescription-renewals',
    title: 'Prescription renewals',
    icon: Pill,
    description: 'Manage medication refills'
  }
];

const insuranceProviders = [
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'UnitedHealthcare',
  'Medicare',
  'Medicaid',
  'Other',
  'No Insurance'
];

export function MarioCareOnboarding({ onComplete, onSkip }: MarioCareonboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    zipCode: '',
    insurance: ''
  });

  const handleNeedToggle = (needId: string) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) 
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const canContinue = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedNeeds.length > 0;
    if (currentStep === 3) return formData.name.trim() !== '' && formData.zipCode.trim() !== '';
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Back Button - Top Level Exit */}
      {onSkip && currentStep === 1 && (
        <button
          onClick={onSkip}
          className="fixed top-4 left-4 p-2 hover:bg-muted rounded-full transition-colors z-50"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      
      <div className="w-full max-w-md">
        {/* Screen 1: Welcome */}
        {currentStep === 1 && (
          <Card className="p-8 text-center animate-in fade-in duration-300">
            {/* Icon */}
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-accent" />
            </div>

            {/* Headline */}
            <h1 className="mb-3">Welcome to MarioCare</h1>

            {/* Subtext */}
            <p className="text-muted-foreground mb-8">
              We'll help you navigate care, compare costs, and manage your benefits — all in one place.
            </p>

            {/* CTA Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 mario-button-scale"
              size="lg"
              onClick={handleContinue}
            >
              Get Started
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>

            {/* Skip Option */}
            {onSkip && (
              <button
                onClick={onSkip}
                className="mt-4 text-muted-foreground hover:text-foreground mario-transition"
              >
                Skip for now
              </button>
            )}
          </Card>
        )}

        {/* Screen 2: Personalization */}
        {currentStep === 2 && (
          <Card className="p-8 animate-in fade-in duration-300">
            {/* Question */}
            <h2 className="mb-2 text-center">What do you need help with today?</h2>
            <p className="text-muted-foreground text-center mb-6">
              Select all that apply
            </p>

            {/* Selectable Cards */}
            <div className="space-y-3 mb-8">
              {needs.map((need) => {
                const Icon = need.icon;
                const isSelected = selectedNeeds.includes(need.id);
                
                return (
                  <Card
                    key={need.id}
                    className={`p-4 cursor-pointer mario-transition ${
                      isSelected 
                        ? 'border-2 border-accent bg-accent/5' 
                        : 'border hover:border-accent/50'
                    }`}
                    onClick={() => handleNeedToggle(need.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon & Checkbox */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-accent text-white' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div 
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-accent border-accent' 
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={isSelected ? 'text-accent' : ''}>{need.title}</h3>
                        <p className="text-muted-foreground">{need.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Continue Button */}
            <Button 
              className="w-full bg-accent hover:bg-accent/90 mario-button-scale"
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue()}
            >
              Continue
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full mt-3 text-muted-foreground hover:text-foreground mario-transition"
            >
              Back
            </button>
          </Card>
        )}

        {/* Screen 3: Account Setup */}
        {currentStep === 3 && (
          <Card className="p-8 animate-in fade-in duration-300">
            {/* Headline */}
            <h2 className="mb-2 text-center">Let's personalize your experience</h2>
            <p className="text-muted-foreground text-center mb-6">
              Just a few quick details to get started
            </p>

            {/* Form */}
            <div className="space-y-4 mb-8">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12"
                />
              </div>

              {/* ZIP Code Input */}
              <div className="space-y-2">
                <Label htmlFor="zipcode">ZIP Code</Label>
                <Input
                  id="zipcode"
                  type="text"
                  placeholder="Enter your ZIP code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  maxLength={5}
                  className="h-12"
                />
                <p className="text-muted-foreground">
                  We'll use this to find care near you
                </p>
              </div>

              {/* Insurance Provider Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Provider (Optional)</Label>
                <Select
                  value={formData.insurance}
                  onValueChange={(value) => setFormData({ ...formData, insurance: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Join Button */}
            <Button 
              className="w-full bg-primary hover:bg-primary/90 mario-button-scale"
              size="lg"
              onClick={handleContinue}
              disabled={!canContinue()}
            >
              Join MarioCare
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full mt-3 text-muted-foreground hover:text-foreground mario-transition"
            >
              Back
            </button>
          </Card>
        )}

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full mario-transition ${
                step === currentStep 
                  ? 'w-8 bg-accent' 
                  : step < currentStep
                  ? 'w-2 bg-accent/50'
                  : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}