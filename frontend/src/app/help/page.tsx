'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HelpCircle, Search, MessageSquare, Gift, User, X } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { MarioAIModal } from '@/components/mario-ai-modal';

export default function HelpPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [showAIModal, setShowAIModal] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

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

    const faqs = [
        {
            question: 'How do I search for procedures?',
            answer: 'Use the search bar on the home page or search page to find procedures. You can search by procedure name, category, or specialty.',
        },
        {
            question: 'How do I book with a provider?',
            answer: 'Click on a provider from the search results or procedure detail page, then click "Book with Concierge" to start the booking process.',
        },
        {
            question: 'How do I earn MarioPoints?',
            answer: 'Earn points by booking with concierge (+50), using MarioAI Pick providers (+25), completing your profile (+100), and more.',
        },
        {
            question: 'How do I view my rewards?',
            answer: 'Navigate to the Rewards page from the main navigation to see your MarioPoints balance and reward history.',
        },
        {
            question: 'How do I update my profile?',
            answer: 'Go to the Profile page from the main navigation to view and update your account information.',
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & FAQ</h1>
                    <p className="text-gray-600">Find answers to common questions</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                    >
                        <MessageSquare className="h-8 w-8 text-[#4DA1A9] mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Ask MarioAI</h3>
                        <p className="text-sm text-gray-600">Get instant help from our AI assistant</p>
                    </button>
                    <a
                        href="/procedures"
                        className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
                    >
                        <Search className="h-8 w-8 text-[#2E5077] mb-3" />
                        <h3 className="font-semibold text-gray-900 mb-1">Search Procedures</h3>
                        <p className="text-sm text-gray-600">Find and compare healthcare procedures</p>
                    </a>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="divide-y">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="p-6">
                                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-[#2E5077] transition-colors">
                                    {faq.question}
                                </summary>
                                <p className="mt-3 text-gray-600">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Still Need Help?</h2>
                    <p className="text-gray-600 mb-4">
                        If you can't find what you're looking for, our support team is here to help.
                    </p>
                    <button
                        onClick={() => setShowAIModal(true)}
                        className="rounded-md bg-[#2E5077] px-6 py-3 text-white hover:bg-[#1e3a5a] transition-colors"
                    >
                        Contact Support
                    </button>
                </div>
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

