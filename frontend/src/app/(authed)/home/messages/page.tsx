'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MarioAIModal } from '@/components/mario-ai-modal';

interface Message {
    id: string;
    sender: 'user' | 'mario' | 'support';
    text: string;
    timestamp: string;
}

export default function MessagesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [showAIModal, setShowAIModal] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Load from localStorage (placeholder until backend connection)
        const stored = localStorage.getItem('marioMessages');
        if (stored) {
            try {
                setMessages(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing messages:', e);
            }
        }
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
                        <p className="text-gray-600">View your messages and conversations</p>
                    </div>
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="rounded-md bg-[#2E5077] px-4 py-2 text-white hover:bg-[#1e3a5a] transition-colors text-sm flex items-center gap-2"
                    >
                        <Send className="h-4 w-4" />
                        New Message
                    </button>
                </div>

                {/* Messages List */}
                {messages.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Messages Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start a conversation with MarioAI or support to see messages here.
                        </p>
                        <button
                            onClick={() => setShowAIModal(true)}
                            className="inline-block rounded-md bg-[#2E5077] px-6 py-3 text-white hover:bg-[#1e3a5a] transition-colors"
                        >
                            Start Conversation
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`bg-white rounded-lg shadow border border-gray-200 p-6 ${
                                    message.sender === 'user' ? 'ml-auto max-w-md' : 'mr-auto max-w-md'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {message.sender !== 'user' && (
                                        <div className="h-8 w-8 rounded-full bg-[#4DA1A9] flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {message.sender === 'user' ? 'You' : message.sender === 'mario' ? 'MarioAI' : 'Support'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(message.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
            <MarioAIModal
                open={showAIModal}
                onClose={() => setShowAIModal(false)}
                mode="search"
            />
        </main>
    );
}

