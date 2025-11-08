'use client';

import { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { handleReward } from '@/lib/rewards';
import { useToast } from '@/components/ui/toast-provider';

export type MarioAIMode = 'search' | 'concierge' | 'claims';

interface MarioAIModalProps {
    open: boolean;
    onClose: () => void;
    mode: MarioAIMode;
    context?: {
        procedureName?: string;
        providerName?: string;
        query?: string;
    };
}

export function MarioAIModal({ open, onClose, mode, context }: MarioAIModalProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'mario'; text: string }>>([]);
    const router = useRouter();
    const { toast } = useToast();

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userMessage = { role: 'user' as const, text: message };
        setMessages((prev) => [...prev, userMessage]);
        setMessage('');

        // Simulate MarioAI response
        setTimeout(() => {
            let response = '';
            if (mode === 'concierge') {
                response = `I'll help you book ${context?.procedureName || 'this procedure'} with ${context?.providerName || 'the provider'}. Your request has been submitted!`;
            } else if (mode === 'search') {
                response = `I found some great options for "${context?.query || message}". Let me show you the best matches!`;
            } else {
                response = 'I can help you with that! Let me process your request.';
            }

            setMessages((prev) => [...prev, { role: 'mario', text: response }]);

            // If concierge mode, handle reward and redirect
            if (mode === 'concierge') {
                const points = handleReward('concierge');
                toast({
                    title: 'Request submitted 🎉',
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
                setTimeout(() => {
                    onClose();
                    router.push('/home');
                }, 2000);
            }
        }, 1000);
    };

    const getTitle = () => {
        switch (mode) {
            case 'concierge':
                return 'Book with Concierge';
            case 'search':
                return 'Ask MarioAI';
            case 'claims':
                return 'Claims Assistant';
            default:
                return 'MarioAI';
        }
    };

    const getPlaceholder = () => {
        switch (mode) {
            case 'concierge':
                return 'Tell me about your booking needs...';
            case 'search':
                return 'Ask me anything about healthcare...';
            case 'claims':
                return 'How can I help with your claims?';
            default:
                return 'Type your message...';
        }
    };

    const handleQuickAction = (action: string) => {
        onClose();
        if (action === 'book') {
            router.push('/procedures');
        } else if (action === 'concern') {
            router.push('/home');
        } else if (action === 'rx') {
            router.push('/medications');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">{getTitle()}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Quick Actions */}
                {mode === 'search' && messages.length === 0 && (
                    <div className="p-4 border-b space-y-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Quick Actions:</p>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => handleQuickAction('concern')}
                                className="text-left px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                            >
                                I have a health concern
                            </button>
                            <button
                                onClick={() => handleQuickAction('book')}
                                className="text-left px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                            >
                                Book a visit
                            </button>
                            <button
                                onClick={() => handleQuickAction('rx')}
                                className="text-left px-4 py-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                            >
                                Rx renewal
                            </button>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            <Sparkles className="h-12 w-12 mx-auto mb-4 text-blue-600 opacity-50" />
                            <p>Start a conversation with MarioAI</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

