'use client'
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Search, 
  Stethoscope, 
  Calendar, 
  Pill,
  DollarSign,
  Shield,
  Clipboard,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from './ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Stethoscope;
  prompt: string;
}

interface MarioAskAIProps {
  onClose?: () => void;
  initialPrompt?: string;
}

export function MarioAskAI({ onClose, initialPrompt }: MarioAskAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasProcessedInitialPrompt = useRef(false);

  // Quick action buttons
  const primaryActions: QuickAction[] = [
    {
      id: 'health-concern',
      label: '🩺 I have a health concern',
      icon: Stethoscope,
      prompt: "Hi Mario, I'm not feeling well and need advice on what to do."
    },
    {
      id: 'book-visit',
      label: '📅 Book a visit',
      icon: Calendar,
      prompt: 'Help me book a doctor visit through the concierge.'
    },
    {
      id: 'rx-renewal',
      label: '💊 RX renewal',
      icon: Pill,
      prompt: 'I need to renew my prescription.'
    }
  ];

  const secondaryActions: QuickAction[] = [
    {
      id: 'cost-estimate',
      label: '💰 Cost Estimate',
      icon: DollarSign,
      prompt: 'Can you estimate the cost of an MRI near me?'
    },
    {
      id: 'insurance-help',
      label: '🛡️ Insurance Help',
      icon: Shield,
      prompt: 'I need help understanding my coverage.'
    },
    {
      id: 'claims-help',
      label: '🧾 Claims Help',
      icon: Clipboard,
      prompt: 'I want to check or dispute a claim.'
    }
  ];

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('not feeling well') || lowerMessage.includes('health concern')) {
      return "I'm sorry to hear you're not feeling well. I can help you find the right care. Can you tell me more about your symptoms? For urgent concerns, please call 911 or visit your nearest emergency room.";
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('appointment') || lowerMessage.includes('visit')) {
      return "I'd be happy to help you book a visit! To find the best provider for you, I'll need to know:\n\n• What type of specialist or care do you need?\n• Do you have a preferred location or hospital?\n• What's your insurance carrier?\n\nOnce you provide these details, I can show you available providers with transparent pricing.";
    }
    
    if (lowerMessage.includes('prescription') || lowerMessage.includes('rx') || lowerMessage.includes('renew')) {
      return "I can help you renew your prescription. Which medication do you need to refill? I can check:\n\n• Current prescription status\n• Pharmacy options with best prices\n• Generic alternatives to save money\n• Auto-refill setup\n\nJust let me know the medication name.";
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('mri') || lowerMessage.includes('estimate')) {
      return "I can provide a cost estimate for your MRI! Based on your insurance (Blue Cross Blue Shield) and network providers in your area:\n\n• In-network MRI: $425 - $850\n• Your estimated out-of-pocket: $180 - $340\n• Deductible applied: $850 of $2,000 met\n\nWould you like me to show you specific imaging centers with the lowest prices?";
    }
    
    if (lowerMessage.includes('insurance') || lowerMessage.includes('coverage')) {
      return "I'm here to help you understand your coverage! Your current plan is Blue Cross Blue Shield PPO. Here's a quick summary:\n\n• Deductible: $850 of $2,000 met (42.5%)\n• Primary care copay: $15\n• Specialist copay: $40\n• ER copay: $250\n\nWhat specific coverage question can I help you with?";
    }
    
    if (lowerMessage.includes('claim') || lowerMessage.includes('dispute')) {
      return "I can help you with your claims! Let me pull up your recent activity:\n\n• 2 pending claims totaling $1,240\n• 1 claim needs your attention (Dr. Sarah Johnson - Cardiology)\n• Average processing time: 5-7 days\n\nWould you like to review a specific claim or start a dispute process?";
    }
    
    return "I'm Mario, your AI health assistant! I can help you with:\n\n• Finding and booking doctors\n• Comparing treatment costs\n• Understanding your insurance\n• Renewing prescriptions\n• Checking claims\n• Answering health questions\n\nWhat would you like help with today?";
  };

  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  // Process initial prompt if provided
  useEffect(() => {
    if (initialPrompt && !hasProcessedInitialPrompt.current) {
      hasProcessedInitialPrompt.current = true;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, handleSendMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: '#F6F4F0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-40"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8EAED' }}
      >
        <div className="px-4 py-4 flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #4DA1A9 0%, #79D7BE 100%)'
              }}
            >
              <Sparkles className="h-5 w-5" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h1 
                className="font-semibold"
                style={{ 
                  fontSize: '18px',
                  color: '#2E5077'
                }}
              >
                Ask MarioAI
              </h1>
              <p 
                style={{ 
                  fontSize: '12px',
                  color: '#666666'
                }}
              >
                Your health assistant
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0F0F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        
        {/* Search Input Area */}
        <div className="px-4 py-6">
          <div 
            className="relative transition-all duration-200"
            style={{
              borderRadius: '8px',
              border: isFocused ? '2px solid #2E5077' : '1px solid #E0E0E0',
              backgroundColor: '#FFFFFF',
              boxShadow: isFocused ? '0 0 0 3px rgba(46, 80, 119, 0.12)' : 'none',
              minHeight: '48px'
            }}
          >
            <div className="flex items-start gap-3 p-3">
              <Search 
                className="h-5 w-5 flex-shrink-0 mt-0.5" 
                style={{ color: '#999999' }} 
              />
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask Mario about your health, benefits, or savings..."
                className="flex-1 resize-none outline-none bg-transparent"
                style={{
                  fontSize: '15px',
                  color: '#1A1A1A',
                  lineHeight: '1.5',
                  minHeight: '24px',
                  maxHeight: '96px',
                  caretColor: '#2E5077'
                }}
                rows={1}
              />
              {inputValue.trim() && (
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all"
                  style={{
                    backgroundColor: '#2E5077',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#274666';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E5077';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Send className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        {messages.length === 0 && (
          <div className="px-4 pb-6">
            <p 
              className="mb-3 font-medium"
              style={{ 
                fontSize: '14px',
                color: '#666666'
              }}
            >
              Quick Actions
            </p>
            
            {/* Primary Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              {primaryActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="px-4 py-3 rounded-lg transition-all"
                  style={{
                    minHeight: '48px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2E5077',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E50770A';
                    e.currentTarget.style.borderColor = '#2E5077';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {secondaryActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="px-4 py-3 rounded-lg transition-all"
                  style={{
                    minHeight: '48px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0E0',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2E5077',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#2E50770A';
                    e.currentTarget.style.borderColor = '#2E5077';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E0E0E0';
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 px-4 pb-6 overflow-y-auto"
          style={{
            scrollBehavior: 'smooth'
          }}
        >
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, #4DA1A920 0%, #79D7BE20 100%)'
                }}
              >
                <div className="relative">
                  <Sparkles 
                    className="h-16 w-16" 
                    style={{ color: '#4DA1A9' }} 
                  />
                  <Stethoscope 
                    className="h-8 w-8 absolute -bottom-2 -right-2" 
                    style={{ color: '#79D7BE' }} 
                  />
                </div>
              </div>
              <h3 
                className="font-semibold mb-2"
                style={{ 
                  fontSize: '20px',
                  color: '#2E5077'
                }}
              >
                Ask Mario anything
              </h3>
              <p 
                style={{ 
                  fontSize: '15px',
                  color: '#666666',
                  maxWidth: '320px'
                }}
              >
                Try "Find an affordable MRI" or "How do I check my claim?"
              </p>
            </div>
          ) : (
            // Messages
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex animate-in fade-in slide-in-from-bottom-2 duration-200"
                  style={{
                    justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    className="max-w-[80%] px-4 py-3"
                    style={{
                      backgroundColor: message.role === 'user' ? '#2E5077' : '#FFFFFF',
                      color: message.role === 'user' ? '#FFFFFF' : '#1A1A1A',
                      borderRadius: message.role === 'user' 
                        ? '12px 12px 4px 12px' 
                        : '12px 12px 12px 4px',
                      border: message.role === 'assistant' ? '1px solid #E0E0E0' : 'none',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex animate-in fade-in duration-200">
                  <div
                    className="px-4 py-3 flex items-center gap-1"
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px 12px 12px 4px',
                      border: '1px solid #E0E0E0'
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        backgroundColor: '#79D7BE',
                        animationDelay: '0ms'
                      }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        backgroundColor: '#79D7BE',
                        animationDelay: '150ms'
                      }}
                    />
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ 
                        backgroundColor: '#79D7BE',
                        animationDelay: '300ms'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
