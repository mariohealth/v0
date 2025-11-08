'use client'
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { 
  X, 
  Send, 
  Sparkles,
  MapPin,
  Star,
  DollarSign
} from 'lucide-react';
import { MarioBookingFlow } from './mario-booking-flow';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestedDoctor?: SuggestedDoctor;
}

interface SuggestedDoctor {
  name: string;
  specialty: string;
  distance: string;
  price: string;
  rating: string;
  network?: string;
  points?: number;
}

interface MarioAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment?: (doctor: SuggestedDoctor) => void;
  initialPrompt?: string | null;
}

// Keyword detection for specialties
const detectSpecialty = (text: string): { specialty: string; keywords: string[] } | null => {
  const lowerText = text.toLowerCase();
  
  const specialtyMap = [
    {
      specialty: 'Cardiology',
      keywords: ['chest', 'heart', 'cardiac', 'shortness of breath', 'breathing', 'palpitations', 'chest pain', 'dizziness', 'blood pressure']
    },
    {
      specialty: 'Orthopedic Surgery',
      keywords: ['knee', 'joint', 'bone', 'fracture', 'arthritis', 'back pain', 'hip', 'shoulder', 'spine']
    },
    {
      specialty: 'Dermatology',
      keywords: ['skin', 'rash', 'acne', 'mole', 'eczema', 'psoriasis', 'itching']
    },
    {
      specialty: 'Internal Medicine',
      keywords: ['fever', 'fatigue', 'headache', 'general', 'checkup', 'physical', 'tired']
    },
    {
      specialty: 'Gastroenterology',
      keywords: ['stomach', 'digestive', 'abdominal', 'nausea', 'diarrhea', 'constipation', 'gut']
    },
    {
      specialty: 'Neurology',
      keywords: ['migraine', 'seizure', 'numbness', 'tingling', 'memory', 'neurological']
    }
  ];

  for (const { specialty, keywords } of specialtyMap) {
    const matchedKeywords = keywords.filter(keyword => lowerText.includes(keyword));
    if (matchedKeywords.length > 0) {
      return { specialty, keywords: matchedKeywords };
    }
  }

  return null;
};

// Sample doctors database
const doctorsDatabase: Record<string, SuggestedDoctor> = {
  'Cardiology': {
    name: 'Dr. Fatima Khan',
    specialty: 'Cardiology',
    distance: '2.1 mi',
    price: '$280',
    rating: '4.92',
    network: 'In-Network',
    points: 150
  },
  'Orthopedic Surgery': {
    name: 'Dr. Sarah Johnson',
    specialty: 'Orthopedic Surgery',
    distance: '2.3 mi',
    price: '$425',
    rating: '4.89',
    network: 'In-Network',
    points: 150
  },
  'Dermatology': {
    name: 'Dr. Michael Chen',
    specialty: 'Dermatology',
    distance: '1.8 mi',
    price: '$195',
    rating: '4.87',
    network: 'In-Network',
    points: 100
  },
  'Internal Medicine': {
    name: 'Dr. Angela Patel',
    specialty: 'Internal Medicine',
    distance: '1.5 mi',
    price: '$160',
    rating: '4.91',
    network: 'In-Network',
    points: 75
  },
  'Gastroenterology': {
    name: 'Dr. Robert Martinez',
    specialty: 'Gastroenterology',
    distance: '3.2 mi',
    price: '$315',
    rating: '4.85',
    network: 'In-Network',
    points: 125
  },
  'Neurology': {
    name: 'Dr. Lisa Wong',
    specialty: 'Neurology',
    distance: '2.7 mi',
    price: '$350',
    rating: '4.90',
    network: 'In-Network',
    points: 140
  }
};

