'use client'
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Camera, 
  Shield, 
  Search, 
  Target, 
  Gift, 
  MessageCircle, 
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { cn } from './ui/utils';

/**
 * MARIO HEALTH - ONBOARDING SPLASH (FUTURE APP USE)
 * 
 * ⚙️ Reserved for future mobile/app onboarding. Not shown in current web flow.
 * 
 * This component contains a "Welcome to Mario Health" splash screen originally designed
 * for native mobile app or PWA onboarding experiences.
 * 
 * CURRENT STATUS: Detached from web auth routing
 * FUTURE USE: Will be activated for mobile app first-launch experience
 * 
 * INTENDED ROUTING (when activated):
 *   - Primary CTA: "Get Started" → Signup
 *   - Secondary: "Already a member? Log In" → Login
 * 
 * WEB FLOW (current):
 *   Marketing Landing Page → Signup (direct)
 *   Marketing Landing Page → Login (direct)
 *   (No splash screen shown)
 * 
 * Design tokens maintained: Inter font, #2E5077 / #4DA1A9 / #79D7BE palette
 */

interface OnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

type OnboardingStep = 
  | 'welcome'
  | 'auth'
  | 'insurance'
  | 'manual-insurance'
  | 'privacy'
  | 'tour-1'
  | 'tour-2' 
  | 'tour-3'
  | 'tour-4'
  | 'complete';

