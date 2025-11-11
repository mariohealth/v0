'use client';

import { useState, useEffect } from 'react';
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

const STORAGE_KEY = 'mario-ai-chat-context';

export function MarioAIModal({ open, onClose, mode, context }: MarioAIModalProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'mario'; text: string }>>([]);
    const router = useRouter();
    const { toast } = useToast();

    // Load chat context from localStorage on mount
    useEffect(() => {
        if (open && messages.length === 0) {
            try {
                const savedContext = localStorage.getItem(STORAGE_KEY);
                if (savedContext) {
                    const parsed = JSON.parse(savedContext);
                    if (parsed.messages && Array.isArray(parsed.messages)) {
                        setMessages(parsed.messages);
                    }
                }
            } catch (error) {
                console.error('Failed to load chat context from localStorage:', error);
            }
        }
    }, [open]);

    // Save chat context to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 0) {
            try {
                const contextToSave = {
                    messages,
                    lastUpdated: new Date().toISOString(),
                    mode
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(contextToSave));
            } catch (error) {
                console.error('Failed to save chat context to localStorage:', error);
            }
        }
    }, [messages, mode]);

    // Clear chat context when modal closes
    const handleClose = () => {
        onClose();
    };

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
            router.push('/home?mode=book');
        } else if (action === 'concern') {
            router.push('/ai?context=concern');
        } else if (action === 'rx') {
            router.push('/medications');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col" style={{ borderRadius: '12px' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E8EAED' }}>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5" style={{ color: '#2E5077' }} />
                        <h2 className="text-lg font-semibold" style={{ color: '#2E5077' }}>{getTitle()}</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                        style={{ color: '#666666' }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Quick Actions */}
                {mode === 'search' && messages.length === 0 && (
                    <div className="p-4 border-b space-y-2" style={{ borderColor: '#E8EAED' }}>
                        <p className="text-sm font-medium mb-2" style={{ color: '#2E5077' }}>Quick Actions:</p>
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                onClick={() => handleQuickAction('concern')}
                                className="text-left px-4 py-2 rounded-md transition-colors text-sm"
                                style={{
                                    backgroundColor: '#F6F4F0',
                                    color: '#2E5077'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E8EAED';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F6F4F0';
                                }}
                            >
                                I Have a Health Concern
                            </button>
                            <button
                                onClick={() => handleQuickAction('book')}
                                className="text-left px-4 py-2 rounded-md transition-colors text-sm"
                                style={{
                                    backgroundColor: '#F6F4F0',
                                    color: '#2E5077'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E8EAED';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F6F4F0';
                                }}
                            >
                                Book a Visit
                            </button>
                            <button
                                onClick={() => handleQuickAction('rx')}
                                className="text-left px-4 py-2 rounded-md transition-colors text-sm"
                                style={{
                                    backgroundColor: '#F6F4F0',
                                    color: '#2E5077'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E8EAED';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#F6F4F0';
                                }}
                            >
                                Rx Renewal
                            </button>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div 
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    style={{ backgroundColor: '#FDFCFA' }}
                >
                    {messages.length === 0 && (
                        <div className="text-center py-8" style={{ color: '#666666' }}>
                            <Sparkles className="h-12 w-12 mx-auto mb-4" style={{ color: '#2E5077', opacity: 0.5 }} />
                            <p>Start a conversation with MarioAI</p>
                        </div>
                    )}
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                                    msg.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'
                                }`}
                                style={{
                                    backgroundColor: msg.role === 'user' ? '#2E5077' : '#FFFFFF',
                                    color: msg.role === 'user' ? '#FFFFFF' : '#2E5077',
                                    boxShadow: msg.role === 'mario' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                                }}
                            >
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t" style={{ borderColor: '#E8EAED' }}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2"
                            style={{
                                borderColor: '#E8EAED',
                                color: '#2E5077',
                                fontSize: '14px'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#2E5077';
                                e.target.style.boxShadow = '0 0 0 2px rgba(46, 80, 119, 0.1)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#E8EAED';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            style={{
                                backgroundColor: '#2E5077',
                                fontSize: '14px'
                            }}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#1a3a5a';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#2E5077';
                                }
                            }}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