// AI response generator
const generateAIResponse = (
  userMessage: string,
  conversationHistory: Message[]
): { content: string; suggestedDoctor?: SuggestedDoctor } => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check if user is answering follow-up questions
  const lastAIMessage = conversationHistory
    .filter(m => m.sender === 'ai')
    .pop();
  
  // Welcome message
  if (conversationHistory.length === 0) {
    return {
      content: "Hi! I'm MarioAI, your healthcare assistant. 👋\n\nI'm here to help you find the right care. Tell me what symptoms or health concerns you're experiencing, and I'll connect you with the best specialist."
    };
  }
  
  // Detect if user is expressing pain or emergency
  if (lowerMessage.includes('severe') || lowerMessage.includes('emergency') || lowerMessage.includes('unbearable')) {
    return {
      content: "This sounds urgent. For severe or emergency symptoms, please call 911 or visit your nearest emergency room immediately.\n\nIf this is not an emergency but you'd like to schedule an appointment, I can help with that."
    };
  }
  
  // Detect specialty based on symptoms
  const specialtyMatch = detectSpecialty(userMessage);
  
  if (specialtyMatch) {
    const doctor = doctorsDatabase[specialtyMatch.specialty];
    
    // Check if we're in follow-up mode
    if (lastAIMessage?.content.includes('experiencing pain or dizziness')) {
      return {
        content: `Understood. Based on your symptoms, this could relate to several conditions. I recommend seeing a specialist for proper evaluation.\n\nWould you like me to help you book an appointment with a ${specialtyMatch.specialty.toLowerCase()} specialist?`,
        suggestedDoctor: doctor
      };
    }
    
    // First detection - ask follow-up
    if (specialtyMatch.keywords.some(k => ['chest', 'heart', 'breathing'].includes(k))) {
      return {
        content: "That sounds concerning. Are you currently experiencing pain or dizziness along with the shortness of breath?"
      };
    }
    
    if (specialtyMatch.keywords.some(k => ['knee', 'joint', 'bone'].includes(k))) {
      return {
        content: "I understand joint issues can be quite limiting. Is the pain constant, or does it occur during specific activities?"
      };
    }
    
    // General follow-up
    return {
      content: `I can help you with that. These symptoms may require evaluation by a ${specialtyMatch.specialty.toLowerCase()} specialist.\n\nHow long have you been experiencing these symptoms?`
    };
  }
  
  // If no specialty detected but conversation is ongoing
  if (lowerMessage.includes('yes') || lowerMessage.includes('yeah') || lowerMessage.includes('sure')) {
    // Check if previous message had a doctor suggestion
    const previousAIWithDoctor = conversationHistory
      .filter(m => m.sender === 'ai' && m.suggestedDoctor)
      .pop();
    
    if (previousAIWithDoctor?.suggestedDoctor) {
      return {
        content: "Great! Here's a highly-rated specialist near you:",
        suggestedDoctor: previousAIWithDoctor.suggestedDoctor
      };
    }
  }
  
  // Duration response
  if (lowerMessage.match(/\d+\s*(day|week|month|year)/)) {
    // Try to detect specialty from earlier in conversation
    const earlierMessages = conversationHistory
      .filter(m => m.sender === 'user')
      .map(m => m.content)
      .join(' ');
    
    const earlierSpecialty = detectSpecialty(earlierMessages);
    if (earlierSpecialty) {
      const doctor = doctorsDatabase[earlierSpecialty.specialty];
      return {
        content: `Thank you for that information. Based on your symptoms, I recommend consulting with a specialist for proper diagnosis and treatment.\n\nWould you like me to help you find a ${earlierSpecialty.specialty.toLowerCase()} specialist?`,
        suggestedDoctor: doctor
      };
    }
  }
  
  // Default helpful response
  return {
    content: "I'd like to help you find the right care. Could you tell me more about your symptoms? For example, what you're experiencing and how long it's been happening?"
  };
};

