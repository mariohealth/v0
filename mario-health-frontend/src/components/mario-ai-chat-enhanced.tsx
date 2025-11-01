'use client'
import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { 
  Send, 
  Sparkles,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { MarioBookingFlow } from './mario-booking-flow';
import { searchData } from '../data/mario-search-data';
import conversationData from '../data/mario_search_results.json';

interface Message {
  id: string;
  sender: 'user' | 'mario';
  content: string;
  timestamp: Date;
  type?: 'suggestion' | 'doctor' | 'dataDisplay';
  options?: string[];
  doctor?: SuggestedDoctor;
  data?: MedicationData;
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

interface MedicationData {
  marioPick: string;
  alternatives: Array<{
    pharmacy: string;
    price: string;
    source: string;
  }>;
}

interface MarioAIChatEnhancedProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onBookAppointment?: (doctor: SuggestedDoctor) => void;
  onSearchSuggestion?: (query: string) => void;
}

// Conversation scripts database
const conversationScripts = {
  chest_tightness: {
    keywords: ['chest', 'tightness', 'shortness', 'breath', 'breathing', 'cardiac', 'heart'],
    script: [
      {
        trigger: 'initial',
        response: "That sounds uncomfortable. Are you experiencing this pain right now or mainly with activity?",
        speaker: 'mario'
      },
      {
        trigger: 'activity',
        response: "Thanks for clarifying. While this can have several causes, it's safest to have a medical evaluation. I can help you compare nearby cardiologists or urgent-care options.",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "View cardiologists near me",
          "Book urgent-care visit",
          "Learn about chest pain causes"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Fatima Khan',
      specialty: 'Cardiology',
      distance: '4.1 mi',
      price: '$280',
      rating: '4.89',
      network: 'In-Network',
      points: 150
    }
  },
  knee_pain: {
    keywords: ['knee', 'joint', 'jogging', 'running', 'exercise', 'orthopedic', 'pain'],
    script: [
      {
        trigger: 'initial',
        response: "Got it. Knee pain after exercise could be from joint strain or inflammation. How long has it been bothering you?",
        speaker: 'mario'
      },
      {
        trigger: 'duration',
        response: "Thanks. I can help you find an orthopedic specialist or physical therapist nearby, and show typical MRI or consultation costs.",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Compare Orthopedic doctors",
          "View MRI knee pricing",
          "Chat with a physical therapist"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Orthopedic Surgery',
      distance: '2.1 mi',
      price: '$425',
      rating: '4.90',
      network: 'In-Network',
      points: 150
    }
  },
  headache: {
    keywords: ['headache', 'migraine', 'head', 'pain', 'recurring'],
    script: [
      {
        trigger: 'initial',
        response: "I'm sorry to hear that. Are they constant or do they come and go?",
        speaker: 'mario'
      },
      {
        trigger: 'pattern',
        response: "Okay. Stress, dehydration, or eye strain can contribute — but it's best to rule out other causes. Would you like to connect with a primary-care or neurology provider?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Find Neurology doctors",
          "Book Primary Care visit",
          "See home remedies"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Marcus Nguyen',
      specialty: 'Neurology',
      distance: '2.9 mi',
      price: '$320',
      rating: '4.81',
      network: 'In-Network',
      points: 140
    }
  },
  diabetes_medication: {
    keywords: ['diabetes', 'metformin', 'medication', 'refill', 'prescription'],
    script: [
      {
        trigger: 'initial',
        response: "Sure thing. I can show current cash and insurance prices for Metformin 500 mg near you.",
        speaker: 'mario',
        type: 'dataDisplay',
        data: {
          marioPick: "Cost Plus Drugs — $9.90",
          alternatives: [
            { pharmacy: "Walgreens", price: "$10.50", source: "GoodRx" },
            { pharmacy: "Walmart", price: "$9.90", source: "SingleCare" },
            { pharmacy: "CVS Pharmacy", price: "$10.20", source: "GoodRx" }
          ]
        }
      }
    ]
  },
  allergies: {
    keywords: ['allergy', 'allergies', 'seasonal', 'sneezing', 'itching'],
    script: [
      {
        trigger: 'initial',
        response: "That's tough — seasonal allergies can be rough. Do you want to see over-the-counter relief options or nearby allergy specialists?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Compare allergy meds",
          "Find allergy doctors",
          "View symptom tips"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Jason Patel',
      specialty: 'Allergy & Immunology',
      distance: '2.4 mi',
      price: '$170',
      rating: '4.82',
      network: 'In-Network',
      points: 100
    }
  },
  sleep_issues: {
    keywords: ['sleep', 'insomnia', 'sleeping', 'tired', 'fatigue'],
    script: [
      {
        trigger: 'initial',
        response: "I'm sorry to hear that. Would you like to review lifestyle tips, or speak to a sleep specialist or mental-health provider?",
        speaker: 'mario',
        type: 'suggestion',
        options: [
          "Book Sleep Specialist",
          "Chat with Mental-Health Provider",
          "View sleep hygiene tips"
        ]
      }
    ],
    doctor: {
      name: 'Dr. Kevin Park',
      specialty: 'Psychiatry',
      distance: '1.7 mi',
      price: '$210',
      rating: '4.93',
      network: 'In-Network',
      points: 125
    }
  }
};

// Detect conversation topic from user message
const detectTopic = (message: string): keyof typeof conversationScripts | null => {
  const lowerMessage = message.toLowerCase();
  
  for (const [topic, data] of Object.entries(conversationScripts)) {
    if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return topic as keyof typeof conversationScripts;
    }
  }
  
  return null;
};

// Search dataset for doctors by specialty
const searchDoctorsBySpecialty = (specialty: string): SuggestedDoctor[] => {
  const lowerSpecialty = specialty.toLowerCase();
  const doctors = searchData.doctors || [];
  
  return doctors
    .filter(doc => doc.specialty.toLowerCase().includes(lowerSpecialty))
    .slice(0, 3)
    .map(doc => ({
      name: doc.name,
      specialty: doc.specialty,
      distance: doc.distance,
      price: doc.price,
      rating: parseFloat(doc.rating).toFixed(2),
      network: doc.network,
      points: 150
    }));
};

export function MarioAIChatEnhanced({ 
  isCollapsed = false, 
  onToggle,
  onBookAppointment,
  onSearchSuggestion
}: MarioAIChatEnhancedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<keyof typeof conversationScripts | null>(null);
  const [conversationStep, setConversationStep] = useState(0);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<SuggestedDoctor | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && !isCollapsed) {
      setMessages([{
        id: '0',
        sender: 'mario',
        content: "Hi! I'm MarioAI 👋\n\nI'm here to help you find the right care. Let's figure that out together. Tell me what symptoms or health concerns you're experiencing. 💬",
        timestamp: new Date()
      }]);
    }
  }, [isCollapsed]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800));

    // Detect topic
    const topic = currentTopic || detectTopic(textToSend);
    
    if (topic && conversationScripts[topic]) {
      setCurrentTopic(topic);
      const script = conversationScripts[topic];
      const currentScript = script.script[conversationStep];

      if (currentScript) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'mario',
          content: currentScript.response,
          timestamp: new Date(),
          type: currentScript.type as any,
          options: currentScript.options,
          data: (currentScript as any).data
        };

        setMessages(prev => [...prev, aiMessage]);
        setConversationStep(conversationStep + 1);

        // If we've shown suggestions, show doctor
        if (currentScript.type === 'suggestion' && script.doctor) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const doctorMessage: Message = {
            id: (Date.now() + 2).toString(),
            sender: 'mario',
            content: `Recommended nearby:`,
            timestamp: new Date(),
            type: 'doctor',
            doctor: script.doctor
          };

          setMessages(prev => [...prev, doctorMessage]);
        }
      }
    } else {
      // Fallback response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'mario',
        content: "I'd like to help you find the right care. Could you tell me more about your symptoms?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    }

    setIsTyping(false);
  };

  const handleOptionClick = async (option: string) => {
    // Check if this is a search-triggering suggestion
    if (option.toLowerCase().includes('view') || 
        option.toLowerCase().includes('compare') || 
        option.toLowerCase().includes('find')) {
      // Extract search term and trigger search
      const searchTerms = {
        'cardiologists': 'Cardiology',
        'orthopedic': 'Orthopedic Surgery',
        'neurology': 'Neurology',
        'allergy': 'Allergy & Immunology',
        'sleep specialist': 'Psychiatry',
        'mri knee': 'MRI Knee'
      };
      
      for (const [key, value] of Object.entries(searchTerms)) {
        if (option.toLowerCase().includes(key)) {
          onSearchSuggestion?.(value);
          return;
        }
      }
    }
    
    // Otherwise, continue conversation
    await handleSendMessage(option);
  };

  const handleBookDoctor = (doctor: SuggestedDoctor) => {
    setSelectedDoctor(doctor);
    setShowBookingFlow(true);
  };

  const handleBookingConfirm = () => {
    if (selectedDoctor) {
      onBookAppointment?.(selectedDoctor);
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

  // Doctor Card
  const DoctorCard = ({ doctor }: { doctor: SuggestedDoctor }) => (
    <Card 
      className="p-4 mt-3 mario-transition cursor-pointer mario-hover-primary"
      style={{
        borderRadius: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}
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
      
      <button 
        className="w-full mario-transition hover:opacity-90"
        style={{ 
          backgroundColor: '#2E5077',
          color: 'white',
          height: '44px',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Book Appointment ✅
      </button>
    </Card>
  );

  // Medication Pricing Display
  const MedicationPricing = ({ data }: { data: MedicationData }) => (
    <Card 
      className="p-4 mt-3"
      style={{
        borderRadius: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        backgroundColor: '#F6F4F0'
      }}
    >
      <div className="mb-3">
        <Badge 
          className="mb-2"
          style={{ 
            backgroundColor: '#4DA1A9',
            color: 'white'
          }}
        >
          Mario's Pick
        </Badge>
        <div className="text-lg font-semibold" style={{ color: '#2E5077' }}>
          {data.marioPick}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium mb-2">Other options:</div>
        {data.alternatives.map((alt, idx) => (
          <div 
            key={idx}
            className="flex justify-between items-center text-sm p-2 rounded-lg"
            style={{ backgroundColor: 'white' }}
          >
            <span>{alt.pharmacy}</span>
            <span className="font-medium">{alt.price}</span>
          </div>
        ))}
      </div>

      <button 
        className="w-full mt-3 mario-transition hover:opacity-90"
        style={{ 
          backgroundColor: '#2E5077',
          color: 'white',
          height: '44px',
          borderRadius: '12px',
          fontWeight: '500',
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Order Medication 💊
      </button>
    </Card>
  );

  if (isCollapsed) {
    return null;
  }

  return (
    <>
      <Card 
        className="border-t"
        style={{
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Header */}
        <div 
          className="p-3 flex items-center justify-between border-b cursor-pointer"
          onClick={onToggle}
          style={{ borderColor: '#E0E0E0' }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4DA1A9' }}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Ask MarioAI</h3>
              <p className="text-xs text-muted-foreground">Your AI healthcare assistant</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-[320px] p-4"
          style={{ backgroundColor: '#F6F4F0' }}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={cn(
                  "flex gap-2 mario-chat-bubble-enter",
                  message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                {message.sender === 'mario' ? <MarioAvatar /> : <UserAvatar />}
                
                <div 
                  className={cn(
                    "flex-1 max-w-[80%]",
                    message.sender === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className="px-3 py-2 whitespace-pre-line mario-transition"
                    style={{
                      backgroundColor: message.sender === 'mario' ? '#E9F6F5' : '#F2F2F2',
                      color: '#1A1A1A',
                      borderRadius: '16px',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    {message.content}
                  </div>

                  {/* Suggestion Options - Horizontal Pill Buttons */}
                  {message.type === 'suggestion' && message.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, idx) => (
                        <button
                          key={idx}
                          className="px-4 py-2 text-sm mario-transition hover:bg-[#4DA1A9] hover:text-white"
                          style={{
                            border: '1.5px solid #4DA1A9',
                            borderRadius: '24px',
                            color: '#4DA1A9',
                            backgroundColor: 'transparent',
                            fontWeight: '500'
                          }}
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Doctor Card */}
                  {message.type === 'doctor' && message.doctor && (
                    <DoctorCard doctor={message.doctor} />
                  )}

                  {/* Medication Pricing */}
                  {message.type === 'dataDisplay' && message.data && (
                    <MedicationPricing data={message.data} />
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
              <div className="flex gap-2">
                <MarioAvatar />
                <div 
                  className="px-3 py-2 flex items-center gap-1"
                  style={{
                    backgroundColor: '#E9F6F5',
                    borderRadius: '16px'
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ 
                      animationDelay: '0ms',
                      backgroundColor: '#4DA1A9'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ 
                      animationDelay: '150ms',
                      backgroundColor: '#4DA1A9'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ 
                      animationDelay: '300ms',
                      backgroundColor: '#4DA1A9'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div 
          className="p-3 border-t"
          style={{ 
            backgroundColor: '#FFFFFF',
            borderColor: '#E0E0E0'
          }}
        >
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              placeholder="Describe your symptoms..."
              className="flex-1"
              style={{
                backgroundColor: '#F6F4F0',
                border: '1px solid #E0E0E0',
                borderRadius: '12px',
                fontSize: '14px'
              }}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="flex-shrink-0 mario-transition"
              style={{ 
                backgroundColor: '#2E5077',
                borderRadius: '12px',
                width: '40px',
                height: '40px'
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

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
