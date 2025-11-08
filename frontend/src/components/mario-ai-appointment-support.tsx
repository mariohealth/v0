'use client'
import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  Clock,
  RefreshCw,
  XCircle,
  AlertCircle,
  DollarSign,
  MessageSquare,
  Send,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { MarioToast } from './mario-toast-helper';
import confetti from 'canvas-confetti';

interface Appointment {
  id: string;
  provider: string;
  specialty: string;
  date: string;
  time: string;
  estimatedCost?: string;
  marioPoints?: number;
}

interface MarioAIAppointmentSupportProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment;
  firstName?: string;
  onActionComplete?: (action: string, details: any) => void;
}

type MessageType = 'assistant' | 'user';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isConfirmationCard?: boolean;
  confirmationData?: any;
}

interface QuickReply {
  id: string;
  icon?: React.ReactNode;
  text: string;
  value: string;
}

type ConversationFlow = 
  | 'greeting'
  | 'reschedule-date'
  | 'reschedule-time'
  | 'reschedule-confirm'
  | 'cancel-confirm'
  | 'cancel-complete'
  | 'late-duration'
  | 'late-complete'
  | 'insurance-topic'
  | 'insurance-copay'
  | 'insurance-complete'
  | 'freeform'
  | 'complete';

export function MarioAIAppointmentSupport({
  isOpen,
  onClose,
  appointment,
  firstName = 'there',
  onActionComplete
}: MarioAIAppointmentSupportProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFlow, setCurrentFlow] = useState<ConversationFlow>('greeting');
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [flowData, setFlowData] = useState<any>({
    rescheduleDate: '',
    rescheduleTime: '',
    lateDuration: '',
    insuranceTopic: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Focus input when shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const startConversation = () => {
    setMessages([]);
    setCurrentFlow('greeting');
    setQuickReplies([]);
    setShowInput(false);
    setFlowData({
      rescheduleDate: '',
      rescheduleTime: '',
      lateDuration: '',
      insuranceTopic: ''
    });

    setTimeout(() => {
      addAssistantMessage(
        `👋 Hi ${firstName} — I see you have ${appointment.specialty === 'Orthopedic Surgery' ? 'an' : 'a'} ${appointment.specialty} appointment with **${appointment.provider}** on **${appointment.date} at ${appointment.time}**.\n\nHow can I help with that appointment today?`
      );
      
      setTimeout(() => {
        showMainMenu();
      }, 800);
    }, 300);
  };

  const addAssistantMessage = (content: string, isConfirmation = false, confirmationData?: any) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: `msg-${Date.now()}`,
        type: 'assistant',
        content,
        timestamp: new Date(),
        isConfirmationCard: isConfirmation,
        confirmationData
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, 500);
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

  const showMainMenu = () => {
    setCurrentFlow('greeting');
    setShowInput(false);
    setQuickReplies([
      {
        id: 'reschedule',
        icon: <RefreshCw className="w-4 h-4" />,
        text: '🔄 Reschedule',
        value: 'reschedule'
      },
      {
        id: 'cancel',
        icon: <XCircle className="w-4 h-4" />,
        text: '❌ Cancel Appointment',
        value: 'cancel'
      },
      {
        id: 'late',
        icon: <Clock className="w-4 h-4" />,
        text: '🕓 Running Late',
        value: 'late'
      },
      {
        id: 'insurance',
        icon: <DollarSign className="w-4 h-4" />,
        text: '💳 Insurance or Cost Question',
        value: 'insurance'
      },
      {
        id: 'other',
        icon: <MessageSquare className="w-4 h-4" />,
        text: '💬 Other Question',
        value: 'other'
      }
    ]);
  };

  const handleQuickReply = (value: string) => {
    const selectedReply = quickReplies.find(r => r.value === value);
    if (selectedReply) {
      addUserMessage(selectedReply.text);
    }

    setQuickReplies([]);

    // Route to appropriate flow
    switch (value) {
      case 'reschedule':
        startRescheduleFlow();
        break;
      case 'cancel':
        startCancelFlow();
        break;
      case 'late':
        startLateFlow();
        break;
      case 'insurance':
        startInsuranceFlow();
        break;
      case 'other':
        startFreeformFlow();
        break;
      // Reschedule flows
      case 'later-this-week':
      case 'next-week':
      case 'custom-date':
        handleRescheduleDate(value);
        break;
      case 'morning':
      case 'afternoon':
      case 'evening':
      case 'no-preference':
        handleRescheduleTime(value);
        break;
      // Cancel flow
      case 'yes-cancel':
        handleCancelConfirm();
        break;
      case 'no-cancel':
        addAssistantMessage("No problem! Your appointment remains scheduled.");
        setTimeout(() => showMainMenu(), 1000);
        break;
      // Late flow
      case '5-min':
      case '10-min':
      case '15-min':
      case '30-min':
      case 'other-delay':
        handleLateNotification(value);
        break;
      // Insurance flows
      case 'confirm-copay':
      case 'check-deductible':
      case 'add-insurance':
        handleInsuranceTopic(value);
        break;
      case 'yes-review':
        handleInsuranceReview();
        break;
      case 'no-review':
        addAssistantMessage("Got it! Let me know if you need anything else.");
        setTimeout(() => showMainMenu(), 1000);
        break;
    }
  };

  // ============================================
  // RESCHEDULE FLOW
  // ============================================
  const startRescheduleFlow = () => {
    setCurrentFlow('reschedule-date');
    addAssistantMessage("No problem! What day would you prefer instead?");
    
    setTimeout(() => {
      setQuickReplies([
        {
          id: 'later-this-week',
          icon: <Calendar className="w-4 h-4" />,
          text: '📅 Later This Week',
          value: 'later-this-week'
        },
        {
          id: 'next-week',
          icon: <Calendar className="w-4 h-4" />,
          text: '📅 Next Week',
          value: 'next-week'
        },
        {
          id: 'custom-date',
          icon: <Calendar className="w-4 h-4" />,
          text: '🗓 Enter Custom Date',
          value: 'custom-date'
        }
      ]);
    }, 800);
  };

  const handleRescheduleDate = (dateOption: string) => {
    setCurrentFlow('reschedule-time');
    setFlowData(prev => ({ ...prev, rescheduleDate: dateOption }));
    
    addAssistantMessage("What time of day works best?");
    
    setTimeout(() => {
      setQuickReplies([
        { id: 'morning', text: 'Morning', value: 'morning' },
        { id: 'afternoon', text: 'Afternoon', value: 'afternoon' },
        { id: 'evening', text: 'Evening', value: 'evening' },
        { id: 'no-preference', text: 'No Preference', value: 'no-preference' }
      ]);
    }, 800);
  };

  const handleRescheduleTime = (timeOption: string) => {
    setCurrentFlow('reschedule-confirm');
    setFlowData(prev => ({ ...prev, rescheduleTime: timeOption }));
    setQuickReplies([]);
    
    addAssistantMessage(
      `Great — I'll contact **${appointment.provider}'s office** to reschedule your appointment.\n\nYou'll get confirmation within 24-48 hours.`
    );

    setTimeout(() => {
      const dateLabel = flowData.rescheduleDate === 'later-this-week' 
        ? 'Later This Week' 
        : flowData.rescheduleDate === 'next-week'
        ? 'Next Week'
        : 'Custom Date';
      
      const timeLabel = timeOption.charAt(0).toUpperCase() + timeOption.slice(1).replace('-', ' ');

      addAssistantMessage('', true, {
        type: 'reschedule',
        oldDate: `${appointment.date} ${appointment.time}`,
        newDate: `${dateLabel} ${timeLabel}`,
        cost: appointment.estimatedCost || '$180',
        points: appointment.marioPoints || 50
      });

      // Trigger confetti
      triggerConfetti();

      // Show toast
      MarioToast.success('Request submitted!', {
        description: "We'll update you soon.",
        duration: 4000
      });

      // Navigate back to Health Hub
      setTimeout(() => {
        addAssistantMessage("Check your Health Hub to track the status of your reschedule request.");
        setTimeout(() => {
          if (onActionComplete) {
            onActionComplete('reschedule', {
              date: dateLabel,
              time: timeLabel
            });
          }
        }, 2000);
      }, 3000);
    }, 1500);
  };

  // ============================================
  // CANCEL FLOW
  // ============================================
  const startCancelFlow = () => {
    setCurrentFlow('cancel-confirm');
    addAssistantMessage(
      `Understood — would you like me to cancel your appointment with **${appointment.provider}** on **${appointment.date}**?`
    );
    
    setTimeout(() => {
      setQuickReplies([
        { id: 'yes-cancel', text: 'Yes', value: 'yes-cancel' },
        { id: 'no-cancel', text: 'No', value: 'no-cancel' }
      ]);
    }, 800);
  };

  const handleCancelConfirm = () => {
    setCurrentFlow('cancel-complete');
    setQuickReplies([]);
    
    addAssistantMessage(
      `Done! I've submitted a cancellation request to the clinic.\n\nYou'll get a confirmation shortly.`
    );

    // Show toast
    MarioToast.success('Appointment canceled', {
      description: 'No fees charged.',
      duration: 4000
    });

    setTimeout(() => {
      if (onActionComplete) {
        onActionComplete('cancel', { appointmentId: appointment.id });
      }
    }, 2000);
  };

  // ============================================
  // RUNNING LATE FLOW
  // ============================================
  const startLateFlow = () => {
    setCurrentFlow('late-duration');
    addAssistantMessage("Thanks for letting me know. How late do you expect to be?");
    
    setTimeout(() => {
      setQuickReplies([
        { id: '5-min', text: '5 min', value: '5-min' },
        { id: '10-min', text: '10 min', value: '10-min' },
        { id: '15-min', text: '15 min', value: '15-min' },
        { id: '30-min', text: '30 min', value: '30-min' },
        { id: 'other-delay', text: 'Other', value: 'other-delay' }
      ]);
    }, 800);
  };

  const handleLateNotification = (duration: string) => {
    setCurrentFlow('late-complete');
    setQuickReplies([]);
    
    const minutes = duration.replace('-min', '').replace('-delay', '');
    
    addAssistantMessage(
      `I'll notify **${appointment.provider}'s office** that you might arrive ${minutes === 'other' ? 'late' : minutes + ' minutes late'}.\n\nTravel safe 🚗 — we'll confirm receipt soon.`
    );

    // Show toast
    MarioToast.success('Clinic notified of delay', {
      duration: 4000
    });

    setTimeout(() => {
      if (onActionComplete) {
        onActionComplete('late', { duration: minutes });
      }
    }, 2000);
  };

  // ============================================
  // INSURANCE/COST FLOW
  // ============================================
  const startInsuranceFlow = () => {
    setCurrentFlow('insurance-topic');
    addAssistantMessage("Sure — what would you like to check?");
    
    setTimeout(() => {
      setQuickReplies([
        { id: 'confirm-copay', text: 'Confirm my copay', value: 'confirm-copay' },
        { id: 'check-deductible', text: 'Ask about deductible', value: 'check-deductible' },
        { id: 'add-insurance', text: 'Add new insurance card', value: 'add-insurance' }
      ]);
    }, 800);
  };

  const handleInsuranceTopic = (topic: string) => {
    if (topic === 'confirm-copay') {
      setCurrentFlow('insurance-copay');
      setQuickReplies([]);
      
      addAssistantMessage(
        `Based on your plan, the **estimated cost** is **${appointment.estimatedCost || '$180'}**, about 15% below average.\n\nNeed me to review this with your insurer?`
      );
      
      setTimeout(() => {
        setQuickReplies([
          { id: 'yes-review', text: 'Yes', value: 'yes-review' },
          { id: 'no-review', text: 'No', value: 'no-review' }
        ]);
      }, 800);
    } else if (topic === 'check-deductible') {
      setQuickReplies([]);
      addAssistantMessage(
        "I'll pull up your deductible information. This typically takes 1-2 business days to verify with your insurer."
      );
      
      MarioToast.success('Request sent to benefits team', {
        duration: 4000
      });

      setTimeout(() => showMainMenu(), 2000);
    } else if (topic === 'add-insurance') {
      setQuickReplies([]);
      addAssistantMessage(
        "You can add a new insurance card in your Profile → Insurance section. Would you like me to guide you there?"
      );
      
      setTimeout(() => showMainMenu(), 2000);
    }
  };

  const handleInsuranceReview = () => {
    setCurrentFlow('insurance-complete');
    setQuickReplies([]);
    
    addAssistantMessage(
      "I'll flag this to our benefits team. You'll get a reply within 1-2 business days."
    );

    MarioToast.success('Request sent to benefits team', {
      duration: 4000
    });

    setTimeout(() => {
      if (onActionComplete) {
        onActionComplete('insurance-review', { appointmentId: appointment.id });
      }
    }, 2000);
  };

  // ============================================
  // FREEFORM FLOW
  // ============================================
  const startFreeformFlow = () => {
    setCurrentFlow('freeform');
    setQuickReplies([]);
    setShowInput(true);
    
    addAssistantMessage("Sure — please type your question below 👇");
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    const message = userInput;
    setUserInput('');

    // Simulate AI response
    addAssistantMessage(
      `Thanks for your question! I've noted this: "${message}"\n\nA member of our care team will follow up with you within 24 hours.`
    );

    setTimeout(() => {
      showMainMenu();
    }, 2000);
  };

  // ============================================
  // HELPERS
  // ============================================
  const triggerConfetti = () => {
    const colors = ['#2E5077', '#4DA1A9', '#79D7BE'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });
  };

  const handleClose = () => {
    setMessages([]);
    setQuickReplies([]);
    setShowInput(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[480px] h-[600px] flex flex-col animate-in zoom-in-95 duration-300"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: '#E8EAED' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4DA1A9' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 
                className="font-semibold"
                style={{ fontSize: '16px', color: '#2E5077' }}
              >
                Mario Concierge
              </h2>
              <p className="text-xs text-[#666666]">Appointment Support</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ outline: 'none' }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid #79D7BE';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <X className="w-5 h-5" style={{ color: '#666666' }} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesEndRef}
          className="flex-1 overflow-y-auto p-6 space-y-4"
          style={{ backgroundColor: '#FDFCFA' }}
        >
          {messages.map((message) => (
            <div key={message.id}>
              {message.isConfirmationCard ? (
                <ConfirmationCard data={message.confirmationData} />
              ) : (
                <MessageBubble message={message} />
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4DA1A910' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#4DA1A9' }} />
              </div>
              <div 
                className="px-4 py-2 rounded-2xl"
                style={{ backgroundColor: '#E0E0E0' }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#666666] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#666666] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#666666] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {quickReplies.length > 0 && (
          <div 
            className="px-6 py-4 border-t"
            style={{ borderColor: '#E8EAED', backgroundColor: '#FFFFFF' }}
          >
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <Button
                  key={reply.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.value)}
                  className="flex items-center gap-2 hover:bg-[#F5F5F5] transition-colors"
                  style={{
                    borderColor: '#E8EAED',
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid #79D7BE';
                    e.currentTarget.style.outlineOffset = '2px';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                >
                  {reply.icon}
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Field */}
        {showInput && (
          <div 
            className="p-6 border-t"
            style={{ borderColor: '#E8EAED', backgroundColor: '#FFFFFF' }}
          >
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1"
                style={{
                  borderRadius: '12px',
                  borderColor: '#E8EAED'
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                style={{
                  backgroundColor: '#2E5077',
                  borderRadius: '12px',
                  minWidth: '44px',
                  minHeight: '44px'
                }}
                className="hover:bg-[#274666] transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.type === 'assistant';
  
  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className="flex items-start gap-2 max-w-[80%]">
        {isAssistant && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ backgroundColor: '#4DA1A910' }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#4DA1A9' }} />
          </div>
        )}
        <div
          className="px-4 py-3 rounded-2xl"
          style={{
            backgroundColor: isAssistant ? '#E0E0E0' : '#2E5077',
            color: isAssistant ? '#2E5077' : '#FFFFFF',
            borderRadius: isAssistant ? '4px 20px 20px 20px' : '20px 4px 20px 20px'
          }}
        >
          <div 
            className="text-sm whitespace-pre-line"
            dangerouslySetInnerHTML={{ 
              __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Confirmation Card Component
function ConfirmationCard({ data }: { data: any }) {
  if (data.type === 'reschedule') {
    return (
      <Card 
        className="p-4 mx-8"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #79D7BE',
          boxShadow: '0 2px 8px rgba(121, 215, 190, 0.15)'
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#79D7BE' }}
          >
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 
              className="font-semibold mb-1"
              style={{ fontSize: '15px', color: '#2E5077' }}
            >
              Reschedule Request Sent
            </h3>
            <p className="text-sm text-[#666666]">
              You'll receive confirmation within 24-48 hours
            </p>
          </div>
        </div>
        
        <div 
          className="space-y-2 py-3 mb-3 border-t border-b"
          style={{ borderColor: '#E8EAED' }}
        >
          <div className="flex justify-between text-sm">
            <span className="text-[#666666]">Old:</span>
            <span className="text-[#2E5077] font-medium">{data.oldDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#666666]">New:</span>
            <span className="text-[#2E5077] font-medium">{data.newDate}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#666666]">Est. Cost {data.cost}</span>
          <Badge 
            className="bg-[#79D7BE] text-white hover:bg-[#79D7BE]"
          >
            +{data.points} points
          </Badge>
        </div>
      </Card>
    );
  }
  
  return null;
}