export function MarioOnboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [insuranceCards, setInsuranceCards] = useState<File[]>([]);
  const [insuranceData, setInsuranceData] = useState({
    company: '',
    memberId: '',
    groupNumber: ''
  });
  const [privacyConsent, setPrivacyConsent] = useState({
    terms: false,
    privacy: false
  });

  const stepOrder: OnboardingStep[] = [
    'welcome', 'auth', 'insurance', 'privacy', 'tour-1', 'tour-2', 'tour-3', 'tour-4', 'complete'
  ];

  const currentStepIndex = stepOrder.indexOf(currentStep);
  const totalSteps = stepOrder.length - 2; // Exclude welcome and complete
  const progress = ((currentStepIndex - 1) / (totalSteps - 1)) * 100;

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      setInsuranceCards(Array.from(files));
    }
  };

  const handleAuthMethod = (method: string) => {
    // Simulate authentication
    console.log('Auth method:', method);
    nextStep();
  };

  const handleInsuranceSubmit = () => {
    if (insuranceCards.length > 0 || (insuranceData.company && insuranceData.memberId)) {
      nextStep();
    }
  };

  const canProceedPrivacy = privacyConsent.terms && privacyConsent.privacy;

  // Welcome Screen
  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ position: 'relative' }}>
        {/* Future Use Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#F5F5F5',
            border: '1px solid #E0E0E0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            color: '#999999',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10
          }}
        >
          <span>⚙️</span>
          <span>Future Use</span>
        </div>

        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">m</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Welcome to Mario Health</h1>
            <p className="text-muted-foreground">
              Save money on healthcare, earn rewards
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Search className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-sm">Compare prices instantly</div>
                <div className="text-xs text-muted-foreground">See what you'll really pay before you go</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-sm">Mario's Pick recommendations</div>
                <div className="text-xs text-muted-foreground">AI-powered suggestions for best value</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                <Gift className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-medium text-sm">Earn rewards for smart choices</div>
                <div className="text-xs text-muted-foreground">Get points for choosing value-based care</div>
              </div>
            </div>
          </div>

          <Button onClick={nextStep} className="w-full mb-3">
            Continue Setup
          </Button>
          <Button variant="ghost" onClick={onSkip} className="w-full text-sm">
            Skip for Now
          </Button>
        </Card>
      </div>
    );
  }

  // Authentication Method Selection
  if (currentStep === 'auth') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">Create Your Account</h2>
            <p className="text-sm text-muted-foreground">
              Choose how you'd like to sign up
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => handleAuthMethod('sso')}
              variant="outline" 
              className="w-full justify-start"
            >
              <div className="w-5 h-5 bg-blue-600 rounded mr-3"></div>
              Continue with Company SSO
            </Button>
            <Button 
              onClick={() => handleAuthMethod('google')}
              variant="outline" 
              className="w-full justify-start"
            >
              <div className="w-5 h-5 bg-red-500 rounded mr-3"></div>
              Continue with Google
            </Button>
            <Button 
              onClick={() => handleAuthMethod('apple')}
              variant="outline" 
              className="w-full justify-start"
            >
              <div className="w-5 h-5 bg-black rounded mr-3"></div>
              Continue with Apple
            </Button>
            <Button 
              onClick={() => handleAuthMethod('email')}
              variant="outline" 
              className="w-full justify-start"
            >
              <div className="w-5 h-5 bg-gray-500 rounded mr-3"></div>
              Sign up with Email
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Insurance Information
  if (currentStep === 'insurance') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <span className="text-sm text-muted-foreground">Step 1 of 3</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">Insurance Information</h2>
            <p className="text-sm text-muted-foreground">
              Upload your insurance card (front and back)
            </p>
          </div>

          <div className="space-y-4">
            <div 
              className={cn(
                "border-2 border-dashed border-border rounded-lg p-6",
                "text-center cursor-pointer hover:border-primary/50 transition-colors",
                insuranceCards.length > 0 && "border-primary bg-primary/5"
              )}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              {insuranceCards.length > 0 ? (
                <div>
                  <Check className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    {insuranceCards.length} file(s) uploaded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insuranceCards.map(f => f.name).join(', ')}
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium mb-1">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Or</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentStep('manual-insurance')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleInsuranceSubmit}
                disabled={insuranceCards.length === 0}
                className="w-full"
              >
                Continue
              </Button>
              <Button 
                variant="ghost" 
                onClick={nextStep}
                className="w-full text-sm"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Manual Insurance Entry
  if (currentStep === 'manual-insurance') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep('insurance')}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <span className="text-sm text-muted-foreground">Step 1 of 3</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <h2 className="text-xl font-bold mb-2">Enter Insurance Details</h2>
            <p className="text-sm text-muted-foreground">
              Manually enter your insurance information
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="insurance-company">Insurance Company</Label>
              <select
                id="insurance-company"
                value={insuranceData.company}
                onChange={(e) => setInsuranceData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-card text-sm"
              >
                <option value="">Select your insurance</option>
                <option value="blue-cross">Blue Cross Blue Shield</option>
                <option value="aetna">Aetna</option>
                <option value="cigna">Cigna</option>
                <option value="united">UnitedHealthcare</option>
                <option value="kaiser">Kaiser Permanente</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="member-id">Member ID</Label>
              <Input
                id="member-id"
                value={insuranceData.memberId}
                onChange={(e) => setInsuranceData(prev => ({ ...prev, memberId: e.target.value }))}
                placeholder="Enter your member ID"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="group-number">Group Number</Label>
              <Input
                id="group-number"
                value={insuranceData.groupNumber}
                onChange={(e) => setInsuranceData(prev => ({ ...prev, groupNumber: e.target.value }))}
                placeholder="Enter group number (optional)"
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleInsuranceSubmit}
              disabled={!insuranceData.company || !insuranceData.memberId}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Privacy & Consent
  if (currentStep === 'privacy') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <span className="text-sm text-muted-foreground">Step 2 of 3</span>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Your privacy is our priority</h2>
              <p className="text-sm text-muted-foreground">
                We're committed to keeping your health data secure
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-sm mb-2">🔐 How we use your data</h3>
              <p className="text-xs text-muted-foreground">
                We only use your information to find you the best healthcare prices and never sell your data.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-sm mb-2">🏥 HIPAA compliance</h3>
              <p className="text-xs text-muted-foreground">
                All health information is encrypted and stored following HIPAA regulations.
              </p>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h3 className="font-medium text-sm mb-2">👥 Who can see your information</h3>
              <p className="text-xs text-muted-foreground">
                Only you and authorized Mario Health staff can access your data.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={privacyConsent.terms}
                onCheckedChange={(checked) => 
                  setPrivacyConsent(prev => ({ ...prev, terms: !!checked }))
                }
              />
              <Label htmlFor="terms" className="text-sm leading-5">
                I agree to the{' '}
                <button className="text-primary underline">Terms of Service</button>
              </Label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={privacyConsent.privacy}
                onCheckedChange={(checked) => 
                  setPrivacyConsent(prev => ({ ...prev, privacy: !!checked }))
                }
              />
              <Label htmlFor="privacy" className="text-sm leading-5">
                I agree to the{' '}
                <button className="text-primary underline">Privacy Policy</button>
              </Label>
            </div>
          </div>

          <Button 
            onClick={nextStep}
            disabled={!canProceedPrivacy}
            className="w-full"
          >
            Continue
          </Button>
        </Card>
      </div>
    );
  }

  // Welcome Tour Screens
  const tourScreens = [
    {
      step: 'tour-1',
      icon: <Search className="h-16 w-16 text-accent" />,
      title: "Find affordable care near you",
      description: "Search for services, medications, and providers",
      progress: 25
    },
    {
      step: 'tour-2', 
      icon: <Target className="h-16 w-16 text-accent" />,
      title: "See what you'll really pay",
      description: "Compare insurance prices vs. cash options",
      progress: 50
    },
    {
      step: 'tour-3',
      icon: <Gift className="h-16 w-16 text-accent" />,
      title: "Earn rewards for smart choices",
      description: "Get points for choosing value-based care",
      progress: 75
    },
    {
      step: 'tour-4',
      icon: <MessageCircle className="h-16 w-16 text-accent" />,
      title: "We'll handle the hard part",
      description: "Our concierge can book appointments for you",
      progress: 100
    }
  ];

  const currentTour = tourScreens.find(screen => screen.step === currentStep);
  
  if (currentTour) {
    const isLastTour = currentStep === 'tour-4';
    const tourIndex = tourScreens.findIndex(screen => screen.step === currentStep);
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-8">
            <div className="mb-6">
              {currentTour.icon}
            </div>
            <h2 className="text-xl font-bold mb-3">{currentTour.title}</h2>
            <p className="text-muted-foreground">{currentTour.description}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {tourScreens.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === tourIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {!isLastTour && (
              <Button 
                variant="ghost" 
                onClick={() => setCurrentStep('complete')}
                className="flex-1"
              >
                Skip Tour
              </Button>
            )}
            <Button 
              onClick={isLastTour ? () => setCurrentStep('complete') : nextStep}
              className="flex-1"
            >
              {isLastTour ? 'Get Started' : 'Next'}
            </Button>
          </div>
          
          {tourIndex > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={prevStep}
              className="mt-2"
            >
              Back
            </Button>
          )}
        </Card>
      </div>
    );
  }

  // Completion
  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Welcome to Mario Health!</h2>
            <p className="text-muted-foreground">
              You're all set up and ready to start saving
            </p>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg mb-6">
            <div className="flex items-center justify-center gap-2 text-accent">
              <Gift className="h-5 w-5" />
              <span className="font-medium">+50 MarioPoints earned!</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For completing your setup
            </p>
          </div>

          <Button onClick={onComplete} className="w-full">
            Start Exploring
          </Button>
        </Card>
      </div>
    );
  }

  return null;
}