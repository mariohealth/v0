'use client'
import { useState, useEffect, useRef } from 'react';
import { X, Sparkles, CheckCircle, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import confetti from 'canvas-confetti';

interface MarioAIBookingChatProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  hospital: string;
  specialty: string;
  onComplete: () => void;
  isDesktop?: boolean;
}

type MessageType = 'assistant' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface QuickReply {
  id: string;
  text: string;
  value: string;
}

type ConversationStep = 'greeting' | 'urgency' | 'time-preference' | 'alternatives' | 'confirmation' | 'complete';

export function MarioAIBookingChat({
  isOpen,
  onClose,
  doctorName,
  hospital,
  specialty,
  onComplete,
  isDesktop = false
}: MarioAIBookingChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    urgency: '',
    timePreference: '',
    wantsAlternatives: ''
  });
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      startConversation();
    }
  }, [isOpen]);

  const startConversation = () => {
    // Reset state
    setMessages([]);
    setCurrentStep('greeting');
    setUserPreferences({
      urgency: '',
      timePreference: '',
      wantsAlternatives: ''
    });

    // Show greeting
    setTimeout(() => {
      addAssistantMessage(
        `Hi! I can help you book an appointment with ${doctorName} at ${hospital}.`
      );
      
      setTimeout(() => {
        proceedToUrgency();
      }, 1000);
    }, 300);
  };

  const addAssistantMessage = (content: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const proceedToUrgency = () => {
    setCurrentStep('urgency');
    addAssistantMessage('How soon would you like to be seen?');
    setQuickReplies([
      { id: 'asap', text: 'As soon as possible', value: 'asap' },
      { id: '1week', text: 'Within 1 week', value: '1week' },
      { id: '2-4weeks', text: 'Within 2–4 weeks', value: '2-4weeks' },
      { id: 'flexible', text: 'Flexible', value: 'flexible' }
    ]);
  };

  const proceedToTimePreference = () => {
    setCurrentStep('time-preference');
    addAssistantMessage('Do you prefer mornings or afternoons?');
    setQuickReplies([
      { id: 'morning', text: 'Morning (9–12)', value: 'morning' },
      { id: 'afternoon', text: 'Afternoon (12–5)', value: 'afternoon' },
      { id: 'evening', text: 'Evening/Weekend', value: 'evening' },
      { id: 'no-pref', text: 'No preference', value: 'no-preference' }
    ]);
  };

  const proceedToAlternatives = () => {
    setCurrentStep('alternatives');
    addAssistantMessage(
      `If the next available is far out, should I suggest similar in-network doctors nearby?`
    );
    setQuickReplies([
      { id: 'yes-alt', text: 'Yes, show alternatives', value: 'yes' },
      { id: 'no-alt', text: `No, wait for ${doctorName.split(' ')[1]}`, value: 'no' }
    ]);
  };

  const proceedToConfirmation = () => {
    setCurrentStep('confirmation');
    setQuickReplies([]);
    
    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      addAssistantMessage(
        `Perfect! Let me summarize your preferences:\n\n` +
        `• Urgency: ${formatPreference(userPreferences.urgency)}\n` +
        `• Time: ${formatPreference(userPreferences.timePreference)}\n` +
        `• Alternatives: ${userPreferences.wantsAlternatives === 'yes' ? 'Yes, show me options' : 'No, wait for this doctor'}`
      );
      
      setTimeout(() => {
        setQuickReplies([
          { id: 'submit', text: 'Submit Request', value: 'submit' },
          { id: 'cancel', text: 'Start Over', value: 'cancel' }
        ]);
      }, 500);
    }, 1500);
  };

  const proceedToComplete = () => {
    setCurrentStep('complete');
    setQuickReplies([]);
    
    // Show typing indicator
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4DA1A9', '#79D7BE', '#2E5077']
      });
      
      addAssistantMessage(
        `✅ Your appointment request has been submitted!`
      );
    }, 1000);
  };

  const formatPreference = (value: string): string => {
    const map: Record<string, string> = {
      'asap': 'As soon as possible',
      '1week': 'Within 1 week',
      '2-4weeks': 'Within 2–4 weeks',
      'flexible': 'Flexible',
      'morning': 'Morning (9–12)',
      'afternoon': 'Afternoon (12–5)',
      'evening': 'Evening/Weekend',
      'no-preference': 'No preference'
    };
    return map[value] || value;
  };

  const handleQuickReply = (reply: QuickReply) => {
    addUserMessage(reply.text);
    setQuickReplies([]);

    // Update preferences based on current step
    if (currentStep === 'urgency') {
      setUserPreferences(prev => ({ ...prev, urgency: reply.value }));
      setTimeout(() => proceedToTimePreference(), 800);
    } else if (currentStep === 'time-preference') {
      setUserPreferences(prev => ({ ...prev, timePreference: reply.value }));
      setTimeout(() => proceedToAlternatives(), 800);
    } else if (currentStep === 'alternatives') {
      setUserPreferences(prev => ({ ...prev, wantsAlternatives: reply.value }));
      setTimeout(() => proceedToConfirmation(), 800);
    } else if (currentStep === 'confirmation') {
      if (reply.value === 'submit') {
        proceedToComplete();
      } else if (reply.value === 'cancel') {
        startConversation();
      }
    }
  };

  const handleSubmitInput = () => {
    if (userInput.trim()) {
      addUserMessage(userInput);
      setUserInput('');
      // Could add custom logic here if needed
    }
  };

  const handleClose = () => {
    setMessages([]);
    setCurrentStep('greeting');
    setQuickReplies([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Chat Modal */}
      <div
        className={`
          fixed z-50 bg-white animate-in duration-300 ease-out
          ${isDesktop 
            ? 'right-0 top-0 bottom-0 w-[400px] slide-in-from-right shadow-2xl' 
            : 'bottom-0 left-0 right-0 max-h-[80vh] slide-in-from-bottom rounded-t-2xl shadow-2xl'
          }
        `}
        style={{
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          borderRadius: isDesktop ? '0' : '16px 16px 0 0'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10"
          style={{
            borderColor: '#E5E7EB',
            borderRadius: isDesktop ? '0' : '16px 16px 0 0'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4DA1A9' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2E5077'
                }}
              >
                MarioAI Concierge
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                Booking Assistant
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="overflow-y-auto p-4 space-y-4"
          style={{ 
            height: isDesktop ? 'calc(100vh - 180px)' : 'calc(80vh - 180px)',
            padding: isDesktop ? '32px' : '24px'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar for assistant */}
              {message.type === 'assistant' && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#4DA1A9' }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl
                  ${message.type === 'assistant' 
                    ? 'bg-white border' 
                    : ''
                  }
                `}
                style={{
                  backgroundColor: message.type === 'user' ? '#4DA1A9' : 'white',
                  color: message.type === 'user' ? 'white' : '#374151',
                  border: message.type === 'assistant' ? '1px solid #E5E7EB' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line'
                }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#4DA1A9' }}
              >
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div 
                className="px-4 py-3 rounded-2xl border"
                style={{
                  backgroundColor: 'white',
                  borderColor: '#E5E7EB'
                }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#9CA3AF',
                      animationDelay: '0ms'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#9CA3AF',
                      animationDelay: '150ms'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#9CA3AF',
                      animationDelay: '300ms'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Reply Chips */}
          {quickReplies.length > 0 && (
            <div className="flex flex-col gap-2 mt-4">
              {quickReplies.map((reply) => (
                <button
                  key={reply.id}
                  onClick={() => handleQuickReply(reply)}
                  className="px-4 py-3 rounded-2xl text-left transition-all hover:shadow-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#F9FAFB',
                    border: '1.5px solid #E5E7EB',
                    color: '#2E5077',
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: '16px'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid #79D7BE';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  {reply.text}
                </button>
              ))}
            </div>
          )}

          {/* Completion Card */}
          {currentStep === 'complete' && (
            <Card 
              className="p-5 mt-4"
              style={{
                borderRadius: '12px',
                border: '2px solid #79D7BE',
                backgroundColor: '#F0FAF8'
              }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#79D7BE' }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2E5077',
                      marginBottom: '4px'
                    }}
                  >
                    Request Submitted
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6B7280' }}>
                    We'll confirm your appointment within 24–48 hours
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 mt-0.5" style={{ color: '#6B7280' }} />
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Doctor</p>
                    <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {doctorName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#6B7280' }} />
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Location</p>
                    <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {hospital}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: '#6B7280' }} />
                  <div>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Preferences</p>
                    <p style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                      {formatPreference(userPreferences.urgency)}, {formatPreference(userPreferences.timePreference)}
                    </p>
                  </div>
                </div>
              </div>

              {/* MarioPoints Badge */}
              <Badge 
                className="w-full justify-center py-2 mb-4"
                style={{
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                +50 MarioPoints earned! 🎉
              </Badge>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  onComplete();
                  handleClose();
                }}
                className="w-full"
                style={{
                  backgroundColor: '#2E5077',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  height: '44px'
                }}
              >
                View in Health Hub
              </Button>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer - Text Input (Optional) */}
        {currentStep !== 'complete' && (
          <div 
            className="sticky bottom-0 bg-white border-t p-4"
            style={{ 
              borderColor: '#E5E7EB',
              padding: isDesktop ? '24px 32px' : '16px 24px'
            }}
          >
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmitInput();
                  }
                }}
                placeholder="Type a message (optional)..."
                className="flex-1"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  fontSize: '14px'
                }}
              />
              <Button
                onClick={handleSubmitInput}
                disabled={!userInput.trim()}
                style={{
                  backgroundColor: userInput.trim() ? '#2E5077' : '#E5E7EB',
                  color: userInput.trim() ? 'white' : '#9CA3AF',
                  borderRadius: '8px',
                  padding: '0 16px'
                }}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
