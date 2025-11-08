'use client'
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface MarioBloodTestConfirmationProps {
  testName?: string;
  providerName?: string;
  estimatedPrice?: string;
  points?: number;
  onViewHealthHub: () => void;
  onDone?: () => void;
  autoRedirect?: boolean;
  autoRedirectDelay?: number;
}

export function MarioBloodTestConfirmation({
  testName = 'Basic Panel (CBC + CMP)',
  providerName = 'LabFast Diagnostics',
  estimatedPrice = '$45',
  points = 30,
  onViewHealthHub,
  onDone,
  autoRedirect = false,
  autoRedirectDelay = 2000
}: MarioBloodTestConfirmationProps) {
  
  // Trigger confetti on mount
  useEffect(() => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Auto-redirect if enabled
  useEffect(() => {
    if (autoRedirect) {
      const timer = setTimeout(() => {
        onViewHealthHub();
      }, autoRedirectDelay);
      return () => clearTimeout(timer);
    }
  }, [autoRedirect, autoRedirectDelay, onViewHealthHub]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card 
          className="p-8"
          style={{ 
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Success Icon with Animation */}
          <motion.div 
            className="text-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div 
              className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6"
              style={{ 
                backgroundColor: 'rgba(121, 215, 190, 0.15)',
                border: '3px solid #79D7BE'
              }}
            >
              <CheckCircle2 
                className="h-14 w-14"
                style={{ color: '#00AA66' }}
              />
            </div>
            
            <h2 
              style={{ 
                fontSize: '24px',
                fontWeight: '700',
                color: '#2E5077',
                marginBottom: '8px'
              }}
            >
              Request Submitted! 🎉
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.5' }}>
              Your concierge will contact you within 24-48 hours to schedule your blood test
            </p>
          </motion.div>

          {/* Test Details Card */}
          <Card 
            className="p-4 mb-6"
            style={{ 
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '16px'
            }}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div 
                    style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}
                  >
                    TEST
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2E5077' }}>
                    💉 {testName}
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6B7280',
                      marginBottom: '4px'
                    }}
                  >
                    ESTIMATED COST
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#4DA1A9' }}>
                    {estimatedPrice}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t" style={{ borderColor: '#E5E7EB' }}>
                <div 
                  style={{ 
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    marginBottom: '4px'
                  }}
                >
                  PROVIDER
                </div>
                <div style={{ fontSize: '14px', color: '#374151' }}>
                  {providerName}
                </div>
              </div>
            </div>
          </Card>

          {/* Points Earned Badge */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full w-full justify-center"
              style={{ 
                backgroundColor: 'rgba(77, 161, 169, 0.12)',
                border: '1px solid rgba(77, 161, 169, 0.2)'
              }}
            >
              <Sparkles 
                className="h-5 w-5"
                style={{ color: '#4DA1A9' }}
              />
              <span 
                style={{ 
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#2E5077'
                }}
              >
                +{points} MarioPoints earned!
              </span>
            </div>
          </motion.div>

          {/* What Happens Next */}
          <div 
            className="p-4 mb-6 rounded-2xl"
            style={{ 
              backgroundColor: 'rgba(46, 80, 119, 0.05)',
              border: '1px solid #E5E7EB'
            }}
          >
            <div 
              style={{ 
                fontSize: '14px',
                fontWeight: '600',
                color: '#2E5077',
                marginBottom: '12px'
              }}
            >
              What happens next?
            </div>
            <ul className="space-y-2" style={{ fontSize: '14px', color: '#374151' }}>
              <li className="flex items-start gap-2">
                <span style={{ color: '#79D7BE', marginTop: '2px' }}>✓</span>
                <span>Your concierge will review provider availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#79D7BE', marginTop: '2px' }}>✓</span>
                <span>You'll receive appointment time options via message</span>
              </li>
              <li className="flex items-start gap-2">
                <span style={{ color: '#79D7BE', marginTop: '2px' }}>✓</span>
                <span>Confirm your preferred time and you're all set!</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full mario-focus-ring"
              style={{
                backgroundColor: '#2E5077',
                color: 'white',
                borderRadius: '12px',
                height: '48px',
                fontSize: '16px',
                fontWeight: '600'
              }}
              onClick={onViewHealthHub}
            >
              <span>View in Health Hub</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            {onDone && (
              <Button
                variant="outline"
                className="w-full mario-focus-ring"
                style={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  borderRadius: '12px',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
                onClick={onDone}
              >
                Done
              </Button>
            )}
          </div>

          {/* Auto-redirect indicator */}
          {autoRedirect && (
            <p 
              className="text-center mt-4" 
              style={{ fontSize: '13px', color: '#9CA3AF' }}
            >
              Redirecting to Health Hub in {Math.floor(autoRedirectDelay / 1000)} seconds...
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