export function MarioAIChat({ isOpen, onClose, onBookAppointment, initialPrompt }: MarioAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<SuggestedDoctor | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeResponse = generateAIResponse('', []);
      setMessages([{
        id: '0',
        sender: 'ai',
        content: welcomeResponse.content,
        timestamp: new Date()
      }]);
      
      // If there's an initial prompt, auto-send it after welcome message
      if (initialPrompt) {
        setTimeout(() => {
          autoSendPrompt(initialPrompt);
        }, 500);
      }
    }
  }, [isOpen]);
  
  // Auto-send initial prompt
  const autoSendPrompt = async (prompt: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate AI response
    const aiResponse = generateAIResponse(prompt, [...messages, userMessage]);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: aiResponse.content,
      timestamp: new Date(),
      suggestedDoctor: aiResponse.suggestedDoctor
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate AI response
    const aiResponse = generateAIResponse(inputValue, [...messages, userMessage]);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: aiResponse.content,
      timestamp: new Date(),
      suggestedDoctor: aiResponse.suggestedDoctor
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBookDoctor = (doctor: SuggestedDoctor) => {
    setSelectedDoctor(doctor);
    setShowBookingFlow(true);
  };

  const handleBookingConfirm = () => {
    if (selectedDoctor) {
      onBookAppointment?.(selectedDoctor);
      onClose();
    }
  };

  // MarioAI Avatar
  const MarioAvatar = () => (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: '#4DA1A9' }}
    >
      <Sparkles className="h-4 w-4 text-white" />
    </div>
  );

  // User Avatar
  const UserAvatar = () => (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: '#E0E0E0' }}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#666666" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  // Doctor Suggestion Card
  const DoctorCard = ({ doctor }: { doctor: SuggestedDoctor }) => (
    <Card 
      className="p-4 mt-3 mario-transition cursor-pointer mario-hover-provider"
      onClick={() => handleBookDoctor(doctor)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#4DA1A9' }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold mb-1">{doctor.name}</div>
          <div className="text-sm text-muted-foreground mb-2">{doctor.specialty}</div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {doctor.distance}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {doctor.rating}
            </div>
            {doctor.network && (
              <Badge 
                variant="secondary" 
                className="text-xs px-1.5 py-0.5"
                style={{ 
                  backgroundColor: '#79D7BE20',
                  color: '#2E5077'
                }}
              >
                {doctor.network}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div 
            className="font-semibold text-lg mb-1"
            style={{ color: '#2E5077' }}
          >
            {doctor.price}
          </div>
          <div 
            className="text-xs"
            style={{ color: '#4DA1A9' }}
          >
            +{doctor.points} pts
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full"
        style={{ backgroundColor: '#2E5077' }}
      >
        Book Appointment
      </Button>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-2xl p-0 gap-0 h-[600px] flex flex-col"
          style={{ 
            backgroundColor: '#F6F4F0',
            borderRadius: '16px'
          }}
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>MarioAI Chat</DialogTitle>
          </VisuallyHidden>
          
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between border-b"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderColor: '#E0E0E0'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4DA1A9' }}
              >
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Ask MarioAI</h3>
                <p className="text-xs text-muted-foreground">Your AI healthcare assistant</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {message.sender === 'ai' ? <MarioAvatar /> : <UserAvatar />}
                  
                  <div 
                    className={cn(
                      "flex-1 max-w-[75%]",
                      message.sender === 'user' ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className="px-4 py-3 whitespace-pre-line"
                      style={{
                        backgroundColor: message.sender === 'ai' ? '#4DA1A9' : '#E8EAED',
                        color: message.sender === 'ai' ? '#FFFFFF' : '#1A1A1A',
                        borderRadius: '16px',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                    >
                      {message.content}
                    </div>
                    
                    {message.suggestedDoctor && (
                      <DoctorCard doctor={message.suggestedDoctor} />
                    )}
                    
                    <div 
                      className={cn(
                        "text-xs text-muted-foreground mt-1 px-1",
                        message.sender === 'user' ? "text-right" : "text-left"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <MarioAvatar />
                  <div 
                    className="px-4 py-3 flex items-center gap-1"
                    style={{
                      backgroundColor: '#4DA1A9',
                      borderRadius: '16px'
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full bg-white animate-pulse"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full bg-white animate-pulse"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full bg-white animate-pulse"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div 
            className="p-4 border-t"
            style={{ 
              backgroundColor: '#FFFFFF',
              borderColor: '#E0E0E0'
            }}
          >
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                className="flex-1"
                style={{
                  backgroundColor: '#F6F4F0',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px'
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="flex-shrink-0"
                style={{ 
                  backgroundColor: '#2E5077',
                  borderRadius: '12px',
                  width: '44px',
                  height: '44px'
                }}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-2">
              MarioAI is here to help guide you to the right care
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Flow Modal */}
      {selectedDoctor && (
        <MarioBookingFlow
          isOpen={showBookingFlow}
          onClose={() => setShowBookingFlow(false)}
          onConfirm={handleBookingConfirm}
          doctor={{
            name: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            price: selectedDoctor.price,
            network: selectedDoctor.network,
            points: selectedDoctor.points
          }}
        />
      )}
    </>
  );
}
