'use client'
import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { X, Send, Sparkles, Check, Calendar, XCircle, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface MarioAIConciergeChatProps {
  isOpen: boolean;
  onClose: () => void;
  requestTitle: string;
  requestId: string;
}

export function MarioAIConciergeChat({
  isOpen,
  onClose,
  requestTitle,
  requestId
}: MarioAIConciergeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      // Send initial greeting when chat opens
      const greeting: Message = {
        id: 'greeting',
        type: 'ai',
        content: `Hi! I'm here to help with your **${requestTitle}**. How can I assist you?`,
        timestamp: new Date()
      };
      setMessages([greeting]);
    } else {
      // Reset when closed
      setMessages([]);
      setInputValue('');
    }
  }, [isOpen, requestTitle]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('status') || lowerMsg.includes('check')) {
      return "I'm currently working with the provider to confirm your appointment. I'll send you a notification as soon as we receive confirmation. This typically takes 24-48 hours.";
    }

    if (lowerMsg.includes('change') || lowerMsg.includes('date') || lowerMsg.includes('time')) {
      return "I'd be happy to help you change your preferred appointment time. What date and time would work better for you? Please provide a few options and I'll check availability.";
    }

    if (lowerMsg.includes('cancel')) {
      return "I understand you'd like to cancel your appointment request. To confirm, would you like me to cancel **" + requestTitle + "**? You can create a new request anytime.";
    }

    if (lowerMsg.includes('coordinator') || lowerMsg.includes('talk to')) {
      return "I'm connecting you with a care coordinator. They'll reach out within the next hour to assist you personally. Is there anything specific you'd like me to note for them?";
    }

    // Default response
    return "I'm here to help with your appointment request. I can check the status, help you change the date/time, assist with cancellation, or connect you with a care coordinator. What would you like to do?";
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: simulateAIResponse(messageContent),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const quickReplies = [
    { icon: Check, text: 'Check status of my appointment', color: '#4DA1A9' },
    { icon: Calendar, text: 'Change preferred date or time', color: '#79D7BE' },
    { icon: XCircle, text: 'Cancel my request', color: '#E57373' },
    { icon: MessageSquare, text: 'Talk to a care coordinator', color: '#2E5077' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-lg p-0 gap-0 h-[90vh] flex flex-col"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E8EAED'
        }}
      >
        <VisuallyHidden>
          <DialogTitle>MarioAI Concierge Chat</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: '#E8EAED' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4DA1A9 0%, #79D7BE 100%)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            </div>
            <div>
              <h3 
                className="font-semibold"
                style={{ fontSize: '15px', color: '#2E5077' }}
              >
                Mario Concierge
              </h3>
              <p className="text-xs" style={{ color: '#666666' }}>
                Online • Typically replies instantly
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="mario-transition active:scale-95"
            style={{
              color: '#666666',
              borderRadius: '8px'
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ backgroundColor: '#FDFCFA' }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  message.type === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                }`}
                style={{
                  backgroundColor: message.type === 'user' ? '#2E5077' : '#FFFFFF',
                  color: message.type === 'user' ? '#FFFFFF' : '#2E5077',
                  boxShadow: message.type === 'ai' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              >
                <div dangerouslySetInnerHTML={{ 
                  __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }} />
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="rounded-xl rounded-bl-sm px-4 py-3"
                style={{
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div className="flex gap-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#4DA1A9',
                      animationDelay: '0ms'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#4DA1A9',
                      animationDelay: '150ms'
                    }}
                  />
                  <div 
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ 
                      backgroundColor: '#4DA1A9',
                      animationDelay: '300ms'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Replies - Show only for the first message */}
          {messages.length === 1 && !isTyping && (
            <div className="space-y-2 pt-2">
              <p className="text-xs" style={{ color: '#666666' }}>
                Quick replies:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {quickReplies.map((reply, index) => {
                  const Icon = reply.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply.text)}
                      className="flex items-center gap-3 p-3 rounded-lg text-left mario-transition active:scale-95"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8EAED',
                        color: '#2E5077'
                      }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${reply.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: reply.color }} />
                      </div>
                      <span className="text-sm">{reply.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: '#E8EAED', backgroundColor: '#FFFFFF' }}
        >
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
              style={{
                backgroundColor: '#F5F5F5',
                border: '1px solid #E8EAED',
                color: '#2E5077'
              }}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="mario-transition active:scale-95"
              style={{
                backgroundColor: inputValue.trim() ? '#2E5077' : '#E8EAED',
                color: '#FFFFFF',
                borderRadius: '8px',
                minWidth: '44px',
                minHeight: '44px',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.outline = '2px solid #79D7BE';
                  e.currentTarget.style.outlineOffset = '2px';
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
