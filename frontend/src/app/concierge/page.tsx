'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/navigation/BottomNav';
import Link from 'next/link';

interface ConciergeRequest {
    id: string;
    type: 'booking' | 'inquiry' | 'support';
    title: string;
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    createdAt: string;
    providerName?: string;
    procedureName?: string;
}

export default function ConciergePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<ConciergeRequest[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        // Load from localStorage (placeholder until backend connection)
        const stored = localStorage.getItem('marioConciergeRequests');
        if (stored) {
            try {
                setRequests(JSON.parse(stored));
            } catch (e) {
                console.error('Error parsing concierge requests:', e);
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-50';
            case 'in-progress':
                return 'text-blue-600 bg-blue-50';
            case 'pending':
                return 'text-yellow-600 bg-yellow-50';
            case 'cancelled':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4" />;
            case 'cancelled':
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Concierge Requests</h1>
                    <p className="text-gray-600">View and manage your concierge requests</p>
                </div>

                {/* Requests List */}
                {requests.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Requests Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Start a concierge request by booking with a provider or asking MarioAI for help.
                        </p>
                        <Link
                            href="/procedures"
                            className="inline-block rounded-md bg-[#2E5077] px-6 py-3 text-white hover:bg-[#1e3a5a] transition-colors"
                        >
                            Start Searching
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                                        {request.providerName && (
                                            <p className="text-sm text-gray-600">Provider: {request.providerName}</p>
                                        )}
                                        {request.procedureName && (
                                            <p className="text-sm text-gray-600">Procedure: {request.procedureName}</p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            request.status
                                        )}`}
                                    >
                                        {getStatusIcon(request.status)}
                                        <span className="capitalize">{request.status.replace('-', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <BottomNav />
        </main>
    );
}

