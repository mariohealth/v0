'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Calendar, 
  DollarSign, 
  Clock, 
  Shield, 
  FileText,
  Phone,
  ChevronRight,
  Loader2,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  showTyping?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface MarioAIConciergeProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  context?: 'general' | 'appointment' | 'medication' | 'claim_dispute';
}

export function MarioAIConcierge({ 
  isOpen, 
  onClose, 
  initialQuery = "", 
  context = 'general' 
}: MarioAIConciergeProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState<string>('initial');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeConversation();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, context, initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = () => {
    setMessages([]);
    setConversationStep('initial');
    
    // Add initial message based on context
    setTimeout(() => {
      addAssistantMessage(getInitialMessage(context), getInitialQuickActions(context));
    }, 500);
  };

  const getInitialMessage = (context: string): string => {
    switch (context) {
      case 'appointment':
        return initialQuery 
          ? `I'll help you book an appointment for ${initialQuery}. When would you like to schedule?`
          : "I'm here to help you find and book healthcare appointments. What type of appointment do you need?";
      case 'medication':
        return "I can help you find the best prices for your medications and transfer prescriptions. What medication are you looking for?";
      case 'claim_dispute':
        return "I'll help you dispute a claim with your insurance company. Can you tell me about the claim you'd like to dispute?";
      default:
        return "Hi! I'm MarioAI, your healthcare concierge. I can help you book appointments, find medication prices, dispute claims, or answer any healthcare questions. How can I assist you today?";
    }
  };

  const getInitialQuickActions = (context: string): QuickAction[] => {
    switch (context) {
      case 'appointment':
        return [
          { id: 'this_week', label: 'This Week', value: 'this_week', icon: <Calendar className="h-4 w-4" /> },
          { id: 'next_week', label: 'Next Week', value: 'next_week', icon: <Calendar className="h-4 w-4" /> },
          { id: 'flexible', label: 'I\'m Flexible', value: 'flexible', icon: <Clock className="h-4 w-4" /> },
          { id: 'custom_date', label: 'Specific Date', value: 'custom_date', icon: <Calendar className="h-4 w-4" /> }
        ];
      case 'medication':
        return [
          { id: 'search_med', label: 'Search Medication', value: 'search_medication' },
          { id: 'compare_prices', label: 'Compare Prices', value: 'compare_prices' },
          { id: 'transfer_rx', label: 'Transfer Prescription', value: 'transfer_prescription' },
          { id: 'refill_reminder', label: 'Set Refill Reminder', value: 'refill_reminder' }
        ];
      case 'claim_dispute':
        return [
          { id: 'preventive_care', label: 'It was preventive care', value: 'preventive_care' },
          { id: 'doctor_said_covered', label: 'My doctor said it\'s covered', value: 'doctor_said_covered' },
          { id: 'covered_before', label: 'I\'ve had this covered before', value: 'covered_before' },
          { id: 'other_reason', label: 'Other reason', value: 'other_reason' }
        ];
      default:
        return [
          { id: 'book_appointment', label: 'Book Appointment', value: 'book_appointment', icon: <Calendar className="h-4 w-4" /> },
          { id: 'find_medication', label: 'Find Medication Prices', value: 'find_medication', icon: <DollarSign className="h-4 w-4" /> },
          { id: 'dispute_claim', label: 'Dispute Insurance Claim', value: 'dispute_claim', icon: <Shield className="h-4 w-4" /> },
          { id: 'general_question', label: 'Ask a Question', value: 'general_question', icon: <MessageCircle className="h-4 w-4" /> }
        ];
    }
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addAssistantMessage = (content: string, quickActions?: QuickAction[], delay = 1000) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content,
        timestamp: new Date(),
        quickActions
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };

  const handleQuickAction = (action: QuickAction) => {
    addUserMessage(action.label);
    processUserInput(action.value);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    addUserMessage(currentInput);
    processUserInput(currentInput);
    setCurrentInput('');
  };

  const processUserInput = (input: string) => {
    // This is a simplified conversation flow - in a real app, this would use AI/NLP
    switch (conversationStep) {
      case 'initial':
        handleInitialInput(input);
        break;
      case 'appointment_timing':
        handleAppointmentTiming(input);
        break;
      case 'appointment_time_preference':
        handleTimePreference(input);
        break;
      case 'medication_search':
        handleMedicationSearch(input);
        break;
      case 'claim_dispute_reason':
        handleClaimDisputeReason(input);
        break;
      default:
        handleGeneralInput(input);
    }
  };

  const handleInitialInput = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('appointment') || input === 'book_appointment') {
      setConversationStep('appointment_timing');
      addAssistantMessage(
        "I'll help you book an appointment. What type of appointment do you need?",
        [
          { id: 'mri', label: 'MRI', value: 'mri' },
          { id: 'primary_care', label: 'Primary Care', value: 'primary_care' },
          { id: 'specialist', label: 'Specialist', value: 'specialist' },
          { id: 'lab_work', label: 'Lab Work', value: 'lab_work' }
        ]
      );
    } else if (lowerInput.includes('medication') || input === 'find_medication') {
      setConversationStep('medication_search');
      addAssistantMessage(
        "I can help you find the best prices for your medications. What medication are you looking for?",
        [
          { id: 'atorvastatin', label: 'Atorvastatin', value: 'atorvastatin' },
          { id: 'metformin', label: 'Metformin', value: 'metformin' },
          { id: 'lisinopril', label: 'Lisinopril', value: 'lisinopril' },
          { id: 'other_med', label: 'Other medication', value: 'other_medication' }
        ]
      );
    } else if (lowerInput.includes('claim') || input === 'dispute_claim') {
      setConversationStep('claim_dispute_reason');
      addAssistantMessage(
        "I'll help you dispute a claim. Can you tell me why you believe this claim should be covered?",
        [
          { id: 'preventive', label: 'It was preventive care', value: 'preventive_care' },
          { id: 'covered_before', label: 'I\'ve had this covered before', value: 'covered_before' },
          { id: 'doctor_said', label: 'My doctor said it\'s covered', value: 'doctor_said_covered' },
          { id: 'other', label: 'Other reason', value: 'other_reason' }
        ]
      );
    } else {
      handleGeneralInput(input);
    }
  };

  const handleAppointmentTiming = (input: string) => {
    setConversationStep('appointment_time_preference');
    let serviceType = input;
    
    if (input === 'mri') serviceType = 'MRI scan';
    else if (input === 'primary_care') serviceType = 'primary care appointment';
    else if (input === 'specialist') serviceType = 'specialist consultation';
    else if (input === 'lab_work') serviceType = 'lab work';

    addAssistantMessage(
      `Great! I'll help you find a ${serviceType}. When would you like to schedule this?`,
      [
        { id: 'this_week', label: 'This Week', value: 'this_week' },
        { id: 'next_week', label: 'Next Week', value: 'next_week' },
        { id: 'month', label: 'Within a Month', value: 'within_month' },
        { id: 'flexible', label: 'I\'m Flexible', value: 'flexible' }
      ]
    );
  };

  const handleTimePreference = (input: string) => {
    setConversationStep('appointment_final');
    let timing = input.replace('_', ' ');
    
    addAssistantMessage(
      `Perfect! What time of day works best for you?`,
      [
        { id: 'morning', label: 'Morning (9AM-12PM)', value: 'morning' },
        { id: 'afternoon', label: 'Afternoon (12PM-5PM)', value: 'afternoon' },
        { id: 'evening', label: 'Evening (5PM-7PM)', value: 'evening' },
        { id: 'no_preference', label: 'No Preference', value: 'no_preference' }
      ]
    );
  };

  const handleMedicationSearch = (input: string) => {
    setConversationStep('medication_details');
    addAssistantMessage(
      `I'll help you find the best price for ${input}. Let me search for current prices and options.`,
      [
        { id: 'show_prices', label: 'Show me prices', value: 'show_prices' },
        { id: 'transfer_prescription', label: 'Transfer my prescription', value: 'transfer_prescription' },
        { id: 'set_reminder', label: 'Set refill reminder', value: 'set_reminder' }
      ]
    );
  };

  const handleClaimDisputeReason = (input: string) => {
    setConversationStep('claim_documentation');
    addAssistantMessage(
      `I understand. ${getDisputeResponse(input)} Do you have any documentation to support your dispute?`,
      [
        { id: 'have_docs', label: 'Yes, I have documentation', value: 'have_documentation' },
        { id: 'can_get_docs', label: 'I can get documentation', value: 'can_get_documentation' },
        { id: 'no_docs', label: 'No documentation available', value: 'no_documentation' }
      ]
    );
  };

  const getDisputeResponse = (reason: string): string => {
    switch (reason) {
      case 'preventive_care':
        return "Preventive care should be covered at 100% under most plans.";
      case 'covered_before':
        return "If this service was covered previously, it should continue to be covered.";
      case 'doctor_said_covered':
        return "If your doctor confirmed coverage, we can use that as supporting evidence.";
      default:
        return "Let's gather information to support your dispute.";
    }
  };

  const handleGeneralInput = (input: string) => {
    // Simple keyword-based responses for demo
    if (input.toLowerCase().includes('help')) {
      addAssistantMessage(
        "I'm here to help! I can assist with booking appointments, finding medication prices, disputing insurance claims, or answering general healthcare questions. What would you like to do?",
        getInitialQuickActions('general')
      );
    } else {
      addAssistantMessage(
        "I understand you're asking about that. While I'm still learning, I can help you with appointments, medications, and insurance claims. Is there something specific I can help you with today?",
        getInitialQuickActions('general')
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle>MarioAI Concierge</DialogTitle>
              <p className="text-sm text-muted-foreground">Your healthcare assistant</p>
            </div>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-accent text-accent-foreground'
              }`}>
                {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              
              <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                
                {message.quickActions && (
                  <div className="mt-2 space-y-1">
                    {message.quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="mr-2 mb-1 h-8 text-xs"
                        onClick={() => handleQuickAction(action)}
                      >
                        {action.icon && <span className="mr-1">{action.icon}</span>}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
                
                <div className="mt-1 text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            MarioAI can make mistakes. Please verify important information.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Floating Action Button for easy access
interface MarioAIFABProps {
  onClick: () => void;
  className?: string;
}

export function MarioAIFAB({ onClick, className = "" }: MarioAIFABProps) {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-20 right-4 md:bottom-4 w-14 h-14 rounded-full shadow-lg mario-transition mario-hover-primary bg-accent hover:bg-accent/90 text-accent-foreground z-50 ${className}`}
      size="sm"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open MarioAI Concierge</span>
    </Button>
  );
}