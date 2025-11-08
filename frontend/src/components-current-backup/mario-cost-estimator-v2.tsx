'use client'
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { toast } from 'sonner@2.0.3';
import {
  ArrowLeft,
  Search,
  Shield,
  ChevronDown,
  Info,
  MessageSquare,
  MapPin,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarioAIBookingChat } from './mario-ai-booking-chat';

interface CostEstimatorV2Props {
  onBack: () => void;
  onOpenAI?: (prompt?: string) => void;
  onBookConcierge?: () => void;
}

const procedureSuggestions = [
  { id: 'mri', label: 'MRI', avgCost: 450 },
  { id: 'ultrasound', label: 'Ultrasound', avgCost: 180 },
  { id: 'xray', label: 'X-Ray', avgCost: 120 },
  { id: 'blood-test', label: 'Blood Test', avgCost: 85 },
];

const insurancePlans = [
  { id: 'bcbs-ppo', label: 'Blue Cross PPO' },
  { id: 'united-hmo', label: 'United Healthcare HMO' },
  { id: 'aetna-ppo', label: 'Aetna PPO' },
  { id: 'no-insurance', label: 'No Insurance (Self-Pay)' },
];

export function MarioCostEstimatorV2({ onBack, onOpenAI, onBookConcierge }: CostEstimatorV2Props) {
  const [procedureQuery, setProcedureQuery] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [location, setLocation] = useState('current');
  const [zipCode, setZipCode] = useState('');
  const [insurance, setInsurance] = useState('bcbs-ppo');
  const [showEstimate, setShowEstimate] = useState(false);
  const [showBookingChat, setShowBookingChat] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  
  // Estimate values
  const [estimatedMin, setEstimatedMin] = useState(0);
  const [estimatedMax, setEstimatedMax] = useState(0);
  const [animatedMin, setAnimatedMin] = useState(0);
  const [animatedMax, setAnimatedMax] = useState(0);

  // Accordion states
  const [procedureOpen, setProcedureOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Count-up animation for cost
  useEffect(() => {
    if (showEstimate && estimatedMin > 0) {
      const duration = 300;
      const steps = 30;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        
        setAnimatedMin(Math.round(estimatedMin * easeOut));
        setAnimatedMax(Math.round(estimatedMax * easeOut));
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    }
  }, [showEstimate, estimatedMin, estimatedMax]);

  const handleProcedureSelect = (procedure: string) => {
    setSelectedProcedure(procedure);
    setProcedureQuery(procedure);
    
    // Mock calculation based on procedure
    const baseCost = procedureSuggestions.find(p => p.label.toLowerCase() === procedure.toLowerCase())?.avgCost || 400;
    const min = baseCost - 100;
    const max = baseCost + 100;
    
    setEstimatedMin(min);
    setEstimatedMax(max);
    setShowEstimate(true);
    
    // Show toast
    toast.success('🎯 Estimate ready', {
      description: `$${min}–$${max}`,
    });
    
    // Auto-expand next section
    setProcedureOpen(false);
    setLocationOpen(true);
  };

  const handleSearch = () => {
    if (procedureQuery.trim()) {
      handleProcedureSelect(procedureQuery);
    }
  };

  const regionalAverage = estimatedMax + 150;
  const marioPick = estimatedMin - 30;
  const yourEstimate = (estimatedMin + estimatedMax) / 2;
  
  const maxBarValue = Math.max(regionalAverage, marioPick, yourEstimate);
  const marioPickPercent = (marioPick / maxBarValue) * 100;
  const yourEstimatePercent = (yourEstimate / maxBarValue) * 100;
  const regionalAvgPercent = (regionalAverage / maxBarValue) * 100;

  // Calculate deductible impact
  const currentDeductible = 850;
  const totalDeductible = 2000;
  const afterVisit = currentDeductible + yourEstimate;
  const deductiblePercent = Math.min((afterVisit / totalDeductible) * 100, 100);

  return (
    <div className="min-h-screen pb-20 md:pb-0" style={{ backgroundColor: '#F6F4F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 -ml-2 mario-button-scale"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2 flex-1">
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1A1A' }}>
                Estimate Your Cost
              </h1>
              <Shield className="h-5 w-5" style={{ color: '#2E5077' }} />
            </div>
          </div>
          <p style={{ fontSize: '14px', color: '#666666' }}>
            See what you'll likely pay before you go
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Input Cards - Accordion Style */}
        
        {/* Card 1 - Procedure */}
        <Collapsible open={procedureOpen} onOpenChange={setProcedureOpen}>
          <Card
            className="overflow-hidden mario-transition"
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CollapsibleTrigger asChild>
              <button
                className="w-full p-4 flex items-center justify-between text-left mario-transition hover:bg-gray-50"
                style={{ outline: 'none' }}
              >
                <div className="flex-1">
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                    Procedure
                  </h3>
                  {selectedProcedure && (
                    <p style={{ fontSize: '14px', color: '#666666' }}>
                      {selectedProcedure}
                    </p>
                  )}
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${procedureOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#666666' }}
                />
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="px-4 pb-4 space-y-3"
              >
                <div style={{ height: '1px', backgroundColor: '#E0E0E0' }} />
                
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#666666' }} />
                  <Input
                    value={procedureQuery}
                    onChange={(e) => setProcedureQuery(e.target.value)}
                    placeholder="e.g., MRI Knee, Blood Test"
                    className="pl-10"
                    style={{
                      borderColor: '#E0E0E0',
                      fontSize: '14px',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2">
                  {procedureSuggestions.map((proc) => (
                    <button
                      key={proc.id}
                      onClick={() => handleProcedureSelect(proc.label)}
                      className="mario-transition"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '14px',
                        backgroundColor: selectedProcedure === proc.label ? '#2E5077' : '#E0E0E0',
                        color: selectedProcedure === proc.label ? '#FFFFFF' : '#666666',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {proc.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Card 2 - Location */}
        <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
          <Card
            className="overflow-hidden mario-transition"
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CollapsibleTrigger asChild>
              <button
                className="w-full p-4 flex items-center justify-between text-left mario-transition hover:bg-gray-50"
                style={{ outline: 'none' }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="h-5 w-5" style={{ color: '#4DA1A9' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                      Location
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666666' }}>
                      {location === 'current' ? 'Use my current location' : `ZIP: ${zipCode}`}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${locationOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#666666' }}
                />
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="px-4 pb-4 space-y-3"
              >
                <div style={{ height: '1px', backgroundColor: '#E0E0E0' }} />
                
                <div className="space-y-2">
                  <button
                    onClick={() => setLocation('current')}
                    className="w-full p-3 rounded-lg flex items-center gap-2 mario-transition"
                    style={{
                      backgroundColor: location === 'current' ? '#E8F5F7' : '#F9F9F9',
                      border: location === 'current' ? '2px solid #4DA1A9' : '2px solid transparent',
                    }}
                  >
                    {location === 'current' && (
                      <CheckCircle className="h-4 w-4" style={{ color: '#4DA1A9' }} />
                    )}
                    <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      Use my current location
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setLocation('manual')}
                    className="w-full p-3 rounded-lg flex items-center gap-2 mario-transition"
                    style={{
                      backgroundColor: location === 'manual' ? '#E8F5F7' : '#F9F9F9',
                      border: location === 'manual' ? '2px solid #4DA1A9' : '2px solid transparent',
                    }}
                  >
                    {location === 'manual' && (
                      <CheckCircle className="h-4 w-4" style={{ color: '#4DA1A9' }} />
                    )}
                    <span style={{ fontSize: '14px', color: '#1A1A1A' }}>
                      Enter ZIP code
                    </span>
                  </button>
                </div>

                {location === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Input
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Enter ZIP code"
                      style={{
                        borderColor: '#E0E0E0',
                        fontSize: '14px',
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Card 3 - Insurance */}
        <Collapsible open={insuranceOpen} onOpenChange={setInsuranceOpen}>
          <Card
            className="overflow-hidden mario-transition"
            style={{
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <CollapsibleTrigger asChild>
              <button
                className="w-full p-4 flex items-center justify-between text-left mario-transition hover:bg-gray-50"
                style={{ outline: 'none' }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <CreditCard className="h-5 w-5" style={{ color: '#79D7BE' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A1A', marginBottom: '4px' }}>
                      Insurance
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666666' }}>
                      {insurancePlans.find(p => p.id === insurance)?.label}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${insuranceOpen ? 'rotate-180' : ''}`}
                  style={{ color: '#666666' }}
                />
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="px-4 pb-4 space-y-3"
              >
                <div style={{ height: '1px', backgroundColor: '#E0E0E0' }} />
                
                <Select value={insurance} onValueChange={setInsurance}>
                  <SelectTrigger style={{ borderColor: '#E0E0E0' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {insurancePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Dynamic Estimate Card */}
        <AnimatePresence>
          {showEstimate && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Card
                className="p-6"
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', marginBottom: '8px' }}>
                      Your Estimated Cost
                    </p>
                    <div style={{ fontSize: '32px', fontWeight: 700, color: '#2E5077', lineHeight: '1.2' }}>
                      ${animatedMin} – ${animatedMax}
                    </div>
                    <p style={{ fontSize: '14px', color: '#666666', marginTop: '8px' }}>
                      20% below average in your area
                    </p>
                  </div>

                  {/* Mini Bar Chart */}
                  <div className="space-y-4">
                    {/* Mario's Pick Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: '12px', color: '#666666' }}>Mario's Pick</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#4DA1A9' }}>
                          ${marioPick}
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${marioPickPercent}%` }}
                        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
                        style={{
                          height: '24px',
                          backgroundColor: '#4DA1A9',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Your Estimate Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: '12px', color: '#666666' }}>You</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2E5077' }}>
                          ${Math.round(yourEstimate)}
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${yourEstimatePercent}%` }}
                        transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                        style={{
                          height: '24px',
                          backgroundColor: '#2E5077',
                          borderRadius: '4px',
                        }}
                      />
                    </div>

                    {/* Regional Average Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontSize: '12px', color: '#666666' }}>Regional Avg</span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#999999' }}>
                          ${regionalAverage}
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${regionalAvgPercent}%` }}
                        transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
                        style={{
                          height: '24px',
                          backgroundColor: '#E0E0E0',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Deductible Tracker */}
                  <div className="pt-4" style={{ borderTop: '1px solid #E0E0E0' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ fontSize: '14px', color: '#666666' }}>
                        Deductible Progress
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#79D7BE' }}>
                        {Math.round(deductiblePercent)}%
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      style={{
                        height: '8px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deductiblePercent}%` }}
                        transition={{ duration: 0.3, delay: 0.5, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          backgroundColor: '#79D7BE',
                        }}
                      />
                    </motion.div>
                    <p style={{ fontSize: '12px', color: '#666666', marginTop: '8px' }}>
                      After this visit, you'll meet {Math.round(deductiblePercent)}% of your deductible.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Context Row - Insights */}
        <AnimatePresence>
          {showEstimate && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div
                className="p-3 space-y-2"
                style={{
                  backgroundColor: '#F9F9F9',
                  borderRadius: '8px',
                }}
              >
                {[
                  'Based on 126 similar claims in your network.',
                  `Estimated with your insurance: ${insurancePlans.find(p => p.id === insurance)?.label}.`,
                  'You\'d earn +100 MarioPoints for booking through Concierge.',
                ].map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#4DA1A9',
                        marginTop: '8px',
                        flexShrink: 0,
                      }}
                    />
                    <p style={{ fontSize: '13px', color: '#666666' }}>
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Footer Actions */}
      <AnimatePresence>
        {showEstimate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white p-4 md:pb-4 pb-24"
            style={{ boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.08)' }}
          >
            <div className="max-w-2xl mx-auto flex flex-col gap-2">
              <Button
                className="w-full h-12 text-white mario-button-scale"
                style={{ backgroundColor: '#2E5077', fontSize: '16px', fontWeight: 600 }}
                onClick={() => setShowBookingChat(true)}
              >
                Book with Concierge
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-12 mario-button-scale"
                style={{ borderColor: '#4DA1A9', color: '#4DA1A9', fontSize: '16px', fontWeight: 600 }}
                onClick={() => {
                  if (onOpenAI) {
                    onOpenAI(`I'm looking for a ${selectedProcedure} and got an estimate of $${estimatedMin}-$${estimatedMax}. Can you help me find the best option?`);
                  }
                }}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Ask MarioAI
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MarioAI Booking Chat */}
      <MarioAIBookingChat
        isOpen={showBookingChat}
        onClose={() => setShowBookingChat(false)}
        doctorName="Cost Estimate"
        hospital={selectedProcedure}
        specialty={`$${estimatedMin}-$${estimatedMax}`}
        onComplete={() => {
          setShowBookingChat(false);
          if (onBookConcierge) {
            onBookConcierge();
          }
        }}
        isDesktop={isDesktop}
      />
    </div>
  );
}
