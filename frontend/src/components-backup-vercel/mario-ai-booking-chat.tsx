'use client';

import { useState } from 'react';
import { X, Send, Sparkles, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleReward } from '@/lib/rewards';
import { useToast } from '@/components/ui/toast-provider';
import { motion, AnimatePresence } from 'framer-motion';

interface MarioAIBookingChatProps {
  open: boolean;
  onClose: () => void;
  providerName: string;
  procedureName?: string;
}

type ChatStep = 'greeting' | 'preferences' | 'confirmation';

export function MarioAIBookingChat({
  open,
  onClose,
  providerName,
  procedureName,
}: MarioAIBookingChatProps) {
  const [step, setStep] = useState<ChatStep>('greeting');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'mario'; text: string; timestamp: number }>>([]);
  const [preferences, setPreferences] = useState({
    preferredDate: '',
    preferredTime: '',
    reason: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, text: message, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    // Simulate MarioAI response based on step
    setTimeout(() => {
      let response = '';
      if (step === 'greeting') {
        response = `Great! I'll help you book with ${providerName}. When would you like to schedule your appointment?`;
        setStep('preferences');
      } else if (step === 'preferences') {
        // Extract preferences from message
        if (message.toLowerCase().includes('tomorrow') || message.toLowerCase().includes('monday') || message.toLowerCase().includes('next week')) {
          preferences.preferredDate = message;
        }
        if (message.toLowerCase().includes('morning') || message.toLowerCase().includes('afternoon') || message.toLowerCase().includes('9') || message.toLowerCase().includes('10')) {
          preferences.preferredTime = message;
        }
        response = `Perfect! I've noted your preferences. Let me confirm your booking details:\n\n• Provider: ${providerName}\n• Date: ${preferences.preferredDate || 'Flexible'}\n• Time: ${preferences.preferredTime || 'Flexible'}\n\nWould you like to proceed with this booking?`;
        setStep('confirmation');
      } else if (step === 'confirmation') {
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('confirm') || message.toLowerCase().includes('proceed')) {
          // Award points
          const points = handleReward('concierge');
          
          // Show success message
          response = `🎉 Booking confirmed! Your appointment with ${providerName} has been scheduled. You've earned +${points} MarioPoints!`;
          
          // Show toast
          toast({
            title: 'Booking confirmed! 🎉',
            description: `You earned +${points} MarioPoints!`,
            action: (
              <button
                onClick={() => router.push('/rewards')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Rewards
              </button>
            ),
          });

          // Redirect after delay
          setTimeout(() => {
            onClose();
            router.push('/home');
          }, 2000);
        } else {
          response = `No problem! Would you like to adjust anything, or should I cancel this booking?`;
        }
      }

      setMessages((prev) => [...prev, { role: 'mario', text: response, timestamp: Date.now() }]);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    // Auto-submit
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#4DA1A9]" />
                <h2 className="text-lg font-semibold text-[#2E5077]">Book with Concierge</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-5 w-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-[#6B7280] py-8">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-[#4DA1A9] opacity-50" />
                  <p className="text-[15px]">Hi! I'm MarioAI. I'll help you book with {providerName}.</p>
                  {procedureName && (
                    <p className="text-sm mt-2">Procedure: {procedureName}</p>
                  )}
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => handleQuickAction('I need an appointment as soon as possible')}
                      className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-[#374151] transition-colors"
                    >
                      I need an appointment as soon as possible
                    </button>
                    <button
                      onClick={() => handleQuickAction('I prefer morning appointments')}
                      className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-[#374151] transition-colors"
                    >
                      I prefer morning appointments
                    </button>
                    <button
                      onClick={() => handleQuickAction('I need a specific date')}
                      className="block w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-[#374151] transition-colors"
                    >
                      I need a specific date
                    </button>
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-[#2E5077] text-white'
                        : 'bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB]'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#E5E7EB]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={step === 'greeting' ? 'Tell me about your booking needs...' : step === 'preferences' ? 'When would you like to schedule?' : 'Type your response...'}
                  className="flex-1 rounded-md border border-[#E5E7EB] px-4 py-2 text-[15px] focus:border-[#2E5077] focus:outline-none focus:ring-2 focus:ring-[#2E5077]"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="rounded-md bg-[#2E5077] px-4 py-2 text-white hover:bg-[#1e3a5a] focus:outline-none focus:ring-2 focus:ring-[#2E5077] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

